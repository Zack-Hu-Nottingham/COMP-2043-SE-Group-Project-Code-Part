// pages/project/houseOwnerList/houseOwnerList.js
const languageUtils = require("../../../../../language/languageUtils");
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({
  /** 
   * Additional feature: Items that have been selected will be displayed at the top of the next display (cloud fetch)
   */
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
    openid: "",
  },

  onLoad() {
    /** 
     *  Initial language
     */
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })

    // console.log(options.index)

    /** 
     * Alphabetical contact list (English first, then Chinese)
     */

    db.collection('user')
      .orderBy('nickName', 'asc')
      .get()
      .then(res => {
        // console.log(res.data)
      })

    this.getList();

  },

  getList() {
    return new Promise((resolve, reject) => {
      db.collection('user')
        .where({
          identity: _.eq(0)
        })
        .get()
        .then(res => {
          // console.log(res)
          this.setData({
            initial: res.data,
            list: res.data
          })
          this.updateList(res.data);
          
        })
    })
  },
  updateList(list){
    for(var i=0;i<list.length;i++){
      if(list[i].project.length != 0){
        this.setProjectName(i);
        // console.log(i)
      }
    }
  },
  setProjectName(i){
    var list = this.data.list;
    var index = i;
    db.collection('project')
        .where({
          _id: _.eq(list[index].project[0])
        })
        .field({
          name: true,
        })
        .get({
          success: res=>{
            // console.log(res)
            this.setData({
              ['list['+index+'].project[0]']: res.data[0].name,
              ['initial['+index+'].project[0]']: res.data[0].name,
            })
            //console.log(this.data.list)
            //console.log(this.data.initial)
          }
        })
  },


  onSearchChange(event) {
    // console.log(event.detail)
    this.setData({
      searchKey: event.detail
    })
  },


  onSearch() {
    var newList = [];
    for (var i = 0; i < this.data.initial.length; i++) {
      if (this.data.initial[i].nickName.indexOf(this.data.searchKey) >= 0) {
        newList.push(this.data.initial[i]);
      }
    }
    this.setData({
      list: newList
    })
    // console.log(newList)
  },

  onClick(event) {
    const {
      name
    } = event.currentTarget.dataset;
    this.setData({
      radio: name,
      owner: this.data.list[name].nickName,
      openid: this.data.list[name]._openid,
    });
    this.getOpenid(this.data.owner)
    // console.log(this.data.owner);
  },

  bindLongTap(event) {
    const {
      index
    } = event.currentTarget.dataset;
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

  getOpenid(name) {
    return new Promise((resolve, reject) => {
      db.collection('user')
        .where({
          nickName: _.eq(name)
        })
        .get()
        .then(res => {
          this.setData({
            openid: res.data[0]._openid,
          })
          resolve("成功获取openid")
        })
        .catch(err =>{
          reject("获取openid失败")
        })
    })
  },

  onUnload() {
    var pages = getCurrentPages();
    /** 
     * current page
     */
    var currPage = pages[pages.length - 1];
    /** 
     * former page
     */
    var prevPage = pages[pages.length - 2];

    prevPage.setData({
      houseOwner: this.data.owner,
      houseOwner_openid: this.data.openid,
    })

    
  }
});