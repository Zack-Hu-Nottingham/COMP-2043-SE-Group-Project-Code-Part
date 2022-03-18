// subpages/pack_W/pages/index/index.js
import Dialog from '../../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

const languageUtils = require("../../../../language/languageUtils");

const db = wx.cloud.database();

const _ = db.command;

Page({

  /**
   * Initial data of page
   */
  data: {

    /**
     * Global data
     */
    userInfo: {},
    isTaskEmpty: true,
    active: 0,

    /**
     * Store bylingual settings
     */
    dictionary: {},
    language: 0,
    languageList: ["简体中文", "English"],


    /**
     * Dashboard page's data
     */
    project: [],
    projectInfo: [],
    projectTask: [],
    taskList: [],
    task: [],

    /**
     * More page's data
     */

    name: "",
    show: false,
    value: '',
    radio: '1', 
  },

  showPopup() {
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  onChange(event) {
    this.setData({ radio: event.detail, });
  },

  /**
   * Life cycle function - listens for page loads
   */
  onLoad: function (options) {

    /**
     * set current user
     */
    this.setData({
      userInfo: app.globalData.userInfo
    })

    /** 
     *  get the worker data
     */
    this.getData()

    /** 
     *  Initial language
     */
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })

    /** 
     *  Set the initial navBar title of page at load time
     */
    wx.setNavigationBarTitle({
      title: this.data.dictionary.page_name[this.data.active],
    })

    this.setData({
      identity: this.data.dictionary.worker,
      name: app.globalData.userInfo.nickName,
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
    wx.hideHomeButton()

    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })
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
  onShareAppMessage: function (e) {
    return {
      /**
       * Customized Title
       */
      title: '',
      /**
       * Jump page after friend click
       */
      path: '',
      /**
       * Discription
       */
      desc: '',
      /**
       * Path of shared images
       */
      imageUrl: ''
    }
  },



  /**
   * Global method
   */

  /**
   * Initialise data
   */
  async getData() {

    /**
     * check task list
     */
    await this.getTaskList()

    /**
     * Check if the task list is empty, and return if it is empty
     */
    if (this.data.isTaskEmpty) {
      return
    }
    /**
     * Get information about each task according to the task list
     */
    for (var item in this.data.taskList) {
      await this.getTaskInfo(this.data.taskList[item])
    }
    /**
     * Division of all tasks according to the project to which they belong
     */
    var temp = []
    for (var item in this.data.task) {
      var idx = temp.indexOf(this.data.task[item].belongTo)
      if (idx < 0) {
        temp = temp.concat([this.data.task[item].belongTo])
      }
    }

    var projectTask = []
    for (var j in temp) {
      projectTask.push([])
      for (var i in this.data.task) {
        if (this.data.task[i].belongTo == temp[j]) {
          projectTask[j] = projectTask[j].concat({
            name: this.data.task[i].name,
            _id: this.data.task[i]._id,
            state: this.data.task[i].state,
            startTime: this.data.task[i].startTime,
            endTime: this.data.task[i].endTime,
          })
        }
      }
    }

    this.setData({
      project: temp,
      projectTask: projectTask
    })
    /**
     * Get project summary information
     */
    for (var idx in this.data.project) {
      this.getProjectInfo(this.data.project[idx])
    }
  },
  /**
   * Get project summary information
   */
  getProjectInfo(projectId) {
    // console.log(projectId)
    return new Promise((resolve, reject) => {
      db.collection('project')
        .doc(projectId)
        .field({
          name: true,
        })
        .get()
        .then(res => {
          this.setData({
            projectInfo: this.data.projectInfo.concat(res.data)
          })
          resolve("成功获取项目简要信息")
        })
        .catch(err => {
          reject("请求项目简要信息失败")
        })

    })
  },
  /**
   * Get project summary information
   */
  getTaskInfo(taskId) {
    return new Promise((resolve, reject) => {
      db.collection('task')
        .where({
          _id: _.eq(taskId)
        })
        .field({
          _id: true,
          name: true,
          startTime: true,
          endTime: true,
          state: true,
          belongTo: true
        })
        .get()
        .then(res => {
          this.setData({
            task: this.data.task.concat(res.data[0]),
          })
          resolve("Successful access to project information")
        })
        .catch(err => {
          reject("Request for project information failed")
        })
    })
  },
  /**
   * Get project list
   */
  getTaskList() {

    return new Promise((resolve, reject) => {
      db.collection('user')
        .where({
          _openid: _.eq(this.data.userInfo._openid)
        })
        .get()
        .then(res => {
          if (res.data[0].task.length != 0) {
            this.setData({
              taskList: res.data[0].task,
              isTaskEmpty: false,
            })
          }

          resolve("Request for project list failed")
        })
        .catch(err => {
          reject("Request for project list failed")
        })
    })
  },

  clickProject(projectId) {
    // console.log(projectId.currentTarget.id)
    wx.navigateTo({
      url: '../projectInfo/projectInfo?id=' + projectId.currentTarget.id,
    })
  },

  /** 
   * Logic for changing tab options
   */
  onChangeTab(event) {
    this.setData({
      active: event.detail
    });
    wx.setNavigationBarTitle({
      title: this.data.dictionary.page_name[this.data.active],
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


  /**
   * Dashboard page's method
   */
  clickTask(event) {
    wx.navigateTo({
      url: '../taskInfo/taskInfo?id=' + event.currentTarget.dataset.id,
    })
  },



  /**
   * More page's method
   */



  /** 
   * Click on the language to display option
   */
  onChangeLan(event) {
    wx.navigateTo({
      url: '/pages/languageSetting/languageSetting',
    })
  },

  /** 
   * Update data
   */
  go_update() {
    this.getData()
  },

  /** 
   * Handle new user name
   */
  userNameInput: function (e) {
    this.setData({
      value:e.detail
    })
  },

  forNotice: function (e) {
    let value= this.data.value;
    var id = app.globalData.userInfo._openid;
    if (value=='') {
      Toast.fail(this.data.dictionary.null_name);
    } else {
      wx.cloud.callFunction({
        name:'updateuserName',
        data:{
          id:id,
          nickName:value
        },
        success:function (res){
          // console.log("success" + value)
        },
        fail:console.error
      })
      Toast({
        type: 'success',
        message: this.data.dictionary.successname,
        onClose: () => {
          this.setData({
            show: false,
            value: '',
          });
          //console.log('执行OnClose函数');
        },
      });
      this.setData({
        name:value
      }) 
    }
  }
})