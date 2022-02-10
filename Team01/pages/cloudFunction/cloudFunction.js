// pages/cloudFunction/cloudFunction.js
Page({

  onLoad(){
    wx.cloud.callFunction({
      name: 'getData'
    })
    .then(res => {
      this.setData({
        openid: res.result.openid
      })
    })
    .catch(res => {
      console.log('Fail', res)
    })
  }
  
  
})