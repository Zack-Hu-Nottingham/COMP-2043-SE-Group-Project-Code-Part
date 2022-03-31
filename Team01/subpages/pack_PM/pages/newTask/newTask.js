// pages/project/newTask/newTask.js
/*
 * Code written by team
 * Code created by: Yuzhe ZHANG
 * Code Modified by: Yuzhe ZHANG
 */
import Toast from '../../../../miniprogram_npm/@vant/weapp/toast/toast'
const languageUtils = require("../../../../language/languageUtils");

var app = getApp()
var id = '';
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

        name: "",
        details: "",

        /**
         * Task state format
         * 0 - unstarted
         * 1 - progressing
         * 2 - finished
         * 3 - delayed
         * 4 - reworking
         * * 5 - accepted
         */
        "taskState": [{
            "name": "Unstarted",
            "value": '0',
        }, {
            "name": "Progressing",
            "value": '1',
        }, {
            "name": "Finished",
            "value": '2',
        }, {
            "name": "Accepted",
            "value": '5'
        }, {
            "name": "Reworking",
            "value": '4',
        }],

        selectedPriority: '',
        selectedState: '',
        isLoading: false,
        showDate: false,

        startTime: '',
        endTime: '',

        belongTo: "",
        Owner: [],
        participant: [],
        fileList: [],
        cloudPath: [],

        showPriority: false,
        prioritys: [{
            "name": "high",
            "value": '0'
        }, {
            "name": "normal",
            "value": '1'
        }, {
            "name": "low",
            "value": '2'
        }],
    },

    /**
     * Life cycle function - listens for page loads
     */
    onLoad: function (options) {

        this.setData({
            belongTo: options.id
        })

        /** 
         *  Initial language
         */
        var lan = wx.getStorageSync("languageVersion");
        this.initLanguage();
        this.setData({
            language: lan
        })

        /** 
         * setting
         */
        wx.setNavigationBarTitle({
            title: this.data.dictionary.create_new_task,
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

    },
    /**
     * Type the task name
     */
    typeName: function (e) {
        this.setData({
            name: e.detail
        })
    },


    /**
     * Type task details
     */
    typeDetails: function (e) {
        this.setData({
            details: e.detail
        })
    },


    /**
     *  Change start/end time
     */
    showDatePopup() {
        this.setData({
            showDate: true
        });
    },

    onDateClose() {
        this.setData({
            showDate: false
        });
    },

    formatDate(date) {
        date = new Date(date);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },

    onDateConfirm(event) {
        const [start, end] = event.detail;
        this.setData({
            startTime: this.formatDate(start),
            endTime: this.formatDate(end),
            show: false,
            date: `${this.formatDate(start)} - ${this.formatDate(end)}`,
        });
        this.onDateClose()
    },

    changePriority: function () {
        this.setData({
            showPriority: true,
        })
    },

    onClosePriority() {
        this.setData({
            showPriority: false
        });
    },

    onSelectPriority(event) {
        // console.log(event.detail.value);
        this.setData({
            selectedPriority: this.data.prioritys[event.detail.value].name
        })
    },
    upload(event){
        const { file } = event.detail;
        var fileList = this.data.fileList;
        fileList.push({
          url: file.url
        })
        this.setData({
          fileList: fileList
        });
        // this.uploadImage(file.url)
      },

    uploadImage(fileURL) {
        wx.cloud.uploadFile({
            cloudPath: 'task/' + id + '/' + new Date().getTime() + Math.floor(9 * Math.random()) + '.png',
            filePath: fileURL,
            success: res => {
                var cloudList = this.data.cloudPath;
                cloudList.push(res.fileID);
                this.setData({
                    cloudPath: cloudList
                })
                this.updateCloudList();
                // console.log("图片上传成功", res)
            },
            fail: console.error
        })
    },
    updateCloudList() {
        // console.log(this.data.cloudPath)
        db.collection('task')
            .where({
                _id: _.eq(id)
            })
            .update({

                data: {
                    /**
                     * change done to be true
                     */
                    cloudList: this.data.cloudPath
                },
                success: function (res) {
                    // console.log(res)
                }
            })
    },


    selectParticipant() {
        wx.navigateTo({
            url: '../contactList/participantList/participantList',
        })
    },

    formSubmit: function (e) {
        var that = this
        if (this.data.name == "") {
            Toast.fail('Name is null');
        }
        if (this.data.startTime > this.data.endTime) {
            Toast('Wrong time setting')
        } else if (this.data.startTime > this.data.endTime) {
            Toast('Wrong time setting')
        } else if (this.data.startTime == '' || this.data.endTime == '') {

        }
        // else if(this.data.project==""){
        //     Toast('No superior project');
        // }
        // else if(this.data.Owner==""){
        //     Toast('None owner');
        // }
        else if (this.data.details == "") {
            Toast('No detail description');
        } else {
            wx.cloud.database().collection('task')
                .add({
                    data: {
                        belongTo: this.data.belongTo,
                        name: this.data.name,
                        startTime: this.data.startTime,
                        endTime: this.data.endTime,
                        description: this.data.description,
                        currentPriority: this.data.selectedPriority,
                        cloudPath: [],
                        participant: this.data.participant,
                    }
                })
                .then(res => {
                    id = res._id;
                    for (var i = 0; i < this.data.fileList.length; i++) {
                        this.uploadImage(this.data.fileList[i].url);
                    }

                    // console.log('添加成功', res)
                })
                .catch(res => {
                    console.log('添加失败', res)
                })

            this.setData({
                isLoading: true
            })
            setTimeout(function () {
                Toast({
                    forbidClick: 'true',
                    type: 'success',
                    message: 'Success!',
                });
            }, 1500)
            setTimeout(function () {
                that.setData({
                    isLoading: false
                })
            }, 2400)
            setTimeout(function () {
                /*wx.navigateTo({
                  url: '../task/task',
                })*/
                let pages = getCurrentPages();
                let project = pages[pages.length - 2];
                project.go_update();
                wx.navigateBack({
                    delta: 1
                })
            }, 2500)

        }

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

    deleteImg(event) {
        const delIndex = event.detail.index
        const {
            fileList
        } = this.data
        fileList.splice(delIndex, 1)
        this.setData({
            fileList
        })
    }

})