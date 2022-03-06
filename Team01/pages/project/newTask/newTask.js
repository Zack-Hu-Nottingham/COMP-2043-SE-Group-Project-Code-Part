// pages/project/newTask/newTask.js
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'
const languageUtils = require("../../../language/languageUtils");

var app = getApp()
var id = '';
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

        // Task state 数据格式
        // 0 - unstarted
        // 1 - progressing
        // 2 - finished
        // 3 - delayed
        // 4 - reworking
        // * 5 - accepted

        "taskState":[{
            "name": "Unstarted",
            "value": '0',
        },{
            "name": "Progressing",
            "value": '1',
        },{
            "name": "Finished",
            "value": '2',
        },{
            "name": "Accepted",
            "value": '5'
        },{
            "name": "Reworking",
            "value": '4',
        }],

        selectedPriority: '',
        selectedState: '',
        isLoading: false,
        showDate: false,

        startTime: '',
        endTime: '',
        
        belongTo: "",
        Owner: [],
        fileList: [],
        cloudPath: [],

        showPriority: false,
        prioritys: [{
            "name": "high",
            "value": '0'
        },{
            "name": "normal",
            "value": '1'
        },{
            "name": "low",
            "value": '2'
        }],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {   
        
        this.setData({
            belongTo: options.id
        })
        
        // 初始化语言
        var lan = wx.getStorageSync("languageVersion");
        this.initLanguage();
        this.setData({
            language: lan
        })

        // 设置
        wx.setNavigationBarTitle({
          title: this.data.dictionary.create_new_task,
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

    // Type the task name
    typeName: function(e){
        this.setData({
            name: e.detail
        })
    },

    // Type task details
    typeDetails: function(e){
        this.setData({
            details: e.detail
        })
    },

    // Change start/end time
    showDatePopup() {
        this.setData({ showDate: true });
    },

    onDateClose() {
        this.setData({ showDate: false });
    },
    
    formatDate(date) {
        date = new Date(date);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    
    onDateConfirm(event) {
        const [start, end] = event.detail;
        this.setData({
            startTime: this.formatDate(start),
            endTime: this.formatDate(end),
            show: false,
            date: `${this.formatDate(start)} - ${this.formatDate(end)}`,
        });
        this.onDateClose()
    },

    changePriority: function(){
        this.setData({
            showPriority: true,
        })
    },

    onClosePriority() {
        this.setData({ showPriority: false });
    },

    onSelectPriority(event) {
        // console.log(event.detail.value);
        this.setData({
            selectedPriority: this.data.prioritys[event.detail.value].name
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
          cloudPath: 'task/'+ id + '/' + new Date().getTime() + Math.floor(9*Math.random()) +'.png', // 上传至云端的路径
          filePath: fileURL, // 小程序临时文件路径
          success: res => {
            var cloudList = this.data.cloudPath;
            cloudList.push(res.fileID);
            this.setData({
                cloudPath: cloudList
            })
            this.updateCloudList();
            console.log("图片上传成功",res)
          },
          fail: console.error
        })
    },
    updateCloudList(){
        // console.log(this.data.cloudPath)
        db.collection('task')
        .where({
            _id: _.eq(id)
        })
        .update({
            // data 传入需要局部更新的数据
            data: {
              // 表示将 done 字段置为 true
              cloudList: this.data.cloudPath
            },
            success: function(res) {
              console.log(res)
            }
          })
      },

    formSubmit: function (e) {
        var that = this
        if(this.data.name == ""){
            Toast.fail('Name is null');
        }
        if(this.data.startTime > this.data.endTime){
            Toast('Wrong time setting')
        }
        else if(this.data.startTime > this.data.endTime){
            Toast('Wrong time setting')
        }
        else if (this.data.startTime == '' || this.data.endTime == '') {

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
            wx.cloud.database().collection('task')
              .add({
                data:{
                    belongTo: this.data.belongTo,
                    name: this.data.name,
                    startTime: this.data.startTime,
                    endTime: this.data.endTime,
                    description: this.data.description,
                    currentPriority: this.data.selectedPriority,
                    cloudPath: [],
                }
              })
              .then(res => {
                id = res._id;
                for(var i = 0; i< this.data.fileList.length; i++ ){
                    this.uploadImage(this.data.fileList[i].url);
                }

                console.log('添加成功', res)
              })
              .catch(res => {
                console.log('添加失败', res) 
              })

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
                /*wx.navigateTo({
                  url: '../task/task',
                })*/
                let pages = getCurrentPages();
                let project = pages[pages.length - 2];
                project.go_update();
                wx.navigateBack({
                  delta: 1
                })
            },2500)
            
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

    deleteImg(event) {
        const delIndex = event.detail.index
        const { fileList } = this.data
        fileList.splice(delIndex, 1)
        this.setData({
          fileList
        })
      }

})