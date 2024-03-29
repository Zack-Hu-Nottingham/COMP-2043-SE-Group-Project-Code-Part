// subpages/pack_PM/pages/index/index.js
/*
 * Code written by team
 * Code created by: Yuzhe ZHANG
 * Code Modified by: Yuzhe ZHANG
 */
import Dialog from '../../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

const languageUtils = require("../../../../language/languageUtils");

const db = wx.cloud.database();

const _ = db.command;

const lib = require('../../../../utils/util');

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
    ifDot: false,

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
    selectindex: 1,
    countid:'',

    totalTask: 0,
    updateIndex: 1,

    projectId: [],
    state0: 0,
    state1: 0,
    state2: 0,
    state3: 0,
    state4: 0,

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

  onChange2(event) {
    const { picker, value, index } = event.detail;
    // Toast(`当前值：${value}, 当前索引：${index}`);
    this.setData({
      selectindex:index,
    })
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
    // this.getFeedbackInfo(app.globalData.userInfo._openid)
    if(this.messageList!=null){
      this.getFeedbackInfo(app.globalData.userInfo._openid)
    }
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
    // let selectindex= this.data.selectindex;
    // console.log('success '+selectindex);
    // db.collection('user').add({
    //   data:{
    //     identity: selectindex,
    //     // _openid: "",
    //     avatarUrl: "",
    //     nickName: "",
    //     project: [],
    //     task: []
    //   },
    //   success: res =>{
    //     console.log(res)        
        return {
          /**
           * Customized Title
           */
          title: '',
          /**
           * Jump page after friend click
           */
          path: '/pages/login/login?identity=' + this.data.selectindex,
          /**
           * Discription
           */
          desc: this.data.dictionary.description1,
          /**
           * Path of shared images
           */
          imageUrl: ''
        }
      // }
    // })
  },



  /**
   * Global method
   */


  /**
   * Initialise data
   */
  async getData(openid) {

    await this.getProjectInfo(openid)

    await this.getStateCount()

    await this.getFeedbackInfo(openid)

  },


  /** 
   * Logic for changing tab options
   */
  onChangeTab(event) {
    this.setData({
      active: event.detail
    });
    if(event.detail==0){
      this.countIsReadNumber(this.data.messageList);
    }
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
        .orderBy('time', 'desc')
        .get()
        .then(res => {
          // console.log(res.data)
          this.setData({
            messageList: res.data
          })
          this.countIsReadNumber(res.data);
        })
    })
  },
  countIsReadNumber(msgList){
    this.setData({
      ifDot: false
    })
    for(var i=0;i<msgList.length;i++){
      if (msgList[i].isRead==0){
        this.setData({
          ifDot: true
        })
      }
    }
  },


  /** 
   * Click the message and change its state to isRead
   */
  clickToChangeIsRead(event) {
    // console.log(event)
    if(!event.currentTarget.dataset.index){
      var index = 0;
    }
    else{
      var index = event.currentTarget.dataset.index;
    }
    var list = this.data.messageList;
    
    // console.log(list[index])
    list[index].isRead = 1;
    this.setData({
      messageList: list
    })
    this.countIsReadNumber(list);
    // this.data.messageList[index].isRead = 1;
    
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
        // console.log('revise isRead successfully', res)

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
                project: this.data.project.concat(res.data[idx]),
                projectId: this.data.project.concat(res.data[idx]._id)
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
      url: '../statisticReport/statisticReport',
    })
  },

  /** 
   * Click to view specific report
   */
  clickProject(event) {
    wx.navigateTo({
      url: '../projectInfo/projectInfo?id=' + event.currentTarget.dataset.id,
    })
  },

  /** 
   * click to create new project
   */
  clickNewProject(event) {
    wx.navigateTo({
      url: '../newProject/newProject',
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
      url: '../../../../pages/languageSetting/languageSetting'
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
      this.getData(app.globalData.userInfo._openid)
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
        // console.log(this.data.totalTask)
        // console.log(parseInt(this.data.updateIndex))

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
                  // console.log('请求修改任务状态成功', res)
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
                  // console.log('请求修改任务状态成功', res)
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
                  // console.log('请求修改任务状态成功', res)
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
                  // console.log('请求修改任务状态成功', res)
                })
                .catch(res => {
                  console.log('请求修改任务状态失败', res)
                })
              }
  
            }
            // this.data.task.push(res.data[0])
          })
        }

        // console.log("成功获取任务信息")
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
  },

  getStateCount(){
    for(var i in this.data.projectId){
      db.collection('task')
       .where({
          belongTo: _.eq(this.data.projectId[i]),
          state: _.eq(0)
       })
       .count()
       .then(res => {
         this.setData({
           state0: res.total
         })

         wx.cloud.callFunction({
            name: 'updateProjectInformation',
            data: {
              id: this.data.projectId[i],
              state: 0,
              count: res.total
            },
         })

       })

      db.collection('task')
       .where({
          belongTo: _.eq(this.data.projectId[i]),
          state: _.eq(1)
       })
       .count()
       .then(res => {
         this.setData({
           state1: res.total
         })

         wx.cloud.callFunction({
            name: 'updateProjectInformation',
            data: {
              id: this.data.projectId[i],
              state: 1,
              count: res.total
            },
         })

       })

      db.collection('task')
       .where({
          belongTo: _.eq(this.data.projectId[i]),
          state: _.eq(2)
       })
       .count()
       .then(res => {
         this.setData({
           state2: res.total
         })

         wx.cloud.callFunction({
              name: 'updateProjectInformation',
              data: {
                id: this.data.projectId[i],
                state: 2,
                count: res.total
              },
          })

       })

      db.collection('task')
       .where({
          belongTo: _.eq(this.data.projectId[i]),
          state: _.eq(3)
       })
       .count()
       .then(res => {
         this.setData({
           state3: res.total
         })

         wx.cloud.callFunction({
              name: 'updateProjectInformation',
              data: {
                id: this.data.projectId[i],
                state: 3,
                count: res.total
              },
          })

       })

      db.collection('task')
       .where({
          belongTo: _.eq(this.data.projectId[i]),
          state: _.eq(4)
       })
       .count()
       .then(res => {
         this.setData({
           state4: res.total
         })

         wx.cloud.callFunction({
              name: 'updateProjectInformation',
              data: {
                id: this.data.projectId[i],
                state: 4,
                count: res.total
              },
          })

       })

    }
  }


})