const https = require('https');
 
function HTTPGet() {}

HTTPGet.prototype.executeHttpGet = function(theUrl, callbackSuccess, callbackFail) {
const url = require('url');

const myURL =
  new url.parse(theUrl);
var options = 
	{
host : myURL.hostname,
port : myURL.port,
path : myURL.path,

        rejectUnauthorized: false, 

   strictSSL: false

};
console.log('Making HTTP request')
https.get(options, (resp) => {
  let data = '';
console.log('here') 
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });
 
  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    	console.log('Ending')
	console.log(data);
	callbackSuccess()
  });
 
}).on("error", (err) => {
  console.log("Error: " + err.message);
  callbackFail()
});
}

module.exports = HTTPGet;

