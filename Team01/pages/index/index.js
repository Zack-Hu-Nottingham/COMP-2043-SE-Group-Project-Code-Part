import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

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
    userInfo: {},

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
    todaysTask:[],

    /**
     * More page's data
     */
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

    wx.login()
    .then(res => {

      // showLoading
      Toast.loading({
        message: 'Loading...',
        forbidClick: true,
        mask: true,
      });
      
      if (res.code) { 
        // 根据获取的code换取用户openid
        var url = "https://api.weixin.qq.com/sns/jscode2session?appid=wxd4b06f2e9673ed00&secret=909d4ff30ed2d6e828f73e55a63cd862&js_code=" + res.code + "&grant_type=authorization_code";
        lib.request({
          url: url,
          method: "GET"
        }).task.then(res => {

          // 设置全局的openid
          app.globalData.userInfo._openid = res.data.openid
          this.setData({
            openid: res.data.openid
          })
          
        }).then(res => {

          // 访问数据库，判断该用户是否已经注册
          db.collection('user').where({
            _openid: app.globalData.userInfo._openid
          }).get().then(res => {
            // console.log(res.data)
            // 如果是已知账户
            if (res.data.length != 0) {
              this.getData()

              Toast({
                type: 'success',
                message: 'Logged in',
                onClose: () => {
                },
              });
            }

            // 如果是新账号
            else {
              Toast.clear()

              // 获取账号信息，并注册该账号
              Dialog.confirm({
                context: this,
                title: 'Registration',
                message: 'Your nickName & phone would be used for registration',
                confirmButtonOpenType: "getUserInfo", // 按钮的微信开放能力
              })
            }
          })
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

  // 获得用户信息
  getuserinfo(e) {
    // console.log(e)
    wx.setStorageSync('userInfo', e.detail.userInfo)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo
    })

    // wx.getUserInfo的返回兼容
    wx.setStorageSync('encryptedData', e.detail.encryptedData)
    wx.setStorageSync('iv', e.detail.iv)
    //拿到用户信息后 获取 用户手机号


    // 拿到数据后写入数据库
    db.collection("user").add({
      data: {
        name: this.data.userInfo.nickName,
        // openid: this.data.openid
      }
    })
    .then(res => {
      // console.log(res)

      Toast.success("Successfully registered")
      // 获取数据
      this.getData()
    })


  },


  // 初始化数据
  async getData(openid){

    await this.getInfo()

    await this.getProjectInfo()

    await this.getFeedbackInfo()

    for (var idx in this.data.project) {
      await this.getTaskInfo(this.data.project[idx]._id)
      // console.log(this.data.project[idx])
    }
    this.getTodaysTask()
  },
  
  // 获取user信息
  getInfo() {
    return new Promise((resolve, reject) => {
      db.collection('user')
      .where({
        _openid: _.eq(this.data.openid)
      })
      .get()
      .then(res => {
        // console.log(res)
        this.setData({
          userInfo: res.data[0]
        })
        app.globalData.userInfo = res.data[0]
        // console.log("app data")
        // console.log(app.globalData.userInfo)
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
          houseOwner: _.eq(this.data.userInfo._openid)
        },
        {
          _openid: _.eq(this.data.userInfo._openid)
        }
      ]))
      .get()
      .then(res => {
        if (res.data.length != 0) {
          this.setData({
            project: this.data.project.concat(res.data)
          })
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
        
        resolve("成功获取任务信息")
      })
      .catch(err => {
        reject("请求任务信息失败")
      })
    })
  },

  getTodaysTask() {
    //获取日期
    var currentDate = new Date();
    currentDate.toLocaleDateString();     //获取当前日期
  
    for (var idx in this.data.task) {
      var startDate = new Date(this.data.task[idx].startTime)
      var endDate = new Date(this.data.task[idx].endTime)
      

      if(currentDate >= startDate && currentDate <= endDate) {
        this.setData({
          todaysTask: this.data.todaysTask.concat(this.data.task[idx])
        })
      }
    }
  },

   // 获取反馈信息
   getFeedbackInfo() {
    return new Promise((resolve, reject) => {
      db.collection('project')
      .where({
        _openid: _.eq(this.data.userInfo._openid),
        feedback: _.exists(true)
      })
      .field({
        feedback:true
      })
      .orderBy('feedback.createTime', 'desc')
      .get()
      .then(res => {
        // console.log(res)
      
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
    wx.navigateTo({
      url: '../more/languageSetting/languageSetting',
    })
  },

  // 更新数据
  go_update(){
    this.getData()
  }
  
})