// pages/projectInfo/projectInfo.js
const languageUtils = require("../../../language/languageUtils");

const app = getApp();

var id = '';
/**
 * Identify the index list in the page of addComment as task/project
 */
var projectComment = '0'; 
const db = wx.cloud.database();
const _ = db.command;
const MAX_LIMIT = 20;


Page({

  /**
   * Initial data of page
   */
  data: {

    // Project Information's data
    task: [],
    taskState: [],

    /**
     * Task state format
     * 0 - unstarted
     * 1 - progressing
     * 2 - finished
     * 3 - delayed
     * 4 - reworking
     * * 5 - accepted
     */
    unstarted: [],
    progressing: [],
    completed: [],
    delayed: [],
    reworking: [],
    accepted: [],

    navbar: [],
    currentTab: 0,
    dictionary: {},
    language: 0,


    project: {},
    houseOwner: "",
    projectManager: "",
    // feedback: [],
    fileList: [],
    cloudList: [],

    /**
     * Task Management's data
     * These data should be filled in when the page is loaded
     */
    startedTask: [],
    notStartedTask: [],
    finishedTask: [],

    activeNames: [],
    countState0Result: 0,
    countState1Result: 0,
    countState2Result: 0,
    countState3Result: 0,
    countState4Result: 0,

  },

  /**
   * Life cycle function - listens for page loads
   */
  onLoad: function (options) {

    /** 
     *  Initial language
     */
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })

    /** 
     * set navBar
     */
    this.setData({
      navbar: [this.data.dictionary.project_info, this.data.dictionary.task_management, this.data.dictionary.gantt_diagram]
    })

    /** 
     *  get the id of project
     */
    id = options.id


    this.getDetail().then(res =>{
      console.log(res)
    })
    // this.getFileList(this.data.cloudList);


    /** 
     *  get unstarted numbers
     */
    db.collection('task').where({
      belongTo: id,
      state: 0
    }).count().then(res => {
      console.log('unstarted: ' + res.total);

      this.setData({
        countState0Result: res.total
      })
    })

    /** 
     *  get processing numbers
     */
    db.collection('task').where({
      belongTo: id,
      state: 1
    }).count().then(res => {
      console.log('processing: ' + res.total);

      this.setData({
        countState1Result: res.total
      })
    })

    /** 
     *  get completed numbers
     */
    db.collection('task').where({
      belongTo: id,
      state: 2
    }).count().then(res => {
      console.log('completed: ' + res.total);

      this.setData({
        countState2Result: res.total
      })
    })

    /** 
     *  get delayed numbers
     */
    db.collection('task').where({
      belongTo: id,
      state: 3
    }).count().then(res => {
      console.log('delayed: ' + res.total);

      this.setData({
        countState3Result: res.total
      })
    })

    /** 
     *  get reworking numbers
     */
    db.collection('task').where({
      belongTo: id,
      state: 4
    }).count().then(res => {
      console.log('reworking: ' + res.total);

      this.setData({
        countState4Result: res.total
      })
    })

    /** 
     *  update gantt
     */
    wx.cloud.callFunction({
      name: 'uploadJSON',
      data: {
        id: id,
        // localPath: ganttPATH,
      }
    }).then(res => {
      console.log('gantt_json更新成功', res)
    }).catch(res => {
      console.log('gantt_json更新失败', res)
    })


  },



  /** 
   * Global method
   */
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    console.log(this.data.currentTab)
    if (this.data.currentTab == 2) {
      console.log('success')
      wx.navigateTo({
        url: '../testDiagram/testDiagram?id=' + id,
      })
    }

    /** 
     *  Loading data from the task management page
     */
    if (this.data.currentTab == 1) {
      const state0BatchTimes = Math.ceil(this.data.countState0Result / 20)
      //console.log(state0BatchTimes)
      var arraypro = []
      var x0 = 0;

      /** 
       *  Initially loop through the cloud database to get an array of promises for the number of counts
       */
      for (let i = 0; i < state0BatchTimes; i++) {
        db.collection("task").where({
          belongTo: id,
          state: 0
        }).skip(i * 20).get().then(res => {
          x0++;
          //console.log(x0);
          for (let j = 0; j < res.data.length; j++) {
            arraypro.push(res.data[j])
          }
          //console.log(arraypro);
          if (x0 == state0BatchTimes) {
            this.setData({
              unstarted: arraypro
            })
          }
        })


      }




      const state1BatchTimes = Math.ceil(this.data.countState1Result / 20)
      var arraypro1 = []
      var x1 = 0
      /** 
       *  Initially loop through the cloud database to get an array of promises for the number of counts
       */
      for (let i = 0; i < state1BatchTimes; i++) {
        db.collection("task").where({
          belongTo: id,
          state: 1
        }).skip(i * 20).get().then(res => {
          x1++;
          for (let j = 0; j < res.data.length; j++) {
            arraypro1.push(res.data[j])
          }
          if (x1 == state1BatchTimes) {
            this.setData({
              progressing: arraypro1
            })
          }
        })


      }



      const state2BatchTimes = Math.ceil(this.data.countState2Result / 20)
      var arraypro2 = []
      var x2 = 0
      /** 
       *  Initially loop through the cloud database to get an array of promises for the number of counts
       */
      for (let i = 0; i < state2BatchTimes; i++) {
        db.collection("task").where({
          belongTo: id,
          state: 2
        }).skip(i * 20).get().then(res => {
          x2++;
          for (let j = 0; j < res.data.length; j++) {
            arraypro2.push(res.data[j])
          }
          if (x2 == state2BatchTimes) {
            this.setData({
              completed: arraypro2
            })
          }
        })


      }



      const state3BatchTimes = Math.ceil(this.data.countState3Result / 20)
      var arraypro3 = []
      var x3 = 0
      /** 
       *  Initially loop through the cloud database to get an array of promises for the number of counts
       */
      for (let i = 0; i < state3BatchTimes; i++) {
        db.collection("task").where({
          belongTo: id,
          state: 3
        }).skip(i * 20).get().then(res => {
          x3++;
          for (let j = 0; j < res.data.length; j++) {
            arraypro3.push(res.data[j])
          }
          if (x3 == state3BatchTimes) {
            this.setData({
              delayed: arraypro3
            })
          }
        })


      }

      const state4BatchTimes = Math.ceil(this.data.countState4Result / 20)
      var arraypro4 = []
      var x4 = 0
      /** 
       *  Initially loop through the cloud database to get an array of promises for the number of counts
       */
      for (let i = 0; i < state4BatchTimes; i++) {
        db.collection("task").where({
          belongTo: id,
          state: 4
        }).skip(i * 20).get().then(res => {
          x4++;
          for (let j = 0; j < res.data.length; j++) {
            arraypro4.push(res.data[j])
          }
          if (x4 == state4BatchTimes) {
            this.setData({
              reworking: arraypro4
            })
          }
        })


      }
    }





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


  async getDetail() {
    return new Promise((resolve, reject) => {
      db.collection('project')
        .doc(id)
        .get({
          success: res => {
            this.setData({
                project: res.data,
                name: res.data.name,
                feedback: res.data.feedback,
                cloudList: res.data.cloudList,
              }),

            wx.setNavigationBarTitle({
                title: this.data.name,
              }),

            this.getHouseOwner()
            this.getProjectManager()
          },
          fail: function (err) {
            // console.log(err)
          }
        })
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
        //console.log(res.tempFilePath)
      })
    }
    this.setData({
      fileList: newList
    })
    // console.log(fileList)
  },

  getHouseOwner() {
    db.collection('user')
      .where({
        _openid: _.eq(this.data.project.houseOwner)
      })
      .get()
      .then(res => {
        this.setData({
          houseOwner: res.data[0]
        })
      })
  },

  getProjectManager() {
    return new Promise((resolve, reject) => {
      db.collection('user')
        .where({
          _openid: _.eq(this.data.project._openid)
        })
        .get()
        .then(res => {
          // console.log(res.data[0])
          this.setData({
            projectManager: res.data[0]
          })
        })
    })
  },


  /** 
   *  Project Information's method
   */
  onDateDisplay() {
    this.setData({
      show: true
    });
  },

  onDateClose() {
    this.setData({
      show: false
    });
  },

  formatDate(date) {
    date = new Date(date);
    // return `${date.getMonth() + 1}/${date.getDate()}`;
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },

  onDateConfirm(event) {
    const [start, end] = event.detail;
    this.onDateClose();


    /** 
     *  use cloud function to update date in DB
     */
    wx.cloud.callFunction({
      name: 'updateProjectDate',
      data: {
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
   * Task Management's method
   */
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  clickNewTask(event) {
    wx.navigateTo({
      url: '../newTask/newTask',
    })
  },


  onProjectBlur: function (e) {
    // console.log(e.detail.value)

    wx.cloud.callFunction({
      name: 'updateProjectDescription',
      data: {
        id: id,
        projectDescription: e.detail.value
      }
    }).then(res => {
      console.log('调用云函数修改项目描述成功', res),
        this.getDetail()
    }).catch(res => {
      console.log('调用云函数修改项目描述失败', res)
    })
  },

  onStateBlur: function (e) {
    // console.log(e.detail.value)

    wx.cloud.callFunction({
      name: 'updateProjectDescription',
      data: {
        id: id,
        stateDescription: e.detail.value
      }
    }).then(res => {
      console.log('调用云函数修改项目状态描述成功', res),
        this.getDetail()
    }).catch(res => {
      console.log('调用云函数修改项目状态描述失败', res)
    })
  },

  go_update() {
    this.getDetail()
  },

  updateComment() {
    db.collection('project')
      .doc(id)
      .get({
        success: res => {
          this.setData({
            feedback: res.data.feedback,
          });
        },
        fail: function (err) {
          // console.log(err)
        }
      })

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
    db.collection('project').where({
      _id: id
    }).update({
      data: {
        cloudList: cloudList.splice(delIndex, 1)
      }
    })
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
      cloudPath: 'project/' + id + '/' + new Date().getTime() + Math.floor(9 * Math.random()) + '.png',
      filePath: fileURL,
      success: res => {
        // console.log("图片上传成功",res)
      },
      fail: console.error
    })
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

  onProjectBlur: function (e) {
    // console.log(e.detail.value)

    wx.cloud.callFunction({
      name: 'updateProjectDescription',
      data: {
        id: id,
        projectDescription: e.detail.value
      }
    }).then(res => {
      console.log('调用云函数成功', res),
        this.getDetail()
    }).catch(res => {
      console.log('调用云函数失败', res)
    })
  },

  onStateBlur: function (e) {
    // console.log(e.detail.value)

    wx.cloud.callFunction({
      name: 'updateProjectDescription',
      data: {
        id: id,
        stateDescription: e.detail.value
      }
    }).then(res => {
      console.log('调用云函数成功', res),
        this.getDetail()
    }).catch(res => {
      console.log('调用云函数失败', res)
    })
  },

  go_update() {
    this.getDetail()
  },

})