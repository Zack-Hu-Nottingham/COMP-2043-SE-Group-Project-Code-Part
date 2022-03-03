import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

const languageUtils = require("../../../language/languageUtils");

const db = wx.cloud.database();

const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    /**
     * Global data
     */
    userInfo: {},
    isTaskEmpty: true,

    active: 0,
    pageName: ['Dashboard', 'More'],

    // 存放双语
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
    task:[],

    /**
     * More page's data
     */

    changetip: '请输入新用户名',
    name : "",
    show: false,
    value: '',
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
  
    // 设置当前用户
    this.setData({
      userInfo: app.globalData.userInfo
    })
    
    // 获取worker数据
    this.getData()

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
      identity: this.data.dictionary.worker,
      name : app.globalData.userInfo.nickName,
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
    wx.hideHomeButton()

    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })
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
  async getData(){

    // 获取任务列表
    await this.getTaskList()

    // 检查任务列表是否为空，如果为空则返回
    if (this.data.isTaskEmpty) {
      return
    }

    // 根据任务列表获得每个任务的信息
    for (var item in this.data.taskList) {
      await this.getTaskInfo(this.data.taskList[item])
    }

    // 根据所有任务所属的项目进行划分
    var temp = []
    for(var item in this.data.task) {
      var idx = temp.indexOf(this.data.task[item].belongTo)
      if ( idx < 0) {
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

    // 获取项目简要信息
    for (var idx in this.data.project) {
      this.getProjectInfo(this.data.project[idx])
    }
  },

  // 获取项目简要信息
  getProjectInfo(projectId) {
    console.log(projectId)
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

  // 获取任务信息
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
        resolve("成功获取任务信息")
      })
      .catch(err => {
        reject("请求任务信息失败")
      })
    })
  },
  
  // 获取任务列表
  getTaskList() {
    
    return new Promise((resolve, reject) => {
      db.collection('user')
      .where({
        _openid: _.eq(this.data.userInfo._openid)
      })
      .get()
      .then(res => {
        console.log(res.data[0].task)
        if(res.data[0].task != []) {
          this.setData({
            taskList: res.data[0].task,
            isTaskEmpty: false,
          })
        } 
        
        resolve("成功获取项目列表")
      })
      .catch(err => {
        reject("请求项目列表失败")
      })
    }
    )
  },

  clickProject(projectId) {
    console.log(projectId.currentTarget.id)
    wx.navigateTo({
      url: '../../project/projectInfoForWorker/projectInfoForWorker?id='+projectId.currentTarget.id,
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
   * Dashboard page's method
   */
  clickTask(event) {
    wx.navigateTo({
      url: '../../project/taskInfoForWorker/taskInfoForWorker?id=' +  event.currentTarget.dataset.id,
    })
  },


  
  /**
   * More page's method
   */
  


  // 点击language展示选项
  onChangeLan(event) {
    wx.navigateTo({
      url: '../../more/languageSetting/languageSetting',
    })
  },

  // 更新数据
  go_update(){
    this.getData()
  },
  
  //更新用户名
  userNameInput:function(e){
    this.setData({
      value:e.detail.value
    })
  },

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