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

    wx.login()
      .then(res => {
        /**
         * showLoading
         */

        Toast.loading({
          message: 'Loading...',
          forbidClick: true,
          mask: true,
        });

        if (res.code) {

          var url = "https://api.weixin.qq.com/sns/jscode2session?appid=wxd4b06f2e9673ed00&secret=909d4ff30ed2d6e828f73e55a63cd862&js_code=" + res.code + "&grant_type=authorization_code";
          lib.request({
            url: url,
            method: "GET"
          }).task.then(res => {

            /**
             * set global openid
             */
            app.globalData.userInfo.openid = res.data.openid
            this.setData({
              openid: res.data.openid
            })

          }).then(res => {

            /**
             * check whether the user has signed in
             */
            db.collection('user').where({
              _openid: app.globalData.userInfo.openid
            }).get().then(res => {
              // console.log(res.data)

              if (res.data.length != 0) {
                app.globalData.userInfo = res.data[0];
                // console.log(app.globalData.userInfo)

                /**
                 * set global id
                 */
                //app.globalData.userInfo.name = res.data[0].name;
                var identity = res.data[0].identity;

                Toast({
                  type: 'success',
                  message: 'Logged in',
                  onClose: () => {
                    // House Owner
                    if (identity == 0) {
                      wx.redirectTo({
                        url: '../indexs/indexOfHouseOwner/indexOfHouseOwner?openid=' + this.data.openid,
                      })
                      // Project Manager
                    } else if (identity == 1) {
                      wx.redirectTo({
                        url: '../indexs/indexForProjectManager/indexForProjectManager?openid=' + this.data.openid,
                      })

                      // Worker
                    } else if (identity == 2) {
                      wx.redirectTo({
                        url: '../indexs/indexForWorker/indexForWorker',
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
          })
        }
      })
  },

  /**
   * get user info
   */
  getuserinfo(e) {


    // wx.setStorageSync('userInfo', e.detail.userInfo)
    app.globalData.userInfo = e.detail.userInfo

    // wx.getUserInfo的返回兼容
    // wx.setStorageSync('encryptedData', e.detail.encryptedData)
    // wx.setStorageSync('iv', e.detail.iv)

    //拿到用户信息后 获取 用户手机号



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