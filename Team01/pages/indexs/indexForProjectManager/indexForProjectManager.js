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
    active: 1,
    pageName: ['Message', 'Project', 'More'],
    currentTime: "",

    // Store bylingual settings
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

    changetip: '请输入新用户名',
    name : "",
    show: false,
    value: '',

    totalTask: 0,
    updateIndex: 1,
  },

  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false});
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
      identity: this.data.dictionary.project_manager,
      name : app.globalData.userInfo.nickName
    })
    this.getData(app.globalData.userInfo._openid)
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
    wx.stopPullDownRefresh()
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

  // Get feedback list
  getFeedbackInfo(openid){
    return new Promise((resolve, reject) =>{
      db.collection('feedback')
      .where({
        _openid: _.eq(openid),
      })
      .orderBy('createTime', 'desc')
      .get()
      .then(res =>{
        // console.log(res.data)
        this.setData({
          messageList: res.data
        })
      })
    })
  },

  // // 获取反馈信息
  // getFeedbackInfo(openid) {
  //   return new Promise((resolve, reject) => {
  //     db.collection('task')
  //     .where({
  //       _openid: _.eq(openid),
  //       feedback: _.exists(true)
  //     })
  //     .field({
  //       feedback:true
  //     })
  //     .orderBy('feedback.createTime', 'desc')
  //     .get()
  //     .then(res => {
  //       //console.log(res.data.length)
      
  //       if (res.data.length != 0) {
  //         for (var idx in res.data) {
  //           this.setData({
  //             messageList: this.data.messageList.concat(res.data[idx].feedback)
  //           })
  //         }
          
  //       }
        
  //       resolve("成功获取项目信息")
  //       console.log('成功获取项目消息',this.data.messageList)
  //     })
  //     .catch(err => {
  //       console.log('请求项目消息失败', err)
  //       //reject("请求项目信息失败")
  //     })
  //   }
      
  //   )},

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

  // Click the message and change its state to isRead
  clickToChangeIsRead(event) {
    console.log(event)
    // console.log(event.currentTarget.dataset.taskid)
    db.collection('feedback')
    .where({
      _id: event.currentTarget.dataset.taskid
    })
    .update({
      // data 传入需要局部更新的数据
      data: {
          isRead:1
        }
     
    })
    .then(res => {
      console.log('修改isRead成功', res)
      
    }).catch(res => {
      console.log('修改isRead失败', res)
    })
  
  },



   
  /**
   * Project page's method
   */

  // Click to view statistic report
  clickStatisticReport(event) {
    wx.navigateTo({
      url: '../../project/statisticReport/statisticReport',
    })
  },

  // Click to view specific report
  clickProject(event) {
    wx.navigateTo({
      url: '../../project/projectInfoForProjectManager/projectInfoForProjectManager?id=' +  event.currentTarget.dataset.id,
    })
  },

  // click to create new project
  clickNewProject(event) {
    wx.navigateTo({
      url: '../../project/newProject/newProject',
    })
  },


  
  /**
   * More page's method
   */


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

  // Handle new user name
  userNameInput:function(e){
    this.setData({
      value:e.detail.value
    })
  },

  // 
  forNotice: function (e) {
    let value= this.data.value;
    if (value=='') {
      Toast.fail('空用户名');
    } else {
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
    }
  }
})