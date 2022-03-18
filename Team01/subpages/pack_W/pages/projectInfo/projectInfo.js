// subpages/pack_W/pages/projectInfo/projectInfo.js
const languageUtils = require("../../../language/languageUtils");

const app = getApp();

var id = '';

const db = wx.cloud.database();

const _ = db.command;


Page({


  /**
   * Initial data of page
   */
  data: {


    /**
     *  Project Information's data
     */
    //
    task: [],
    taskState: [],

    /**
     * Task state format
     * 0 - unstarted
     * 1 - progressing
     * 2 - finished
     * 3 - delayed
     * 4 - reworking
     * * 5 - accepted
     */
    unstarted: [],
    progressing: [],
    completed: [],
    delayed: [],
    reworking: [],
    accepted: [],

    navbar: [],
    currentTab: 0,
    dictionary: {},
    language: 0,


    project: {},
    userInfo: {},
    houseOwner: "",
    projectManager: "",
    feedback: [],

    /**
     * Task Management's data
     * These data should be filled in when the page is loaded
     */
    startedTask: [],
    notStartedTask: [],
    finishedTask: [],
    // for collapse bar
    activeNames: [],

  },

  /** 
   * Global method
   */

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


  getDetail() {
    db.collection('project')
      .doc(id)
      .get({
        success: res => {

          this.setData({
              project: res.data,
              name: res.data.name,
              fileList: res.data.fileList,
              feedback: res.data.feedback,
            }),

            wx.setNavigationBarTitle({
              title: this.data.name,
            }),

            this.getHouseOwner()
          this.getProjectManager()
        },
        fail: function (err) {
          // console.log(err)
        }
      })

  },

  getHouseOwner() {
    return new Promise((resolve, reject) => {
      db.collection('user')
        .where({
          _openid: _.eq(this.data.project.houseOwner)
        })
        .get()
        .then(res => {
          // console.log(res.data[0])
          this.setData({
            houseOwner: res.data[0]
          })
        })
    })
  },

  getProjectManager() {
    return new Promise((resolve, reject) => {
      db.collection('user')
        .where({
          _openid: _.eq(this.data.project._openid)
        })
        .get()
        .then(res => {
          // console.log(res.data[0])
          this.setData({
            projectManager: res.data[0]
          })
        })
    })
  },

  /** 
   *  Project Information's method
   */

  formatDate(date) {
    date = new Date(date);
    // return `${date.getMonth() + 1}/${date.getDate()}`;
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },



  /**
   * Life cycle function - listens for page loads
   */
  onLoad: function (options) {


    /** 
     *  Initial language
     */
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })

    /** 
     *  get the id of project
     */
    id = options.id


    this.getDetail()

  },

})