// pages/project/taskInfo/taskInfo.js

<<<<<<< HEAD
=======
const languageUtils = require("../../../language/languageUtils");

>>>>>>> main
var id = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {

<<<<<<< HEAD
    taskPage: {},

    name: "",
    /*
    belongTo: [],
    stageOfProject: "",
    tag: "",
    participants: [],
    description: "",

    
    startTime: '1/16',
    endTime: '5/12',*/
    dateShow: false,

    /*currentPriority: 'normal',*/
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

=======
    // 存放双语
    dictionary: {},
    language: 0,
    languageList: ["简体中文", "English"],
    
    
    taskPage: {},
    belongTo: "",

    dateShow: false,
    priorityShow: false,

    priority: [
      {
        name: 'Highest',
      },
      {
        name: 'High'
      },
      {
        name: 'Normal'
      },
      {
        name: 'Low'
      },
      {
        name: 'Lowest'
      },
    ],
>>>>>>> main
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
<<<<<<< HEAD
    
    id = options.id

    wx.cloud.database().collection('taskList')
      .doc(id)
      .get()
      .then(res => {
        this.setData({
          taskPage: res.data,
        }),

        wx.setNavigationBarTitle({
          title: res.data.name,
        })

      })
      .catch(err => {
        console.log('请求失败', err)
      })
=======

    // 初始化语言
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })

    // 获得当前task的id
    id = options.id

    // 根据id获得对应数据
    this.getDetail()
>>>>>>> main

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
<<<<<<< HEAD
  onDateDisplay() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
=======

  onDateDisplay() {
    this.setData({ dateShow: true });
  },

  onClose() {
    this.setData({ dateShow: false });
  },
  
>>>>>>> main
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
<<<<<<< HEAD
=======
  
>>>>>>> main
  onConfirm(event) {
    const [start, end] = event.detail;
    this.setData({
      startTime: this.formatDate(start),
      endTime: this.formatDate(end),
<<<<<<< HEAD
      show: false,
=======
      dateShow: false,
>>>>>>> main
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
<<<<<<< HEAD
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
        this.setData({
          taskPage: res.data,
        }),

        wx.setNavigationBarTitle({
          title: res.data.name,
=======
      console.log('修改task日期成功', res),
      this.getDetail()
    }).catch(res => {
      console.log('修改task日期失败', res)
    })
  },

  getDetail(){
    wx.cloud.database().collection('task')
      .doc(id)
      .get()
      .then(res => {
        wx.setNavigationBarTitle({
          title: res.data.name,
        }),

        this.setData({
          taskPage: res.data,
>>>>>>> main
        })

      })
      .catch(err => {
        console.log('请求失败', err)
      })
<<<<<<< HEAD
=======
      .then(res => {
        console.log(this.data.taskPage.belongTo)
        wx.cloud.database().collection('project')
        .doc(this.data.taskPage.belongTo)
        .get()
        .then(res => {
          this.setData({
            belongTo: res.data.name
          })
        })
      })



>>>>>>> main
  },

  onPriorityClose() {
    this.setData({priorityShow: false})
  },

<<<<<<< HEAD
=======
     /**
   * Create Comment page's method
   */
  clickAddComment(event) {
    wx.navigateTo({
      url: '../addComment/addComment',
    })
  },

>>>>>>> main
  onPrioritySelect(e) {
    // console.log(e.detail.name)
    this.setData({
      currentPriority: e.detail.name 
    }),
<<<<<<< HEAD
    
    //wx.cloud.database().collection('taskList')
    //  .doc(id)
    //  .update({
    //    data: {
    //      currentPriority: e.detail.name
    //    }
    //  })
=======
>>>>>>> main

    //调用云函数
    wx.cloud.callFunction({
      name: 'updateData',
      data:{
        id: id,
        currentPriority: e.detail.name
      }
    }).then(res => {
<<<<<<< HEAD
      console.log('调用云函数成功', res),
      this.getDetail()
    }).catch(res => {
      console.log('调用云函数失败', res)
=======
      console.log('修改task优先级成功', res),
      this.getDetail()
    }).catch(res => {
      console.log('修改task优先级失败', res)
>>>>>>> main
    })

  },

  clickPriority() {
    // console.log("click")
    this.setData({
      priorityShow: true
    })
<<<<<<< HEAD
  }
=======
  },

  // 初始化语言
  initLanguage() {
    var self = this;
    //获取当前小程序语言版本所对应的字典变量
    var lang = languageUtils.languageVersion();

    // 页面显示
    self.setData({
      dictionary: lang.lang.index,
    });
  },
>>>>>>> main
})