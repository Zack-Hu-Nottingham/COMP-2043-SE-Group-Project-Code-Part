// pages/project/taskInfo/taskInfo.js

const languageUtils = require("../../../language/languageUtils");
const db = wx.cloud.database();
const _ = db.command;
var id = '';

var taskComment = '1';

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


    taskPage: {},
    belongTo: "",

    dateShow: false,
    priorityShow: false,
    feedback: [],
    fileList: [],

    priority: [{
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
     * get task id
     */
    id = options.id


    this.getDetail()

    // this.updateComment();

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
    this.onClose();
    // this.setData({
    //   startTime: this.formatDate(start),
    //   endTime: this.formatDate(end),
    //   dateShow: false,
    //   date: `${this.formatDate(start)} - ${this.formatDate(end)}`,
    // });

    /**
     * cloud function
     */
    wx.cloud.callFunction({
      name: 'updateDate',
      data: {
        id: id,
        startTime: `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
        endTime: `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`
      }
    }).then(res => {
      console.log('修改task日期成功', res),
        this.getDetail()
    }).catch(res => {
      console.log('修改task日期失败', res)
    })
  },


  getDetail() {
    /**
     * Query the name and task information of a task based on its task_id
     */
    //return new Promise(function (resolve) {
    db.collection('task')
      .doc(id)
      .get({
        success: res => {
          // console.log(res.data)
          this.setData({
            taskPage: res.data,
            belongTo: res.data.belongTo,
          });
          this.updateComment(res.data.feedback)
          wx.setNavigationBarTitle({
            title: res.data.name,
          });
        },
        fail: err => {
          console.log('拉取任务信息请求失败', err)
        }
      })
    //})
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
      url: '../addComment/addComment?id=' + id + '&index=' + taskComment,
    })
  },

  onTaskDescriptionBlur: function (e) {
    // console.log(e.detail.value)

    wx.cloud.callFunction({
      name: 'updateTaskDescription',
      data: {
        id: id,
        descriptions: e.detail.value
      }
    }).then(res => {
      console.log('调用云函数修改任务描述成功', res),
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
        console.log('修改task优先级成功', res),
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

  deleteImg(event) {
    const delIndex = event.detail.index
    const {
      fileList
    } = this.data
    fileList.splice(delIndex, 1)
    this.setData({
      fileList
    })
    db.collection('task').where({
      _id: id
    }).update({
      data: {
        cloudList: cloudList.splice(delIndex, 1)
      }
    })
  },

  updateComment(list) {
    if (list) {
      var newList = [];
      // console.log(list)
      for (var i = 0; i < list.length; i++) {
        db.collection('feedback')
          .where({
            _id: list[i]._id
          })
          .get({
            success: res => {
              // console.log(res.data)
              newList.push(res.data[0])
              // console.log(newList)
              this.setData({
                feedback: newList
              })
            }
          })
      }
      // console.log(this.data.feedback)
    }

  },
  getList(list) {
    var newList = [];
    // console.log(list)
    for (var i = 0; i < list.length; i++) {
      db.collection('feedback')
        .where({
          _id: list[i]._id
        })
        .get({
          success: res => {
            newList.push(res.data[0])
            // console.log(newList)
          }
        })
    }
    this.setData({
      feedback: newList
    })
    // console.log(this.data.feedback)
  },
  upload() {
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        var fileList = this.data.fileList;
        fileList.push({
          url: res.tempFilePaths[0]
        });
        this.setData({
          fileList: fileList
        });
        this.uploadImage(res.tempFilePaths[0]);
        // console.log("成功选择图片",fileList);
      }
    })
  },

  uploadImage(fileURL) {
    wx.cloud.uploadFile({
      cloudPath: 'task/' + id + '/' + new Date().getTime() + Math.floor(9 * Math.random()) + '.png',
      filePath: fileURL,
      success: res => {
        // console.log("图片上传成功",res)
      },
      fail: console.error
    })
  },
})