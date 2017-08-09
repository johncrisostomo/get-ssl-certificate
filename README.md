# get-ssl-certificate

## A micro-library that returns a website's SSL certificate

[![Build Status](https://travis-ci.org/johncrisostomo/get-ssl-certificate.svg?branch=master)](https://travis-ci.org/johncrisostomo/get-ssl-certificate)
[![Coverage Status](https://coveralls.io/repos/github/johncrisostomo/get-ssl-certificate/badge.svg?branch=master)](https://coveralls.io/github/johncrisostomo/get-ssl-certificate?branch=master)
[![Code Climate](https://codeclimate.com/github/johncrisostomo/get-ssl-certificate/badges/gpa.svg)](https://codeclimate.com/github/johncrisostomo/get-ssl-certificate)
[![npm](https://img.shields.io/badge/npm-v2.0.1-blue.svg)](https://www.npmjs.com/package/get-ssl-certificate)

### Installation

```
npm install --save get-ssl-certificate
```

### Usage

#### Import package:
```
var sslCertificate = require('get-ssl-certificate');
```

#### Pass a url / domain name:
```
sslCertificate.get('nodejs.org').then(function (certificate) {
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
License
----

MIT
