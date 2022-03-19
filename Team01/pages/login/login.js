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
  data: {},

  /**
   * Life cycle function - listens for page loads
   */
  onLoad: function (options) {

    // 显示loading
    Toast.loading({
      message: 'Loading...',
      forbidClick: true,
      mask: true,
    });

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
              message: 'Your nickName & phone would be used for registration',
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
          identity: 0,
          task: [],
          project: []
        }
      })
      .then(res => {

        Toast.success("Successfully registered")


        /**
         * jump to house owner page
         */
        wx.redirectTo({
          url: '../indexs/indexOfHouseOwner/indexOfHouseOwner',
        })
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