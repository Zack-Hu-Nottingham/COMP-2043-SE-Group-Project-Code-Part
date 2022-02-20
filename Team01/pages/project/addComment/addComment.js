// pages/project/addComment/addComment.js
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'
const languageUtils = require("../../../language/languageUtils");
const app = getApp();
const db = wx.cloud.database();

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

        //feedback type:
        // 0 - Project Delay
        // 1 - Task Delay
        // 2 - Task need rework
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
        details: '',
        feedback: [],
        id: '',

        isLoading: false,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) { 
        this.setData({
            id: options.id,
        })
        // console.log(this.data.createTime);
        db.collection('project').doc(options.id).get().then(res => {
            // res.data 包含该记录的数据
            this.setData({
                feedback: res.data.feedback,
            })
          })
        
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
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success:res => {
            var fileList = this.data.fileList;
            fileList.push({url: res.tempFilePaths[0]});
            this.setData({ fileList: fileList });
            console.log("成功选择图片",fileList);
          }
        })
      },

    uploadImage(fileURL) {
        wx.cloud.uploadFile({
          cloudPath: 'feedback/'+ this.data.id + '/' + new Date().getTime() +'.png', // 上传至云端的路径
          filePath: fileURL, // 小程序临时文件路径
          success: res => {
            console.log("图片上传成功",res)
          },
          fail: console.error
        })
    },


    formSubmit: function (e) {
        if (this.data.selectedIndex == ''){
            Toast('Feedback type is null')
        }
        else if (this.data.details == ''){
            Toast('Description is null')
        }
        else {
            this.data.feedback.push({
                type: this.data.selectedIndex, 
                details: this.data.details, 
                fileList: this.data.fileList,
                owner: app.globalData.userInfo.openid,
                id: this.data.id,
                createTime: this.formatDate(new Date()),
            })
            console.log(this.data.feedback)
            db.collection('project').doc(this.data.id).update({
                // data 传入需要局部更新的数据
                data: {
                  feedback: this.data.feedback
                },
                success: function(res) {
                  console.log(res.data.feedback)
                }
              })
    
            for(var i = 0; i< this.data.fileList.length; i++ ){
                this.uploadImage(this.data.fileList[i].url);
            }
            this.action();
        }

    },
    action: function(e){
        this.setData({
            isLoading: true,
        })
        setTimeout(res =>{
            Toast({
                forbidClick: 'true',
                type: 'success',
                message: 'Success!',
              });
        },1500)
        setTimeout(res =>{
            this.setData({
                isLoading: false
            })
        },2400)
        setTimeout(res =>{
            wx.navigateBack({
              delta: 1,
            })
        },2500)
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

    formatDate(date) {
        date = new Date(date);
        // return `${date.getMonth() + 1}/${date.getDate()}`;
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      },
})