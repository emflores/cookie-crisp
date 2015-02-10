var _isUndefined = require( 'lodash-node/compat/lang/isUndefined' );
var _isString    = require( 'lodash-node/compat/lang/isString' );
var _isObject    = require( 'lodash-node/compat/lang/isObject' );
var _find        = require( 'lodash-node/compat/collection/find' );

// Constants
var COOKIE_DELIMITER_RE = /;\s*/;
var KEY_VALUE_DELIMITER = '=';
var DEFAULT_PATH        = '/';

/**
 * Gets current date + n days in seconds since
 * @param  {string} days
 * @return {number}
 */
function getDate ( days ) {
    var parsedDays = parseInt( days, 10 );
    var date       = new Date();
    var toDate     = new Date( date.getTime() + ( days * 24 * 60 * 60 * 1000 ) );
    return toDate.toGMTString();
}

/**
 * noop with style
 * @param  {string} val
 * @return {string}
 */
function passThrough ( val ) {
    return val;
}

/**
 * Given an array of cookie key/value pairs, returns the value
 * that matches the provided key.
 * @param  {array}   cookieArray  Array of cookie key/value pairs
 * @param  {string}  cookieName   Key to be looked up
 * @param  {boolean} decode       Whether or not the cookie should be decoded before
 *                                being returned
 * @return {string}
 */
function getCookie ( cookieArray, cookieName, decode ) {
    var decodeMethod = decode ? decodeURIComponent : passThrough;
    var recentPair   = null;

    var cookieVal = _find( cookieArray, function ( val, index ) {
        recentPair = cookieArray[ index ].split( KEY_VALUE_DELIMITER );
        var key    = decodeMethod( recentPair[ 0 ] );

        return key === cookieName;
    });

    return cookieVal ? decodeMethod( recentPair[ 1 ] ) : undefined;
}

/**
 * Returns a cookie key/value string
 * @param  {string}  key
 * @param  {string}  val
 * @param  {boolean} encode  Whether or not the cookie should be encoded
 *                           before being set
 * @return {string}
 */
function formCookie ( key, val, encode ) {
    var encodeMethod = encode ? encodeURIComponent : passThrough;
    return encodeMethod( key ) + '=' + encodeMethod( val );
}

/**
* Gets cookie value
* @param  {string}     cookieName
* @param  {boolean}    decode
* @return {string}
*/
function get ( cookieName, decode ) {
    if ( !_isString( cookieName ) ) {
        throw new TypeError( 'cookieName argument is required and must be a string' );
    }

    if ( _isUndefined( decode ) ) {
        decode = true;
    }

    var cookieArray = this.doc.cookie.split( COOKIE_DELIMITER_RE );
    return getCookie( cookieArray, cookieName, decode );
}

/**
 * Sets cookie value
 * @param   {string}                  key               Name of cookie
 * @param   {string|number|boolean}   value             New value for cookie
 * @param   {object}                  [opts]            Options object
 * @param   {string}                  [opts.path]       Path to write cookie (write to root domain by default)
 * @param   {string}                  [opts.expires]    GMT expiration date
 * @param   {number}                  [opts.days]       Number of days for a cookie to expire in
 * @param   {encode}                  [opts.encode]     Whether or not the cookie key/value should be encoded
 * @returns {string}                                    New cookie value
 *
 */
function set ( key, value, opts ) {
    if ( !_isString( key ) ) {
        throw new TypeError( 'key argument is required and must be a string' );
    }

    if ( _isUndefined( value ) || _isObject( value ) ) {
        throw new TypeError( 'value must be defined and cannot be an object' );
    }

    opts      = opts || {};
    opts.path = _isString( opts.path ) ? opts.path : DEFAULT_PATH;

    if ( _isUndefined( opts.encode ) ) {
        opts.encode = true;
    }

    var newCookie = formCookie( key, value, opts.encode );

    if ( !_isUndefined( opts.days ) ) {
        newCookie += '; expires=' + getDate( opts.days );
    } else if ( !_isUndefined( opts.expires ) ) {
        newCookie += '; expires=' + opts.expires;
    }

    newCookie += '; path=' + opts.path;
    this.doc.cookie = newCookie;
    return newCookie;
}

/**
 * Removes cookie
 * @param  {string} cookieName      Key of cookie to be removed
 * @return {string}                 New cookie value
 */
function remove ( cookieName ) {
    return this.set( cookieName, '', { expires: 'Thu, 01 Jan 1970 00:00:01 GMT' } );
}

/**
 * Initializes cookie crisp
 * @param  {object}     doc     Reference to window.document
 */
function init ( doc ) {
    if ( _isUndefined( doc ) ) {
        doc = window.document;
    }

    if ( _isUndefined( doc.cookie ) ) {
        doc.cookie = '';
    }

    this.doc = doc;
}

/**
 * Exports object for cookie crisp
 * @type {Object}
 *
 * @example
 *
 * cookieCrisp.init( window.document );
 * cookieCrisp.set( 'key', 'value', { expires: '21 days' } );
 */
module.exports = {
    doc: null,
    init: init,
    get: get,
    set: set,
    remove: remove
};
