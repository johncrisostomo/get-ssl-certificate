var https = require('https')

function isEmpty(object) {
  for (var prop in object) {
    if (object.hasOwnProperty(prop)) return false
  }

  return true
}

function pemEncode(str, n) {
  var ret = []

  for (var i = 1; i <= str.length; i++) {
    ret.push(str[i - 1])
    var mod = i % n

    if (mod === 0) {
      ret.push('\n')
    }
  }

  var returnString = `-----BEGIN CERTIFICATE-----\n${ret.join('')}\n-----END CERTIFICATE-----`

  return returnString
}

function get(url, opts) {
  opts = opts || {};
	
  if (url.length <= 0 || typeof url !== 'string') {
    throw Error('A valid URL is required')
  }

  var options = {
    hostname: url,
	timeout: opts.timeout,
    agent: false,
    rejectUnauthorized: false,
    ciphers: 'ALL'
  }

  return new Promise(function(resolve, reject) {
    var req = https.get(options, function(res) {
      var certificate = res.socket.getPeerCertificate()
      if (isEmpty(certificate) || certificate === null) {
        reject({ message: 'The website did not provide a certificate' })
      } else {
        if (certificate.raw) {
          certificate.pemEncoded = pemEncode(certificate.raw.toString('base64'), 64)
        }
        resolve(certificate)
      }
    })
	
	// Set timeout if required
	if (options.timeout) {
		req.setTimeout(options.timeout, function() {
			reject('Timeout triggered after ' + options.timeout + ' ms');
			req.abort();
		})
	}
    req.on('error', function(e) {
      reject(e);
    })

    req.end();
  })
}

module.exports = {
  get: get
}
