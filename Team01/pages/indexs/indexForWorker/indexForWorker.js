import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

const languageUtils = require("../../../language/languageUtils");
const db = wx.cloud.database();
const _ = db.command;
// const lib = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    /**
     * Global data
     */
    userInfo: {},

    active: 0,
    pageName: ['Dashboard', 'More'],

    // 存放双语
    dictionary: {},
    language: 0,
    languageList: ["简体中文", "English"],

    /**
     * Dashboard page's data
     */
    project: [],
    projectInfo: [],
    projectTask: [],
    taskList: [],
    task:[],

    /**
     * More page's data
     */
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.data.userInfo = app.globalData.userInfo

    this.getData()

    // 初始化语言
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })

    // 载入时设置初始页面的navBar title
    wx.setNavigationBarTitle({
      title: this.data.pageName[this.data.active],
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
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })
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



  /**
   * Global method
   */


  // 初始化数据
  async getData(){

    // 获取任务列表
    await this.getTaskList()

    // 根据任务列表获得每个任务的信息
    for (var item in this.data.taskList) {
      await this.getTaskInfo(this.data.taskList[item])
    }

    // 根据所有任务所属的项目进行划分
    var temp = []
    for(var item in this.data.task) {
      var idx = temp.indexOf(this.data.task[item].belongTo)
      if ( idx < 0) {
        temp = temp.concat([this.data.task[item].belongTo])
      }
    }

    var projectTask = []
    for (var j in temp) {
      projectTask.push([])
      for (var i in this.data.task) {
          if (this.data.task[i].belongTo == temp[j]) {
            projectTask[j] = projectTask[j].concat({
              name: this.data.task[i].name,
              _id: this.data.task[i]._id,
              state: this.data.task[i].state,
              startTime: this.data.task[i].startTime,
              endTime: this.data.task[i].endTime,
            })
          }
      }
    }
    
    this.setData({
      project: temp,
      projectTask: projectTask
    })

    // 获取项目简要信息
    for (var idx in this.data.project) {
      this.getProjectInfo(this.data.project[idx])
    }
  },

  // 获取项目简要信息
  getProjectInfo(projectId) {
    return new Promise((resolve, reject) => {
      db.collection('project')
      .doc(projectId)
      .field({
        name: true,
      })
      .get()
      .then(res => {
          this.setData({
            projectInfo: this.data.projectInfo.concat(res.data)
          })
          resolve("成功获取项目简要信息")
      })
      .catch(err => {
        reject("请求项目简要信息失败")
      })

    })
  },

  // 获取任务信息
  getTaskInfo(taskId) {
    return new Promise((resolve, reject) => {
      db.collection('task')
      .where({
        _id: _.eq(taskId)
      })
      .field({
        _id: true,
        name: true,
        startTime: true,
        endTime: true,
        state: true,
        belongTo: true
      })
      .get()
      .then(res => {
        this.setData({
          task: this.data.task.concat(res.data[0]),
        })
        resolve("成功获取任务信息")
      })
      .catch(err => {
        reject("请求任务信息失败")
      })
    })
  },
  
  // 获取任务列表
  getTaskList() {
    return new Promise((resolve, reject) => {
      db.collection('user')
      .where({
        _openid: _.eq(this.data.userInfo.openid)
      })
      .get()
      .then(res => {
        this.setData({
          taskList: res.data[0].task
        })
        console
        resolve("成功获取项目列表")
      })
      .catch(err => {
        reject("请求项目列表失败")
      })}
    )
  },

  clickProject(projectId) {
    wx.navigateTo({
      url: '../project/projectInfoForWorker/projectInfoForWorker?id='+projectId,
    })
  },

  // 更改tab选项时对应的逻辑
  onChangeTab(event) {
    this.setData({ active: event.detail });
    wx.setNavigationBarTitle({
      title: this.data.pageName[this.data.active],
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

      
  /**
   * Dashboard page's method
   */
  clickTask(event) {
    wx.navigateTo({
      url: '../project/taskInfoForWorker/taskInfoForWorker?id=' +  event.currentTarget.dataset.id,
    })
  },


  
  /**
   * More page's method
   */
  
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  
  onSetting: function(){
    wx.navigateTo({
      url: '../more/setting/setting',
    })
  },

  onMoreInfo: function(){
    wx.navigateTo({
      url: '../more/moreInfo/moreInfo',
    })
  },


  // 点击language展示选项
  onChangeLan(event) {
    wx.navigateTo({
      url: '../more/languageSetting/languageSetting',
    })
  },

  // 更新数据
  go_update(){
    this.getData()
  }
  
})