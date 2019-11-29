var SocketTask = null;
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
var socket = {
  init(that) {
    var _this = that;
    var name = _this.data.userInfo.merchname;
    var mid = _this.data.merchid;
    var logo = _this.data.userInfo.logo;
    var is_master = _this.data.is_master;
    var temp = 'wss://interface.dagaimao.cn:9501' + "?nike_name=" + name + "&merchid=" + mid + "&is_master=" + is_master + "&photo=" + logo
    var url = encodeURI(temp)
    //建立连接
    SocketTask = wx.connectSocket({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      success(e) {
        console.log(e)
      }
    })
    SocketTask.onOpen(function(res){
      console.log('websocket 连接成功')
    })
    SocketTask.onMessage((res) => {
      var data = JSON.parse(res.data)
      console.log(data)
      _this.onpreDataType(data)
    })
  },
  onsendSocketMessage(res) {
    var data = JSON.stringify(res)
    SocketTask.send({
      data: data,
      success(e){
      }
    })
  }
}
module.exports = {
  socket: socket,
  systemInfo: systemInfo
}