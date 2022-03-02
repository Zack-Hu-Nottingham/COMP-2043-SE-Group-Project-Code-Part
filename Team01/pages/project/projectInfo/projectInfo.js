// pages/projectInfo/projectInfo.js
const languageUtils = require("../../../language/languageUtils");

import * as echarts from '../../../ec-canvas/echarts';

const app = getApp();

var id = '';
var projectComment = '0'; //辨别addComment的页面中索引列表是task/project
const db = wx.cloud.database();
const _ = db.command;



Page({

  /**
   * 页面的初始数据
   */
  data: {

    // Project Information's data
    task: [],
    taskState: [],

    // Task state 数据格式
        // 0 - unstarted
        // 1 - progressing
        // 2 - finished
        // 3 - delayed
        // 4 - reworking
        // * 5 - accepted
    unstarted: [],
    progressing: [],
    completed: [],
    delayed: [],
    reworking: [],
    accepted: [],

    navbar: [],
    currentTab: 0,
    dictionary: {},
    language: 0,


    project: {},
    houseOwner: "",
    projectManager: "",
    feedback: [],

    // Task Management's data
    // These data should be filled in when the page is loaded
    startedTask: [],
    notStartedTask: [],
    finishedTask: [],
    // for collapse bar
    activeNames: [],

    //gantt diagram
    // ec: {
    //   onInit: initChart
    // }

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

    // 设置navbar
    this.setData({
      navbar: [this.data.dictionary.project_info, this.data.dictionary.task_management, this.data.dictionary.gantt_diagram]
    })

    // 获取当前project的id
    id = options.id

    // 从数据库中根据id获取数据
    this.getDetail()


  },


  // Global method
  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })

    // 载入task management页面的数据
    if (this.data.currentTab == 1) {

      db.collection("task")
      .where({
        belongTo: id,
        state: 0
      })
      .get().then(res => {
        this.setData({
          unstarted: res.data
        })
      })

      db.collection("task")
      .where({
        belongTo: id,
        state: 1
      })
      .get().then(res => {
        this.setData({
          progressing: res.data
        })
      })

      db.collection("task")
      .where({
        belongTo: id,
        state: 2
      })
      .get().then(res => {
        this.setData({
          completed: res.data
        })
      })

      db.collection("task")
      .where({
        belongTo: id,
        state: 3
      })
      .get().then(res => {
        this.setData({
          delayed: res.data
        })
      })

      db.collection("task")
      .where({
        belongTo: id,
        state: 4
      })
      .get().then(res => {
        this.setData({
          reworking: res.data
        })
      })
    }
  },

  
  initLanguage() {
    var self = this;
    //获取当前小程序语言版本所对应的字典变量
    var lang = languageUtils.languageVersion();

    // 页面显示
    self.setData({
      dictionary: lang.lang.index,
    });
  },

  
  getDetail(){
    db.collection('project')
      .doc(id)
      .get({
        success: res => {
          this.setData({
            project: res.data,
            name: res.data.name,
            fileList: res.data.fileList,
            feedback: res.data.feedback,
          }),

          wx.setNavigationBarTitle({
            title: this.data.name,
          }),

          this.getHouseOwner()
          this.getProjectManager()
        },
        fail: function(err) {
          // console.log(err)
        }
      })
    
  },

  getHouseOwner() {
    return new Promise((resolve, reject) => {
    db.collection('user')
      .where({
        _openid: _.eq(this.data.project.houseOwner)
      })
      .get()
      .then(res => {
        // console.log(res.data[0])
        this.setData({
          houseOwner: res.data[0]
        })
      })
    })
  },

  getProjectManager() {
    return new Promise((resolve, reject) => {
    db.collection('user')
      .where({
        _openid: _.eq(this.data.project._openid)
      })
      .get()
      .then(res => {
        // console.log(res.data[0])
        this.setData({
          projectManager: res.data[0]
        })
      })
    })
  },

  // Project Information's method

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
    this.onDateClose();
    //调用云函数，更新数据库中日期
    wx.cloud.callFunction({
      name: 'updateProjectDate',
      data:{
        id: id,
        startTime: `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
        endTime: `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`
      }
    }).then(res => {
      console.log('project日期更新成功', res),
      this.getDetail()
    }).catch(res => {
      console.log('project日期更新失败', res)
    })
  },

  // Task Management's method

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  clickNewTask(event) {
    wx.navigateTo({
      url: '../newTask/newTask',
    })
  },

   /**
   * Create Comment page's method
   */
  clickAddComment(event) {
        wx.navigateTo({
          url: '../addComment/addComment?id=' + id + '&index=' + projectComment
        })
  },

  onProjectBlur: function(e){
    // console.log(e.detail.value)
    
    wx.cloud.callFunction({
      name: 'updateProjectDescription',
      data:{
        id: id,
        projectDescription: e.detail.value
      }
    }).then(res => {
      console.log('调用云函数修改项目描述成功', res),
      this.getDetail()
    }).catch(res => {
      console.log('调用云函数修改项目描述失败', res)
    })
  },

  onStateBlur: function(e){
    // console.log(e.detail.value)

    wx.cloud.callFunction({
      name: 'updateProjectDescription',
      data:{
        id: id,
        stateDescription: e.detail.value
      }
    }).then(res => {
      console.log('调用云函数修改项目状态描述成功', res),
      this.getDetail()
    }).catch(res => {
      console.log('调用云函数修改项目状态描述失败', res)
    })
  },

  go_update(){
    this.getDetail()
  },
  deleteImg(event) {
    const delIndex = event.detail.index
    const { fileList } = this.data
    fileList.splice(delIndex, 1)
    this.setData({
      fileList
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

  onProjectBlur: function(e){
    // console.log(e.detail.value)

    wx.cloud.callFunction({
      name: 'updateProjectDescription',
      data:{
        id: id,
        projectDescription: e.detail.value
      }
    }).then(res => {
      console.log('调用云函数成功', res),
      this.getDetail()
    }).catch(res => {
      console.log('调用云函数失败', res)
    })
  },

  onStateBlur: function(e){
    // console.log(e.detail.value)

    wx.cloud.callFunction({
      name: 'updateProjectDescription',
      data:{
        id: id,
        stateDescription: e.detail.value
      }
    }).then(res => {
      console.log('调用云函数成功', res),
      this.getDetail()
    }).catch(res => {
      console.log('调用云函数失败', res)
    })
  },

  go_update(){
    this.getDetail()
  }

})

