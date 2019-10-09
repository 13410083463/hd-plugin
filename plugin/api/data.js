let systemInfo = {};

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
  systemInfo: systemInfo
}