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
    currentTime: "",

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


    /**
     * More page's data
     */
    userInfo: {},

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
      userInfo: app.globalData.userInfo,
      identity: this.data.dictionary.project_manager
    })
    this.getData(app.globalData.userInfo.openid)
    console.log(this.data.userInfo)
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
    wx.hideHomeButton()
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
  onShareAppMessage: function (e) {
    return{
      title:'', //自定义标题
      path: '', //好友点击后跳转页面 
      desc: '', // 描述
      imageUrl: '' //分享的图片路径
    }
  },



  /**
   * Global method
   */

  // 初始化数据
  async getData(openid){

    await this.updateState()

    await this.getProjectInfo(openid)

    await this.getFeedbackInfo(openid)
    
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



   
  /**
   * Project page's method
   */

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
              console.log('请求修改项目状态失败', err)
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
              console.log('请求修改项目状态失败', err)
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
              console.log('请求修改项目状态失败', err)
            })
          }
        }
        // this.data.task.push(res.data[0])
        resolve("成功修改项目状态")
      })
      .catch(err => {
        console.log(err)
        reject("修改项目状态失败")
      })
    })

  },

})