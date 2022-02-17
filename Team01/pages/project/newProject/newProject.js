// pages/project/newProject/newProject.js
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'
const languageUtils = require("../../../language/languageUtils");

var app = getApp()

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

        // 项目描述
        name: "",
        description: "",

        startDate: "",
        endDate: "",

        // 模板选择
        selectedTemplate: '',
        selectedTemplateIndex: '1',
        

        isLoading: false,
        fileList: [],
        owner: [],
        participant: [],
        
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
        // 初始化语言
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

    },

    // 处理用户输入名字
    typeName: function(e){
        this.setData({
            name: e.detail
        })
    },

    // 处理用户输入描述
    typeDescription: function(e){
        this.setData({
            description: e.detail
        })
    },
    
    changeOwner(){
        wx.navigateTo({
          url: '../../contact/contactList/contactList',
        })
    },

    // 选择模板
    selectTemplate: function(){
        wx.navigateTo({ url: '../projectTemplate/projectTemplate', })
    },
    upload(){
        //把this赋值给that，就相当于that的作用域是全局的。
        let that = this;
        wx.chooseImage({
          // count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success(res) {
            console.log("成功选择图片",res);
            that.uploadImage(res.tempFilePaths[0]);
          }
        })
      },

    uploadImage(fileURL) {
        wx.cloud.uploadFile({
          cloudPath: 'feedBack/'+ new Date().getTime() +'.png', // 上传至云端的路径
          filePath: fileURL, // 小程序临时文件路径
          success: res => {
            var fileList = this.data.fileList;
            fileList.push({url: res.fileID,name: fileURL,deletable: true});
            this.setData({ fileList: fileList });
            console.log("图片上传成功",res)
          },
          fail: console.error
        })
    },

    // 提交新项目
    formSubmit: function (e) {

        db.collection('project').add({
            // data 字段表示需新增的 JSON 数据
            data: {
                // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
                name: this.data.name,
                startTime: this.data.startDate,
                endTime: this.data.endDate,
                owner: this.data.owner,
                participant: this.data.participant,
                template: this.data.selectedTemplate,
                projectDescription: this.data.description,
            },
            success: function(res) {
              // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
              console.log(res)
            }
          })

        // var that = this
        // 数据校验
        if (this.data.name == "") {
            Toast('Name is null');
        }
        else if (this.data.description == "") {
            Toast('No detail description');
        }
        else if ( startDate == '' || endDate == '' ) {
            Toast("")
        }
        else{
            this.setData({
                isLoading: true
            })
            setTimeout(function(){
                Toast({
                    forbidClick: 'true',
                    type: 'success',
                    message: 'Success!',
                  });
            },1500)
            setTimeout(function(){
                that.setData({
                    isLoading: false
                })
            },2400)
            setTimeout(function(){
                wx.navigateTo({
                  url: '../../index/index',
                })
            },2500)
        }
        
    },

    // calendar 的配套method
    onDateDisplay() {
        this.setData({ show: true });
    },
    
    onDateClose() {
        this.setData({ show: false });
    },

    formatDate(date) {
        date = new Date(date);
        // return `${date.getMonth() + 1}/${date.getDate()}`;
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      },
    
      onDateConfirm(event) {
        const [start, end] = event.detail;
        this.setData({
            startDate: this.formatDate(start),
            endDate: this.formatDate(end)
        })
        this.onDateClose();

    
        // //调用云函数，更新数据库中日期
        // wx.cloud.callFunction({
        //   name: 'updateProjectDate',
        //   data:{
        //     id: id,
        //     startTime: `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
        //     endTime: `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`
        //   }
        // }).then(res => {
        //   console.log('project日期更新成功', res),
        //   this.getDetail()
        // }).catch(res => {
        //   console.log('project日期更新失败', res)
        // })
      },

})