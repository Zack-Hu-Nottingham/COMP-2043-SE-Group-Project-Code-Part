// pages/project/statisticReport/statisticReport.js
const languageUtils = require("../../../language/languageUtils");

const app = getApp();

const db = wx.cloud.database();
const _ = db.command;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: 0,
    projectNum: 0,
    totalTasks: 0,
    totalUnstart: 0,
    totalProgressing: 0,
    totalCompleted: 0,
    projects:[],

    language: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })

    this.getData(app.globalData.userInfo._openid)

  },

  // 初始化数据
  async getData(openid){

    await this.getProjectInfo(openid)

    for (var idx in this.data.projects) {
      await this.getTaskInfo(this.data.projects[idx]._id)
    }

    
    
  },

  // 获取项目信息
  getProjectInfo(openid) {
    return new Promise((resolve, reject) => {
      db.collection('project')
      .where(
        {
          _openid: _.eq(openid)
        })
      .get()
      .then(res => {
        if (res.data.length != 0) {
          this.setData({
            projectNum: res.data.length
          })
          for (var idx in res.data) {
            this.setData({
              projects: this.data.projects.concat(res.data[idx])
            })  
          }
        }
        
        resolve("成功获取项目信息")
      })
      .catch(err => {
        reject("请求项目信息失败")
      })}
    )},

  // 获取任务信息
  getTaskInfo(projectId) {
    return new Promise((resolve, reject) => {
      db.collection('task')
      .where({
        belongTo: _.eq(projectId)
      })
      .count()
      .then(res => {
        this.setData({
          totalTasks: res.total
        })
        resolve("成功获取任务信息")
      })
      .catch(err => {
        reject("请求任务信息失败")
      })

      db.collection('task')
      .where({
        belongTo: _.eq(projectId), 
        state: 0,
      })
      .count()
      .then(res => {
        this.setData({
          totalUnstart: res.total
        })
        resolve("成功获取任务信息")
      })
      .catch(err => {
        reject("请求任务信息失败")
      })

      db.collection('task')
      .where({
        belongTo: _.eq(projectId), 
        state: 1,
      })
      .count()
      .then(res => {
        this.setData({
          totalProgressing: res.total
        })
        resolve("成功获取任务信息")
      })
      .catch(err => {
        reject("请求任务信息失败")
      })

      db.collection('task')
      .where({
        belongTo: _.eq(projectId), 
        state: 2,
      })
      .count()
      .then(res => {
        this.setData({
          totalCompleted: res.total
        })
        this.setData({
          value: ((100 * this.data.totalCompleted) / this.data.totalTasks).toFixed(2)
        })
        resolve("成功获取任务信息")
      })
      .catch(err => {
        reject("请求任务信息失败")
      })
    })
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

  clickProject(event) {
    wx.navigateTo({
      url: '../../project/projectInfo/projectInfo?id=' +  event.currentTarget.dataset.id,
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

  }
})