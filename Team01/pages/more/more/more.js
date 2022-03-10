// pages/more/more.js
const app = getApp();
Page({

  /**
   * Initial data of page
   */
  data: {
    nickName: app.globalData.userInfo.nickName,
    identity: app.globalData.userInfo.identity,
    userAvatarUrl: app.globalData.userInfo.avatarUrl,
    position: "",
  },

  /**
   * Life cycle function - listens for page loads
   */
  onLoad: function (options) {
    if (this.data.identity == 0) {
      this.setData({
        position: this.dictionary.house_owner,
      })
    } else if (this.data.identity == 1) {
      this.setData({
        position: this.dictionary.project_manager,
      })
    }

  },
  /**
   * Life cycle function - Listens for the page to complete its first rendering
   */
  onReady: function () {

  },

  /**
   * Life cycle function - Listens for page display
   */
  onShow: function () {

  },

  /**
   * Life cycle function - Listens for page hide
   */
  onHide: function () {

  },

  /**
   * Life cycle function - Listens for page unload
   */
  onUnload: function () {

  },

  /**
   * Page-specific event handlers - listen for user pull actions
   */
  onPullDownRefresh: function () {

  },

  /**
   * A handler for a pull-down event on the page
   */
  onReachBottom: function () {

  },

  /**
   * Users click on the upper right to share
   */
  onShareAppMessage: function () {

  },
  getUserProfile(e) {
    /**
     * It is recommended to use wx.getUserProfile to get user information, developers *
     * need user confirmation every time they get user personal information through 
     * this interface, developers keep the user's quickly filled out avatar nickname to 
     * avoid repeated pop-up windows
     */
    wx.getUserProfile({
      desc: '展示用户信息',
      success: (res) => {
        // console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  onSetting: function () {
    wx.navigateTo({
      url: '../setting/setting',
    })
  },
  onMoreInfo: function () {
    wx.navigateTo({
      url: '../moreInfo/moreInfo',
    })
  }
})