# Cookie Crisp [![NPM version](https://badge.fury.io/js/cookie-crisp.png)](https://www.npmjs.com/package/cookie-crisp)

> A small cookie utility for getting, setting, and deleting cookies

## `init( doc )`
Initializes cookie-crisp. Can optionally pass in a reference to `document` that differs from `window.document`.

## `get( cookieName, decode )`
Returns a cookie value given a cookie name. By default, the cookie value is decoded before being returned.

## `set( key, value, opts )`
Sets a cookie given a key, value, and a set of options:

### `opts.path`
Path to write cookie (default being `/`).

### `opts.days`
Days from now that you would like the cookie to expire.

### `opts.expires`
Available if you would like to pass your own GMT expiration date.

### `opts.encode`
Whether or not the cookie key/value should be encoded before being set.

## `remove( cookieName )`
Shortcut for setting a cookie's expiration to `Thu, 01 Jan 1970 00:00:01 GMT`.
