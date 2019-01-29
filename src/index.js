'use strict';
const {dirname, basename, relative, resolve} = require('path');
const readdirRecursive = require('@aboviq/readdir-recursive');
const {isMatch} = require('matcher');

const isObjectEmpty = obj => Object.keys(obj).length === 0;

const validateHandlers = handlers => {
	if (!handlers) {
		throw new TypeError('Missing handlers option');
	}
	if (typeof handlers !== 'object') {
		throw new TypeError('The handlers option must be an object');
	}
	if (isObjectEmpty(handlers)) {
		throw new TypeError('The handlers option must contain at least one handler');
	}
	Object.entries(handlers).forEach(([filename, handler]) => {
		if (typeof handler !== 'function') {
			throw new TypeError(`The handler for "${filename}" is not a function`);
		}
	});
};

const getMatchingFiles = (dir, filePatterns) =>
	readdirRecursive(dir, {
		filter: ({file}) => filePatterns.some(filePattern => isMatch(file, filePattern))
	});

const kollektor = async ({handlers, cwd = process.cwd()}) => {
	validateHandlers(handlers);

	const filePatterns = Object.keys(handlers);
	const paths = await getMatchingFiles(resolve(cwd), filePatterns);

	paths.sort();

	const fileMap = new Map();

	for (const [filePattern, handler] of Object.entries(handlers)) {
		for (const fullPath of paths) {
			const path = relative(resolve(cwd), fullPath);
			const dirPath = dirname(fullPath);
			const dir = dirname(path);
			const file = basename(path);

			let data = fileMap.get(dir) || {dir, dirPath};

			if (isMatch(file, filePattern)) {
				// eslint-disable-next-line no-await-in-loop
				const result = await handler(fullPath, data);
				data = {...data, ...result};
			}

			fileMap.set(dir, data);
		}
	}

	return [...fileMap.values()];
};

module.exports = kollektor;
