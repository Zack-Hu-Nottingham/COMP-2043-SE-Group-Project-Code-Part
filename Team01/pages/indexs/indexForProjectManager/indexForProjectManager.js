import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

const languageUtils = require("../../../language/languageUtils");
const db = wx.cloud.database();
const _ = db.command;
const lib = require('../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {

    /**
     * Global data
     */
    active: 0,
    pageName: ['Message', 'Project', 'More'],

    // 存放双语
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


    // /**
    //  * Dashboard page's data
    //  */
    // task:[],


    /**
     * More page's data
     */
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    name: "",
    identity: "",

    currentTime: "",

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化语言
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })

    // 载入时设置初始页面的navBar title
    wx.setNavigationBarTitle({
      title: this.data.pageName[this.data.active],
    })

    this.setData({
      identity: this.data.dictionary.project_manager
    })
    this.getData(app.globalData.userInfo.openid)

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



  /**
   * Global method
   */
  // 初始化数据
  async getData(openid){

    await this.updateState()

    await this.getProjectInfo(openid)

    await this.getFeedbackInfo(openid)

    for (var idx in this.data.project) {
      await this.getTaskInfo(this.data.project[idx]._id)
      // console.log(this.data.project[idx])
    }
    
  },

  // 获取项目信息
  getProjectInfo(openid) {
    return new Promise((resolve, reject) => {
      db.collection('project')
      .where(
        {
          _openid: _.eq(openid)
        })
      .get()
      .then(res => {
        if (res.data.length != 0) {
          for (var idx in res.data) {
            this.setData({
              project: this.data.project.concat(res.data[idx])
            })  
          }
        }
        
        resolve("成功获取项目信息")
      })
      .catch(err => {
        reject("请求项目信息失败")
      })}
    )},


      // 获取反馈信息
  getProjectInfo(openid) {
    return new Promise((resolve, reject) => {
      db.collection('project')
      .where({
          _openid: _.eq(openid)
        })
      .get()
      .then(res => {
        // console.log("res = ")
        // console.log(res)
        if (res.data.length != 0) {
          for (var idx in res.data) {
            this.setData({
              project: this.data.project.concat(res.data[idx])
            })  
          }
        }
        
        resolve("成功获取项目信息")
      })
      .catch(err => {
        reject("请求项目信息失败")
      })}
    )},

  // 获取任务信息
  getTaskInfo(projectId) {
    return new Promise((resolve, reject) => {
      db.collection('task')
      .where({
        belongTo: _.eq(projectId)
      })
      .get()
      .then(res => {
        // console.log(res)
        for (var idx in res.data) {
          this.setData({
            task: this.data.task.concat(res.data[idx])
          })
        }
        // this.data.task.push(res.data[0])
        resolve("成功获取任务信息")
      })
      .catch(err => {
        reject("请求任务信息失败")
      })
    })
  },

  // 获取反馈信息
  getFeedbackInfo(openid) {
    return new Promise((resolve, reject) => {
      db.collection('project')
      .where({
        _openid: _.eq(openid),
        feedback: _.exists(true)
      })
      .field({
        feedback:true
      })
      .orderBy('feedback.createTime', 'desc')
      .get()
      .then(res => {
        //console.log(res.data.length)
      
        if (res.data.length != 0) {
          for (var idx in res.data) {
            this.setData({
              messageList: this.data.messageList.concat(res.data[idx].feedback)
            })
          }
          
        }
        
        resolve("成功获取项目信息")
        console.log('成功获取项目信息',this.data.messageList)
      })
      .catch(err => {
        console.log('请求项目信息失败', err)
        //reject("请求项目信息失败")
      })}
      
    )},

  // 更改tab选项时对应的逻辑
  onChangeTab(event) {
    this.setData({ active: event.detail });
    wx.setNavigationBarTitle({
      title: this.data.pageName[this.data.active],
    })
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

  /**
   * Message page's method
   */
  clickMessage(event) {
    wx.navigateTo({
      url: '../message/message/message?sender=' + event.target.id,
    })
  },

  // 点击通知
  clickNotification(event) {

  },



   
  /**
   * Project page's method
   */
  // clickMyTask(event) {
  //   wx.navigateTo({
  //     url: '../project/taskInfo/taskInfo',
  //   })
  // },

  clickStatisticReport(event) {
    wx.navigateTo({
      url: '../../project/statisticReport/statisticReport',
    })
  },

  clickProject(event) {
    wx.navigateTo({
      url: '../../project/projectInfo/projectInfo?id=' +  event.currentTarget.dataset.id,
    })
  },

  clickNewProject(event) {
    wx.navigateTo({
      url: '../../project/newProject/newProject',
    })
  },


  
  /**
   * More page's method
   */
  
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        // console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  
  onSetting: function(){
    wx.navigateTo({
      url: '../../more/setting/setting',
    })
  },

  onMoreInfo: function(){
    wx.navigateTo({
      url: '../../more/moreInfo/moreInfo',
    })
  },


  // 点击language展示选项
  onChangeLan(event) {
    // console.log('check')
    wx.navigateTo({
      url: '../../more/languageSetting/languageSetting',
    })
  },

  // 更新数据
  go_update(){
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
    //console.log(this.data.currentTime)

    new Promise((resolve, reject) => {
      db.collection('task')
      .get()
      .then(res => {
        //console.log(res)
        for (var idx in res.data) {
          if(this.data.currentTime < res.data[idx].startTime){
            //console.log(res.data[idx].startTime)
            wx.cloud.database().collection('task')
            .doc(res.data[idx]._id)
            .update({
              data: {
                state: 0,
              }
            })
            .catch(err => {
              console.log('请求失败', err)
            })
          }else if(this.data.currentTime > res.data[idx].startTime && this.data.currentTime < res.data[idx].endTime){
            wx.cloud.database().collection('task')
            .doc(res.data[idx]._id)
            .update({
              data: {
                state: 1,
              }
            })
            .catch(err => {
              console.log('请求失败', err)
            })
          }else if(this.data.currentTime > res.data[idx].endTime){
            wx.cloud.database().collection('task')
            .doc(res.data[idx]._id)
            .update({
              data: {
                state: 3,
              }
            })
            .catch(err => {
              console.log('请求失败', err)
            })
          }
        }
        // this.data.task.push(res.data[0])
        resolve("成功获取任务信息")
      })
      .catch(err => {
        reject("请求任务信息失败")
      })
    })

  },

})