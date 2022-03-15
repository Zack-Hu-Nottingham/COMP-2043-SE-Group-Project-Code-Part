// pages/project/newProject/newProject.js
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'

const languageUtils = require("../../../language/languageUtils");

const templateLib = require("../../../template/townhouse/Townhouse.js");
const en_templateLib = require("../../../template/townhouse/en_Townhouse.js");

const detachedLib = require("../../../template/detachedHouse/Detached_House.js");
const en_detachedLib = require("../../../template/detachedHouse/en_Datached_House.js");

const GardenLib = require("../../../template/gardenVilla/Garden_Villa.js");
const en_GardenLib = require("../../../template/gardenVilla/en_Garden_Villa.js");

const db = wx.cloud.database();
const _ = db.command;

var app = getApp();

var start = "";

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
     *  project description
     */
    name: "",
    description: "",

    startDate: "",
    endDate: "",

    /** 
     *  choose template
     */
    selectedTemplate: '',
    selectedTemplateIndex: '1',
    duration: 0,

    isLoading: false,
    fileList: [],
    cloudPath: [],
    houseOwner: "",
    houseOwner_openid: '',
    participant: [],
    participant_openid: [],

    project: "",
    task: [],

    template: "",
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


  /**
   * Life cycle function - listens for page loads
   */
  onLoad: function (options) {

    /** 
     *  Initial language
     */
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })

    wx.setNavigationBarTitle({
      title: this.data.dictionary.new_project,
    })
  },


  typeName: function (e) {
    this.setData({
      name: e.detail
    })
  },

  /** 
   *  enter description
   */
  typeDescription: function (e) {
    this.setData({
      description: e.detail
    })
  },

  changeOwner() {
    wx.navigateTo({
      url: '../../project/contactList/houseOwnerList/houseOwnerList',
    })
  },

  changeParticipant() {
    wx.navigateTo({
      url: '../../project/contactList/participantList/participantList',
    })
  },
  /** 
   *  choose template
   */
  selectTemplate: function () {
    wx.navigateTo({
      url: '../projectTemplate/projectTemplate',
    })
  },
  upload(event){
    const { file } = event.detail;
    var fileList = this.data.fileList;
    fileList.push({
      url: file.url
    })
    this.setData({
      fileList: fileList
    });
    // this.uploadImage(file.url)
  },

  uploadImage(fileURL) {
    wx.cloud.uploadFile({
      cloudPath: 'project/' + this.data.project + '/' + new Date().getTime() + Math.floor(9 * Math.random()) + '.png',
      filePath: fileURL,
      success: res => {
        var cloudList = this.data.cloudPath;
        cloudList.push(res.fileID);
        this.setData({
          cloudPath: cloudList
        })
        this.updateCloudList();
        console.log("图片上传成功", res)
      },
      fail: console.error
    })
  },


  /** 
   * submit new project
   */
  formSubmit: function (e) {

    this.ConfirmTemplate()

    if (this.data.name == "") {
      Toast(this.data.dictionary.null_name);
    } else if (this.data.startDate == "" || this.data.endDate == "") {
      Toast(this.data.dictionary.null_date_setting);
    } else if (this.data.description == "") {
      Toast(this.data.dictionary.submitErrMsg2);
    } else if (this.data.selectedTemplate == "") {
      Toast(this.data.dictionary.null_template_setting)
    } else if (this.data.houseOwner == "" ) {
      Toast(this.data.dictionary.null_house_owner)
    } else if (this.data.participant.length == 0) {
      Toast(this.data.dictionary.null_participant)
    } else {

      wx.cloud.database().collection('project')
        .add({
          data: {
            name: this.data.name,

            startTime: this.data.startDate,
            endTime: this.data.endDate,

            projectDescription: this.data.description,

            houseOwner: this.data.houseOwner_openid,
            participant: this.data.participant,

            //fileList: this.data.fileList,
            cloudList: [],
            template: this.data.selectedTemplate,

            completed: [],
            delayed: [],
            task: [],
            unstarted: [],
            progressing: [],

            currentPhase: 0,
            // feedback: [],
            fileList: [],
          }
        })
        .then(res => {
          this.setData({
            project: res._id
          })
          for (var i = 0; i < this.data.fileList.length; i++) {
            this.uploadImage(this.data.fileList[i].url);
          }

          this.createTask();
          
          // house owner's project list update
          // this.updateOwners(res._id);
          this.action();

        })
        .catch(res => {
          console.log('新建项目失败，请联系管理员', res)
        })
    }
  },

  updateOwners(res_id){
    var newProjectList=[];
    newProjectList.push(res_id);
    console.log(newProjectList)
    db.collection('user').where({
      _openid: _.eq(this.data.houseOwner_openid)
    }).update({
      data:{
        project: newProjectList
      },
      success: res => {
        console.log('[数据库] [更新记录] 成功：',res)
      },
      fail: err => {
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
    // }).update({
    //   data: {
    //     project: ['o_jxV5TAqQjBnhn2BVwEBhfBHbrn']
    //   }
    // }).then(res =>{
    //   console.log(res)
    // })
  },

  updateCloudList() {
    // console.log(this.data.cloudPath)
    db.collection('project')
      .where({
        _id: _.eq(this.data.project)
      })
      .update({
        /** 
         *  set part of data
         */
        data: {
          /** 
           * set done to be true
           */
          cloudList: this.data.cloudPath
        },
        success: function (res) {
          console.log(res)
        }
      })
  },

  action() {
    /** 
     *  animation of submission
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
        url: '../../indexs/indexForProjectManager/indexForProjectManager',
      })
    }, 2500)
  },


  onDateDisplay() {
    this.setData({
      show: true
    });
  },

  onDateClose() {
    this.setData({
      show: false
    });
  },

  formatDate(date) {
    date = new Date(date);
    // return `${date.getMonth() + 1}/${date.getDate()}`;
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },

  onDateConfirm(event) {
    start = event.detail;
    var end = this.addDate(start, this.data.duration)
    this.setData({
      startDate: this.formatDate(start),
      endDate: this.formatDate(end),
    })
    this.onDateClose();
  },

  /** 
   *  Date addition and subtraction date parameter is the date the calculation starts, days is the number of days to be added  
   * format :addDate('2017-1-11',20) 
   */
  addDate: function (date, days) {
    var d = new Date(date);
    d.setDate(d.getDate() + days);
    var m = d.getMonth() + 1;
    return d.getFullYear() + '-' + m + '-' + d.getDate();
  },

  // Modify the template according to the start time of project
  modifyTemplate(startTime) {
    for (var idx in this.data.template) {
      this.data.template[idx].belongTo = this.data.project

      /**
       * Change time
       */
      this.data.template[idx].startTime = this.addDate(startTime, this.data.template[idx].offset)
      this.data.template[idx].endTime = this.addDate(this.data.template[idx].startTime, this.data.template[idx].duration)
    }
  },

  createTaskAccordingToTemplate(idx) {
    return new Promise((resolve, reject) => {
      db.collection('task')
        .add({
          data: this.data.template[idx]
        })
        .then(res => {
          this.setData({
            task: this.data.task.concat(res._id)
          })
          resolve()
        })
        .catch(res => {
          reject()
        })
    })
  },

  // Create a list of tasks according to the template
  async createTask() {

    this.modifyTemplate(start)

    for (var idx in this.data.template) {
      await this.createTaskAccordingToTemplate(idx)
    }

    db.collection('project')
      .doc(this.data.project)
      .update({
        data: {
          task: this.data.task,
          unstarted: this.data.task
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

  // Select template according to current language setting
  ConfirmTemplate(){
    if(this.data.language == 0) {
      if(this.data.selectedTemplate == "Townhouse Decoration"){
        this.setData({
          template: templateLib.townhouse,
        })
      }else if(this.data.selectedTemplate == "Detached Villa Decoration"){
        this.setData({
          template: detachedLib.detached_house,
        })
      }else if(this.data.selectedTemplate == "Garden Villa Decoration"){
        this.setData({
          template: GardenLib.garden_villa,
        })
      }
      // const en_templateLib = require("../../../template/townhouse/en_Townhouse.js");
      // const en_GardenLib = require("../../../template/gardenVilla/en_Garden_Villa.js");
      // const en_detachedLib = require("../../../template/detachedHouse/en_Detached_House.js");
      

    } else {
      if(this.data.selectedTemplate == "Townhouse Decoration"){
        this.setData({
          template: en_templateLib.en_townhouse,
        })
      }else if(this.data.selectedTemplate == "Detached Villa Decoration"){
        this.setData({
          template: en_detachedLib.en_detached_house,
        })
      }else if(this.data.selectedTemplate == "Garden Villa Decoration"){
        this.setData({
          template: en_GardenLib.en_garden_villa,
        })
      }
    }
    
  }
})