// pages/project/newProject/newProject.js
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'

const languageUtils = require("../../../language/languageUtils");

const templateLib = require("../../../template/template.js");

const db = wx.cloud.database();
const _ = db.command;

var app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        
        // 存放双语
        dictionary: {},
        language: 0,
        languageList: ["简体中文", "English"],

        // 项目描述
        name: "",
        description: "",

        startDate: "",
        endDate: "",

        // 模板选择
        selectedTemplate: '',
        selectedTemplateIndex: '1',
        duration:0,

        isLoading: false,
        fileList: [],
        cloudPath: [],
        houseOwner: "",
        houseOwner_openid: '',
        participant: [],

        project: "",
        task: [],

        currentPhaseDescription: ["阶段1", "阶段2", "阶段3", "阶段4", "阶段5", "阶段6", "阶段7", "阶段8", "阶段9", "阶段10", "阶段11", "阶段12", "阶段13", "阶段14"],
        template: templateLib.template,
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
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 初始化语言
        var lan = wx.getStorageSync("languageVersion");
        this.initLanguage();
        this.setData({
        language: lan
        })
        console.log(this.getOpenid('Lokkk'));
    },

    // 处理用户输入名字
    typeName: function(e){
        this.setData({
            name: e.detail
        })
    },

    // 处理用户输入描述
    typeDescription: function(e){
        this.setData({
            description: e.detail
        })
    },
    
    changeOwner(){
        wx.navigateTo({
          url: '../../project/contactList/houseOwnerList/houseOwnerList',
        })
    },

    changeParticipant(){
      wx.navigateTo({
        url: '../../project/contactList/participantList/participantList',
      })
  },

    // 选择模板
    selectTemplate: function(){
        wx.navigateTo({ url: '../projectTemplate/projectTemplate', })
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
          cloudPath: 'project/'+ this.data.project + '/' + new Date().getTime() + Math.floor(9*Math.random()) +'.png', // 上传至云端的路径
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

    getOpenid(name){
      return new Promise((resolve, reject) => {
        db.collection('user')
        .where({
          nickName: _.eq(name)
        })
        .get()
        .then(res => {
          this.setData({
            houseOwner_openid:res.data[0]._openid,
          })
        })
      })
    },


    // 提交新项目
    formSubmit: function (e) {

        if (this.data.name == "") {
            Toast(this.data.dictionary.null_name);
        }
        else if (this.data.startDate == "" || this.data.endDate == "") {
            Toast(this.data.dictionary.null_date_setting);
        }
        else if (this.data.description == "") {
            Toast(this.data.dictionary.submitErrMsg2);
        }
        else if(this.data.selectedTemplate == ""){
            Toast(this.data.dictionary.null_template_setting)
        }
        else{
          this.getOpenid(this.data.houseOwner);
          // 根据输入先创建一个项目，此时task列表为空
          wx.cloud.database().collection('project')
            .add({
              data:{
                  name: this.data.name,
                  
                  startTime: this.data.startDate,
                  endTime: this.data.endDate,
                  
                  projectDescription: this.data.description,

                  projectManager: app.globalData.userInfo._openid,
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
                  currentPhaseDescription: this.data.currentPhaseDescription,
                  // feedback: [],
                  fileList: [],

              }
            })
            .then(res => {
              this.setData({
                project: res._id
              })
              for(var i = 0; i< this.data.fileList.length; i++ ){
                this.uploadImage(this.data.fileList[i].url);
              }
              

              this.createTask()
              this.action();
              
            })
            .catch(res => {
              console.log('新建项目失败，请联系管理员', res) 
            })
            this.action();

              
        }
        
    },
    updateCloudList(){
      // console.log(this.data.cloudPath)
      db.collection('project')
      .where({
          _id: _.eq(this.data.project)
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
          url: '../../indexs/indexForProjectManager/indexForProjectManager',
        })
      },2500)
    },

    // calendar 的配套method
    onDateDisplay() {
        this.setData({ show: true });
    },
    
    onDateClose() {
        this.setData({ show: false });
    },

    formatDate(date) {
      date = new Date(date);
      // return `${date.getMonth() + 1}/${date.getDate()}`;
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
  
    onDateConfirm(event) {
      const start = event.detail;
      var end = this.addDate(start, this.data.duration)
      this.setData({
          startDate: this.formatDate(start),
          endDate: this.formatDate(end),
      })
      this.onDateClose();
      
    },

    //日期加减法  date参数为计算开始的日期，days为需要加的天数   
    //格式:addDate('2017-1-11',20) 
    addDate: function(date,days){ 
      var d=new Date(date); 
      d.setDate(d.getDate() + days); 
      var m=d.getMonth() + 1; 
      return d.getFullYear()+'-'+ m +'-'+d.getDate(); 
    },    

    // modify the template accordingly
    modifyTemplate() {
      for(var idx in this.data.template) {
        this.data.template[idx].belongTo = this.data.project

        // 修改时间
        this.data.template[idx].startTime = this.data.template[idx].startTime
        this.data.template[idx].endTime = this.data.template[idx].endTime
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

    async createTask() {

      this.modifyTemplate()
      
      for(var idx in this.data.template) {
        // console.log(idx)
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
      const { fileList } = this.data
      fileList.splice(delIndex, 1)
      this.setData({
        fileList
      })
    }
})