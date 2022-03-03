// pages/project/statisticReport/statisticReport.js
const languageUtils = require("../../../language/languageUtils");

const app = getApp();

var id = '';

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

    project: [],

    dictionary: {},
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

    // 获取当前project的id
    id = options.id

    // 从数据库中根据id获取数据
    this.getDetail()

    this.getTaskData(id)


    this.setData({
        value: 43.9,
        projectNum: 1,
        totalTasks: 0,
        totalUnstart: 0,
        totalProgressing: 0,
        totalCompleted: 0,
        projects:[{
          name: "Project1",
          taskNum: 18,
          unstart: 5,
          processing: 5,
          completed: 8,
          percentage: 44.4,
          color: "#ffd700"
        },{
          name: "Project2",
          taskNum: 15,
          unstart: 2,
          processing: 1,
          completed: 12,
          percentage: 80,
          color: "#00bfff"
        },{
          name: "Project3",
          taskNum: 24,
          unstart: 13,
          processing: 6,
          completed: 5,
          percentage: 20.8,
          color: "#32cd32"
        }]
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

  getDetail(){
    // console.log(id)
    db.collection('project')
      .doc(id)
      .get({
        success: res => {

          this.setData({
            project: res.data,
            //projects: this.data.project.concat(res.data),
            name: res.data.name,
          }),

          wx.setNavigationBarTitle({
            title: this.data.name,
          })
        },
      })
  },

  getTaskData(Id) {
    
    db.collection('task')
      .where({
        belongTo: _.eq(Id)
      })
      .get()
      .then(res => {
        for (var idx in res.data) {
          this.setData({
            totalTasks: res.data.length
          })
        }
        // this.data.task.push(res.data[0])
        resolve("成功获取任务信息")
      })
      .catch(err => {
        
      })

      db.collection('task')
      .where({
        belongTo: _.eq(Id),
        state: _.eq(0)
      })
      .get()
      .then(res => {
        for (var idx in res.data) {
          this.setData({
            totalUnstart: res.data.length
          })
        }
        // this.data.task.push(res.data[0])
        resolve("成功获取任务信息")
      })
      .catch(err => {
        
      })

    db.collection('task')
      .where({
        belongTo: _.eq(Id),
        state: _.eq(1)
      })
      .get()
      .then(res => {
        for (var idx in res.data) {
          this.setData({
            totalProgressing: res.data.length
          })
        }
        // this.data.task.push(res.data[0])
        resolve("成功获取任务信息")
      })
      .catch(err => {
        
      })

    db.collection('task')
      .where({
        belongTo: _.eq(Id),
        state: _.eq(2)
      })
      .get()
      .then(res => {
        for (var idx in res.data) {
          this.setData({
            totalCompleted: res.data.length,
          })
        }
        this.setData({
          value: ((100 * res.data.length) / this.data.totalTasks).toFixed(2)
        })
        // this.data.task.push(res.data[0])
        resolve("成功获取任务信息")
      })
      .catch(err => {
        
      })

  },

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