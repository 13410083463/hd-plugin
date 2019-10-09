let config = require('../config');
let api = require('./api.js')
/**
 *登录
 */
function login(options){
  return new Promise((resolve, reject) => {
    request(options).then((res)=>{
      resolve(res)
    }).catch((err)=>{
      wx.showToast({
        title: '网络出现异常！',
        icon: 'none',
        duration: 1000
      })
    })
  });
}
function request(options){
  return new Promise((resolve, reject)=>{
    wx.request({ ...options,...{
      success(res){
        resolve(res.data)
      },
      fail(err){
        reject(err)
      }
    }})
  })
}

function httpRequest(options,_this){
  return new Promise((resolve,reject)=>{
    var token = wx.getStorageSync('id')
    options.data.key = token
    if (token){
      request(options).then((res)=>{
        if (res.error != 5){
          resolve(res)
        }else{
          _this.setData({
            login:true
          })
        }
      }).catch((err)=>{
        wx.showToast({
          title: '网络出现异常！',
          icon: 'none',
          duration: 1000
        })
      })
    }else{
      _this.setData({
        login: true
      })
    }
  })
}
module.exports = {
  login: login,
  httpRequest:httpRequest
}