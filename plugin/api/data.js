let systemInfo = {};
const http = require('./http.js');
const api = require('./api.js');
console.log(http)
function fn(){
  return new Promise((resolve,reject)=>{
    http.httpRequest2({
      url: api.get_pushUrl,
      method: "POST",
      data: {}
    }).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}
//获取设备信息
wx.getSystemInfo({
  success(e) {
    var height = (e.statusBarHeight * 2) + 20;
    var totleHeight = e.screenHeight - height;
    systemInfo.totleHeight = totleHeight;
    systemInfo.height = e.statusBarHeight
  }
})
module.exports = {
  systemInfo: systemInfo,
  fn:fn
}