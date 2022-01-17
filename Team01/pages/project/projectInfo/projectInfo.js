// pages/projectInfo/projectInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "project1",
    owner: "Loc",
    startTime: "2022-01-10",
    endTime: "2023-02-20",
    projectDescription: "None",
    stateDescription: "None",
    currentState: "Normal",
    task: [],
    startTask: [],
    notStartTask: [],
    finishedTask: [],
    unstarted: 5,
    processing: 1,
    completed: 1,
    total: 7,
    delayed: 0,

    navbar: ['Project Information', 'Task Management', 'Gantt Diagram'],
    currentTab: 0,
    index: 0,
    query: {},
    option1: [
      { text: 'Not started tasks', value: 0 },
      { text: 'Progressing tasks', value: 1 },
      { text: 'Finished tasks', value: 2 },
    ],  
    value1: 0,
    activeNames: ['1'],

  },

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  
  bindStartDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      startTime: e.detail.value
    })
  },

  bindEndDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      endTime: e.detail.value
    })
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  navbarTap: function(e) {
    console.log(e)
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    app.globalData.currentTab = e.currentTarget.dataset.idx;
  },

  changeValue(e) {
    this.setData({
      value1: e.detail
    })
  },

  onshow() {
    this.setData({
      currentTab: app.globalData.currntTab
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("hello")
    try{
      wx.request({
        url: 'team01.site/project',
        method: 'GET',
        data: options,
        timeout: 1000,
        success (res) {
          this.setData ({
            name: options.name,
            owner: options.owner,
            startTime: options.startTime,
            endTime: options.endTime,
            projectDescription: options.projectDescription,
            stateDescription: options.stateDescription,
            currentState: options.currentState,
            task: options.task,
            // startTask: [],
            // notStartTask: [],
            // finishedTask: [],
            // unstarted: 5,
            // processing: 1,
            // completed: 1,
            // total: 7,
            delayed: 2,
          })
          com
        }
      })  
    } catch(error) {
      console.log(error)
    }
    console.log("bye")
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // console.log(this.data.name)
    // console.log(capitalizeFirstLetter(this.data.name))

    wx.setNavigationBarTitle({
      title: capitalizeFirstLetter(this.data.name) 
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function () {
    
  // },

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

