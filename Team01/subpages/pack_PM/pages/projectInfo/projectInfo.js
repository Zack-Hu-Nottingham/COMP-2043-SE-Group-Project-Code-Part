// subpages/pack_PM/pages/projectInfo/projectInfo.js
const languageUtils = require("../../../../language/languageUtils");

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
    accepted: [],

    navbar: [],
    currentTab: 0,
    dictionary: {},
    language: 0,

    project: {},
    houseOwner: "",
    projectManager: "",
    feedback: [],
    fileList: [],
    defaultDate: [],

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


    this.getDetail()

    /** 
     *  get unstarted numbers
     */
    db.collection('task').where({
      belongTo: id,
      state: 0
    }).count().then(res => {
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
      this.setData({
        countState3Result: res.total
      })
    })
  },



  /** 
   * Global method
   */
  navbarTap: function (e) {
    const number = 1;
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    // console.log(this.data.currentTab)
    if (this.data.currentTab == 2) {
      //console.log('success')
      wx.navigateTo({
        url: '../../../../pages/testDiagram/testDiagram?id=' + id + '&index=' + number,
      })
    }

    /** 
     *  Loading data from the task management page
     */
    if (this.data.currentTab == 1) {
      const state0BatchTimes = Math.ceil(this.data.countState0Result / 20)
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
    }
  },


  /** 
   *  Initialize language
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


  getFeedback() {
    db.collection('feedback')
      .where({
        projectId: id, 
      })
      .get({
        success: res => {
          var newList = []
          for (var i = 0; i < res.data.length; i++) {
            newList.push(res.data[i])
          }
          this.setData({
              feedback: newList,
            })
            // console.log(feedback)
        },
        fail: function (err) {
          // console.log(err)
        }
      })

  },
  /** 
   * Get detailed info about the project
   */
  getDetail() {
    db.collection('project')
      .doc(id)
      .get({
        success: res => {
          // console.log(res)
          this.setData({
            project: res.data,
            name: res.data.name,
          }),
          wx.setNavigationBarTitle({
            title: this.data.project.name,
          }),
          
          //console.log(res.data.cloudList)
          //this.getDefaultDate()
          this.getFileList(res.data.cloudList)
          this.getFeedback()
          this.getHouseOwner(res.data.houseOwner)
          this.getProjectManager(res.data._openid)
        },
        fail: function (err) {
          // console.log(err)
        }
      })

  },

  // getDefaultDate(){
  //   let dateStart = Date.parse(new Date(this.data.taskPage.startTime.replace(/-/,"/")));
  //   let dateEnd = Date.parse(new Date(this.data.taskPage.endTime.replace(/-/,"/")));
  //   let defaultDate = [dateStart, dateEnd];
  //   this.setData({
  //     defaultDate: defaultDate
  //   })
  // },

  async getFileList(cloudPath) {
    // console.log(cloudPath)
    var newList = [];
    for (var i = 0; i < cloudPath.length; i++) {
      await wx.cloud.downloadFile({
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

  /** 
   * Get the info of house owner
   */
  getHouseOwner(houseOwnerId) {
    db.collection('user')
      .where({
        _openid: _.eq(houseOwnerId)
      })
      .get()
      .then(res => {
        this.setData({
          houseOwner: res.data[0]
        })
      })
  },

  //
  /** 
   *  Get the info of project manager
   */
  getProjectManager() {
    return new Promise((resolve, reject) => {
      db.collection('user')
        .where({
          _openid: _.eq(this.data.project._openid)
        })
        .get()
        .then(res => {
          this.setData({
            projectManager: res.data[0]
          })
        })
    })
  },

  /** 
   *  Project Information's method
   */

  /** 
   *  Modify the description of project
   */
  onProjectDescriptionBlur: function (e) {
    wx.cloud.callFunction({
      name: 'updateProjectDescription',
      data: {
        id: id,
        projectDescription: e.detail.value
      }
    }).then(res => {
      // console.log('调用云函数修改项目描述成功', res),
        this.getDetail()
    }).catch(res => {
      console.log('调用云函数修改项目描述失败', res)
    })
  },

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

  go_update() {
    this.getDetail()
  },
  // upload() {
  //   wx.chooseImage({
  //     sizeType: ['original', 'compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: res => {
  //       var fileList = this.data.fileList;
  //       fileList.push({
  //         url: res.tempFilePaths[0]
  //       });
  //       this.setData({
  //         fileList: fileList
  //       });
  //       this.uploadImage(res.tempFilePaths[0]);
  //       // console.log("成功选择图片",fileList);
  //     }
  //   })
  // },
  upload(event){
    const { file } = event.detail;
    var fileList = this.data.fileList;
    fileList.push({
      url: file.url
    })
    this.setData({
      fileList: fileList
    });
    this.uploadImage(file.url)
  },

  uploadImage(fileURL) {
    wx.cloud.uploadFile({
      cloudPath: 'project/' + id + '/' + new Date().getTime() + Math.floor(9 * Math.random()) + '.png',
      filePath: fileURL,
      success: res => {
        // console.log(res.fileID)
        db.collection('project').where({
          _id: id
        }).update({
          data: {
            cloudList: _.push(res.fileID)
          }
        })
        // wx.showToast({
        //   title: this.data.dictionary.upload_image_success,
        //   icon: 'success',
        //   duration: 2000,
        // })
        // console.log("图片上传成功",res)
      },
      fail: console.error
    })
  },
  deleteImg(event) {
    const delIndex = event.detail.index
    // console.log(delIndex)
    const { fileList } = this.data
    fileList.splice(delIndex, 1)
    this.setData({
      fileList
    })
    db.collection('project').where({_id:id})
    .field({
      cloudList: true,
    })
    .get({
      success: res=>{
        db.collection('project').where({
          _id: id
        }).update({
          data: {
            cloudList: _.pull(res.data[0].cloudList[delIndex])
          }
        }).then(res =>{
          // console.log("图片删除成功",res)
          // wx.showToast({
          //   title: this.data.dictionary.delete_image_success,
          //   icon: 'success',
          //   duration: 2000,
          // })
        })
        
        // console.log(res.data[0].cloudList[delIndex])
      }
    })
    
    
  },

})