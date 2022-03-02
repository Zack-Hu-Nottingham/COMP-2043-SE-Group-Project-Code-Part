// pages/project/houseOwnerList/houseOwnerList.js
const languageUtils = require("../../../../language/languageUtils");
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({
    // Additional feature: 已被选中的项目在下次展示时会置顶显示（云端调取）
    data: {
        dictionary: {},
        language: 0,
        languageList: ["简体中文", "English"],
        // isManager: 
        // 0 - House Owner
        // 1 - Project Manager
        // 2 - follower
        initial: [],
        list: [],
        searchKey: "",
        radio: '',
        owner: "",
    },

    onLoad(){

        // console.log(options.index)

        //按首字母顺序排序联系人列表(先英后中)
        db.collection('user')
        .orderBy('nickName','asc')
        .get()
        .then(res => {
            // console.log(res.data)
        })

        this.getList();

        // 初始化语言
        var lan = wx.getStorageSync("languageVersion");
        this.initLanguage();
        this.setData({
        language: lan
        })
    },

    getList(){
        return new Promise((resolve, reject) => {
            db.collection('user')
            .where({
              identity: _.eq(0)
            })
            .get()
            .then(res => {
              console.log(res)
              this.setData({
                initial: res.data,
                list: res.data
              })
            })
          })
    },

    /*监听搜索输入框的值*/
    onSearchChange(event){
      // console.log(event.detail)
      this.setData({
        searchKey: event.detail
      })
    },

    /*输入框搜索商品*/
    onSearch(){
      var newList = [];
      for(var i=0;i<this.data.initial.length;i++){
        if(this.data.initial[i].nickName.indexOf(this.data.searchKey)>=0){
          newList.push(this.data.initial[i]);
        }
      }
      this.setData({
        list: newList
      })
      // console.log(newList)
    },

    onClick(event){
      const { name } = event.currentTarget.dataset;
      this.setData({
        radio: name,
        owner: this.data.list[name].nickName,
      });
      // console.log(this.data.owner);
    },

    bindLongTap(event) {
        const { index } = event.currentTarget.dataset;
        wx.setClipboardData({
            data: this.data.list[index].phone,
            success: res => {
              wx.showToast({
                title: this.data.dictionary.copy_phone_confirm,
                icon: 'none',
                duration: 1000,
              })
            },
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

      // 传回姓名
      prevPage.setData({
        houseOwner: this.data.owner
      })
    }
  });