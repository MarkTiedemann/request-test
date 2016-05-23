
# request-test

[![](https://travis-ci.org/MarkTiedemann/request-test.svg?branch=master)](https://travis-ci.org/MarkTiedemann/request-test)
[![](https://david-dm.org/MarkTiedemann/request-test.svg)](https://david-dm.org/MarkTiedemann/request-test) [![](https://img.shields.io/node/v/request-test.svg)](https://www.npmjs.com/package/request-test)

**Convenience wrapper around [Node core requests](https://nodejs.org/api/http.html#http_http_request_options_callback) to easily test whether a request fails or succeeds.**

- **Supports `http` and `https`.**
- **Supports timeouts and cancelling requests.**
- **Test results:**
    - `success`: if the request was cancelled or returned a 100, 200 or 300 HTTP status code
    - `fail`: if the request had an error, timed out, or returned 400 or 500 HTTP status code

## Installation

```
npm install request-test
```

## Quickstart

**> setting a timeout**

```js

const test = require('request-test')

const request = test({ url: 'https://slow.com', timeout: 1000 })

request.once('fail', reason => console.log(reason)) // => 'ETIMEDOUT'

```

**> cancelling a request**

```js

const test = require('request-test')

const request = test({ url: 'https://slow.com' })

request.once('success', reason => console.log(reason)) // => 'CANCELLED'

setTimeout(() => {
    request.cancel()
}, 1000)

```

## API

```js
const test = require('request-test')
```

### `request = test({ url, timeout })`

**> Starts a request test with the specified url and timeout**

- **url** `<String>`: the url the request will be sent to; *default:* `http://localhost`
- **timeout** `<Number>`: the timeout in milliseconds after which the request will be aborted; *default:* `2000`
- **returns** a `<ClientRequest>` which emits one of the following events:
   - **success =>** `<String> / <Number>`: the reason why the request succeeded, e.g. a 100, 200 or 300 HTTP status code or `CANCELLED`
   - **fail =>** `<String> / <Number>`: the reason why the request failed, e.g.: a 400 or 500 HTTP status code or the error code of a Node network errror, e.g. `ETIMEDOUT`, `ENOTFOUND`, `ECONNREFUSED`, etc.
- **throws** an `<Error>`: if the protocol of the url is neither `http` nor `https`

### `request.cancel()`

**> Cancels the sent request**

- Note that upon calling this method the request will be considered a `success`.

## License

[WTFPL](http://www.wtfpl.net/) – Do What the F*ck You Want to Public License.

Made with :heart: by [@MarkTiedemann](https://twitter.com/MarkTiedemannDE).
