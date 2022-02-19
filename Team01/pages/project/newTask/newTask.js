// pages/project/newTask/newTask.js
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'
<<<<<<< HEAD
=======
const languageUtils = require("../../../language/languageUtils");

>>>>>>> main
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
<<<<<<< HEAD
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
=======
        
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
>>>>>>> main
    },

    /**
     * 生命周期函数--监听页面加载
     */
<<<<<<< HEAD
    onLoad: function (options) {
=======
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
>>>>>>> main
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
<<<<<<< HEAD
=======

    // Type the task name
>>>>>>> main
    typeName: function(e){
        this.setData({
            name: e.detail
        })
    },
<<<<<<< HEAD
=======

    // Type task details
>>>>>>> main
    typeDetails: function(e){
        this.setData({
            details: e.detail
        })
    },
<<<<<<< HEAD
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
=======

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
>>>>>>> main
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
<<<<<<< HEAD
=======
            wx.cloud.database().collection('task')
              .add({
                data:{
                    belongTo: this.data.belongTo,
                    name: this.data.name,
                    startTime: this.data.startTime,
                    endTime: this.data.endTime,
                    description: this.data.description,
                    currentPriority: this.data.selectedPriority,
                }
              })
              .then(res => {
                console.log('添加成功', res)
              })
              .catch(res => {
                console.log('添加失败', res) 
              })

>>>>>>> main
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
<<<<<<< HEAD
                wx.navigateTo({
                  url: '../task/task',
=======
                /*wx.navigateTo({
                  url: '../task/task',
                })*/
                let pages = getCurrentPages();
                let project = pages[pages.length - 2];
                project.go_update();
                wx.navigateBack({
                  delta: 1
>>>>>>> main
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
        
<<<<<<< HEAD
    }
=======
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

>>>>>>> main
})