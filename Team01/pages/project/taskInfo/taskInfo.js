// pages/project/taskInfo/taskInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: 'Task1',
    belongTo: [],
    stageOfProject: "",
    tag: "",
    participants: [],
    description: "None",

    
    startTime: '2022-1-16',
    endTime: '2022-5-12',
    dateShow: false,

    currentPriority: 'normal',
    priorityShow: false,
    priority: [
      {
        name: 'highest',
      },
      {
        name: 'high'
      },
      {
        name: 'normal'
      },
      {
        name: 'low'
      },
      {
        name: 'lowest'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: this.data.name,
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

  onDateClose() {
    this.setData({ dateShow: false });
  },

  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },

  onConfirmStartTime(event) {
    this.setData({
      dateShow: false,
      startTime: this.formatDate(event.detail),
    });
  },
  
  onConfirmEndTime(event) {
    this.setData({
      dateShow: false,
      endTime: this.formatDate(event.detail),
    });
  },

  onPriorityClose() {
    this.setData({priorityShow: false})
  },

  onPrioritySelect(e) {
    // console.log(e.detail.name)
    this.setData({
      currentPriority: e.detail.name 
    })
  },

  clickPriority() {
    // console.log("click")
    this.setData({
      priorityShow: true
    })
  }
})