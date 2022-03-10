// pages/more/moreInfo/moreInfo.js

import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

Page({

  /**
   * Initial data of page
   */
  data: {
    changetip: '请输入新用户名',
    name: "",
    title: 'More Information',
    position: 'project manager',
    phonenumber: '86',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),
    show: false,
    value: '',

  },
  showPopup() {
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },


  /**
   * Life cycle function - listens for page loads
   */
  onLoad: function (options) {
    wx.getUserProfile({
      desc: '展示更多信息',
      success: (res) => {
        // console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          name: res.userInfo.userNickName,

        })
      }
    })
    wx.setNavigationBarTitle({
      title: this.data.title
    })

    this.setData({
      name: app.globalData.userInfo.nickName,
    })

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

  forNotice: function (e) {

    Toast({
      type: 'success',
      message: '提交成功',
      onClose: () => {
        this.setData({
          show: false,
          changetip: "",
        });
        //console.log('执行OnClose函数');
      },
    });
  }
})