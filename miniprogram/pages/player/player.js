var plugin = requirePlugin("myPlugin")
Page({
  data: {
    camera: true,
    mode: 'SD',//SD（标清）, HD（高清）, FHD（超清）, RTC（实时通话）
    beauty: 5,//美颜数值 1-9 0关闭
    muted: false,//是否静音
  },
  onLoad: function () {
  },
 
  onloginSuccess(v) {
    console.log(v)
  }
})