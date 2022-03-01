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
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.login()
    .then(res => {

      // showLoading
      Toast.loading({
        message: 'Loading...',
        forbidClick: true,
        mask: true,
      });
      
      if (res.code) { 
        // 根据获取的code换取用户openid
        var url = "https://api.weixin.qq.com/sns/jscode2session?appid=wxd4b06f2e9673ed00&secret=909d4ff30ed2d6e828f73e55a63cd862&js_code=" + res.code + "&grant_type=authorization_code";
        lib.request({
          url: url,
          method: "GET"
        }).task.then(res => {

          // 设置全局的openid
          app.globalData.userInfo.openid = res.data.openid
          this.setData({
            openid: res.data.openid
          })
          
        }).then(res => {

          // 访问数据库，判断该用户是否已经注册
          db.collection('user').where({
            _openid: app.globalData.userInfo.openid
          }).get().then(res => {
            // console.log(res.data)
            // 如果是已知账户
            if (res.data.length != 0) {
              // 设置全局身份信息
              app.globalData.userInfo.name = res.data[0].name;
              var identity = res.data[0].identity;

              Toast({
                type: 'success',
                message: 'Logged in',
                onClose: () => {
                  // House Owner
                  if (identity == 0) {
                    wx.navigateTo({
                      url: '../indexs/indexOfHouseOwner/indexOfHouseOwner?openid=' + this.data.openid,
                    })
                   
                    // Project Manager
                  } else if (identity == 1) {
                    wx.navigateTo({
                      url: '../indexs/indexForProjectManager/indexForProjectManager',
                    })
                   
                    // Worker
                  } else if (identity == 2) {
                    wx.navigateTo({
                      url: '../indexs/indexForWorker/indexForWorker',
                    })
                  }
                },
              });
            }

            // 如果是新账号
            else {
              Toast.clear()

              // 获取账号信息，并注册该账号
              Dialog.confirm({
                context: this,
                title: 'Registration',
                message: 'Your nickName & phone would be used for registration',
                confirmButtonOpenType: "getUserInfo", // 按钮的微信开放能力
              })
            }
          })
        })
      }
    })
  },

  // 获得用户信息
  getuserinfo(e) {
    // console.log(e)
    wx.setStorageSync('userInfo', e.detail.userInfo)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo
    })

    // wx.getUserInfo的返回兼容
    wx.setStorageSync('encryptedData', e.detail.encryptedData)
    wx.setStorageSync('iv', e.detail.iv)
    //拿到用户信息后 获取 用户手机号


    // 拿到数据后写入数据库
    db.collection("user").add({
      data: {
        name: this.data.userInfo.nickName,
        identity: 0
        // openid: this.data.openid
      }
    })
    .then(res => {
      // console.log(res)

      Toast.success("Successfully registered")

      // 跳转房主界面
      wx.navigateTo({
        url: '../indexs/indexOfHouseOwner/indexOfHouseOwner',
      })
    })



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

  }
})