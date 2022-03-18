// pages/project/statisticReport/statisticReport.js
const languageUtils = require("../../../language/languageUtils");

const app = getApp();

var id = '';

const db = wx.cloud.database();
const _ = db.command;

Page({

  /**
   * Initial data of page
   */
  data: {
    projectManager: '',
    value: 0,
    projectNum: 0,
    totalTasks: 0,
    totalUnstart: 0,
    totalProgressing: 0,
    totalCompleted: 0,
    totalDelayed: 0,
    projects: [],

    project: [],
    fileList: [],

    dictionary: {},
    language: 0,
  },

  /**
   * Life cycle function - listens for page loads
   */
  onLoad: function (options) {

    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })

    /** 
     *  get the id of project
     */
    id = options.id

    this.getTaskData(id)


    this.getDetail()

    this.setData({
      value: 0,
      projectNum: 1,
      totalTasks: 0,
      totalUnstart: 0,
      totalProgressing: 0,
      totalCompleted: 0,
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

  getDetail() {
    // console.log(id)
    db.collection('project')
      .doc(id)
      .get({
        success: res => {

          this.getFileList(res.data.cloudList);

          this.setData({
              project: res.data,
              //projects: this.data.project.concat(res.data),
              name: res.data.name,
            }),

            wx.setNavigationBarTitle({
              title: this.data.dictionary.my_project,
            })

          this.getProjectManager()
        },
      })
  },

  getTaskData(projectId) {
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

      db.collection('task')
        .where({
          belongTo: _.eq(projectId),
          state: 3,
        })
        .count()
        .then(res => {
          this.setData({
            totalDelayed: res.total
          })
          resolve("成功获取任务信息")
        })
        .catch(err => {
          reject("请求任务信息失败")
        })

    })

  },

  onDateDisplay() {
    this.setData({
      show: true
    });
  },

  onDateClose() {
    this.setData({
      show: false
    });
  },

  formatDate(date) {
    date = new Date(date);
    // return `${date.getMonth() + 1}/${date.getDate()}`;
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },

  getProjectManager() {
    return new Promise((resolve, reject) => {
      db.collection('user')
        .where({
          _openid: _.eq(this.data.project._openid)
        })
        .get()
        .then(res => {
          this.setData({
            projectManager: res.data[0]
          })
        })
    })
  },

  viewGantt() {
    console.log(this.data.project._id)
    /** 
     *  update gantt
     */
    wx.cloud.callFunction({
      name: 'uploadJSON',
      data: {
        id: this.data.project._id,
        // localPath: ganttPATH,
      }
    }).then(res => {
      console.log('gantt_json更新成功', res)
    }).catch(res => {
      console.log('gantt_json更新失败', res)
    })
    var number = 2;
    wx.navigateTo({
      url: '../testDiagram/testDiagram?id=' + this.data.project._id + '&index=' + number,
    })
  },
  async getFileList(cloudPath) {
    // console.log(cloudPath)
    var newList = [];
    for (var i = 0; i < cloudPath.length; i++) {
      await wx.cloud.downloadFile({
        fileID: cloudPath[i]
      }).then(res => {
        newList.push({
          "url": res.tempFilePath
        })
        this.setData({
          fileList: newList
        })
        //console.log(res.tempFilePath)
      })
    }
    // console.log(newList)
  },
  


  /**
   * Life cycle function - Listens for the page to complete its first rendering
   */
  onReady: function () {

  },

  /**
   * Life cycle function - Listens for page display
   */
  onShow: function () {

  },
  /**
   * Life cycle function - Listens for page hide
   */
  onHide: function () {

  },

  /**
   * Life cycle function - Listens for page unload
   */
  onUnload: function () {

  },

  /**
   * Page-specific event handlers - listen for user pull actions
   */
  onPullDownRefresh: function () {

  },

  /**
   * A handler for a pull-down event on the page
   */
  onReachBottom: function () {

  },

  /**
   * Users click on the upper right to share
   */
  onShareAppMessage: function () {

  }
})