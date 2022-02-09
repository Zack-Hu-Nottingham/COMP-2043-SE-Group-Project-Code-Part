import { changLanguage } from '../../../language/languageUtils';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
// import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
const languageUtils = require("../../../language/languageUtils");

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 存放双语
    dictionary: {},
    language: 0,
    languageList: ["简体中文", "English"],

  },

  onChangeLan(event) {

    // Dialog.confirm({
    //   context: this,
    //   // title: this.data.dictionary.change_lan_confirm,
    //   // message: '弹窗内容',
    // })
    //   .then(() => {
    //     // on confirm
    //   })
    //   .catch(() => {
    //     // on cancel
    //     return
    //   });
    
    // if (this.data.language == 0) {
    //   wx.setStorage({
    //     key: "languageVersion",
    //     data: 1,
    //   });
    // } else if (this.data.language == 1) {
    //   wx.setStorage({
    //     key: "languageVersion",
    //     data: 0,
    //   });
    // }
    

    this.setData({
      language: event.target.id
    })
    languageUtils.changLanguage()
    this.initLanguage()
    Toast.success(this.data.dictionary.success_change)
  },

  // 初始化语言
  initLanguage() {
    var self = this;
    //获取当前小程序语言版本所对应的字典变量
    var lang = languageUtils.languageVersion();

    // 页面显示
    self.setData({
      dictionary: lang.lang.index,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Dialog.confirm({
      context: this,
      // title: this.data.dictionary.change_lan_confirm,
      // message: '弹窗内容',
    })
      .then(() => {
        // on confirm
      })
      .catch(() => {
        // on cancel
        return
      });

    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
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