'use strict';

const dns = require('dns')

function IPRetriever() {}

IPRetriever.prototype.getIpAddress = function(hostname, callback) {

dns.lookup(hostname, function(err, result) {
	console.log('Result of IP:')
	console.log(result)
	callback(result)
})
}


module.exports = IPRetriever;

//new IPRetriever().getIpAddress('www.google.com');
