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


    this.setData({
        value: 43.9,
        projectNum: 3,
        totalTasks: 57,
        totalUnstart: 20,
        totalProgressing: 12,
        totalCompleted:25,
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
    console.log(id)
    db.collection('project')
      .doc(id)
      .get({
        success: res => {

          this.setData({
            project: res.data,
            name: res.data.name
          }),

          wx.setNavigationBarTitle({
            title: this.data.name,
          }),

          this.getProjectManager()
          // this.getTaskState()
        },
        fail: function(err) {
          console.log(err)
        }
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