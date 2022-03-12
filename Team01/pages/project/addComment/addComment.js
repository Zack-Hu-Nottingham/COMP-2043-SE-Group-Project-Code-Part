// pages/project/addComment/addComment.js
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'
const languageUtils = require("../../../language/languageUtils");
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;

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
        selectedFeedback: '',
        selectedIndex: '',

        feedback: [],

        showFeedback: false,
        feedbackType: [],
        fileList: [],
        cloudPath: [],
        details: '',
        id: '',
        feedback_id: '',
        // commentPage: '',
        isLoading: false,

    },

    /**
     * Life cycle function - listens for page loads
     */
    onLoad: function (options) {

        this.setData({
            id: options.id,
            // commentPage: options.index,
        })
        db.collection('task').doc(options.id).get().then(res => {
            this.setData({
                feedback: res.data.feedback,
            })
        })


        /** 
         *  Initial language
         */
        var lan = wx.getStorageSync("languageVersion");
        this.initLanguage();
        this.setData({
            language: lan
        })
        this.setData({
            //feedback type:
            // 0 - Project Delay
            // 1 - Task Delay
            // 2 - Task need rework
            feedbackType: [{
                "name": this.data.dictionary.feedback_type0,
                "value": '0'
            }, {
                "name": this.data.dictionary.feedback_type1,
                "value": '1'
            }, {
                "name": this.data.dictionary.feedback_type2,
                "value": '2'
            }],
        })

        /** 
         *  setting
         */
        wx.setNavigationBarTitle({
            title: this.data.dictionary.comment_title,
        })
    },

    typeDetails: function (e) {
        this.setData({
            details: e.detail
        })
    },

    changeFeedback: function () {
        this.setData({
            showFeedback: true,
        })
    },

    onCloseFeedback() {
        this.setData({
            showFeedback: false
        });
    },

    onSelectFeedback(event) {
        // console.log(event.detail.value);
        this.setData({
            selectedFeedback: this.data.feedbackType[event.detail.value].name,
            selectedIndex: this.data.feedbackType[event.detail.value].value,
        })
    },

    upload() {
        wx.chooseImage({
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                var fileList = this.data.fileList;
                fileList.push({
                    url: res.tempFilePaths[0]
                });
                this.setData({
                    fileList: fileList
                });
                // console.log("成功选择图片",fileList);
            }
        })
    },

    uploadImage(fileURL) {
        wx.cloud.uploadFile({
            /** 
             *  path to upload to cloud
             */
            cloudPath: 'feedback/' + this.data.id + '/' + this.data.feedback_id + '/' + (new Date()).getTime() + Math.floor(9 * Math.random()) + '.png',
            /** 
             *  temporary path
             */
            filePath: fileURL,
            success: res => {
                // cloudPath: []
                var cloudList = this.data.cloudPath;
                cloudList.push(res.fileID);
                this.setData({
                    cloudPath: cloudList
                })
                this.updateCloudList();
                console.log("图片上传成功", res)
            },
            fail: res => {
                console.log("图片上传失败", res)
            }
        })
    },

    formSubmit: function (e) {
        if (this.data.selectedIndex == '') {
            Toast(this.data.dictionary.submitErrMsg1)
        } else if (this.data.details == '') {
            Toast(this.data.dictionary.submitErrMsg2)
        } else {
            wx.cloud.database().collection('feedback')
                .add({
                    data: {
                        /** 
                         *  type of fb
                         */
                        type: this.data.feedbackType[this.data.selectedIndex],
                        /** 
                         *  description of fb
                         */
                        description: this.data.details,
                        /** 
                         *  cloud list
                         */
                        cloudList: [],
                        /** 
                         *  belonged task
                         */
                        belongTo: this.data.id,
                        createTime: this.formatDate(new Date()),
                        isRead: 0,
                    }
                })
                .then(res => {
                    // console.log(res._id)
                    this.setData({
                        feedback_id: res._id
                    })
                    for (var i = 0; i < this.data.fileList.length; i++) {
                        this.uploadImage(this.data.fileList[i].url);
                    }
                    /** 
                     *  Transfer the local cloudPath to the database -> feedback_id ==> cloudList
                     */

                    this.updateDB();
                    this.action();
                })
                .catch(res => {
                    console.log('新建评论失败，请联系管理员', res)
                })
        }

    },
    updateCloudList() {
        // console.log(this.data.cloudPath)
        db.collection('feedback')
            .where({
                _id: _.eq(this.data.feedback_id)
            })
            .update({
                /** 
                 * part of data to upload
                 */
                data: {
                    /** 
                     *  set done to be true
                     */
                    cloudList: this.data.cloudPath
                },
                success: function (res) {
                    console.log(res)
                }
            })
    },
    updateDB() {

        this.data.feedback.push({
            _id: this.data.feedback_id,
            createTime: this.formatDate(new Date()),
        });

        db.collection('task').doc(this.data.id).update({
            /** 
             * part of data to upload
             */
            data: {
                feedback: this.data.feedback
            },
            success: function (res) {
                // console.log(res.data)
            }
        })
    },

    action: function (e) {
        this.setData({
            isLoading: true,
        })
        setTimeout(res => {
            Toast({
                forbidClick: 'true',
                type: 'success',
                message: 'Success!',
            });
        }, 1500)
        setTimeout(res => {
            this.setData({
                isLoading: false
            })
        }, 2400)
        setTimeout(res => {
            var pages = getCurrentPages();
            /** 
             * current page
             */
            var currPage = pages[pages.length - 1];
            /** 
             * former page
             */
            var prevPage = pages[pages.length - 2];
            prevPage.updateComment();

            wx.navigateBack({
                delta: 1
            })
        }, 2500)
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

    formatDate(date) {
        date = new Date(date);
        // return `${date.getMonth() + 1}/${date.getDate()}`;
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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