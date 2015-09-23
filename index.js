var thunkify = require('thunkify');
var request = require('request');

var token, jsapiTicket;

function* refreshToken(appid, appsec) {
  var now = Date.now();
  if (!token || (now - token.timestamp > 3600 * 1000)) {
    var result =
      yield thunkify(request)({
        url: 'https://api.weixin.qq.com/cgi-bin/token',
        qs: {
          grant_type: 'client_credential',
          appid: appid,
          secret: appsec
        }
      });
    if (result) {
      var body = result[1];
      token = JSON.parse(body);
      token.timestamp = now;
    }
  }
  return token;
}

function* getTicket(appid, appsec) {
  if (!token) {
    yield refreshToken(appid, appsec);
  }
  var result =
    yield thunkify(request)({
      url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
      qs: {
        access_token: token.access_token,
        type: 'jsapi'
      }
    });
  if (result) {
    var body = result[1];
    var data = JSON.parse(body);
  }
  if (!data || !data.ticket) {
    token = null;
    return yield getTicket();
  }
  return data;
}

module.exports = function*(appid, appsec) {
  if (!jsapiTicket) {
    jsapiTicket = yield getTicket(appid, appsec);
  }
  return jsapiTicket;
};
