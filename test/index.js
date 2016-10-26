var should = require('chai').should(),
    expect = require('chai').expect,
    spy = require('sinon').spy,
    stub = require('sinon').stub,
    https = require('https'),
    getSSLCertificate = require('../index');

describe('getSSLCertificate', function() {
  var url = 'nodejs.org';

  it('should throw an error for empty strings', function() {
    expect(function () { getSSLCertificate('', spy()) }).to.throw(Error);
  });

  it('should throw an error if callback provided is not a function', function() {
    expect(function () { getSSLCertificate(url, '') }).to.throw(Error);
  });

  it('should accept a url and a callback function', function() {
    getSSLCertificate(url, spy());
  });

  it('should pass the certificate to the callback if successful', function(done) {
    getSSLCertificate(url, function(err, result) {
      expect(result).to.be.a("Object");
      done();
    });
  });

  it('should pass an error Object for invalid URLs/not found', function(done) {
    getSSLCertificate('hello.sample', function(err, result) {
      expect(err).to.be.a("Object");
      done();
    });
  });
});
