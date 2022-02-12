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

        name: "",
        details: "",
        "visibility":[{
            "name": "Private",
            "value":"privateProject"
        },{
            "name": "Public",
            "value":"publicProject"
        }],
        selectedTemplate: '',
        selectedTemplateIndex: '1',
        selectedVisibility: "Private",
        isLoading: false,
        fileList: []
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
    typeName: function(e){
        this.setData({
            name: e.detail
        })
    },
    typeDetails: function(e){
        this.setData({
            details: e.detail
        })
    },
    changeVisibility: function(){
        var arr = this.data.visibility
        var arrName = new Array()
        for(var i in arr){
            arrName.push(arr[i].name)
        }
        wx.showActionSheet({
            itemList: arrName,
            itemColor: "gray",
            success: (res) =>{
                this.setData({
                    selectedVisibility: arrName[res.tapIndex]
                })
            }
        })
    },
    selectTemplate: function(){
        wx.navigateTo({ url: '../projectTemplate/projectTemplate', })
    },
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
    formSubmit: function (e) {

        var that = this
        if(this.data.name==""){
            Toast('Name is null');
        }
        else if(this.data.details==""){
            Toast('No detail description');
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
})