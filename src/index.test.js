'use strict';
const kollektor = require('.');

describe('kollektor', () => {
	it('throws without options', () => {
		expect(kollektor).toThrowError(TypeError);
	});

	it('throws without handlers', () => {
		const kollekt = () => kollektor({});

		expect(kollekt).toThrowError(TypeError);
		expect(kollekt).toThrowError('Missing handlers option');
	});

	it('throws when handlers is not an object', () => {
		const kollekt = () => kollektor({handlers: 'here are my handlers'});

		expect(kollekt).toThrowError(TypeError);
		expect(kollekt).toThrowError('The handlers option must be an object');
	});

	it('throws when handlers is an empty object', () => {
		const kollekt = () => kollektor({handlers: {}});

		expect(kollekt).toThrowError(TypeError);
		expect(kollekt).toThrowError('The handlers option must contain at least one handler');
	});
});
