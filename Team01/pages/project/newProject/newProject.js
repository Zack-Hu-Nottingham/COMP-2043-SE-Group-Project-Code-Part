// pages/project/newProject/newProject.js
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'

const languageUtils = require("../../../language/languageUtils");

var app = getApp();

const db = wx.cloud.database();

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
        

        isLoading: false,
        fileList: [],
        houseOwner: "",
        owner: [],
        participant: [],
        ownerPage: 0,
        participantPage: 2,

        project: "",
        task: [],
        template: [{
          name: "泥水进场",
          description: "泥水进场包含第一次放样和墙体堆筑",
          belongTo: "",
          currentPriority: "Normal",
          startTime: "",
          endTime: "",
          participant: "",
          state: 0,
          tag: [],
          duration: 2,

        }, {
          name: "水电布管",
          description: "水电布管包含第二次精放样和水电施工",
          belongTo: "",
          currentPriority: "Normal",
          startTime: "",
          endTime: "",
          participant: "",
          state: 0,
          tag: [],
          duration: 2,

        }, {
          name: "木作工程",
          description: "木作工程包含土木施工",
          belongTo: "",
          currentPriority: "Normal",
          startTime: "",
          endTime: "",
          participant: "",
          state: 0,
          tag: [],
          duration: 2,

        }, {
          name: "泥水工程",
          description: "泥水工程包含地暖地面找平和瓷砖、石材进场",
          belongTo: "",
          currentPriority: "Normal",
          startTime: "",
          endTime: "",
          participant: "",
          state: 0,
          tag: [],
          duration: 2,

        }, {
          name: "油漆工程",
          description: "油漆工程包含油工施工、成品安装、油漆修补",
          belongTo: "",
          currentPriority: "Normal",
          startTime: "",
          endTime: "",
          participant: "",
          state: 0,
          tag: [],
          duration: 2,

        }, {
          name: "后期安装项目",
          description: "后期安装项目包含验收、软装摆场",
          belongTo: "",
          currentPriority: "Normal",
          startTime: "",
          endTime: "",
          participant: "",
          state: 0,
          tag: [],
          duration: 2,
          
          
        }]
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
          url: '../../project/contactList/contactList?index='+this.data.ownerPage,
        })
    },

    changeParticipant(){
      wx.navigateTo({
        url: '../../project/contactList/contactList?index='+this.data.participantPage,
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
          cloudPath: 'feedback/'+ this.data.id + '/' + new Date().getTime() +'.png', // 上传至云端的路径
          filePath: fileURL, // 小程序临时文件路径
          success: res => {
            console.log("图片上传成功",res)
          },
          fail: console.error
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
          // 根据输入先创建一个项目，此时task列表为空
          wx.cloud.database().collection('project')
            .add({
              data:{
                  name: this.data.name,
                  startTime: this.data.startDate,
                  endTime: this.data.endDate,
                  projectDescription: this.data.description,
                  projectManager: app.globalData.userInfo._openid,
                  template: this.data.selectedTemplate,
                  houseOwner: this.data.houseOwner,
                  participant: this.data.participant,
                  feedback: [],
                  fileList: this.data.fileList,

                  completed: [],
                  delayed: [],
                  task: [],
                  unstarted: [],
                  progressing: [],

              }
            })
            .then(res => {
              this.setData({
                project: res._id
              })

              // 根据模板创建新的子task
              this.createTask()
              .then(() => {
                this.action();
              })
              .catch(() => {

              })

            })
            .catch(res => {
              console.log('新建项目失败，请联系管理员', res) 
            })
            this.action();

              
        }
        
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
          wx.navigateTo({
            url: '../../index/index',
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
      const [start, end] = event.detail;
      this.setData({
          startDate: this.formatDate(start),
          endDate: this.formatDate(end)
      })
      this.onDateClose();

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
        db.collection('testTask')
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