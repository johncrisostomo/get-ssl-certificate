# get-ssl-certificate

## A zero-dependency utility that returns a website's SSL certificate

[![Build Status](https://travis-ci.org/johncrisostomo/get-ssl-certificate.svg?branch=master)](https://travis-ci.org/johncrisostomo/get-ssl-certificate)
[![Coverage Status](https://coveralls.io/repos/github/johncrisostomo/get-ssl-certificate/badge.svg?branch=master)](https://coveralls.io/github/johncrisostomo/get-ssl-certificate?branch=master)
[![Code Climate](https://codeclimate.com/github/johncrisostomo/get-ssl-certificate/badges/gpa.svg)](https://codeclimate.com/github/johncrisostomo/get-ssl-certificate)
[![npm](https://img.shields.io/badge/npm-v2.3.3-blue.svg)](https://www.npmjs.com/package/get-ssl-certificate)

### Installation

```
npm install --save get-ssl-certificate
```

### Usage

#### Import package:

```
const sslCertificate = require('get-ssl-certificate')
```

#### Pass a url / domain name:

```
sslCertificate.get('nodejs.org').then(function (certificate) {
  console.log(certificate)
  // certificate is a JavaScript object

  console.log(certificate.issuer)
  // { C: 'GB',
  //   ST: 'Greater Manchester',
  //   L: 'Salford',
  //   O: 'COMODO CA Limited',
  //   CN: 'COMODO RSA Domain Validation Secure Server CA' }

  console.log(certificate.valid_from)
  // 'Aug  14 00:00:00 2017 GMT'

  console.log(certificate.valid_to)
  // 'Nov 20 23:59:59 2019 GMT'

  // If there was a certificate.raw attribute, then you can access certificate.pemEncoded
  console.log(certificate.pemEncoded)
  // -----BEGIN CERTIFICATE-----
  // ...
  // -----END CERTIFICATE-----
});
```

#### Optional parameters: Timeout (in ms), Protocol (Default is 'https:') and Port (Default is 443)

```
sslCertificate.get('nodejs.org', 250, 443, 'https:').then(function (certificate) {
  console.log(certificate)
  // certificate is a JavaScript object

  console.log(certificate.issuer)
  // { C: 'GB',
  //   ST: 'Greater Manchester',
  //   L: 'Salford',
  //   O: 'COMODO CA Limited',
  //   CN: 'COMODO RSA Domain Validation Secure Server CA' }

  console.log(certificate.valid_from)
  // 'Aug  14 00:00:00 2017 GMT'

  console.log(certificate.valid_to)
  // 'Nov 20 23:59:59 2019 GMT'

  // If there was a certificate.raw attribute, then you can access certificate.pemEncoded
  console.log(certificate.pemEncoded)
  // -----BEGIN CERTIFICATE-----
  // ...
  // -----END CERTIFICATE-----
});
```

## License

MIT
