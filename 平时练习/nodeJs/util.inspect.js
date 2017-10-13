var  util = require('util'); 

function Person() {
	this.name = 'byvoid';

	this.toString = function() {
		return this.name;
	};
}
var obj = new Person(); 
var a = 'fa';
console.log( a );
console.log( util.inspect( obj, false, null, true ) );