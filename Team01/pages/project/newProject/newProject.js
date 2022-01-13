// pages/newProject/newProject.js
var util = require('../../utils/util.js')
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showVisibility:false,
        "visibility":[{
            "name": "Private",
            "value":"privateProject"
        },{
            "name": "Public",
            "value":"publicProject"
        }],
        "templates":[],
        "templateIndex": 0,
        "visibilityIndex": 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var now = new Date()
        var initDate = util.formatDate(now)
        var initEndDate = util.formatDate4YearMotchDay(now.getFullYear() + 1, now.getMonth() + 1, now.getDate())
        this.setData({
            initDate: initDate,
            startDate: initDate,
            endDate: initDate,
            initEndDate: initEndDate
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

    changeVisibility: function(){
        var arr = this.data.visibility
        var arrName = new Array()
        for(var i in arr){
            arrName.push(arr[i].name)
        }
        wx.showActionSheet({
            itemList: arrName,
            itemColor: "gray",
            success: function(res) {
                this.setData({
                    visibilityIndex: res.tapIndex
                })
            }
        })
    },
    onClose() {
        this.setData({ show: false });
    },

    onSelect(event) {
        console.log(event.detail);
    },
    selectTemplate: function(){
        wx.navigateTo({ url: '../projectTemplate/projectTemplate', })
    }
})