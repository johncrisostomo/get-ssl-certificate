var should = require('chai').should(),
  expect = require('chai').expect,
  spy = require('sinon').spy,
  stub = require('sinon').stub,
  https = require('https'),
  getSSLCertificate = require('../index');

describe('getSSLCertificate.get()', function() {
  var mockUrl = 'https://nodejs.org';

  var mockBase64EncodedRawBuffer =
    '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​​​​​';

  var mockPemEncodedCert = `-----BEGIN CERTIFICATE-----
MIIGSzCCBTOgAwIBAgIQZlk9V/IMvFc+QzOBtf7CgDANBgkqhkiG9w0BAQsFADCB
kDELMAkGA1UEBhMCR0IxGzAZBgNVBAgTEkdyZWF0ZXIgTWFuY2hlc3RlcjEQMA4G
A1UEBxMHU2FsZm9yZDEaMBgGA1UEChMRQ09NT0RPIENBIExpbWl0ZWQxNjA0BgNV
BAMTLUNPTU9ETyBSU0EgRG9tYWluIFZhbGlkYXRpb24gU2VjdXJlIFNlcnZlciBD
QTAeFw0xNzA4MTQwMDAwMDBaFw0xOTExMjAyMzU5NTlaMFkxITAfBgNVBAsTGERv
bWFpbiBDb250cm9sIFZhbGlkYXRlZDEdMBsGA1UECxMUUG9zaXRpdmVTU0wgV2ls
ZGNhcmQxFTATBgNVBAMMDCoubm9kZWpzLm9yZzCCAiIwDQYJKoZIhvcNAQEBBQAD
ggIPADCCAgoCggIBALVs5Fy3QLCaE/ZKxUO3Ev+e6OTChLVCoXCKJ+gqjRUcoXgV
PhLm3aFb9w/9lsuKiGGGQb38ygNSfmZbcNd5yKNJpviP1O9lVxgL1MmBkocrz+Ov
VuhjwJ3di8HsWN+dlPkU8DaRArKHC+z6E0igg4ycSb0cIBJLRCR3VyNHBHUGsfzW
WKgNDES8wWvFxUls/m5KhCjvZUzT2Jcr9uW/rVnJMAaDC16xBWu7OLU9FGT6bgK/
3y/2bNlJSG8HdexDA07CYCrvvxcDrSIdqiqINTw7amiO/oOHgR9kXO7Xs/5G4fi5
9Z+tAo80m5vBQhHVgwmU0FXuo9VHkR4HoK3euKgrkYjlhyDZXNR47smvHxe+gUG+
gJBvGjOURafrWyhfaAObDylFmKfRwABfwitScbB1L1jM3vjI/YVvt64hyAuKLOmD
rpQEblPt5MuJ9CUC0xtTYHccAcgBVZGGN0kFUOP1VeLudcyMY23eNjPP7dYukb8P
dognNpTu66IML8nxSipDVRe8HXNzkiRjQJq2Aylc6wu1N4ejNMnKPKizAAXFpi/A
cVCDRi4AcZqPo+0KmCjDhxNgpz+LBKT8HnEwKETpu5lAt350XJ2R8ibXGvytSxE6
r2jZKyTdtKITa1WhzRrfOWBbY8tjkDjtD0yYdomGZ0Omh2nMVYR+SgbW4uPxAgMB
AAGjggHVMIIB0TAfBgNVHSMEGDAWgBSQr2o6lFoL2JDqElZz30O0Oija5zAdBgNV
HQ4EFgQUcMdzKdAgAd58S29IuEIabcmg6jcwDgYDVR0PAQH/BAQDAgWgMAwGA1Ud
EwEB/wQCMAAwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCME8GA1UdIARI
MEYwOgYLKwYBBAGyMQECAgcwKzApBggrBgEFBQcCARYdaHR0cHM6Ly9zZWN1cmUu
Y29tb2RvLmNvbS9DUFMwCAYGZ4EMAQIBMFQGA1UdHwRNMEswSaBHoEWGQ2h0dHA6
Ly9jcmwuY29tb2RvY2EuY29tL0NPTU9ET1JTQURvbWFpblZhbGlkYXRpb25TZWN1
cmVTZXJ2ZXJDQS5jcmwwgYUGCCsGAQUFBwEBBHkwdzBPBggrBgEFBQcwAoZDaHR0
cDovL2NydC5jb21vZG9jYS5jb20vQ09NT0RPUlNBRG9tYWluVmFsaWRhdGlvblNl
Y3VyZVNlcnZlckNBLmNydDAkBggrBgEFBQcwAYYYaHR0cDovL29jc3AuY29tb2Rv
Y2EuY29tMCMGA1UdEQQcMBqCDCoubm9kZWpzLm9yZ4IKbm9kZWpzLm9yZzANBgkq
hkiG9w0BAQsFAAOCAQEASDpkkfX7Feoa0/C/m+DkAZRzg+mEacWfk2CPQEl5y+Xf
UHxIaN9boBvU9vYTonmy4+cIolVEgoIAWE4ckHZe8UDG1xpDbLOTxMFDzZlw5Q1K
hGklibNxlNRKV+esSH+vQMBGbOYXBnJrEv0TwrR+autRyBRq+PArgmAUFyzwp/dU
ne+t90j8ys/qcjy0nJ2u2/9uh5smb/9rQT3VbVCipJQetpionZXDGNWSwJvMK+kI
6/1bESkdRFPIFqmd5u6R9HVk1GHz3vy8oAq6HuqiyVmV3ylIeuui1PN/MJ7wNmpK
HmJx6deP0rullujAEXAf0QRFq39TiLld//8aIx/ZSg==
-----END CERTIFICATE-----`;

  var bufferFromBase64String = new Buffer.from(mockBase64EncodedRawBuffer, 'base64');

  var mockCertificate = {
    subject: {
      OU: ['Domain Control Validated', 'PositiveSSL Wildcard'],
      CN: '*.nodejs.org'
    },
    issuer: {
      C: 'GB',
      ST: 'Greater Manchester',
      L: 'Salford',
      O: 'COMODO CA Limited',
      CN: 'COMODO RSA Domain Validation Secure Server CA'
    },
    valid_from: 'Nov  8 00:00:00 2015 GMT',
    valid_to: 'Aug 22 23:59:59 2017 GMT',
    raw: bufferFromBase64String
  };

  var mockSuccessResult = {
    socket: {
      getPeerCertificate: function() {
        return mockCertificate;
      }
    }
  };

  var mockFailResult = {
    socket: {
      getPeerCertificate: function() {
        return {};
      }
    }
  };

  var onEventStub = spy();
  var endFunction = spy();

  var httpsCb = [
    mockFailResult,
    mockSuccessResult,
    mockFailResult,
    mockSuccessResult,
    mockSuccessResult,
    mockSuccessResult,
    mockSuccessResult,
    mockSuccessResult
  ];

  beforeEach(function() {
    stub(https, 'get')
      .yields(httpsCb.shift())
      .returns({ on: onEventStub, end: endFunction });
  });

  afterEach(function() {
    https.get.restore();
  });

  it('should throw an error for empty strings', function() {
    expect(function() {
      getSSLCertificate.get('', spy());
    }).to.throw(Error);
  });

  it('should return a promise', function() {
    expect(getSSLCertificate.get(mockUrl)).to.be.a('Promise');
  });

  it('should reject with an Error if an empty object is received', function(done) {
    getSSLCertificate.get(mockUrl).catch(function(err) {
      expect(err.message).to.be.equal('The website did not provide a certificate');
      done();
    });
  });

  it('should pass the certificate to the callback if successful', function(done) {
    getSSLCertificate.get(mockUrl).then(function(cert) {
      expect(cert).to.be.deep.equal(mockCertificate);
      expect(endFunction.called).to.be.equal(true);
      done();
    });
  });

  it('req.on() should always be called to handle https error events', function(done) {
    getSSLCertificate.get(mockUrl).then(function(cert) {
      expect(onEventStub.calledWith('error')).to.be.equal(true);
      done();
    });
  });

  it('req.end() should be called', function(done) {
    getSSLCertificate.get(mockUrl).then(function(cert) {
      expect(cert).to.be.deep.equal(mockCertificate);
      expect(endFunction.called).to.be.equal(true);
      done();
    });
  });

  it('the certificate should have a raw attribute equal to the converted mock buffer', function(done) {
    getSSLCertificate.get(mockUrl).then(function(cert) {
      expect(cert.raw).to.be.deep.equal(bufferFromBase64String);
      done();
    });
  });

  it('the certificate should have a pemEncoded attribute equal to the mock PEM encoded certificate', function(done) {
    getSSLCertificate.get(mockUrl).then(function(cert) {
      expect(cert.pemEncoded).to.be.equal(mockPemEncodedCert);
      done();
    });
  });
});
