// pages/project/statisticReport/statisticReport.js
const languageUtils = require("../../../../language/languageUtils");

const app = getApp();

const db = wx.cloud.database();
const _ = db.command;


Page({

  /**
   * Initial data of page
   */
  data: {
    value: 0,
    projectNum: 0,
    totalTasks: 0,
    totalUnstart: 0,
    totalProgressing: 0,
    totalCompleted: 0,
    projects: [],

    language: 0,
  },

  /**
   * Life cycle function - listens for page loads
   */
  onLoad: function (options) {

    /** 
     *  Initial language
     */
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })

    /** 
     *  Get project list of current project manager
     */

    this.getData(app.globalData.userInfo._openid)

    wx.setNavigationBarTitle({
      title: this.data.dictionary.statistic_report,
    })
  },

  /** 
   *  Initial data
   */
  async getData(openid) {

    await this.getProjectInfo(openid)

    for (var idx in this.data.projects) {
      await this.getTaskInfo(this.data.projects[idx]._id)
    }

  },

  /** 
   *  get project info
   */
  getProjectInfo(openid) {
    return new Promise((resolve, reject) => {
      db.collection('project')
        .where({
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
        })
    })
  },

  /** 
   *  get task info
   */
  getTaskInfo(projectId) {
    return new Promise((resolve, reject) => {
      db.collection('task')
        .where({
          belongTo: _.eq(projectId)
        })
        .count()
        .then(res => {
          this.setData({
            totalTasks: res.total + this.data.totalTasks
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
            totalUnstart: res.total + this.data.totalUnstart
          })
          // console.log("添加未开始任务 res.total=" + res.total + " total = " + this.data.totalUnstart)
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
            totalProgressing: res.total + this.data.totalProgressing
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
            totalCompleted: res.total + this.data.totalCompleted
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

  /** 
   *  Initial language
   */
  initLanguage() {
    var self = this;
    //Get the dictionary variable corresponding to the current language version of the applet
    var lang = languageUtils.languageVersion();

    /** 
     * show the page
     */
    self.setData({
      dictionary: lang.lang.index,
    });
  },

  /** 
   * Click specific project to view detail
   */
  clickProject(event) {
    wx.navigateTo({
      url: '../projectInfo/projectInfo?id=' + event.currentTarget.dataset.id,
    })
  },
})


