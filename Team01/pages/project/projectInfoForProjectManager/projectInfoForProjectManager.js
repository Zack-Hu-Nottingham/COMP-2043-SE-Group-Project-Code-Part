// pages/projectInfo/projectInfo.js
const languageUtils = require("../../../language/languageUtils");

const app = getApp();

var id = '';

var projectComment = '0'; //辨别addComment的页面中索引列表是task/project

const db = wx.cloud.database();

const _ = db.command;

const MAX_LIMIT = 20;


Page({

  /**
   * 页面的初始数据
   */
  data: {

    // Project Information's data
    task: [],
    taskState: [],

    // Task state 数据格式
        // 0 - unstarted
        // 1 - progressing
        // 2 - finished
        // 3 - delayed
    unstarted: [],
    progressing: [],
    completed: [],
    delayed: [],
    accepted: [],

    navbar: [],
    currentTab: 0,
    dictionary: {},
    language: 0,

    project: {},
    houseOwner: "",
    projectManager: "",
    feedback: [],
    fileList: [],

    // Task Management's data
    // These data should be filled in when the page is loaded
    startedTask: [],
    notStartedTask: [],
    finishedTask: [],
    // for collapse bar
    activeNames: [],

    countState0Result:0,
    countState1Result:0,
    countState2Result:0,
    countState3Result:0,

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

    // 设置navbar
    this.setData({
      navbar: [this.data.dictionary.project_info, this.data.dictionary.task_management, this.data.dictionary.gantt_diagram]
    })

    // 获取当前project的id
    id = options.id

    // 从数据库中根据id获取数据
    this.getDetail()


    // 获取数据库条数:unstarted
    db.collection('task').where({
      belongTo: id,
      state: 0
    }).count().then(res => {
      this.setData({
        countState0Result : res.total
      })
    })

    // 获取数据库条数:processing
    db.collection('task').where({
      belongTo: id,
      state: 1
    }).count().then(res => {
      this.setData({
        countState1Result : res.total
      })
    })

    // 获取数据库条数:completed
    db.collection('task').where({
      belongTo: id,
      state: 2
    }).count().then(res => {
      this.setData({
        countState2Result : res.total
      })
    })
     
    //获取数据库条数:delayed
    db.collection('task').where({
      belongTo: id,
      state: 3
    }).count().then(res => {
      this.setData({
        countState3Result : res.total
      })
    })
  },

  

  // Global method
    navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    console.log(this.data.currentTab)
    if(this.data.currentTab == 2){
      console.log('success')
      wx.navigateTo({
        url: '../testDiagram/testDiagram?id='+id,
      })
    }

    // 载入task management页面的数据
    if (this.data.currentTab == 1) {
      const state0BatchTimes = Math.ceil(this.data.countState0Result / 20)
      var arraypro=[]
      var x0 = 0;

      //初次循环获取云端数据库的分次数的promise数组
      for (let i = 0; i < state0BatchTimes; i++) {
        db.collection("task").where({
          belongTo: id,
          state: 0
        }).skip(i*20).get().then(res => {
            x0++;
            //console.log(x0);
            for (let j = 0; j < res.data.length; j++) {
              arraypro.push(res.data[j])
            }
            //console.log(arraypro);
            if(x0==state0BatchTimes){
              this.setData({
                unstarted : arraypro
              })
            }
          })
      }

    
      const state1BatchTimes = Math.ceil(this.data.countState1Result / 20)
      var arraypro1=[]
      var x1 = 0

      //初次循环获取云端数据库的分次数的promise数组
      for (let i = 0; i < state1BatchTimes; i++) {
        db.collection("task").where({
          belongTo: id,
          state: 1
        }).skip(i*20).get().then(res => {
            x1++;
            for (let j = 0; j < res.data.length; j++) {
              arraypro1.push(res.data[j])
            }
            if(x1==state1BatchTimes){
              this.setData({
                progressing : arraypro1
              })
            }
          })
        }

    
      const state2BatchTimes = Math.ceil(this.data.countState2Result / 20)
      var arraypro2=[]
      var x2 = 0

      //初次循环获取云端数据库的分次数的promise数组
      for (let i = 0; i < state2BatchTimes; i++) {
        db.collection("task").where({
          belongTo: id,
          state: 2
        }).skip(i*20).get().then(res => {
            x2++;
            for (let j = 0; j < res.data.length; j++) {
              arraypro2.push(res.data[j])
            }
            if(x2==state2BatchTimes){
              this.setData({
                completed : arraypro2
              })
            }
          })
        }
  
  
      const state3BatchTimes = Math.ceil(this.data.countState3Result / 20)
      var arraypro3=[]
      var x3 = 0

      //初次循环获取云端数据库的分次数的promise数组
      for (let i = 0; i < state3BatchTimes; i++) {
        db.collection("task").where({
          belongTo: id,
          state: 3
        }).skip(i*20).get().then(res => {
            x3++;
            for (let j = 0; j < res.data.length; j++) {
              arraypro3.push(res.data[j])
            }
            if(x3==state3BatchTimes){
              this.setData({
                delayed : arraypro3
              })
            }
          })
        }
    }
  },

  
  // Initialize language
  initLanguage() {
    var self = this;
    // 获取当前小程序语言版本所对应的字典变量
    var lang = languageUtils.languageVersion();

    // 页面显示
    self.setData({
      dictionary: lang.lang.index,
    });
  },

  
  // Get detailed info about the project
  getDetail(){
    db.collection('project')
      .doc(id)
      .get({
        success: res => {
          this.setData({
            project: res.data,
            name: res.data.name,
            feedback: res.data.feedback,
          }),
          console.log(res.data.cloudList)
          this.getFileList(res.data.cloudList);

          wx.setNavigationBarTitle({
            title: this.data.project.name,
          }),

          this.getHouseOwner()
          this.getProjectManager()
        },
        fail: function(err) {
          // console.log(err)
        }
      })
    
  },
  
  getFileList(cloudPath){
    // console.log(cloudPath)
    var newList = [];
    for(var i=0;i<cloudPath.length;i++){
      wx.cloud.downloadFile({
        fileID: cloudPath[i]
      }).then(res => {
        newList.push({"url": res.tempFilePath})
        //console.log(res.tempFilePath)
      })
    }
    console.log(newList)
    this.setData({
      fileList: newList
    })
  },

  // Get the info of house owner
  getHouseOwner() {
    db.collection('user')
      .where({
        _openid: _.eq(this.data.project.houseOwner)
      })
      .get()
      .then(res => {
        this.setData({
          houseOwner: res.data[0]
        })
      })
  },

  // Get the info of project manager
  getProjectManager() {
    return new Promise((resolve, reject) => {
    db.collection('user')
      .where({
        _openid: _.eq(this.data.project._openid)
      })
      .get()
      .then(res => {
        this.setData({
          projectManager: res.data[0]
        })
      })
    })
  },

  // Project Information's method

  // Modify the description of project
  onProjectDescriptionBlur: function(e){
    wx.cloud.callFunction({
      name: 'updateProjectDescription',
      data:{
        id: id,
        projectDescription: e.detail.value
      }
    }).then(res => {
      console.log('调用云函数修改项目描述成功', res),
      this.getDetail()
    }).catch(res => {
      console.log('调用云函数修改项目描述失败', res)
    })
  },

  // onDateDisplay() {
  //   this.setData({ show: true });
  // },

  // onDateClose() {
  //   this.setData({ show: false });
  // },

  // formatDate(date) {
  //   date = new Date(date);
  //   // return `${date.getMonth() + 1}/${date.getDate()}`;
  //   return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  // },

  // onDateConfirm(event) {
  //   const [start, end] = event.detail;
  //   this.onDateClose();
  //   //调用云函数，更新数据库中日期
  //   wx.cloud.callFunction({
  //     name: 'updateProjectDate',
  //     data:{
  //       id: id,
  //       startTime: `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
  //       endTime: `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`
  //     }
  //   }).then(res => {
  //     console.log('project日期更新成功', res),
  //     this.getDetail()
  //   }).catch(res => {
  //     console.log('project日期更新失败', res)
  //   })
  // },

  
  // Task Management's method

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  clickNewTask(event) {
    wx.navigateTo({
      url: '../newTask/newTask',
    })
  },


  
  updateComment(){
    db.collection('project')
    .doc(id)
    .get({
      success: res => {
        this.setData({
          feedback: res.data.feedback,
        });
      },
      fail: function(err) {
        // console.log(err)
      }
    })
  },

  go_update(){
    this.getDetail()
  },


  // deleteImg(event) {
  //   const delIndex = event.detail.index
  //   const { fileList } = this.data
  //   fileList.splice(delIndex, 1)
  //   this.setData({
  //     fileList
  //   })
  //   db.collection('project').where({
  //     _id: id
  //   }).update({
  //     data: {
  //       cloudList: cloudList.splice(delIndex, 1)
  //     }
  //   })
  // },
  
  // upload(){
  //   wx.chooseImage({
  //     sizeType: ['original', 'compressed'],
  //     sourceType: ['album', 'camera'],
  //     success:res => {
  //       var fileList = this.data.fileList;
  //       fileList.push({url: res.tempFilePaths[0]});
  //       this.setData({ fileList: fileList });
  //       this.uploadImage(res.tempFilePaths[0]);
  //       // console.log("成功选择图片",fileList);
  //     }
  //   })
  // },

  // // Upload image to cloud
  // uploadImage(fileURL) {
  //     wx.cloud.uploadFile({
  //       cloudPath: 'project/'+ id + '/' + new Date().getTime() + Math.floor(9*Math.random()) + '.png', // 上传至云端的路径
  //       filePath: fileURL, // 小程序临时文件路径
  //       success: res => {
  //         // console.log("图片上传成功",res)
  //       },
  //       fail: console.error
  //     })
  // },



})

