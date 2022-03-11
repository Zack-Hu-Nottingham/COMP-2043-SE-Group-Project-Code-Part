import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

const languageUtils = require("../../../language/languageUtils");
const db = wx.cloud.database();
const _ = db.command;
const lib = require('../../../utils/util');

Page({
  /**
   * Initial data of page
   */
  data: {
    /**
     * Global data
     */
    openid: "",
    user: [],
    userInfo: {},
    isProjectEmpty: true,

    active: 0,
    pageName: ['Dashboard', 'More'],

    /**
     * Store bylingual settings
     */
    dictionary: {},
    language: 0,
    languageList: ["简体中文", "English"],

    /**
     * Message page's data
     */
    messageList: [],

    project: [],

    /**
     * Dashboard page's data
     */
    task: [],


    /**
     * More page's data
     */
    userInfo: {},

    totalTask: 89,

    currentTime: "",

    date: "",
    dateShow: false,
    filter: '',
    filterShow: false,

    changetip: '请输入新用户名',
    name : "",
    show: false,
    show1: false,
    value: '',
    radio: '1', 

    Filter: [],

    updateIndex: 1,
  },

  showPopup() {
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({ show: false});
  },

  showPopup1() {
    this.setData({ show1: true });
  },

  onClose1() {
    this.setData({ show1: false});
  },

  onChange(event) {
    this.setData({ radio: event.detail, });
  },

  /**
   * Life cycle function - listens for page loads
   */
  onLoad: function (options) {

    this.setData({
      identity: this.data.dictionary.house_owner,
      openid: options.openid,
      name: app.globalData.userInfo.nickName,
      userInfo: app.globalData.userInfo,
    })

    this.getData();


    /** 
     *  Initial language
     */
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan,
      Filter: [{
        name: this.data.dictionary.time,
      }, {
        name: this.data.dictionary.priority,
      }],
    })

    /** 
     *  Set the initial navBar title of page at load time
     */
    wx.setNavigationBarTitle({
      title: this.data.pageName[this.data.active],
    })


  },
  /**
   * Life cycle function - Listens for the page to complete its first rendering
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
  async getData(openid) {

    await this.getInfo()

    await this.getProjectInfo(this.data.openid)

    for (var idx in this.data.project) {
      await this.getTaskInfo(this.data.project[idx]._id)
    }

  },

  /**
   * get the user data
   */
  getInfo() {
    // console.log(app.globalData.userInfo._openid)
    return new Promise((resolve, reject) => {
      db.collection('user')
        .where({
          _openid: _.eq(app.globalData.userInfo._openid)
        })
        .get()
        .then(res => {
          this.setData({
            user: res.data[0]
          })
          resolve("get user data successfully");
        })
        .catch(err => {
          reject("fail to get user data")
        })
    })
  },

  /**
   * Get project  information
   */
  getProjectInfo(openid) {
    return new Promise((resolve, reject) => {
      db.collection('project')
        .where({
          houseOwner: _.eq(openid)
        })
        .get()
        .then(res => {
          if (res.data.length != 0) {
            this.setData({
              isProjectEmpty: false
            })
            for (var idx in res.data) {
              this.setData({
                project: this.data.project.concat(res.data[idx])
              })
            }
          }
          resolve("Successful access to project information")
        })
        .catch(err => {
          reject("Request for project information failed")
        })
    })
  },

  /**
   * Get task info
   */
  getTaskInfo(projectId) {

    for (let i = 0; i < Math.ceil(this.data.totalTask / 20); i++) {
      db.collection("task")
        .where({
          belongTo: _.eq(projectId),
        })
        .skip(i * 20)
        .get()
        .then(res => {
          for (var idx in res.data) {
            this.setData({
              task: this.data.task.concat(res.data[idx])
            })
          }
          // console.log("Successful access to task information")
        })
        .catch(err => {
          console.log("failto access to task information")
        })
    }

  },

  /** 
   * Logic for changing tab options
   */
  onChangeTab(event) {
    this.setData({
      active: event.detail
    });
    wx.setNavigationBarTitle({
      title: this.data.pageName[this.data.active],
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
      url: '../../project/taskInfoForHouseOwner/taskInfoForHouseOwner?id=' + event.currentTarget.dataset.id,
    })
  },

  clickProjectReport(event) {

    if (this.data.isProjectEmpty) {
      Toast(this.data.dictionary.no_project_error)
    } else {
      wx.navigateTo({
        url: '../../project/projectReport/projectReport?id=' + this.data.project[0]._id,
      })
    }
  },


  /**
   * More page's method
   */

  /** 
   * Click on the language to display option
   */
  onChangeLan(event) {
    // console.log('check')
    wx.navigateTo({
      url: '../../more/languageSetting/languageSetting',
    })
  },

  /** 
   * Update data
   */
  go_update() {
    this.setData({
        project: [],
        task: [],
      }),
      this.getData()
  },

  clickFilter() {
    if (this.data.isProjectEmpty) {
      Toast({
        message: this.data.dictionary.no_project_error,
      })
    } else {
      this.setData({
        filterShow: true
      })
    }
  },

  onFilterClose() {
    this.setData({
      filterShow: false
    })
  },

  onFilterSelect(e) {
    this.setData({
      filterShow: !this.data.filterShow,
      filter: e.detail.name
    })

    console.log(e.detail.value)

    if (this.data.filter == 'Time') {
      this.onTimeSelect()
    } else if (this.data.filter == 'Priority') {
      this.onPrioritySelect()
    }
  },

  onTimeSelect() {
    this.setData({
      task: [],
    });
    for (var idx in this.data.project) {
      this.timeFilter(this.data.project[idx]._id)
    }
  },

  timeFilter(projectId) {
    for (let i = 0; i < Math.ceil(this.data.totalTask / 20); i++) {
      db.collection('task')
        .where({
          belongTo: _.eq(projectId),
        })
        .orderBy("endTime", 'asc')
        .skip(i * 20)
        .get()
        .then(res => {
          for (var idx in res.data) {
            this.setData({
              task: this.data.task.concat(res.data[idx])
            })
          }
          // console.log("success to get task info")
        })
        .catch(err => {
          console.log("fail to get task info")
        })
    }

  },

  onPrioritySelect() {
    this.setData({
      task: [],
    })

    this.priorityFilter(this.data.project._id)
    // for (var idx in this.data.project) {
    //   this.priorityFilter(this.data.project[idx]._id)
    // }
  },

  priorityFilter(projectId) {
    for (let i = 0; i < Math.ceil(this.data.totalTask / 20); i++) {
      db.collection('task')
        .where({
          belongTo: _.eq(projectId),
        })
        .skip(i * 20)
        .get()
        .then(res => {
          for (var idx in res.data) {
            if (res.data[idx].currentPriority == "Highest") {
              this.setData({
                task: this.data.task.concat(res.data[idx])
              })
            }
          }
          // console.log("fail to get task info")
        })
        .catch(err => {
          console.log("fail to get task info")
        })
    }

    for (let i = 0; i < Math.ceil(this.data.totalTask / 20); i++) {
      db.collection('task')
        .where({
          belongTo: _.eq(projectId),
        })
        .skip(i * 20)
        .get()
        .then(res => {
          for (var idx in res.data) {
            if (res.data[idx].currentPriority == "High") {
              this.setData({
                task: this.data.task.concat(res.data[idx])
              })
            }
          }
          // console.log("成功获取任务信息")
        })
        .catch(err => {
          console.log("fail to get task info")
        })
    }

    for (let i = 0; i < Math.ceil(this.data.totalTask / 20); i++) {
      db.collection('task')
        .where({
          belongTo: _.eq(projectId),
        })
        .skip(i * 20)
        .get()
        .then(res => {
          for (var idx in res.data) {
            if (res.data[idx].currentPriority == "Normal") {
              this.setData({
                task: this.data.task.concat(res.data[idx])
              })
            }
          }
          // console.log("成功获取任务信息")
        })
        .catch(err => {
          console.log("fail to get task info")
        })
    }

    for (let i = 0; i < Math.ceil(this.data.totalTask / 20); i++) {
      db.collection('task')
        .where({
          belongTo: _.eq(projectId),
        })
        .skip(i * 20)
        .get()
        .then(res => {
          for (var idx in res.data) {
            if (res.data[idx].currentPriority == "Low") {
              this.setData({
                task: this.data.task.concat(res.data[idx])
              })
            }
          }
          // console.log("成功获取任务信息")
        })
        .catch(err => {
          console.log("fail to get task info")
        })
    }

    for (let i = 0; i < Math.ceil(this.data.totalTask / 20); i++) {
      db.collection('task')
        .where({
          belongTo: _.eq(projectId),
        })
        .skip(i * 20)
        .get()
        .then(res => {
          for (var idx in res.data) {
            if (res.data[idx].currentPriority == "Lowest") {
              this.setData({
                task: this.data.task.concat(res.data[idx])
              })
            }
          }
          // console.log("成功获取任务信息")
        })
        .catch(err => {
          console.log("fail to get task info")
        })
    }

  },

  priorityFilter(projectId){
    new Promise((resolve, reject) => {
    db.collection('task')
      .where({
        belongTo: _.eq(projectId),
        //currentPriority: _.eq('Highest')
      })
      .get()
      .then(res => {
        for (var idx in res.data) {
          if(res.data[idx].currentPriority == "Highest"){
            this.setData({
              task: this.data.task.concat(res.data[idx])
            })
          } 
        }
        for (var idx in res.data) {
          if(res.data[idx].currentPriority == "High"){
            this.setData({
              task: this.data.task.concat(res.data[idx])
            })
          } 
        }
        for (var idx in res.data) {
          if(res.data[idx].currentPriority == "Normal"){
            this.setData({
              task: this.data.task.concat(res.data[idx])
            })
          } 
        }
        for (var idx in res.data) {
          if(res.data[idx].currentPriority == "Low"){
            this.setData({
              task: this.data.task.concat(res.data[idx])
            })
          } 
        }
        for (var idx in res.data) {
          if(res.data[idx].currentPriority == "Lowest"){
            this.setData({
              task: this.data.task.concat(res.data[idx])
            })
          } 
        }
        resolve("成功获取任务信息")
      })
      .catch(err => {
        reject("请求任务信息失败")
      })
    })
  },

  userNameInput:function(e){
    // console.log(e.detail)
    this.setData({
      value:e.detail
    })
    // console.log(this.data.value)
  },

  forNotice: function (e) {
    let value= this.data.value;
    var id = app.globalData.userInfo._openid;
    // console.log(id)
    if (value=='') {
      Toast.fail('空用户名');
    } else {
      wx.cloud.callFunction({
        name:'updateuserName',
        data:{
          id:id,
          nickName:value
        },
        success:function (res){
          console.log("success" + value)
        },
        fail:console.error
      })
      Toast({
        type: 'success',
        message: '提交成功',
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
  },

  listenerActionSheet: function () {
    this.setData({

      filterShow: !this.data.filterShow
    });
  }
})