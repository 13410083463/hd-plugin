var config = require('../config')
var path = config.windowUrl;
var api = {
  login: path +'app/index.php?i=2&status=login&c=entry&do=login&m=ceshi_zxy',
  get_pushUrl: path + 'app/index.php?i=2&c=entry&m=ewei_shopv2&do=mobile&r=appMethod.live.getPushUrl',
  getMerchid: path +'app/index.php?i=2&c=entry&m=ewei_shopv2&do=mobile&r=appMethod.shortVideo.getinfo',
  content: path +"/app/index.php?i=2&c=entry&do=chat&m=back_zxy&content="
}
module.exports = api
