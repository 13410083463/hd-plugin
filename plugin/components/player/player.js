var data = require('../../index.js')
Component({
  properties:{
    camera:Boolean,
    mode:String,
    beauty:Number,
    muted:Boolean
  },
  data: {
    height: data.systemInfo.height,
    login:false,
    player:true,
    totleHeight: data.systemInfo.totleHeight,
    args: {
      withCredentials: true,
      lang: 'zh_CN'
    },
    url:'',
    userInfo:{}
  },
  attached: function(){
    // 可以在这里发起网络请求获取插件的数据
  },
  ready:function(){
    var _this = this
    _this.setData({
      player:false
    })
    if(!wx.getStorageSync('id')){
      _this.setData({
        login:true
      })
      return
    }
    _this._initData()
  },
  methods:{
    onMainPush: function (e) {
      console.log(e)
    },
    onMainError: function (e) {
      console.log(e)
    },
    //获取登录授权成功
    loginSuccess: function (res) {
      var _this = this;
      data.http.login({
        url: data.url.login,
        data: {
          code: res.detail.code
        }
      }).then((res) => {
        console.log(res)
        if (res.code == 0) {
          wx.setStorageSync('id', res.token)
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
          userInfo: res.account
        })
        return _this._getPushLive();
      }).then((res)=>{
        if(res.code == 200){
          _this.setData({
            url:res.data.src,
            login:false,
            player:true
          },()=>{
            _this.pusherContext = wx.createLivePusherContext('pusher')
            _this.pusherContext.start()
          })
         
        }
      })
    },
    //获取推流地址
    _getPushLive:function() {
      var _this = this;
      return new Promise((resolve,reject)=>{
        data.http.httpRequest({
          url: data.url.get_pushUrl,
          method:'POST',
          data:{},
          header: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        },_this).then((res)=>{
          resolve(res)
        })
      })
    },
    //设置权限
    _openSetting(){
      var _this = this;
      wx.getSetting({
        success(res) {
          console.log(res)
          if (res.authSetting['scope.camera'] && res.authSetting['scope.record']) {
            console.log(1111)
          }
        }
      });
    }
  },
})