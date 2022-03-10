import { changLanguage } from '../../../language/languageUtils';

import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

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

    Dialog.confirm({
      context: this,
      title: this.data.dictionary.change_lan_confirm,
      confirmButtonText: this.data.dictionary.confirm,
      cancelButtonText: this.data.dictionary.cancel,
    })
      .then(() => {
        // on confirm
        
        this.setData({
          language: event.target.id
        })
        
        languageUtils.changLanguage()
        
        this.initLanguage()
        
        Toast.success(this.data.dictionary.success_change)

      })
      .catch(() => {
        // on cancel
        return
      });
    
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
    
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })

  },

})