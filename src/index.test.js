'use strict';
const {promisify} = require('util');
const {resolve} = require('path');
const {readFile} = require('fs');
const kollektor = require('.');

const readFileAsync = promisify(readFile);

describe('kollektor', () => {
	it('throws without options', async () => {
		await expect(kollektor()).rejects.toThrowError(TypeError);
	});

	it('throws without handlers', async () => {
		const result = kollektor({});

		await expect(result).rejects.toThrowError(TypeError);
		await expect(result).rejects.toThrowError('Missing handlers option');
	});

	it('throws when handlers is not an object', async () => {
		const result = kollektor({handlers: 'here are my handlers'});

		await expect(result).rejects.toThrowError(TypeError);
		await expect(result).rejects.toThrowError('The handlers option must be an object');
	});

	it('throws when handlers is an empty object', async () => {
		const result = kollektor({handlers: {}});

		await expect(result).rejects.toThrowError(TypeError);
		await expect(result).rejects.toThrowError(
			'The handlers option must contain at least one handler'
		);
	});

	it('throws when any handler is not a function', async () => {
		const result = kollektor({handlers: {filename1: () => {}, filename2: 'not a function'}});

		await expect(result).rejects.toThrowError(TypeError);
		await expect(result).rejects.toThrowError('The handler for "filename2" is not a function');
	});

	it('calls the given handler for matching files', async () => {
		const packageJsonHandler = jest.fn();

		await kollektor({
			handlers: {
				'package.json': packageJsonHandler
			}
		});

		expect(packageJsonHandler).toHaveBeenCalled();
	});

	it('does not call the given handler when no matching file exists', async () => {
		const pkgJsonHandler = jest.fn();

		await kollektor({
			handlers: {
				'pkg.json': pkgJsonHandler
			}
		});

		expect(pkgJsonHandler).not.toHaveBeenCalled();
	});

	it('calls the given handler with the full path to the handled file', async () => {
		const packageJsonHandler = jest.fn();

		await kollektor({
			handlers: {
				'package.json': packageJsonHandler
			}
		});

		expect(packageJsonHandler).toHaveBeenCalledWith(
			resolve(__dirname, '..', 'package.json'),
			expect.anything()
		);
	});

	it("calls the given handler with data.dir as the handled file's dir relative to cwd", async () => {
		const packageJsonHandler = jest.fn();
		const indexJsHandler = jest.fn();

		await kollektor({
			handlers: {
				'package.json': packageJsonHandler,
				'index.js': indexJsHandler
			}
		});

		expect(packageJsonHandler).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({dir: '.'})
		);
		expect(indexJsHandler).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({dir: 'src'})
		);
	});

	it("calls the given handler with data.dirPath as the handled file's dir's full path", async () => {
		const packageJsonHandler = jest.fn();
		const indexJsHandler = jest.fn();

		await kollektor({
			handlers: {
				'package.json': packageJsonHandler,
				'index.js': indexJsHandler
			}
		});

		expect(packageJsonHandler).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({dirPath: resolve(__dirname, '..')})
		);
		expect(indexJsHandler).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({dirPath: __dirname})
		);
	});

	it('sets data.dir correctly when cwd option is set', async () => {
		const indexJsHandler = jest.fn();

		await kollektor({
			cwd: __dirname,
			handlers: {
				'index.js': indexJsHandler
			}
		});

		expect(indexJsHandler).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({dir: '.'})
		);
	});

	it('can handle generic file handlers', async () => {
		const jsHandler = jest.fn();

		await kollektor({
			handlers: {
				'*.js': jsHandler
			}
		});

		expect(jsHandler.mock.calls).toEqual(
			expect.arrayContaining([
				[expect.stringMatching(/\/commitlint\.config\.js$/), expect.objectContaining({dir: '.'})],
				[expect.stringMatching(/\/index\.js$/), expect.objectContaining({dir: 'src'})],
				[expect.stringMatching(/\/index\.test\.js$/), expect.objectContaining({dir: 'src'})]
			])
		);
	});

	it('returns an array with one item for each unique folder', async () => {
		const result = await kollektor({
			cwd: resolve(__dirname, '..', 'fixtures'),
			handlers: {
				'config.yml': () => {},
				'data.json': () => {}
			}
		});

		expect(result).toHaveLength(2);
	});

	it('merges the result of each handler with the result for that folder', async () => {
		const result = await kollektor({
			cwd: resolve(__dirname, '..', 'fixtures'),
			handlers: {
				'config.yml': () => ({config: true}),
				'data.json': () => ({data: true})
			}
		});

		expect(result).toEqual(
			expect.arrayContaining([
				expect.objectContaining({dir: 'another', config: true, data: true}),
				expect.objectContaining({dir: 'subfolder', config: true, data: true})
			])
		);
	});

	it('can handle async handlers', async () => {
		const result = await kollektor({
			cwd: resolve(__dirname, '..', 'fixtures'),
			handlers: {
				'config.yml': async configFile => {
					const ymlContent = await readFileAsync(configFile, 'utf8');
					return {config: ymlContent.trim()};
				}
			}
		});

		expect(result).toEqual(
			expect.arrayContaining([
				expect.objectContaining({dir: 'another', config: 'hello: earth'}),
				expect.objectContaining({dir: 'subfolder', config: 'hello: world'})
			])
		);
	});

	it('runs handlers in alphabetical order according to matching filename', async () => {
		const result = await kollektor({
			cwd: resolve(__dirname, '..', 'fixtures'),
			handlers: {
				'config.yml': () => ({value: 1}),
				'data.json': (_, {value}) => ({value: value + 1})
			}
		});

		expect(result).toEqual(
			expect.arrayContaining([
				expect.objectContaining({dir: 'another', value: 2}),
				expect.objectContaining({dir: 'subfolder', value: 2})
			])
		);
	});
});
