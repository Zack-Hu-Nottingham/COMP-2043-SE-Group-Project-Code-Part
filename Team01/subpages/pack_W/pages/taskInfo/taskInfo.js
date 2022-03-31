// subpages/pack_W/pages/taskInfo/taskInfo.js
/*
 * Code written by team
 * Code created by: Yuzhe ZHANG, Zixiang HU
 * Code Modified by: Yuzhe ZHANG, Zixiang HU
 */
import Dialog from '../../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../../miniprogram_npm/@vant/weapp/toast/toast';

const languageUtils = require("../../../../language/languageUtils");

const app = getApp();

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
    construction_fileList: [],
    fileList: [],
    cloudPath: [],
    feedback: [],

    taskPage: {},
    belongTo: "",
    projectId: "",
    openid: "",
    show: false,
    creater: "",
    createTime: "",
    button_title: "",
    PM_id: "",


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
      language: lan,
      creater: app.globalData.userInfo.nickName,
      createTime:  this.formatDate(new Date()),
    })

    /**
     * get task id
     */
    id = options.id

      const newState = 1;
      db.collection('task')
      .where({
        _id: _.eq(options.id)
      }).update({
        data: {
          state: newState,
        }
      })

    this.getDetail()

    wx.setNavigationBarTitle({
      title: this.data.dictionary.task_info,
    })
    this.setData({
      beforeClose:(action)=>{
        return new Promise((resolve) => {
          if (action === 'confirm'){
            //如果没有填写原因
            if(this.data.construction_fileList.length == 0){
              //保留弹框并提示
              resolve(false);              
              // Toast(this.data.dictionary.submitErrMsg3)
            }else{
              this.updateState();
              this.uploadComment();
              setTimeout(res => {
                this.setData({
                  construction_fileList: [],
                })
                resolve(true);
              }, 2400)
            }
          }else{
            //点击取消按钮关闭弹框
            // console.log('cancel')
            resolve(true);
          }
         });
       },
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
        if(res.data.state==0){
          this.setData({
            button_title: this.data.dictionary.upload_image_start_construction
          })
        }
        else if(res.data.state==1){
          this.setData({
            button_title: this.data.dictionary.upload_image_finish_construction
          })
        }
        this.updateComment();
        this.getFileList(res.data.cloudList)

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
            this.getPM(res.data._id);
            this.setData({
              belongTo: res.data.name,
              projectId: res.data._id,
              openid: res.data.projectManager,
            })

          })
      })
  },

  updateComment(){
    db.collection('feedback')
    .where({
      belongTo: _.eq(id),
      type: {
        value: _.eq("3"),
      }
    })
    .orderBy('time', 'desc')
    .get({
      success: res=>{
        this.setData({
          feedback: res.data,
        })
      }
    })
  },

  getPM(projectId){
    db.collection('project')
    .doc(projectId)
    .field({
        _openid: true,
    })
    .get({
        success: res=>{
            this.setData({
                PM_id: res.data._openid
            })
        }
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

  changeState(){
    this.setData({
      show: true
    })
  },
  uploadComment(){
      wx.cloud.database().collection('feedback')
          .add({
              data: {
                  type: {
                    name: "Update task status",
                    value: "3"
                  },
                  taskName: this.data.taskPage.name,
                  description: this.data.button_title,
                  cloudList: [],
                  belongTo: id,
                  projectId: this.data.projectId,
                  pmId: this.data.PM_id,
                  createTime: this.data.createTime,
                  time: new Date(),
                  isRead: 0,
                  owner: app.globalData.userInfo.nickName,
              }
          })
          .then(res => {
              this.uploadImage(this.data.construction_fileList,res._id)
          })
          .catch(res => {
              console.log('新建评论失败，请联系管理员', res)
          })
  },

  onClose(){
    this.setData({
      show: false
    })
  },

  getFileList(cloudPath) {
    // console.log(cloudPath)
    var newList = [];
    for (var i = 0; i < cloudPath.length; i++) {
      wx.cloud.downloadFile({
        fileID: cloudPath[i]
      }).then(res => {
        newList.push({
          "url": res.tempFilePath
        })
        this.setData({
          fileList: newList
        })
        //console.log(res.tempFilePath)
      })
    }
    // console.log(fileList)
  },
  updateState(){
    console.log(id)
    if(this.data.taskPage.state == 0){
      this.setData({
        taskPage: {
          state: 1,
        }
      })
      var newState = 1;
      db.collection('task')
      .where({
        _id: _.eq(id)
      }).update({
        data: {
          state: newState,
        }
      })
    } 
    else if(this.data.taskPage.state == 1){
      this.setData({
        taskPage: {
          state: 2,
        }
      })
      var newState = 2;
      db.collection('task').doc(id).update({
        data: {
          state: newState,
        }
      })
    }
    
  },

  //upload construction state fb
  upload(event){
    const { file } = event.detail;
    var fileList = this.data.construction_fileList;
    fileList.push({
      url: file.url
    })
    this.setData({
      construction_fileList: fileList
    });
    // this.uploadImage(file.url)
  },

  uploadImage(list,comment_id) {
    var cloudList = [];
    for(var i=0;i<list.length;i++){
      wx.cloud.uploadFile({
        cloudPath: 'feedback/' + this.data.projectId + '/' + id + '/' + new Date().getTime() + Math.floor(9 * Math.random()) + '.png',
        filePath: list[i].url,
        success: res => {
          cloudList.push(res.fileID);
          this.updateCloudList(cloudList,comment_id);
          // console.log("图片上传成功", res)
        },
        fail: console.error
      })
    }
    this.updateComment()
  },

  updateCloudList(fileList,comment_id) {
    // console.log(this.data.cloudPath)
    db.collection('feedback')
      .where({
        _id: _.eq(comment_id)
      })
      .update({
        data: {
          /**
           * set done to be true
           */
          cloudList: fileList
        },
        success: function (res) {
          //console.log(res)
        }
      })
  },

  formatDate(date) {
    date = new Date(date);
    // return `${date.getMonth() + 1}/${date.getDate()}`;
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
},

  deleteImg(event) {
    const delIndex = event.detail.index
    const {
      construction_fileList
    } = this.data
    construction_fileList.splice(delIndex, 1)
    this.setData({
      construction_fileList
    })
  },
  


})