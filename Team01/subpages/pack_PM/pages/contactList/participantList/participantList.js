// pages/project/participantList/participantList.js
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
    result: [],
    owners: [],
    // isManager: 
    // 0 - House Owner
    // 1 - Project Manager
    // 2 - follower
    initial: [],
    list: [],
    searchKey: "",
  },

  onLoad() {

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

    /** 
     *  Initial language
     */
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })
  },

  getList() {
    return new Promise((resolve, reject) => {
      db.collection('user')
        .where({
          identity: _.eq(2)
        })
        .get()
        .then(res => {
          // console.log(res)
          this.setData({
            initial: res.data,
            list: res.data
          })
        })
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

  onChange(event) {
    this.setData({
      result: event.detail,
    });
    //console.log(this.data.owners);
  },

  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },

  toggle(event) {
    if (this.endTime - this.startTime < 350) {
      const {
        index
      } = event.currentTarget.dataset;
      const checkbox = this.selectComponent(`.checkboxes-${index}`);
      checkbox.toggle();
    }
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
    var owners = this.data.owners;

    for (var i = 0; i < this.data.result.length; i++) {
      db.collection('user')
        .where({
          _id: _.eq(this.data.result[i])
        })
        .get()
        .then(res => {
          owners.push(res.data[0].nickName)

          prevPage.setData({
            participant: owners
          })
        })
    }
    // console.log(this.data.owners)


  }
});