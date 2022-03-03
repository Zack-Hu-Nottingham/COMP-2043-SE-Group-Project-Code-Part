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

        showFeedback: false,
        feedbackType: [],
        fileList: [],
        details: '',
        feedback: [],
        id: '',
        commentPage: '',

        isLoading: false,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) { 
        this.setData({
            id: options.id,
            commentPage: options.index,
        })
        if(this.data.commentPage=='0'){
            db.collection('project').doc(options.id).get().then(res => {
                // res.data 包含该记录的数据
                this.setData({
                    feedback: res.data.feedback,
                })
              })
        }
        else{
            db.collection('task').doc(options.id).get().then(res => {
                // res.data 包含该记录的数据
                this.setData({
                    feedback: res.data.feedback,
                })
              })
        }
        // console.log(options)
        // console.log(this.data.feedback);
 
        
        // 初始化语言
        var lan = wx.getStorageSync("languageVersion");
        this.initLanguage();
        this.setData({
            language: lan
        })
        this.setData({
            //feedback type:
            // 0 - Project Delay
            // 1 - Task Delay
            // 2 - Task need rework
            feedbackType: [{
                "name": this.data.dictionary.feedback_type0,
                "value": '0'
            },{
                "name": this.data.dictionary.feedback_type1,
                "value": '1'
            },{
                "name": this.data.dictionary.feedback_type2,
                "value": '2'
            }],
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
            selectedFeedback: this.data.feedbackType[event.detail.value].name,
            selectedIndex: this.data.feedbackType[event.detail.value].value,
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
            // console.log("成功选择图片",fileList);
          }
        })
      },

    uploadImage(fileURL) {
        wx.cloud.uploadFile({
          cloudPath: 'feedback/'+ this.data.id + '/' + new Date().getTime() +'.png', // 上传至云端的路径
          filePath: fileURL, // 小程序临时文件路径
          success: res => {
            // console.log("图片上传成功",res)
          },
          fail: console.error
        })
    },


    formSubmit: function (e) {
        if (this.data.selectedIndex == ''){
            Toast(this.data.dictionary.submitErrMsg1)
        }
        else if (this.data.details == ''){
            Toast(this.data.dictionary.submitErrMsg2)
        }
        else {
            this.data.feedback.push({
                type: this.data.feedbackType[this.data.selectedIndex], //反馈类型
                description: this.data.details, //反馈描述
                fileList: this.data.fileList, //文件列表
                owner: app.globalData.userInfo.nickName, //创建人
                belongTo: this.data.id, //所属项目/任务
                createTime: this.formatDate(new Date()),
            })
            for(var i = 0; i< this.data.fileList.length; i++ ){
                this.uploadImage(this.data.fileList[i].url);
            }
            // console.log(this.data.feedback);
            this.updateDB();
            this.action();
        }

    },
    updateDB(){
        if(this.data.commentPage=='0'){
            db.collection('project').doc(this.data.id).update({
                // data 传入需要局部更新的数据
                data: {
                  feedback: this.data.feedback
                },
                success: function(res) {
                    //const page = ('pages/index/index');
                    //page.refresh();
                  // console.log(res.data.feedback)
                }
              })
        }
        else{
            db.collection('task').doc(this.data.id).update({
                // data 传入需要局部更新的数据
                data: {
                  feedback: this.data.feedback
                },
                success: function(res) {
                  // console.log(res.data.feedback)
                }
              })
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
            var pages = getCurrentPages();
            var currPage = pages[pages.length - 1];   //当前页面
            var prevPage = pages[pages.length - 2];  //上一个页面
            prevPage.updateComment();

            wx.navigateBack({
                delta: 1
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

    deleteImg(event) {
        const delIndex = event.detail.index
        const { fileList } = this.data
        fileList.splice(delIndex, 1)
        this.setData({
          fileList
        })
      }
})