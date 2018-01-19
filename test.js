'use strict';

var callback = function(result) {
console.log('Callback: ' + result);
}
var IPRetriever = require('./ip_retriever');
	new IPRetriever().getIpAddress('fergusb.dyndns.org', callback
);
console.log('done')


var HTTPGet = require('./http_get')
new HTTPGet().executeHttpGet('https://httpbin.org/ip')
