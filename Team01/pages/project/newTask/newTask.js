// pages/project/newTask/newTask.js
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
        "taskState":[{
            "name": "Not started"
        },{
            "name": "Progressing"
        },{
            "name": "Need to rework"
        },{
            "name": "Finished"
        },{
            "name": "Accepted"
        }],
        "priority":[{
            "name": "Highest"
        },{
            "name": "Higher"
        },{
            "name": "Medium"
        },{
            "name": "Lower"
        },{
            "name": "Lowest"
        }],
        selectedPriority: "Medium",
        selectedState: "Not started",
        isLoading: false,
        show: false,
        show2: false,
        startTime: new Date().getTime(),
        endTime: new Date().getTime(),
        ST: "",
        ET: "",
        project: "",
        Owner: [],
        fileList: []
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
    changeST: function(e){
        var CT = new Date(e.detail)
        console.log(e.detail)
        this.setData({
            startTime: e.detail,
            ST: CT.getFullYear() + "-" + (Number(CT.getMonth()) + 1) + "-" + CT.getDate()
        });
    },
    changeET: function(e){
        var CT = new Date(e.detail)
        console.log(e.detail)
        this.setData({
            endTime: e.detail,
            ET: CT.getFullYear() + "-" + (Number(CT.getMonth()) + 1) + "-" + CT.getDate()
        });
    },

    showPopup() {
        this.setData({ show: true });
    },
    onClose() {
        this.setData({ show: false });
    },
    showPopup2() {
        this.setData({ show2: true });
    },
    onClose2() {
        this.setData({ show2: false });
    },

    changeState: function(){
        var arr = this.data.taskState
        var arrName = new Array()
        for(var i in arr){
            arrName.push(arr[i].name)
        }
        wx.showActionSheet({
            itemList: arrName,
            itemColor: "gray",
            success: (res) =>{
                this.setData({
                    selectedState: arrName[res.tapIndex]
                })
            }
        })
    },
    changePriority: function(){
        var arr = this.data.priority
        var arrName = new Array()
        for(var i in arr){
            arrName.push(arr[i].name)
        }
        wx.showActionSheet({
            itemList: arrName,
            itemColor: "gray",
            success: (res) =>{
                this.setData({
                    selectedPriority: arrName[res.tapIndex]
                })
            }
        })
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
        else if(this.data.startTime>this.data.endTime){
            Toast('Wrong time setting')
        }
        // else if(this.data.project==""){
        //     Toast('No superior project');
        // }
        // else if(this.data.Owner==""){
        //     Toast('None owner');
        // }
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
                  url: '../task/task',
                })
            },2500)
            /*wx.request({
                url: '接口路径',
                header: {
                "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                data: { xingming: e.detail.value.xingming, xingbie: e.detail.value.xingbie, aihao: e.detail.value.aihao },
                success: function (res) {
                console.log(res.data);
                if (res.data.status == 0) {
                    wx.showToast({
                    title: '提交失败！！！',
                    icon: 'loading',
                    duration: 1500
                    })
                } else {
                    wx.showToast({
                    title: '提交成功！！！',//这里打印出登录成功
                    icon: 'success',
                    duration: 1000
                    })
                }
                } */
        }
        
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