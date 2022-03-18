// pages/about/about.js
const languageUtils = require("../../language/languageUtils");

Page({

    /**
     * 页面的初始数据
     */
    data: {    
        /**
        * Store bylingual settings
        */
       dictionary: {},
       language: 0,
       languageList: ["简体中文", "English"],

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        /** 
         *  Initial language
         */
        var lan = wx.getStorageSync("languageVersion");
        this.initLanguage();
        this.setData({
          language: lan
        })

    },
    initLanguage() {
        var self = this;
        //Get the dictionary variable corresponding to the current language version of the applet
        var lang = languageUtils.languageVersion();
        /** 
         * show the page
         */
        self.setData({
          dictionary: lang.lang.index,
        });
      },
    
})