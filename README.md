# get-ssl-certificate

## A micro-library that returns a website's SSL certificate

### Installation

```
npm install --save get-ssl-certificate
```

### Usage

#### Import package:
```
var getSSL = require('get-ssl-certificate');
```

#### Pass a url / domain name and a callback function:
```
getSSL('nodejs.org', function(err, certificate) {

  console.log(certificate);
  // certificate is a JavaScript object

  console.log(certificate.issuer);
  // { C: 'GB',
  //   ST: 'Greater Manchester',
  //   L: 'Salford',
  //   O: 'COMODO CA Limited',
  //   CN: 'COMODO RSA Domain Validation Secure Server CA' }

  console.log(certificate.valid_from)
  // 'Nov  8 00:00:00 2015 GMT'

  console.log(certificate.valid_to)
  // 'Aug 22 23:59:59 2017 GMT'

});
```

### Todos
- 100% coverage through proper stubbing to simulate HTTPS requests
- Promise-based helper functions

License
----

MIT
