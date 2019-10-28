var data = require('../../index.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    camera: true,
    mode: 'SD',//SD（标清）, HD（高清）, FHD（超清）, RTC（实时通话）
    beauty: 5,//美颜数值 1-9 0关闭
    muted: false,//是否静音
    height: data.api.systemInfo.height,
    totleHeight: data.api.systemInfo.totleHeight,
    imageUrlPath: data.image,
    args: {
      withCredentials: true,
      lang: 'zh_CN'
    },
    url:'',
    login: false,
    player: true,
    windowInfo: '1、任何机构和个人不得通过黑洞智影平台对重大政治、军事、经济、社会、文化、体育等活动、事件的实况进行视音频直播。 2、严禁发表反党反政府的言论，或做出侮辱诋毁党和国家的行为。 3、严禁直接或间接传播淫秽、色情、挑逗性、大尺度内容。',
    userInfo: {},
    is_master: 2,
    focus: false,
    showComment: false,
    commentHeight: 0,
    comment: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    _this.setData({
      player: false
    })
    if (!wx.getStorageSync('id')) {
      _this.setData({
        login: true
      })
      return
    }
    _this._initData()
  },
  onMainPush: function (e) { },
  onMainError: function (e) { },
  //获取登录授权成功
  loginSuccess: function (res) {
    var _this = this;
    data.http.login({
      url: data.url.login,
      data: {
        code: res.detail.code
      }
    }).then((res) => {
      if (res.code == 0) {
        wx.setStorageSync('id', res.token)
        wx.setStorageSync('userInfo', res.userInfo)
        _this._initData();
      }
    })
  },
  //获取登录授权失败
  loginFail: function (res) {
    console.log(res);
  },
  //初始数据
  _initData: function () {
    var _this = this;
    data.http.httpRequest({
      url: data.url.getMerchid,
      data: {}
    }, _this).then((res) => {
      _this.setData({
        userInfo: res.account,
        merchid: res.merchid
      })
      return _this._getPushLive();
    }).then((res) => {
      if (res.code == 200) {
        _this.setData({
          url: res.data.src,
          login: false,
          player: true
        }, () => {
          _this.pusherContext = wx.createLivePusherContext('pusher')
          _this.pusherContext.start()
           data.util.socket.init(_this);
        })
      }
    })
  },
  //获取推流地址
  _getPushLive: function () {
    var _this = this;
    return new Promise((resolve, reject) => {
      data.http.httpRequest({ 
        url: data.url.get_pushUrl,
        method: 'POST',
        data: {},
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }, _this).then((res) => {
        resolve(res)
      })
    })
  },
  _close() {
    var that = this;
    that.setData({
      focus: false,
      showComment: false,
      commentHeight: 0
    })
  },
  showcomment() {
    var that = this;
    that.setData({
      focus: true,
      showComment: true,
      commentHeight: 80
    })
  },
  //提交评论
  pushComment(e) {
    var that = this;
    var res = { 'type': 'comment', 'data': { 'merchid': that.data.merchid, 'comment': e.detail.value, 'nike_name': that.data.userInfo.merchname, 'photo': that.data.userInfo.logo, 'beta_version': 1 } };
    that.oncomment(res)
    that.setData({
      focus: false,
      showComment: false,
      commentHeight: 0
    })
  },
  //弹幕检测
  oncomment(comment) {
    var that = this;
    data.http.httpRequest({
      url: data.url.content + comment.data.comment,
      data: {}
    }, that).then((res) => {
      if (res.code == 200) {
        data.util.socket.onsendSocketMessage(comment)
      } else {
        wx.showToast({
          title: '您的弹幕有敏感词汇！请重新发送',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  //数据类型处理
  onpreDataType(data) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    var comment = that.data.comment;
    switch (data.type) {
      case 'commentList':
        var commentList = data.list;
        for (let i in commentList) {
          var cuttingList = commentList[i].split('|');
          var obj = {
            name: cuttingList[0],
            content: cuttingList[1],
            logo: cuttingList[2],
            type: 2
          }
          comment.push(obj)
        }
        that.setData({
          comment
        })
        break;
      case 'comment':
        var temp = data.comment.split('|');
        var obj = {
          name: temp[0],
          content: temp[1],
          logo: temp[2],
          type: userInfo.nickName == that.data.userInfo.merchname ? 1 : 2
        }
        comment.push(obj)
        that.setData({
          comment
        })
        break;
      case 'joinRoom':
        var temp = data.content.split('|');
        var obj = {
          name: '',
          content: temp[0] + temp[1],
          logo: temp[2],
          type: 3
        }
        comment.push(obj)
        that.setData({
          comment
        })
        break;
      case 'refresh':
        that.setData({
          total: data.total
        })
        break;
      default:
    }
    that.queryMultipleNodes();
  },
  //获取滚动条高度
  queryMultipleNodes() {
    var _this = this;
    wx.createSelectorQuery().in(_this).select('.comment').boundingClientRect(function (res) {
      console.log(res)
      _this.setData({
        chatbottom: res.height
      })
    }).exec()
    wx.createSelectorQuery().in(_this).select('.chatcoze-ul').boundingClientRect(function (res) {
      if (res.height != undefined && res.height != '' && res.height != null && typeof (res.height) != 'undefined') {
        var setsbottom = Math.ceil(parseInt(res.height) - parseInt(_this.data.chatbottom));
        _this.setData({
          scrollTop: setsbottom
        });
      }
    }).exec()
  },
  //切换相机
  switchCamera() {
    this.pusherContext && this.pusherContext.switchCamera({});
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})