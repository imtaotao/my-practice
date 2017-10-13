'use strict';
const os = require( 'os' );  

const ifaces = os.networkInterfaces();
const ip = {};

for ( let dev in ifaces ) {   
	ifaces[dev].forEach(  details => {  
		if ( details.family === 'IPv4' ) {  
			ip[dev] = details.address;
		}; 
	});  
};

module.exports = ip;