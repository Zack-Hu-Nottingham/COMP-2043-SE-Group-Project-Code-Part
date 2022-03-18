import {
  changLanguage
} from '../../language/languageUtils';

import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

const languageUtils = require("../../language/languageUtils");

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

  },

  onChangeLan(event) {

    Dialog.confirm({
        context: this,
        title: this.data.dictionary.change_lan_confirm,
        confirmButtonText: this.data.dictionary.confirm,
        cancelButtonText: this.data.dictionary.cancel,
      })
      .then(() => {

        this.setData({
          language: event.target.id
        })

        languageUtils.changLanguage()

        this.initLanguage()

        Toast.success(this.data.dictionary.success_change)

      })
      .catch(() => {
        // on cancel
        return
      });

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

  /**
   * Life cycle function - listens for page loads
   */
  onLoad: function (options) {

    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })

  },

})