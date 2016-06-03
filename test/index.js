const assert = require('assert');
const exec = require('child_process').exec;
const fs = require('fs');

describe(
    'run 10000 dice rolls csv generation example via "npm example"',
    function(){
	var error = false;
	before(function(done){
	    try {
		fs.unlinkSync("./dicerolls.csv");
	    } catch(e) {};
	    exec('npm run-script example', 
		 function(e, stdout, stderr){
		     error = e;
		     done();
		 });
	});
	after(function(){
	    try {
		fs.unlinkSync("./dicerolls.csv");
	    } catch(e) {};
	});
	it('should run without throwing an error', function(){
	    assert.ok(!error, error);
	});
	it('should create a file called dicerolls.csv', function(){
	    /* see:
	       http://stackoverflow.com/questions/4482686/check-synchronously-if-file-directory-exists-in-node-js
	    */
	    fs.accessSync("./dicerolls.csv", fs.F_OK);
	});
	it('the dicerolls.csv file should have 10001-10002 lines', function(){
	    var data = (fs
			.readFileSync("./dicerolls.csv", {encoding:"utf8"})
			.split("\n")
		       );
	    assert.ok((data.length === 10001) || (data.length === 10002));
	});
	it('the 10001th line should be "10000","<n>" where n is between 1 and 6', function(){
	    var data = (fs
			.readFileSync("./dicerolls.csv", {encoding:"utf8"})
			.split("\n")
		       );
	    var rowstring = data[10000];
	    var row = JSON.parse('['+rowstring+']');
	    assert.ok(row[0] === "10000");
	    assert.ok( (+row[1]<=6) && (+row[1]>0) );
	});
    }
);

describe('browserify bundling the example and module code ', function(){
    var error = 0;
    var bundleFileName = "./example/csv-file-creator-example-bundle.js";
    before(function(done){
	try {
	    fs.unliknkSync(bundleFileName);
	} catch(e){}
	exec('cd ./example && ./makeBundle.sh', 
	     function(e,stdout,stderr){
		 error = e;
		 done();
	     });
    });
    after(function(){
	try {
	    fs.unlinkSync(bundleFileName);
	} catch(e) {}
    });
    it('should run without throwing an error', function(){
	assert.ok(!error, error);
    });
    it('should create the bundle file '+bundleFileName, function(){
	fs.accessSync(bundleFileName, fs.F_OK);
    });
});

describe('running example in firefox ', function(){
    before(function(done){
	var firefox;
	try {
	    fs.unlinkSync("./dicerolls.csv");
	} catch(e){}
	var forceQuit = function(){
	    firefox.kill();
	    done();
	};
	setTimeout(forceQuit, 10000);
	firefox = exec("firefox example/index.html", 
		       function(e, stdout, stderr){});
    });
    after(function(){
	try {
	    fs.unlinkSync("./dicerolls.csv");
	} catch(e) {};
    });
    it('should create the file dicerolls.csv',
       function(){
	   fs.accessSync("./dicerolls.csv", fs.F_OK);
       });
});
