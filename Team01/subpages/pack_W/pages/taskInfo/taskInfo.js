// subpages/pack_W/pages/taskInfo/taskInfo.js
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'

const languageUtils = require("../../../language/languageUtils");

const db = wx.cloud.database();

const _ = db.command;

var id = ''

Page({

  /**
   * Initial data of page
   */
  data: {

    /**
     * Store bylingual settings
     */
    dictionary: {},
    language: 0,
    languageList: ["简体中文", "English"],

    /**
     * Store images
     */
    fileList: [],
    cloudPath: [],

    taskPage: {},
    belongTo: "",
    projectId: "",
    openid: "",


    priority: [{
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
   * Life cycle function - listens for page loads
   */
  onLoad: function (options) {

    /**
     * Initial data of page
     */
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })

    /**
     * get task id
     */
    id = options.id


    this.getDetail()

    wx.setNavigationBarTitle({
      title: this.data.dictionary.task_info,
    })
  },

  /**
   * Page-specific event handlers - listen for user pull actions
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * get task infomation
   */
  getDetail() {
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


  /** 
   *  Initial language
   */
  initLanguage() {
    var self = this;
    //Get the dictionary variable corresponding to the current language version of the applet

    var lang = languageUtils.languageVersion();


    /** 
     * show the page
     */
    self.setData({
      dictionary: lang.lang.index,
    });
  },

  // 
  afterRead(event) {
    const {
      file
    } = event.detail;
    const {
      fileList = []
    } = this.data;
    fileList.push({
      ...file
    });
    this.setData({
      fileList
    });
  },


  uploadToCloud() {
    wx.cloud.init();
    const {
      fileList
    } = this.data;
    if (!fileList.length) {
      wx.showToast({
        title: '请选择图片',
        icon: 'none'
      });
    } else {
      const uploadTasks = fileList.map((file, index) => this.uploadFilePromise(`my-photo${index}.png`, file));
      Promise.all(uploadTasks)
        .then(data => {
          wx.showToast({
            title: '上传成功',
            icon: 'none'
          });
          const newFileList = data.map(item => ({
            url: item.fileID
          }));
          this.setData({
            cloudPath: data,
            fileList: newFileList
          });
        })
        .catch(e => {
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          });
          // console.log(e);
        });
    }
  },

  uploadFilePromise(fileName, chooseResult) {
    return wx.cloud.uploadFile({
      cloudPath: fileName,
      filePath: chooseResult.url
    });
  },

  startConstruction() {
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
        type: {
          "name": "任务开始"
        },
        _openid: this.data.openid
      }
    })

    for (var i = 0; i < this.data.fileList.length; i++) {
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
        type: {
          "name": "任务完成"
        },
        _openid: this.data.openid
      }
    })

    for (var i = 0; i < this.data.fileList.length; i++) {
      this.uploadImage(this.data.fileList[i].url);
    }
    this.action();
  },



  upload() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        var fileList = this.data.fileList;
        fileList.push({
          url: res.tempFilePaths[0]
        });
        this.setData({
          fileList: fileList
        });
        // console.log("成功选择图片", fileList);
      }
    })
  },

  uploadImage(fileURL) {
    wx.cloud.uploadFile({
      cloudPath: 'task/' + id + '/' + new Date().getTime() + Math.floor(9 * Math.random()) + '.png',
      filePath: fileURL,
      success: res => {
        var cloudList = this.data.cloudPath;
        cloudList.push(res.fileID);
        this.setData({
          cloudPath: cloudList
        })
        this.updateCloudList();
        // console.log("图片上传成功", res)
      },
      fail: console.error
    })
  },

  updateCloudList() {
    // console.log(this.data.cloudPath)
    db.collection('task')
      .where({
        _id: _.eq(id)
      })
      .update({

        data: {
          /**
           * set done to be true
           */
          cloudList: this.data.cloudPath
        },
        success: function (res) {
          //console.log(res)
        }
      })
  },

  deleteImg(event) {
    const delIndex = event.detail.index
    const {
      fileList
    } = this.data
    fileList.splice(delIndex, 1)
    this.setData({
      fileList
    })
  },

  action() {
    /**
     * submit images
     */
    this.setData({
      isLoading: true,
    })
    setTimeout(res => {
      Toast({
        forbidClick: 'true',
        type: 'success',
        message: 'Success!',
      });
    }, 1500)
    setTimeout(res => {
      this.setData({
        isLoading: false
      })
    }, 2400)
    setTimeout(res => {
      wx.redirectTo({
        url: '../../indexs/indexForWorker/indexForWorker',
      })
    }, 2500)
  },

})