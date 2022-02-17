// pages/project/addComment/addComment.js
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
        selectedFeedback: '',
        selectedIndex: '',

        showFeedback: false,
        feedbackValue: [{
            "name": "Project Delay",
            "value": '0'
        },{
            "name": "Task Delay",
            "value": '1'
        },{
            "name": "Task need rework",
            "value": '2'
        }],
        fileList: [],
        imageURL: '',
        details: '',

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面
        // console.log(prevPage.data.id);
        
        // 初始化语言
        var lan = wx.getStorageSync("languageVersion");
        this.initLanguage();
        this.setData({
            language: lan
        })

        // 设置
        wx.setNavigationBarTitle({
            title: this.data.dictionary.comment_title,
        })
    },
    
    typeDetails: function(e){
        this.setData({
            details: e.detail
        })
    },

    changeFeedback: function(){
        this.setData({
            showFeedback: true,
        })
    },

    onCloseFeedback() {
        this.setData({ showFeedback: false });
    },

    onSelectFeedback(event) {
        // console.log(event.detail.value);
        this.setData({
            selectedFeedback: this.data.feedbackValue[event.detail.value].name,
            selectedIndex: this.data.feedbackValue[event.detail.value].value,
        })
    },

    upload(){
        var that = this;
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success(res) {
            var fileList = that.data.fileList;
            fileList.push({url: res.tempFilePaths[0]});
            that.setData({ fileList: fileList });
            console.log("成功选择图片",fileList);
            // that.uploadImage(res.tempFilePaths[0]);
          }
        })
      },

    uploadImage(fileURL) {
        wx.cloud.uploadFile({
          cloudPath: 'feedBack/'+ new Date().getTime() +'.png', // 上传至云端的路径
          filePath: fileURL, // 小程序临时文件路径
          success: res => {
            console.log("图片上传成功",res)
          },
          fail: console.error
        })
    },

    formSubmit: function (e) {
        var feedBack = {type: this.data.selectedIndex, details: this.data.details, files: this.data.fileList};
        for(var i = 0; i< this.data.fileList.length; i++ ){
            this.uploadImage(this.data.fileList[i].url);
        }
        // 上传数据：
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
})