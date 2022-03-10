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
    
    // 存放照片
    fileList: [{
      url: 'https://img.yzcdn.cn/vant/leaf.jpg',
      name: '图片1',
    }],

    taskPage: {},
    belongTo: "",


    priority: [
      {
        name: 'High'
      },
      {
        name: 'Normal'
      },
      {
        name: 'Low'
      }
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

    wx.setNavigationBarTitle({
      title: this.data.dictionary.task_info,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  // 获取任务对应信息
  getDetail(){
    db.collection('task')
      .doc(id)
      .get()
      .then(res => {
        this.setData({
          taskPage: res.data,
        })
      })
      .catch(err => {
        console.log('请求失败', err)
      })
      .then(res => {
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

  // 
  afterRead(event) {
    const { file } = event.detail;
    const { fileList = [] } = this.data;
    fileList.push({ ...file });
    this.setData({ fileList });
  },

  // 上传图片
  uploadToCloud() {
    wx.cloud.init();
    const { fileList } = this.data;
    if (!fileList.length) {
      wx.showToast({ title: '请选择图片', icon: 'none' });
    } else {
      const uploadTasks = fileList.map((file, index) => this.uploadFilePromise(`my-photo${index}.png`, file));
      Promise.all(uploadTasks)
        .then(data => {
          wx.showToast({ title: '上传成功', icon: 'none' });
          const newFileList = data.map(item => ({ url: item.fileID }));
          this.setData({ cloudPath: data, fileList: newFileList });
        })
        .catch(e => {
          wx.showToast({ title: '上传失败', icon: 'none' });
          console.log(e);
        });
    }
  },

  uploadFilePromise(fileName, chooseResult) {
    return wx.cloud.uploadFile({
      cloudPath: fileName,
      filePath: chooseResult.url
    });
  }
})