// app.js
App({
  onLaunch() {

    wx.cloud.init({
      traceUser: true,
      env: 'cloud1-2gqr09fl444e3a8c'
    })

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: {
      name: "",
      _openid: "",
      isManager: 0,
      phone: ""
    }
  }
})
