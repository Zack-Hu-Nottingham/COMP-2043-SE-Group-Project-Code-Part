// pages/project/statisticReport/statisticReport.js
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
    projects:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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