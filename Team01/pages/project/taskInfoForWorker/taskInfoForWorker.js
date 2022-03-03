// pages/project/taskInfo/taskInfo.js

const languageUtils = require("../../../language/languageUtils");
const db = wx.cloud.database();
const _ = db.command;
var id = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 存放双语
    dictionary: {},
    language: 0,
    languageList: ["简体中文", "English"],
    
    
    taskPage: {},
    belongTo: "",


    priority: [
      {
        name: 'Highest',
      },
      {
        name: 'High'
      },
      {
        name: 'Normal'
      },
      {
        name: 'Low'
      },
      {
        name: 'Lowest'
      },
    ],
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

    // 获得当前task的id
    id = options.id

    // 根据id获得对应数据
    this.getDetail()

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  

  getDetail(){
    db.collection('task')
      .doc(id)
      .get()
      .then(res => {
        wx.setNavigationBarTitle({
          title: res.data.name,
        }),

        this.setData({
          taskPage: res.data,
        })

      })
      .catch(err => {
        console.log('请求失败', err)
      })
      .then(res => {
        // console.log(this.data.taskPage.belongTo)
       db.collection('project')
        .doc(this.data.taskPage.belongTo)
        .get()
        .then(res => {
          this.setData({
            belongTo: res.data.name
          })
        })
      })
  },

  /**
   * Create Comment page's method
   */
  clickAddComment(event) {
    wx.navigateTo({
      url: '../addComment/addComment',
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
})