// subpages/pack_HO/pages/taskInfo/taskInfo.js
const languageUtils = require("../../../language/languageUtils");
const db = wx.cloud.database();
const _ = db.command;
var id = '';

Page({

  /**
   * Initial data of page
   */
  data: {

    /**
     * Store bylingual settings
     */
    dictionary: {},
    language: 0,
    languageList: ["简体中文", "English"],

    project: [],
    taskPage: {},
    belongTo: "",
    participant: '',

    dateShow: false,
    priorityShow: false,

    priority: [
      {
        name: 'High'
      },
      {
        name: 'Normal'
      },
      {
        name: 'Low'
      }
    ],

    fileList: [],
    feedback: [],
  },

  /**
   * Life cycle function - listens for page loads
   */
  onLoad: function (options) {

    /**
     * Initial data of page
     */
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })

    /**
     * get task id
     */
    id = options.id


    this.getDetail()

    this.getImage()

  },

  getImage() {
    wx.cloud.downloadFile()
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

  },

  onDateDisplay() {
    this.setData({
      dateShow: true
    });
  },

  onClose() {
    this.setData({
      dateShow: false
    });
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
      dateShow: false,
      date: `${this.formatDate(start)} - ${this.formatDate(end)}`,
    });


    wx.cloud.callFunction({
      name: 'updateDate',
      data: {
        id: id,
        startTime: `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
        endTime: `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`
      }
    }).then(res => {
      // console.log('修改task日期成功', res),
        this.getDetail()
    }).catch(res => {
      console.log('修改task日期失败', res)
    })
  },

  getDetail() {
    wx.cloud.database().collection('task')
      .doc(id)
      .get()
      .then(res => {
          // console.log(res.data)
          this.updateComment()
          wx.setNavigationBarTitle({
              title: res.data.name,
            });
          this.getFileList(res.data.cloudList)            
          this.setData({
            taskPage: res.data,
          })
      })
      .catch(err => {
        console.log('请求失败', err)
      })
      .then(res => {
        // console.log(this.data.taskPage.belongTo)
        db.collection('project')
          .doc(this.data.taskPage.belongTo)
          .get()
          .then(res => {
            this.setData({
              project: res.data,
              belongTo: res.data.name
            })
          })
        this.getParticipant()
      })
  },

  updateComment(){
    db.collection('feedback')
    .where({
      belongTo: _.eq(id)
    })
    .orderBy('time', 'desc')
    .get({
      success: res=>{
        this.setData({
          feedback: res.data
        })
        // console.log(res)
      }
    })

  },

  getFileList(cloudPath) {
      // console.log(cloudPath)
      var newList = [];
      for (var i = 0; i < cloudPath.length; i++) {
        wx.cloud.downloadFile({
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

  getParticipant() {
    return new Promise((resolve, reject) => {
      db.collection('user')
        .where({
          _openid: _.eq(this.data.taskPage.participant)
        })
        .get()
        .then(res => {
          this.setData({
            participant: res.data[0]
          })
        })
    })
  },

  onPriorityClose() {
    this.setData({
      priorityShow: false
    })
  },

  /**
   * Create Comment page's method
   */
  clickAddComment(event) {
    wx.navigateTo({
      url: '../addComment/addComment?id=' + id + '&projectId=' + this.data.taskPage.belongTo,
    })
  },

  onTaskDescriptionBlur: function (e) {
    // console.log(e.detail.value)

    wx.cloud.callFunction({
      name: 'updateTaskDescription',
      data: {
        id: id,
        taskDescriptions: e.detail.value
      }
    }).then(res => {
      //console.log('调用云函数修改任务描述成功', res),
        this.getDetail()
    }).catch(res => {
      console.log('调用云函数修改任务描述失败', res)
    })
  },

  onPrioritySelect(e) {
    // console.log(e.detail.name)
    this.setData({
        currentPriority: e.detail.name
      }),


      wx.cloud.callFunction({
        name: 'updateData',
        data: {
          id: id,
          currentPriority: e.detail.name
        }
      }).then(res => {
        this.getDetail()
      }).catch(res => {
        console.log('修改task优先级失败', res)
      })

  },

  clickPriority() {
    // console.log("click")
    this.setData({
      priorityShow: true
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

  
})