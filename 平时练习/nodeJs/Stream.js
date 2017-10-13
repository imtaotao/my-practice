"use strict";
const fs = require( 'fs' );
let data = '';

var stream = fs.createReadStream( 'input.txt' );

stream.setEncoding( 'UTF8' );

stream.on( 'data', val => data += val );

stream.on( 'end', () => console.log( data ) );