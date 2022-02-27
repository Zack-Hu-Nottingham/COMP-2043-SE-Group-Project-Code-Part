// pages/contact/contactList/contactList.js
const languageUtils = require("../../../language/languageUtils");
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({
    // Additional feature: 已被选中的项目在下次展示时会置顶显示（云端调取）
    data: {
        dictionary: {},
        language: 0,
        languageList: ["简体中文", "English"],
        result: [],
        owners: [],
        // isManager: 
        // 0 - House Owner
        // 1 - Project Manager
        // 2 - follower
        list: [],
    },

    onLoad(options){
        //按首字母顺序排序联系人列表(先英后中)
        db.collection('user')
        .orderBy('name','asc')
        .get()
        .then(res => {
            // console.log(res.data)
        })

        this.getList(options.index);

        // 初始化语言
        var lan = wx.getStorageSync("languageVersion");
        this.initLanguage();
        this.setData({
        language: lan
        })
    },

    getList(index){
        return new Promise((resolve, reject) => {
            db.collection('user')
            .where({
              isManager: _.eq(parseInt(index))
            })
            .get()
            .then(res => {
              // console.log(res)
              this.setData({
                list: res.data
              })
            })
          })
    },
  
    onChange(event) {

    //   this.setData({
    //     result: event.detail,
    //   });
      // console.log(this.data.result);
      for(var i=0; i<event.detail.length; i++){
          this.data.result.push(this.data.list[i].id);
      }
      // console.log(this.data.result);
    },

    bindTouchStart: function(e) {
        this.startTime = e.timeStamp;
    },
    bindTouchEnd: function(e) {
        this.endTime = e.timeStamp;
    },

    toggle(event) {
        if(this.endTime  - this.startTime < 350) {
            const { index } = event.currentTarget.dataset;
            const checkbox = this.selectComponent(`.checkboxes-${index}`);
            checkbox.toggle();
        }
    },

    bindLongTap: function (event) {
        const { index } = event.currentTarget.dataset;
        wx.setClipboardData({
            data: this.data.list[index].phone,success: function () {
              wx.showToast({
                title: '已复制用户电话',
                icon: 'none',
                duration: 1000,
              })
            }
        })
  },
    
  
    noop() {},


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
    
    onUnload(){
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面

        var owners = this.data.owners;

        for(var i=0;i<this.data.result.length;i++){
            owners.push(this.data.list[this.data.result[i]]);
        }

        prevPage.setData({
            owner: this.data.results
            // 传回他们的id，并在父页面编译id查询到姓名------
        })

    }
  });