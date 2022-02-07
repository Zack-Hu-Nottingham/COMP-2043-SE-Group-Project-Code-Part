// pages/projectInfo/projectInfo.js
const app = getApp()

var id = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    owner: '',
    startTime: '',
    endTime: '',
    projectDescription: '',
    stateDescription: '',
    currentState: '',
    task: [],
    unstarted: 0,
    processing: 0,
    completed: 0,
    total: 0,
    delayed: 0,
    /*name: "project1",
    owner: "Loc",
    startTime: "2022-01-10",
    endTime: "2023-02-20",
    projectDescription: "None",
    stateDescription: "None",
    currentState: "Normal",
    task: [],
    unstarted: 5,
    processing: 1,
    completed: 1,
    total: 7,
    delayed: 0,*/


    project: {},
    name: '',

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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    id = options.id
    console.log(options)

    this.getDetail()

    this.setData ({
      query: options,
    })
  
    
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

    wx.cloud.callFunction({
      name: 'updateProjectDate',
      data:{
        id: id,
        startTime: e.detail.value,
      }
    }).then(res => {
      console.log('调用云函数成功', res),
      this.getDetail()
    }).catch(res => {
      console.log('调用云函数失败', res)
    })

  },

  bindEndDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      endTime: e.detail.value
    })

    wx.cloud.callFunction({
      name: 'updateProjectDate',
      data:{
        id: id,
        endTime: e.detail.value,
      }
    }).then(res => {
      console.log('调用云函数成功', res),
      this.getDetail()
    }).catch(res => {
      console.log('调用云函数失败', res)
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

  


  getDetail(){
    wx.cloud.database().collection('project')
      .doc(id)
      .get()
      .then(res => {
        this.setData({
          project: res.data,
          owner: res.data.owner,
          startTime: res.data.startTime,
          endTime: res.data.endTime,
          projectDescription: res.data.projectDescription,
          stateDescription: res.data.stateDescription,
          currentState: res.data.currentState,
          task: res.data.task,
          unstarted: res.data.unstarted,
          processing: res.data.processing,
          completed: res.data.completed,
          total: res.data.total,
          delayed: res.data.delayed,
        }),

        wx.setNavigationBarTitle({
          title: res.data.name,
        })

      })
      .catch(err => {
        console.log('请求失败', err)
      })
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

