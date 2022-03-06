// pages/project/taskInfo/taskInfo.js

const languageUtils = require("../../../language/languageUtils");
const db = wx.cloud.database();
const _ = db.command;
var id = '';
var taskComment = '1'; //辨别addComment的页面中索引列表是task/project

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 存放双语
    dictionary: {},
    language: 0,
    languageList: ["简体中文", "English"],
    
    
    taskPage: {},
    belongTo: "",

    dateShow: false,
    priorityShow: false,
    feedback:[],
    fileList:[],

    priority: [
      {
        name: 'Highest',
      },
      {
        name: 'High'
      },
      {
        name: 'Normal'
      },
      {
        name: 'Low'
      },
      {
        name: 'Lowest'
      },
    ],
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

    // 获得当前task的id
    id = options.id

    // 根据id获得对应数据
    this.getDetail()

    // this.updateComment();

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
    wx.stopPullDownRefresh()
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

  onDateDisplay() {
    this.setData({ dateShow: true });
  },

  onClose() {
    this.setData({ dateShow: false });
  },
  
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  
  onConfirm(event) {
    const [start, end] = event.detail;
    this.onClose();
    // this.setData({
    //   startTime: this.formatDate(start),
    //   endTime: this.formatDate(end),
    //   dateShow: false,
    //   date: `${this.formatDate(start)} - ${this.formatDate(end)}`,
    // });

    //调用云函数
    wx.cloud.callFunction({
      name: 'updateDate',
      data:{
        id: id,
        startTime: `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
        endTime: `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`
      }
    }).then(res => {
      console.log('修改task日期成功', res),
      this.getDetail()
    }).catch(res => {
      console.log('修改task日期失败', res)
    })
  },
  

  getDetail(){
    //根据task_id查询task的name和task信息
    //return new Promise(function (resolve) {
    db.collection('task')
      .doc(id)
      .get({
        success: res => {
          // console.log(res.data)
          this.setData({
            taskPage: res.data,
            belongTo: res.data.belongTo,
          });
          wx.setNavigationBarTitle({
            title: res.data.name,
          });
          this.updateComment(res.data.feedback)
        },
        fail: err => {
          console.log('拉取任务信息请求失败', err)
        }
      })
    //})
  },

  onPriorityClose() {
    this.setData({priorityShow: false})
  },

     /**
   * Create Comment page's method
   */
  clickAddComment(event) {
    wx.navigateTo({
      url: '../addComment/addComment?id='+ id + '&index=' + taskComment,
    })
  },

  onTaskDescriptionBlur: function(e){
    // console.log(e.detail.value)

    wx.cloud.callFunction({
      name: 'updateTaskDescription',
      data:{
        id: id,
        descriptions: e.detail.value
      }
    }).then(res => {
      console.log('调用云函数修改任务描述成功', res),
      this.getDetail()
    }).catch(res => {
      console.log('调用云函数修改任务描述失败', res)
    })
  },

  onPrioritySelect(e) {
    // console.log(e.detail.name)
    this.setData({
      currentPriority: e.detail.name 
    }),

    //调用云函数
    wx.cloud.callFunction({
      name: 'updateData',
      data:{
        id: id,
        currentPriority: e.detail.name
      }
    }).then(res => {
      console.log('修改task优先级成功', res),
      this.getDetail()
    }).catch(res => {
      console.log('修改task优先级失败', res)
    })

  },

  clickPriority() {
    // console.log("click")
    this.setData({
      priorityShow: true
    })
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
    db.collection('task').where({
      _id: id
    }).update({
      data: {
        cloudList: cloudList.splice(delIndex, 1)
      }
    })
  },

  updateComment(list){
    var newList = [];
    // console.log(list)
    for(var i=0; i< list.length; i++){
      db.collection('feedback')
      .where({
        _id: list[i]._id
      })
      .get({
        success: res =>{
          // console.log(res.data)
          newList.push(res.data[0])
          // console.log(newList)
          this.setData({
            feedback: newList
          })
        }
      })
    }
    // console.log(this.data.feedback)

  },
  getList(list){
    var newList = [];
    // console.log(list)
    for(var i=0; i< list.length; i++){
      db.collection('feedback')
      .where({
        _id: list[i]._id
      })
      .get({
        success: res =>{
          newList.push(res.data[0])
          // console.log(newList)
        }
      })
    }
    this.setData({
      feedback: newList
    })
    // console.log(this.data.feedback)
  },
  upload(){
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:res => {
        var fileList = this.data.fileList;
        fileList.push({url: res.tempFilePaths[0]});
        this.setData({ fileList: fileList });
        this.uploadImage(res.tempFilePaths[0]);
        // console.log("成功选择图片",fileList);
      }
    })
  },

  uploadImage(fileURL) {
      wx.cloud.uploadFile({
        cloudPath: 'task/'+ id + '/' + new Date().getTime() + Math.floor(9*Math.random()) + '.png', // 上传至云端的路径
        filePath: fileURL, // 小程序临时文件路径
        success: res => {
          // console.log("图片上传成功",res)
        },
        fail: console.error
      })
  },
})