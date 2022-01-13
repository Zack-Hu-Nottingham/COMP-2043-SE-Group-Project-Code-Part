var util = require('../../utils/util.js')
var app = getApp()
// pages/newTask/newTask.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        "startDate":"",
        "endDate":"",
        "taskType":[{
            "name": "Project Task",
            "value":"proTask"
        },{
            "name": "Sub Task",
            "value":"subTask"
        },{
            "name": "Mini Task",
            "value":"miniTask"
        }],
        "taskStage":[{
            "name": "Not started",
            "value":"NotStarted"
        },{
            "name": "Progressing",
            "value":"Progressing"
        },{
            "name": "Need to rework",
            "value":"NeedToRework"
        },{
            "name": "Finished",
            "value":"Finished"
        },{
            "name": "Accept",
            "value":"Accept"
        }],
        "priority":[{
            "name": "Highest!!!!",
            "value": 1,
        },{
            "name": "Higher!!!",
            "value": 2,
        },{
            "name": "Normal!!",
            "value": 3,
        },{
            "name": "Lower!",
            "value": 4,
        },{
            "name": "Lowest",
            "value": 5,
        }],
        "taskTypeIndex": 0,
        "taskStageIndex": 0,
        "priorityIndex": 0,
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

    changeTaskType: function(){
        var arr = this.data.taskType
        var arrName = new Array()
        for(var i in arr){
            arrName.push(arr[i].name)
        }
        wx.showActionSheet({
            itemList: arrName,
            itemColor: "gray",
            success: function(res) {
                this.setData({
                    taskTypeIndex: res.tapIndex
                })
            }
        })
    },
    changeStartDate: function(e) {
        this.setData({
            startDate: e.detail.value
        })
    },
    changeEndDate: function(e) {
        this.setData({
            endDate: e.detail.value
        })
    },
    changeTaskStage: function(){
        var that = this
        var arr = that.data.taskStage
        var arrName = new Array()
        for(var i in arr){
            arrName.push(arr[i].name)
        }
        wx.showActionSheet({
            itemList: arrName,
            itemColor: "gray",
            success: function(res) {
                that.setData({
                    taskStageIndex: res.tapIndex
                })
            }
        })
    },
    changePriority: function(){
        var that = this
        var arr = that.data.priority
        var arrName = new Array()
        for(var i in arr){
            arrName.push(arr[i].name)
        }
        wx.showActionSheet({
            itemList: arrName,
            itemColor: "gray",
            success: function(res) {
                that.setData({
                    priorityIndex: res.tapIndex
                })
            }
        })
    },
})