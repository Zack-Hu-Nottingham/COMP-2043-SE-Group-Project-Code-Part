const languageUtils = require("../../language/languageUtils");

Page({

  /**
   * 页面的初始数据
   */
  data: {

    /**
     * Global data
     */
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
    taskList:[],


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

    this.getData()

    // 测试用，获取login code
    wx.login({
      success: (res) => {
        console.log(res)
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

  clickNotification(event) {
    // wx.navigateTo({
      // url: '',
    // })
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


   
  /**
   * Dashboard page's method
   */
  clickTask(event) {
    console.log(event.target)
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

  getData(){
    wx.cloud.database().collection('messageList').get()
      .then(res => {
        this.setData({
          messageList: res.data
        })
      })
      .catch(err => {
        console.log('请求失败', err)
      }),

    wx.cloud.database().collection('project').get()
      .then(res => {
        this.setData({
          project: res.data
        })
      })
      .catch(err => {
        console.log('请求失败', err)
      }),

    wx.cloud.database().collection('taskList').get()
      .then(res => {
        this.setData({
          taskList: res.data
        })
      })
      .catch(err => {
        console.log('请求失败', err)
      })
  }

})