// pages/more/more.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: app.globalData.userInfo.nickName,
    identity: app.globalData.userInfo.identity,
    userAvatarUrl: app.globalData.userInfo.avatarUrl,
    position: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(this.data.identity==0){
      this.setData({
        position: this.dictionary.house_owner,
      })
    }
    else if(this.data.identity==1){
      this.setData({
        position: this.dictionary.project_manager,
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        // console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  onSetting: function(){
    wx.navigateTo({
      url: '../setting/setting',
    })
  },
  onMoreInfo: function(){
    wx.navigateTo({
      url: '../moreInfo/moreInfo',
    })
  }
})