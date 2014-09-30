var _isUndefined    = require( 'lodash-node/compat/objects/isUndefined' );
var _isString       = require( 'lodash-node/compat/objects/isString' );
var _isObject       = require( 'lodash-node/compat/objects/isObject' );

// Constants
var COOKIE_DELIMITER_RE = /;\s*/;
var KEY_VALUE_DELIMITER = '=';
var DEFAULT_PATH        = '/';

/**
 * Gets current date + n days in seconds since
 * @param  {string} days
 * @return {number}
 */
var getDate = function ( days ) {
    var parsedDays = parseInt( days, 10 );
    var date = new Date();
    return new Date( date.getTime() + ( days * 24 * 60 * 60 * 1000 ) );
};

/**
 * Gets cookie value
 * @param  {string}     cookieName
 * @return {string}
 */
var get = function ( cookieName ) {
    if ( !_isString( cookieName ) ) {
        throw new TypeError( 'cookieName argument is required and must be a string' );
    }

    var cookieArray = this.doc.cookie.split( COOKIE_DELIMITER_RE );

    for ( var i = 0; i < cookieArray.length; ++i ) {
        var cookieNamedPair = cookieArray[ i ].split( KEY_VALUE_DELIMITER );
        var key             = decodeURIComponent( cookieNamedPair[ 0 ] );
        
        if ( key === cookieName ) {
            return decodeURIComponent( cookieNamedPair[ 1 ] );
        }
    }
    return undefined;
};

/**
 * Sets cookie value
 * @param   {string}                  key               Name of cookie
 * @param   {string|number|boolean}   value             New value for cookie
 * @param   {object}                  [opts]            Options object
 * @param   {string}                  [opts.path]       Path to write cookie (write to root domain by default)
 * @param   {string}                  [opts.expires]    GMT expiration date
 * @param   {number}                  [opts.days]       Number of days for a cookie to expire in
 * @returns {string}                                    New cookie value
 *
 */
var set = function ( key, value, opts ) {
    if ( !_isString( key ) ) {
        throw new TypeError( 'key argument is required and must be a string' );
    }

    if ( _isUndefined( value ) || _isObject( value ) ) {
        throw new TypeError( 'value must be defined and cannot be an object' );
    }

    opts      = opts || {};
    opts.path = _isString( opts.path ) ? opts.path : DEFAULT_PATH;

    var newCookie = encodeURIComponent( key ) + '=' + encodeURIComponent( value );

    if ( !_isUndefined( opts.days ) ) {
        newCookie += '; expires=' + getDate( opts.days ).toGMTString();
    } else if ( !_isUndefined( opts.expires ) ) {
        newCookie += '; expires=' + opts.expires;
    }

    newCookie += '; path=' + encodeURIComponent( opts.path );
    this.doc.cookie = newCookie;
    return newCookie;
};

/**
 * Removes cookie
 * @param  {string} cookieName      Key of cookie to be removed
 * @return {string}                 New cookie value
 */
var remove = function ( cookieName ) {
    return this.set( cookieName, '', { expires: 'Thu, 01 Jan 1970 00:00:01 GMT' } );
};

/**
 * Initializes cookie crisp
 * @param  {object}     doc     Reference to window.document
 */
var init = function ( doc ) {
    if ( _isUndefined( doc ) ) {
        throw new Error( 'document argument is required' );
    }

    if ( _isUndefined( doc.cookie ) ) {
        doc.cookie = '';
    }
    
    this.doc = doc;
};

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