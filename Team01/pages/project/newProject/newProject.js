// pages/project/newProject/newProject.js
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'
const languageUtils = require("../../../language/languageUtils");

var app = getApp()
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

    // 选择模板
    selectTemplate: function(){
        wx.navigateTo({ url: '../projectTemplate/projectTemplate', })
    },
    
    // 读完文件后
    afterRead: function(event) {
        const { file } = event.detail;
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        wx.uploadFile({
          url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
          filePath: file.url,
          name: 'file',
          formData: { user: 'test' },
          success(res) {
            // 上传完成需要更新 fileList
            const { fileList = [] } = this.data;
            fileList.push({ ...file, url: res.data });
            this.setData({ fileList });
          },
        });
      },

    // 提交新项目
    formSubmit: function (e) {

        var that = this
        // 数据校验
        if (this.data.name == "") {
            Toast('Name is null');
        }
        else if (this.data.startDate == "" || this.data.endDate == "") {
            Toast('No start Date or end Date');
        }
        else if (this.data.description == "") {
            Toast('No detail description');
        }  
        else{
            wx.cloud.database().collection('project')
              .add({
                data:{
                    name: this.data.name,
                    startTime: this.data.startDate,
                    endTime: this.data.endDate,
                    projectDescription: this.data.description
                }
              })
              .then(res => {
                console.log('添加成功', res)
              })
              .catch(res => {
                console.log('添加失败', res) 
              })
            this.setData({
                isLoading: true,
            })
            // wx.showLoading({
            //   title: 'title',
            //   musk: true
            // })
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
                let pages = getCurrentPages();
                let project = pages[pages.length - 2];
                project.go_update();
                wx.navigateBack({
                  delta: 1
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