require( 'should' );

var cookieCrisp = require( '../index.js' );

var MONTHS = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

var initCookieCrisp = function ( cookie ) {
    var doc = {
        cookie: cookie
    };
    cookieCrisp.init( doc );
};

describe( 'Cookie Cutter', function () {

    describe( 'Remove', function () {
        it( 'removes a cookie given a valid name', function () {
            initCookieCrisp( 'foo=bar' );
            var result = cookieCrisp.remove( 'foo' );
            result.should.equal( 'foo=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=%2F' );
        });
    });

    describe( 'Getter', function () {
        it( 'returns a cookie value given a name that exists', function () {
            initCookieCrisp( 'foo=bar' );
            var result = cookieCrisp.get( 'foo' );
            result.should.equal( 'bar' );
        });

        it( 'returns undefined given a cookie name that does not exist', function () {
            initCookieCrisp( 'foo=bar' );
            var result = cookieCrisp.get( 'baz' );
            ( typeof result === 'undefined' ).should.be.true;
        });

        it( 'throws an error if the cookie name argument is not a string', function () {
            var COOKIE_NAME_TYPE_ERROR = 'cookieName argument is required and must be a string';
            initCookieCrisp( 'foo=bar' );

            cookieCrisp.get.bind( null, 1 ).should.throw( COOKIE_NAME_TYPE_ERROR );
            cookieCrisp.get.bind( null, [] ).should.throw( COOKIE_NAME_TYPE_ERROR );
            cookieCrisp.get.bind( null, function () {} ).should.throw( COOKIE_NAME_TYPE_ERROR );
            cookieCrisp.get.bind( null, {} ).should.throw( COOKIE_NAME_TYPE_ERROR );
            cookieCrisp.get.bind( null, null ).should.throw( COOKIE_NAME_TYPE_ERROR );
            cookieCrisp.get.bind( null, undefined ).should.throw( COOKIE_NAME_TYPE_ERROR );
        });
    });

    describe( 'Setter', function () {
        it( 'throws an error if the key argument is not a string', function () {
            var KEY_TYPE_ERROR = 'key argument is required and must be a string';
            initCookieCrisp( 'foo=bar' );

            cookieCrisp.set.bind( null, 1, 'baz' ).should.throw( KEY_TYPE_ERROR );
            cookieCrisp.set.bind( null, [], 'baz' ).should.throw( KEY_TYPE_ERROR );
            cookieCrisp.set.bind( null, function () {}, 'baz' ).should.throw( KEY_TYPE_ERROR );
            cookieCrisp.set.bind( null, {}, 'baz' ).should.throw( KEY_TYPE_ERROR );
            cookieCrisp.set.bind( null, null, 'baz' ).should.throw( KEY_TYPE_ERROR );
            cookieCrisp.set.bind( null, undefined, 'baz' ).should.throw( KEY_TYPE_ERROR );
        });

        it( 'throws an error if the value argument is undefined or an object', function () {
            var VALUE_TYPE_ERROR = 'value must be defined and cannot be an object';
            initCookieCrisp( 'foo=bar' );

            cookieCrisp.set.bind( null, 'foo', {} ).should.throw( VALUE_TYPE_ERROR );
            cookieCrisp.set.bind( null, 'foo', undefined ).should.throw( VALUE_TYPE_ERROR );
        });

        it( 'creates a cookie with a default path of "/" given a valid key/value and no path argument', function () {
            initCookieCrisp( 'foo=bar' );
            var result = cookieCrisp.set( 'foo', 'baz' );
            result.should.equal( 'foo=baz; path=%2F' );
        });

        it( 'creates a cookie with a customized path with the path option is present', function () {
            initCookieCrisp( 'foo=bar' );
            var result = cookieCrisp.set( 'foo', 'baz', { path: '/bat' } );
            result.should.equal( 'foo=baz; path=%2Fbat' );
        });

        it( 'creates a cookie with a expiration parameter and default path if the expires option is an object', function () {
            initCookieCrisp( 'foo=bar' );
            var dateToSet = new Date();
            var result = cookieCrisp.set( 'foo', 'baz', { expires: dateToSet.toGMTString() } );
            result.should.equal( 'foo=baz; expires=' + dateToSet.toGMTString() + '; path=%2F' );
        });

        it( 'creates a cookie with an expiration parameter and default path if the days option is set and path is undefined', function () {
            initCookieCrisp( 'foo=bar' );
            var today = new Date();
            var tomorrow = new Date( today.getTime() + ( 1 * 24 * 60 * 60 * 1000 ) );
            var day = tomorrow.getUTCDate();
            var month = MONTHS[ tomorrow.getUTCMonth() ];
            var validCookie = new RegExp( 'foo=baz; expires=.*' + day + ' ' + month + '.*; path=%2F', 'i' );
            var result = cookieCrisp.set( 'foo', 'baz', { days: 1 } );
            validCookie.test( result ).should.be.true;
        });
    });
});
