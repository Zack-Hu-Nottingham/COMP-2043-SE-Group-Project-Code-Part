/*
 * Code written by team
 * Code created by: Yizhou LIU
 * Code Modified by: Yizhou LIU
 */
// pages/ganttDiagram/ganttDiagram.js
var id = '';
var redirectPage = '';
var fs = wx.getFileSystemManager();
const db = wx.cloud.database();
const _ = db.command;
var ganttPATH = '../../../ganttData/testData.json';
const app = getApp();

Page({

    /**
     * Initial data of page
     */
    data: {},

    /**
     * Life cycle function - listens for page loads
     */
    onLoad: function (options) {
        id = options.id;
        redirectPage = options.index;
        /**redirectPage:
         * 0 - projectInfo
         * 1 - projectInfoForProjectManager
         * 2 - projectReport
         */

        // wx.cloud.callFunction({
        //   name: 'uploadJSON',
        //   data:{
        //     id: id,
        //     // localPath: ganttPATH,
        //   }
        // }).then(res => {
        //   console.log('gantt_json更新成功', res)
        // }).catch(res => {
        //   console.log('gantt_json更新失败', res)
        // })
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
        if(redirectPage==1){
            wx.redirectTo({
                url: '../../pages/projectInfo/projectInfo?id='+id,
            })
        }
        else if(redirectPage==0){
            wx.redirectTo({
                url: '../../pages/projectReport/projectReport?id='+id,
            })
        }
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