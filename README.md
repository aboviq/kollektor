# @aboviq/kollektor

[![Build status][travis-image]][travis-url] [![NPM version][npm-image]][npm-url] [![XO code style][codestyle-image]][codestyle-url]

> Generic file collector, useful for mono repos and microservices

## Installation

Install `@aboviq/kollektor` using [npm](https://www.npmjs.com/):

```bash
npm install @aboviq/kollektor
```

## Usage

### Module usage

```javascript
const kollektor = require('@aboviq/kollektor');

// Read all package.json files in a mono-repo:
const packages = await kollektor({
	handlers: {
		'package.json': packageFile => require(packageFile)
	}
});
```

## API

### `kollektor(options)`

| Name    | Type     | Description                                       |
| ------- | -------- | ------------------------------------------------- |
| options | `Object` | Options for specifying the behaviour of Kollektor |

Returns: `Promise<Array<Object>>`, all collected information depending on given [handlers](#optionshandlers).

#### Options

#### `options.cwd`

Type: `String`  
Default: `process.cwd()`

Sets the current working directory

#### `options.handlers`

Type: `Object<Handler>`

Example:

```js
{
	"handlers": {
		"package.json": () => {},
		"*.yml": () => {},
		"README.md": () => {}
	}
}
```

##### `Handler` definition

Type: `Function`  
Signature: `handlerName :: String -> Object -> Object`

`handlerName` is the name of the handler and is usually a filename, e.g. `"package.json"` which will call the handler for each package.json file it finds. The `handlerName` can also be a simple pattern matching multiple files, e.g: `"*.yml"`.

When a file is found that matches the `handlerName` the handler function will be called with these arguments:

| Name     | Type     | Description                                                                                                                                                           |
| -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fullPath | `String` | The full path to the found file                                                                                                                                       |
| data     | `Object` | This contains `dir` (the relative path of the folder), `dirPath` (the full path of the folder) and all data returned from previous handlers affecting the same folder |

Any `Object` returned from a handler is merged with the current folder's `data` and will be fed to the next handler affecting files in the same folder. When all handlers have been called and completed for a specific folder the resulting `data` is what's being returned in the `Array` of collected information. See the tests for more details on how it works.

## Contributing

See [Contribution Guidelines](CONTRIBUTING.md) and our [Code Of Conduct](CODE_OF_CONDUCT.md).

## License

MIT © [Aboviq AB](https://www.aboviq.com/)

[npm-url]: https://npmjs.org/package/@aboviq/kollektor
[npm-image]: https://badge.fury.io/js/%40aboviq%2Fkollektor.svg
[travis-url]: https://travis-ci.org/aboviq/kollektor
[travis-image]: https://travis-ci.org/aboviq/kollektor.svg?branch=master
[codestyle-url]: https://github.com/sindresorhus/xo
[codestyle-image]: https://img.shields.io/badge/code%20style-XO-5ed9c7.svg?style=flat
