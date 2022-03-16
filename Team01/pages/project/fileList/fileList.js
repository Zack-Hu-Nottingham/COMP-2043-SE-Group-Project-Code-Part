// pages/project/fileList/fileList.js
const languageUtils = require("../../../language/languageUtils");
const db = wx.cloud.database();
const _ = db.command;
var id = '';
var index = '';
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

    feedback: [],
    navigationBar: 'Details',
    feedbackBelongTo: '',
    creater: '',

    show: false,
    clickImg: '',

  },

  /**
   * Store bylingual settings
   */
  onLoad: function (options) {
    // console.log(options)

    /** 
     *  Initial language
     */
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })
    console.log(options)
    db.collection('feedback')
      .where({
        _id: options.id
      })
      .get({
        success: res => {
          console.log(res.data)
          this.setData({
            feedback: res.data[0]
          });
          // console.log(this.data.feedback)
          // console.log(this.data.feedback.cloudList.length)
        }
      })
    this.getBelongTo();

    wx.setNavigationBarTitle({
      title: this.data.navigationBar,
    });
  },

  getBelongTo() {
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
                _id: res.data[0].belongTo
              })
              .field({
                name: true,
              })
              .get({
                success: res => {
                  // console.log(res.data[0])
                  this.setData({
                    feedbackBelongTo: res.data[0].name,
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
                      success: res => {
                        this.setData({
                          creater: res.data[0].nickName
                        })
                      }
                    })
                }
              })
          },
          fail: function (err) {
            //console.log(err)
            reject(err);
          }
        })
    })
  },
  getPhase(index) {
    // console.log(index)
    this.setData({
      phase: this.data.dictionary.current_phase_description[parseInt(index)]
    })
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

  imgShow: function (event) {
    // console.log(event.currentTarget.dataset.src)
    this.setData({
      show: true,
      clickImg: event.currentTarget.dataset.src
    })
  },
  imgClose() {
    this.setData({
      show: false,
    })
  },
  /**
   * Life cycle function - Listens for the page to complete its first rendering
   */
  onReady: function () {

  },

  /**
   * Life cycle function - Listens for page display
   */
  onShow: function () {

  },
  /**
   * Life cycle function - Listens for page hide
   */
  onHide: function () {

  },

  /**
   * Life cycle function - Listens for page unload
   */
  onUnload: function () {
    let pages = getCurrentPages();
    let prePage = pages[pages.length-2];
    prePage.onShow();

  },

  /**
   * Page-specific event handlers - listen for user pull actions
   */
  onPullDownRefresh: function () {

  },

  /**
   * A handler for a pull-down event on the page
   */
  onReachBottom: function () {

  },

  /**
   * Users click on the upper right to share
   */
  onShareAppMessage: function () {

  }
})