const languageUtils = require("../../language/languageUtils");
const db = wx.cloud.database();
const _ = db.command;
const lib = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {

    /**
     * Global data
     */
    openid: "",
    user: [],
    active: 2,
    pageName: ['Message', 'Project', 'Dashboard', 'More'],

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
     * Dashboard page's data
     */
    task:[],


    /**
     * More page's data
     */
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    name: "",
    position: "Project Manager",

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 获取当前用户的openid
    // wx.login({
    //   success: (res) => {
    //     // 根据临时code，访问接口获得用户openid
    //     if (res.code) { 
    //       var url = "https://api.weixin.qq.com/sns/jscode2session?appid=wxd4b06f2e9673ed00&secret=909d4ff30ed2d6e828f73e55a63cd862&js_code=" + res.code + "&grant_type=authorization_code";
    //       wx.request({
    //         url: url,
    //         method: 'GET',
    //         success: (res) => {
    //           console.log("Openid = " + res.data.openid);
    //           this.setData({
    //             openid: res.data.openid,
    //           })
    //         }
    //       })
    //     }
    //   }
    // })

    wx.login()
    .then(res => {
      if (res.code) { 
        var url = "https://api.weixin.qq.com/sns/jscode2session?appid=wxd4b06f2e9673ed00&secret=909d4ff30ed2d6e828f73e55a63cd862&js_code=" + res.code + "&grant_type=authorization_code";
        lib.request({
          url: url,
          method: "GET"
        }).task.then(res => {
          this.setData({
            openid: res.data.openid,
          })
        }).then(res => {
          // 获取初始数据 
          this.getData()
        })
        
      }
    })


    // 初始化语言
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })

    // 载入时设置初始页面的navBar title
    wx.setNavigationBarTitle({
      title: this.data.pageName[this.data.active],
    }),

    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          name: res.userInfo.userNickName
        })
      }
    })
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
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
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

    await this.getUserInfo()

    await this.getProjectInfo()

    var idx
    for (idx in this.data.project) {
      await this.getTaskInfo(this.data.project[idx]._id)
      console.log(this.data.project[idx])
    }
    
  },
  
  // 获取user信息
  getUserInfo() {
    return new Promise((resolve, reject) => {
      db.collection('user')
      .where({
        openid: _.eq(this.data.openid)
      })
      .get()
      .then(res => {
        this.setData({
          user: res.data[0]
        })
        resolve("成功获取用户数据");
      })
      .catch(err => {
        reject("请求用户信息失败")
      })  
    })
    
  },

  // 获取项目信息
  getProjectInfo() {
    return new Promise((resolve, reject) => {
      db.collection('project')
      .where(_.or([
        {
          houseOwner: _.eq(this.data.user._id)
        },
        {
          projectManager: _.eq(this.data.user._id)
        }
      ]))
      .get()
      .then(res => {
        console.log(res.data[0])
        this.data.project.push(res.data[0])
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
        this.data.task.push(res.data[0])
        resolve("成功获取任务信息")
      })
      .catch(err => {
        reject("请求任务信息失败")
      })
    })
  },

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
   * Create Project page's method
   */
  clickNewProject(event) {
    wx.navigateTo({
      url: '../project/newProject/newProject',
    })
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
  clickMyTask(event) {
    wx.navigateTo({
      url: '../project/taskInfo/taskInfo',
    })
  },

  clickStatisticReport(event) {
    wx.navigateTo({
      url: '../project/statisticReport/statisticReport',
    })
  },

  clickProject(event) {
    wx.navigateTo({
      url: '../project/projectInfo/projectInfo?id=' +  event.currentTarget.dataset.id,
    })
  },

  clickNewProject(event) {
    wx.navigateTo({
      url: '../project/newProject/newProject',
    })
  },

   
  /**
   * Dashboard page's method
   */
  clickTask(event) {
    wx.navigateTo({
      url: '../project/taskInfo/taskInfo?id=' +  event.currentTarget.dataset.id,
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
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  
  onSetting: function(){
    wx.navigateTo({
      url: '../more/setting/setting',
    })
  },

  onMoreInfo: function(){
    wx.navigateTo({
      url: '../more/moreInfo/moreInfo',
    })
  },


  // 点击language展示选项
  onChangeLan(event) {
    console.log('check')
    wx.navigateTo({
      url: '../more/languageSetting/languageSetting',
    })
  },

  
})