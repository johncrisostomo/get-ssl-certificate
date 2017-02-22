var https = require('https');

function isEmpty(object) {
  for(var prop in object) {
    if(object.hasOwnProperty(prop))
      return false;
  }

  return true;
}

function get(url) {
  if (url.length <= 0 || typeof url !== 'string') {
    throw Error("A valid URL is required");
  }

  var options = {
    hostname: url, 
    agent: false, 
    rejectUnauthorized: false,
    ciphers: "ALL",
  };
  
  return new Promise(function (resolve, reject) {
    var req = https.get(options, function (res) {
      var certificate = res.socket.getPeerCertificate();
      if(isEmpty(certificate) || certificate === null) {
        reject({message: 'The website did not provide a certificate'});
      } else {
        resolve(certificate);
      }
    });

    req.on('error', function(e) {
      reject(e);
    });

    req.end();
  });
}

module.exports = {
  get: get,
};
