var https = require('https');

function isEmpty(object) {
  for(var prop in object) {
    if(object.hasOwnProperty(prop))
      return false;
  }

  return true;
}

module.exports = function(url, callback) {
  if (url.length <= 0 || typeof url != 'string') {
    throw Error("A valid URL is required");
  }

  if (typeof callback != "function") {
    throw Error("Callback function is required");
  }

  var req = https.get({hostname: url, agent: false}, function (res) {
    var certificate = res.socket.getPeerCertificate();
    if(isEmpty(certificate) || certificate === null) {
      callback({message: 'The website did not provide a certificate'}, null);
    } else {
      callback(null, certificate);
    }
  });

  req.on('error', function(e) {
    callback(e, null)
  });

  req.end();
}
