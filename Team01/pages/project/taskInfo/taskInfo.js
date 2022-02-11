// pages/project/taskInfo/taskInfo.js

var id = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {

    taskPage: {},

    /*
    belongTo: [],
    stageOfProject: "",
    tag: "",
    participants: [],
    

    
    startTime: '1/16',
    endTime: '5/12',*/
    dateShow: false,

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
    ],

    data: '',
    show: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    id = options.id

    this.getDetail()

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
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  onConfirm(event) {
    const [start, end] = event.detail;
    this.setData({
      startTime: this.formatDate(start),
      endTime: this.formatDate(end),
      show: false,
      date: `${this.formatDate(start)} - ${this.formatDate(end)}`,
    });

    //调用云函数
    wx.cloud.callFunction({
      name: 'updateDate',
      data:{
        id: id,
        startTime: `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
        endTime: `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`
      }
    }).then(res => {
      console.log('调用云函数成功', res),
      this.getDetail()
    }).catch(res => {
      console.log('调用云函数失败', res)
    })
  },

  
  // onDateDisplay() {
  //   this.setData({ dateShow: true });
  // },

  // onDateClose() {
  //   this.setData({ dateShow: false });
  // },

  // formatDate(date) {
  //   date = new Date(date);
  //   return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  // },

  // onConfirmStartTime(event) {
  //   this.setData({
  //     dateShow: false,
  //     startTime: this.formatDate(event.detail),
  //   });
  // },
  
  // onConfirmEndTime(event) {
  //   this.setData({
  //     dateShow: false,
  //     endTime: this.formatDate(event.detail),
  //   });
  // },

  getDetail(){
    wx.cloud.database().collection('taskList')
      .doc(id)
      .get()
      .then(res => {

        wx.setNavigationBarTitle({
          title: res.data.name,
        }),

        this.setData({
          taskPage: res.data,
        })

      })
      .catch(err => {
        console.log('请求失败', err)
      })
  },

  onPriorityClose() {
    this.setData({priorityShow: false})
  },

  onPrioritySelect(e) {
    // console.log(e.detail.name)
    this.setData({
      currentPriority: e.detail.name 
    }),

    //调用云函数
    wx.cloud.callFunction({
      name: 'updateData',
      data:{
        id: id,
        currentPriority: e.detail.name
      }
    }).then(res => {
      console.log('调用云函数成功', res),
      this.getDetail()
    }).catch(res => {
      console.log('调用云函数失败', res)
    })

  },

  clickPriority() {
    // console.log("click")
    this.setData({
      priorityShow: true
    })
  }
})