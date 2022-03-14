// pages/project/newProject/projectTemplate/projectTemplate.js
var app = getApp()

const languageUtils = require("../../../language/languageUtils");

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


        /**
         * Classification of templates based on room type
         */
        templates: [{
            /**
             * Townhouses
             */
            name: "Townhouse Decoration",
            content: "Townhouses have their own separate gardens to the front and rear, plus a dedicated parking space or garage.",
            duration: 233,
            /**
             * Frequency of use (record the number of times used, the array is sorted by frequency of use)
             */
            useFrq: "7",
            id: '1'
        }, {
            /**
             * Freestanding Villas
             */
            name: "Detached Villa Decoration",
            content: "Detached Villa is a detached house with a high degree of privacy. It has private space above, private garden area and basement below.",
            duration: 90,
            useFrq: "6",
            id: '2'
        }, {
            /**
             * Garden house style residence
             */
            name: "Garden Villa Decoration",
            content: "Garden Villa has private gardens and large floor plans for a high level of living comfort.",
            duration: 90,
            useFrq: "4",
            id: '3'
        }, ],
        radio: '',

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
     * Store bylingual settings
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

    },



    onChange(event) {
        this.setData({
            radio: event.detail,
        });
    },

    onClick(event) {
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];
        var prevPage = pages[pages.length - 2];
        var templates = this.data.templates;
        var i;
        const {
            name
        } = event.currentTarget.dataset;
        this.setData({
            radio: name,
        });
        for (i = 0; i < templates.length; i++) {
            if (name == i + 1) {
                prevPage.setData({
                    selectedTemplate: templates[i].name,
                    selectedTemplateIndex: i,
                    duration: templates[i].duration
                });
            }
        }
    },
})