// pages/project/fileList/fileList.js
const languageUtils = require("../../../language/languageUtils");
const db = wx.cloud.database();
const _ = db.command;
var id = '';
var index = '';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 存放双语
        dictionary: {},
        language: 0,
        languageList: ["简体中文", "English"],

        feedback:[],
        navigationBar: 'Details',
        feedbackBelongTo: '',
        creater: '',

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      // console.log(options)

        // 初始化语言
        var lan = wx.getStorageSync("languageVersion");
        this.initLanguage();
        this.setData({
            language: lan
        })
        db.collection('feedback')
        .where({
          _id: options.id
        })
        .get({
          success: res =>{
            // console.log(res.data)
            this.setData({
              feedback: res.data[0]
            })
          }
        })
        this.getBelongTo();

        wx.setNavigationBarTitle({
          title: this.data.navigationBar,
        });
    },

    getBelongTo(){
      return new Promise((resolve, reject) => {
        //console.log(this.data.feedback.belongTo)
        db.collection('task')
        .where({
          _id: this.data.feedback.belongTo
        })
        .field({
          belongTo: true,
          phase: true,
        })
        .get({
          success: res => {
            // console.log(res.data[0])
            this.getPhase(res.data[0].phase);
            db.collection('project')
            .where({
              _id:res.data[0].belongTo
            })
            .field({
              name: true,
            })
            .get({
              success: res => {
                // console.log(res.data[0])
                this.setData({
                  feedbackBelongTo:res.data[0].name,
                })
                //console.log(this.data.feedback)
                db.collection('user')
                .where({
                  _openid: this.data.feedback._openid
                })
                .field({
                  nickName: true
                })
                .get({
                  success: res=>{
                    this.setData({
                      creater:res.data[0].nickName
                    })
                  }
                })
              }
            })
          },
          fail: function(err) {
            //console.log(err)
            reject(err);
          }
        })
      })
    },
    getPhase(index){
      // console.log(index)
      this.setData({
        phase: this.data.dictionary.current_phase_description[parseInt(index)]
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
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
     
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

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
    onShareAppMessage: function () {

    }
})