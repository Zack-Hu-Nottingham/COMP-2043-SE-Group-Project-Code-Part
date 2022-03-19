import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

const lib = require('../../utils/util')

const languageUtils = require("../../language/languageUtils");

const app = getApp();

const db = wx.cloud.database();

const _ = db.command;

// pages/login/login.js
Page({

  /**
   * Initial data of page
   */
  data: {
    identity: 0
  },

  /**
   * Life cycle function - listens for page loads
   */
  onLoad: function (options) {
    console.log(options)
    // 显示loading
    Toast.loading({
      message: 'Loading...',
      forbidClick: true,
      mask: true,
    });

    // 如果这个用户来自PM邀请
    if (Object.keys(options).length != 0) {
      this.setData({
        identity: options.identity
      })
    }

    // 调用云函数获取用户信息
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {

        // set global openid
        app.globalData.userInfo.openid = res.result.OPENID
        this.setData({
          openid: res.result.OPENID
        })

        /**
         * check whether the user has signed in
         */
        db.collection('user').where({
          _openid: app.globalData.userInfo.openid
        }).get().then(res => {

          if (res.data.length != 0) {
            app.globalData.userInfo = res.data[0];
            var identity = res.data[0].identity;

            Toast({
              type: 'success',
              message: 'Logged in',
              onClose: () => {
                // House Owner
                if (identity == 0) {
                  wx.redirectTo({
                    url: '../../subpages/pack_HO/pages/index/index?openid=' + this.data.openid,
                  })
                  // Project Manager
                } else if (identity == 1) {
                  wx.redirectTo({
                    url: '../../subpages/pack_PM/pages/index/index?openid=' + this.data.openid,
                  })

                  // Worker
                } else if (identity == 2) {
                  wx.redirectTo({
                    url: '../../subpages/pack_W/pages/index/index',
                  })
                }
              },
            });
          }

          /**
           * if is new account
           */
          else {
            Toast.clear()

            /**
             * get the info of new account
             */
            Dialog.confirm({
              context: this,
              title: 'Registration',
              message: "It's good to meet you here, click to register~",
              confirmButtonOpenType: "getUserInfo",
            })
          }
        })
      }
    })

  },

  /**
   * get user info
   */
  getuserinfo(e) {

    app.globalData.userInfo = e.detail.userInfo

    /**
     * write into db
     */
    db.collection("user").add({
        data: {
          nickName: e.detail.userInfo.nickName,
          avatarUrl: e.detail.userInfo.avatarUrl,
          identity: this.data.identity,
          task: [],
          project: []
        }
      })
      .then(res => {
        Toast.success("Success")

        if (this.data.identity == 0) {
          wx.redirectTo({
            url: '../../subpages/pack_HO/pages/index/index',
          })
        } else if (this.data.identity == 1) {
          wx.redirectTo({
            url: '../../subpages/pack_PM/pages/index/index',
          })
        } else {
          wx.redirectTo({
            url: '../../subpages/pack_W/pages/index/index',
          })
        }
        
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

  }
})