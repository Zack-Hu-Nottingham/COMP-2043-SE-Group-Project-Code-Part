// pages/project/taskInfo/taskInfo.js
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'

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
    fileList: [],
    cloudPath: [],

    taskPage: {},
    belongTo: "",
    projectId: "",
    openid: "",


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
            belongTo: res.data.name,
            projectId: res.data._id,
            openid: res.data.projectManager,
          })
        })
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
  },

  startConstruction(){
    db.collection('task')
      .doc(id)
      .update({
        data: {
          state: 1, 
        }
      })
      .catch(err => {
        console.log('请求失败', err)
      })

      wx.cloud.callFunction({
        name: 'updateMessage',
        data: {
          belongTo: this.data.projectId,
          cloudList: this.data.fileList,
          type: {"name" : "任务开始"},
          _openid: this.data.openid
        }
      })
  
      for(var i = 0; i< this.data.fileList.length; i++ ){
        this.uploadImage(this.data.fileList[i].url);
      }
      this.action();
  },

  finishConstruction() {

    db.collection('task')
      .doc(id)
      .update({
        data: {
          state: 2, 
        }
      })
      .catch(err => {
        console.log('请求失败', err)
      })

    wx.cloud.callFunction({
      name: 'updateMessage',
      data: {
        belongTo: this.data.projectId,
        cloudList: this.data.fileList,
        type: {"name" : "任务完成"},
        _openid: this.data.openid
      }
    })

    for(var i = 0; i< this.data.fileList.length; i++ ){
      this.uploadImage(this.data.fileList[i].url);
    }
    this.action();
  },



  upload(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:res => {
        var fileList = this.data.fileList;
        fileList.push({url: res.tempFilePaths[0]});
        this.setData({ fileList: fileList });
        console.log("成功选择图片",fileList);
      }
    })
  },

  uploadImage(fileURL) {
    wx.cloud.uploadFile({
      cloudPath: 'task/'+ id + '/' + new Date().getTime() + Math.floor(9*Math.random()) +'.png', // 上传至云端的路径
      filePath: fileURL, // 小程序临时文件路径
      success: res => {
        var cloudList = this.data.cloudPath;
        cloudList.push(res.fileID);
        this.setData({
            cloudPath: cloudList
        })
        this.updateCloudList();
        console.log("图片上传成功",res)
      },
      fail: console.error
    })
  },

  updateCloudList(){
    // console.log(this.data.cloudPath)
    db.collection('task')
    .where({
        _id: _.eq(id)
    })
    .update({
        // data 传入需要局部更新的数据
        data: {
          // 表示将 done 字段置为 true
          cloudList: this.data.cloudPath
        },
        success: function(res) {
          console.log(res)
        }
      })
  },

  deleteImg(event) {
    const delIndex = event.detail.index
    const { fileList } = this.data
    fileList.splice(delIndex, 1)
    this.setData({
      fileList
    })
  },

  action(){
    //提交动画
    this.setData({
      isLoading: true,
    })
    setTimeout(res =>{
        Toast({
            forbidClick: 'true',
            type: 'success',
            message: 'Success!',
          });
    },1500)
    setTimeout(res =>{
        this.setData({
            isLoading: false
        })
    },2400)
    setTimeout(res =>{
      wx.redirectTo({
        url: '../../indexs/indexForWorker/indexForWorker',
      })
    },2500)
  },

})