'use strict';
const isObjectEmpty = obj => Object.keys(obj).length === 0;

const kollektor = ({handlers}) => {
	if (!handlers) {
		throw new TypeError('Missing handlers option');
	}
	if (typeof handlers !== 'object') {
		throw new TypeError('The handlers option must be an object');
	}
	if (isObjectEmpty(handlers)) {
		throw new TypeError('The handlers option must contain at least one handler');
	}
};

module.exports = kollektor;
