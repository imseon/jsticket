var jsticket = require('./index');
var co = require('co');
var assert = require('assert');

describe('jsticket', function() {
  it('should got jsticket', function() {
    return co(function*() {
      var ticket = yield jsticket('wx908d74aa59b95d94', '68458c6cea52c983c6b1bc4f5dc9897c');
      assert.equal(ticket.errcode, 0);
      assert.equal(ticket.expires_in, 7200);
    }).then(function() {});
  })
})
