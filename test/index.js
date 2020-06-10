var fs = require('fs');

require.extensions['.txt'] = function(module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

require.extensions['.pem'] = function(module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

var should = require('chai').should(),
  expect = require('chai').expect,
  spy = require('sinon').spy,
  stub = require('sinon').stub,
  https = require('https'),
  rewire = require('rewire'),
  mockPemEncodedCert = require('./mocks/mock.pem'),
  mockBase64EncodedRawBuffer = require('./mocks/base64buffer.txt'),
  getSSLCertificate = rewire('../index');

describe('Mock getSSLCertificate.get()', function() {
  var mockUrl = 'nodejs.org';

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
    mockSuccessResult,
    mockFailResult
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

describe('Live getSSLCertificate.get()', function() {
  it('should timeout', function(done) {
    getSSLCertificate
      // This is a ridiculously low timeout that surely fails, as it usually takes around ~200ms
      .get('blog.johncrisostomo.com', 1)
      .catch(function(error) {
        expect(error.message).to.be.equal('Request timed out.');
        done();
      });
  });
});

describe('PEM Encoding', function() {
  var raw = '01234567890123456789'
  var pemEncode = getSSLCertificate.__get__('pemEncode')

  it('should have the correct prefix', function(done) {
    var encodedLines = pemEncode(raw, 5).split('\n')
    expect(encodedLines[0]).to.be.equal('-----BEGIN CERTIFICATE-----');
    done();
  })

  it('should have the correct suffix', function(done) {
    var encodedLines = pemEncode(raw, 5).split('\n')
    expect(encodedLines[encodedLines.length - 1]).to.be.equal('-----END CERTIFICATE-----');
    done();
  })

  it('should produce the expected number of lines with each given the maximum line-lengths', function(done) {
    for(var i = 1; i <= raw.length; i++) {
      var encodedLines = pemEncode(raw, i).split('\n')
      expect(encodedLines).to.have.lengthOf(Math.ceil(raw.length / i) + 2);
      for(var lineIndex = 1; lineIndex < encodedLines.length - 2; lineIndex++) {
        expect(encodedLines[lineIndex]).to.have.lengthOf(i);
      }
      expect(encodedLines[encodedLines.length - 2]).to.have.lengthOf.below(i + 1);
    }
    done();
  })
});
