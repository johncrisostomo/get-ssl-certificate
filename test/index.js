var should = require('chai').should(),
    expect = require('chai').expect,
    spy = require('sinon').spy,
    stub = require('sinon').stub,
    https = require('https'),
    getSSLCertificate = require('../index');

describe('getSSLCertificate.get()', function() {
  var mockUrl = 'https://nodejs.org';

  var mockCertificate= {
     subject:
       { OU: [ 'Domain Control Validated', 'PositiveSSL Wildcard'  ],
            CN: '*.nodejs.org' },
      issuer:
       { C: 'GB',
            ST: 'Greater Manchester',
            L: 'Salford',
            O: 'COMODO CA Limited',
            CN: 'COMODO RSA Domain Validation Secure Server CA' },
      valid_from: 'Nov  8 00:00:00 2015 GMT',
      valid_to: 'Aug 22 23:59:59 2017 GMT',
  };

  var mockSuccessResult = { 
    socket: { 
      getPeerCertificate: function() { 
        return mockCertificate;
      }, 
    }, 
  };

  var mockFailResult = { 
    socket: { 
      getPeerCertificate: function() { 
        return {}; 
      }, 
    }, 
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
  ];

  beforeEach(function() {
    stub(https, "get").yields(httpsCb.shift())
      .returns({ on: onEventStub, end: endFunction, });
  });

  afterEach(function() {
    https.get.restore();
  });

  it('should throw an error for empty strings', function() {
    expect(function () { getSSLCertificate.get('', spy()) }).to.throw(Error);
  });

  it('should return a promise', function() {
    expect(getSSLCertificate.get(mockUrl)).to.be.a('Promise');
  });

  it('should reject with an Error if an empty object is received', function(done) {
    getSSLCertificate.get(mockUrl).catch(function (err) {
      expect(err.message).to.be.equal('The website did not provide a certificate');
      done();
    });
  });

  it('should pass the certificate to the callback if successful', function(done) {
    getSSLCertificate.get(mockUrl).then(function (cert) {
      expect(cert).to.be.deep.equal(mockCertificate);
      expect(endFunction.called).to.be.equal(true);
      done();
    });
  });

  it('req.on() should always be called to handle https error events', function (done) {
    getSSLCertificate.get(mockUrl).then(function (cert) {
      expect(onEventStub.calledWith('error')).to.be.equal(true);
      done();
    });
  });

  it('req.end() should be called', function(done) {
    getSSLCertificate.get(mockUrl).then(function (cert) {
      expect(cert).to.be.deep.equal(mockCertificate);
      expect(endFunction.called).to.be.equal(true);
      done();
    });
  });
});
