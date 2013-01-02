'use strict';

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var fs = require( "fs" )
	, cp = require( "child_process" )
	, rimraf = require( "rimraf" )
	;

exports['svn_npm_crutch_tester'] = {
  setUp: function(done) {
		// -----------------------------------------------------
		// Eh, I'm too lazy for nice async code here
		// -----------------------------------------------------
		if( fs.existsSync( __dirname + "/tmp" ) ) {
			rimraf.sync( __dirname + "/tmp" );
		}
		fs.mkdirSync( __dirname + "/tmp" );
		fs.writeFileSync( __dirname + "/tmp/package.json",
			fs.readFileSync( __dirname + "/artifacts/package.json" )
		);
		fs.writeFileSync( __dirname + "/tmp/README.md",
			fs.readFileSync( __dirname + "/artifacts/README.md" )
		);
    done();
  },

  "full subversion module checkout": function(test) {
    test.expect( 4 );

		cp.exec( "npm install", {
			cwd: __dirname + "/tmp"
		}, function( error, stdout, stderr ) {

			test.equal( error, null, "There should be no error generated" );

			test.ok(
				fs.existsSync( __dirname + "/tmp/node_modules" ),
				"Should have a node_modules folder" );

			test.ok(
				fs.existsSync( __dirname + "/tmp/node_modules/svn-npm-crutch-test" ),
				"Should have a svn-npm-crutch-test module (from subversion)" );

			var svnNpmCrutchTestResult = false;

			try {
				svnNpmCrutchTestResult = require( "./tmp/node_modules/svn-npm-crutch-test" ).test();
			} catch( e ) {
				// Don't die
			}

			test.equal(
				svnNpmCrutchTestResult,
				"HEY YOU GUYS!",
				"Should be able to require the svn module "
			);

			test.done();

		});
  }
};