// pages/project/houseOwnerList/houseOwnerList.js
const languageUtils = require("../../../../language/languageUtils");
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
          identity: _.eq(0)
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

  onClick(event) {
    const {
      name
    } = event.currentTarget.dataset;
    this.setData({
      radio: name,
      owner: this.data.list[name].nickName,
    });
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
      houseOwner: this.data.owner
    })
  }
});