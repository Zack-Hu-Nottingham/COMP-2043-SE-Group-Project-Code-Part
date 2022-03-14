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
    active: 1,
    currentTime: "",
    isProjectEmpty: true,

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


    /**
     * Projects page's data
     */

    project: [],


    /**
     * More page's data
     */
    userInfo: {},

    name: "",
    show: false,
    value: '',
    showInvite: false,
    radio: '1',

    totalTask: 0,
    updateIndex: 1,

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

  showPopupInvite() {
    this.setData({ showInvite: true });
  },

  onCloseInvite() {
    this.setData({ showInvite: false});
  },

  onChange(event) {
    this.setData({ radio: event.detail, });
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
     *  Set the initial navBar title of page at load time
     */
    wx.setNavigationBarTitle({
      title: this.data.dictionary.page_name_for_pm[this.data.active],
    })

    this.setData({
      userInfo: app.globalData.userInfo,
      name: app.globalData.userInfo.nickName
    })
    this.getData(app.globalData.userInfo._openid)
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

    /** 
     * Initialise language
     */
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })

    /** 
     * Set the initial navBar title of page at load time 
     */
    wx.setNavigationBarTitle({
      title: this.data.dictionary.page_name_for_pm[this.data.active],
    })

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
    wx.stopPullDownRefresh()
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
  async getData(openid) {

    await this.getProjectInfo(openid)

    await this.getFeedbackInfo(openid)

  },


  /** 
   * Logic for changing tab options
   */
  onChangeTab(event) {
    this.setData({
      active: event.detail
    });
    wx.setNavigationBarTitle({
      title: this.data.dictionary.page_name_for_pm[this.data.active],
    })
  },
  /** 
   * Get feedback list
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
   * Message page's method
   */

  /** 
   * Get feedback list
   */
  getFeedbackInfo(openid) {
    return new Promise((resolve, reject) => {
      db.collection('feedback')
        .where({
          _openid: _.eq(openid),
        })
        .orderBy('createTime', 'desc')
        .get()
        .then(res => {
          // console.log(res.data)
          this.setData({
            messageList: res.data
          })
        })
    })
  },


  clickMessage(event) {
    wx.navigateTo({
      url: '../message/message/message?sender=' + event.target.id,
    })
  },

  /** 
   * Click the message and change its state to isRead
   */
  clickToChangeIsRead(event) {
    console.log(event)
    // console.log(event.currentTarget.dataset.taskid)
    db.collection('feedback')
      .where({
        _id: event.currentTarget.dataset.taskid
      })
      .update({

        /** 
         * data passed in the data that needs to be updated locally
         */
        data: {
          isRead: 1
        }

      })
      .then(res => {
        console.log('revise isRead successfully', res)

      }).catch(res => {
        console.log('revise isRead failed', res)
      })

  },




  /**
   * Project page's method
   */


  /** 
   * get project information
   */
  getProjectInfo(openid) {
    return new Promise((resolve, reject) => {
      db.collection('project')
        .where({
          _openid: _.eq(openid)
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
   * Click to view statistic report
   */
  clickStatisticReport(event) {
    wx.navigateTo({
      url: '../../project/statisticReport/statisticReport',
    })
  },

  /** 
   * Click to view specific report
   */
  clickProject(event) {
    wx.navigateTo({
      url: '../../project/projectInfoForProjectManager/projectInfoForProjectManager?id=' + event.currentTarget.dataset.id,
    })
  },

  /** 
   * click to create new project
   */
  clickNewProject(event) {
    wx.navigateTo({
      url: '../../project/newProject/newProject',
    })
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

  updateState(){

    const _currentTime = lib.formatDate(new Date());
    this.setData({
      currentTime: _currentTime
    });
    // console.log(this.data.currentTime)

    db.collection('task')
      .count()
      .then(res => {
        this.setData({
          totalTask: res.total,
        })
        this.setData({
          updateIndex: this.data.totalTask / 20,
        })
        console.log(this.data.totalTask)
        console.log(parseInt(this.data.updateIndex))

        for(var i = 0; i <= parseInt(this.data.updateIndex); i++){
          db.collection('task')
          .skip(i*20)
          .get()
          .then(res => {
            //console.log(res)
            for (var idx in res.data) {
  
              if(res.data.state == 2 || res.data.state == 4){
                continue;
              }
  
              if(res.data[idx].startTime == ''){
                wx.cloud.callFunction({
                  name: 'updateState',
                  data: {
                    id: res.data[idx]._id,
                    state: 0
                  }
                })
                .then(res=>{
                  console.log('请求修改任务状态成功', res)
                })
                .catch(res => {
                  console.log('请求修改任务状态失败', res)
                })
              }else if(this.data.currentTime < res.data[idx].startTime){
                wx.cloud.callFunction({
                  name: 'updateState',
                  data: {
                    id: res.data[idx]._id,
                    state: 0
                  }
                })
                .then(res=>{
                  console.log('请求修改任务状态成功', res)
                })
                .catch(res => {
                  console.log('请求修改任务状态失败', res)
                })
  
              }else if(this.data.currentTime > res.data[idx].startTime && this.data.currentTime < res.data[idx].endTime){
                wx.cloud.callFunction({
                  name: 'updateState',
                  data: {
                    id: res.data[idx]._id,
                    state: 1
                  }
                })
                .then(res=>{
                  console.log('请求修改任务状态成功', res)
                })
                .catch(res => {
                  console.log('请求修改任务状态失败', res)
                })
              }else if(this.data.currentTime > res.data[idx].endTime){
                wx.cloud.callFunction({
                  name: 'updateState',
                  data: {
                    id: res.data[idx]._id,
                    state: 3
                  }
                })
                .then(res=>{
                  console.log('请求修改任务状态成功', res)
                })
                .catch(res => {
                  console.log('请求修改任务状态失败', res)
                })
              }
  
            }
            // this.data.task.push(res.data[0])
          })
        }

        console.log("成功获取任务信息")
      })
      .catch(err => {
        console.log("请求任务信息失败")
      })

  },

  /** 
   * Handle new user name
   */
  userNameInput: function (e) {
    this.setData({
      value: e.detail
    });
  },

  /** 
   *get notice
   */
  forNotice: function (e) {
    let value= this.data.value;
    var id = app.globalData.userInfo._openid;
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
  }
})