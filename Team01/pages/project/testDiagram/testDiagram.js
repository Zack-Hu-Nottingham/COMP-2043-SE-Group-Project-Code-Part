// pages/project/testDiagram/testDiagram.js
var util = require('../../../utils/util.js');
var id = '';
var ganttURL = 'http://120.25.227.183/';
var ganttPATH = '../../../ganttData/testData.json';

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        id = options.id;
    //     wx.uploadFile({
    //       url: ganttURL,
    //       filePath: ganttPATH,
    //       name: 'audioFile',//这里是上传音频文件类型，按照需求填写
    //       header: {
    //         'content-type': 'application/json' // 默认值
    //       },
    //       // formData: {
    //       //   'token': token,  //其他额外的formdata，按需求来
    //       // },
    //       success: function (res) {
    //         //坑一：与wx.request不同，wx.uploadFile返回的是[字符串]，需要自己转为JSON格式
    //         //如果不转换，直接用点运算符是获取不到后台返回的值的
    //         let datas = JSON.parse(res.data)
    //         let status = datas.status;
    //         console.log(datas)
    //       },
    //       fail: function (res) {
    //         console.log('failed')
    //       }
    // })
        // wx.uploadFile({
        //   url: 'http://120.25.227.183', //仅为示例，非真实的接口地址
        //   filePath: '../../../ganttData/testData.json',
        //   name: 'file',
        //   formData: {
        //     // 'user': 'test'
        //   },
        //   success (res){
        //     console.log(res.data)
        //     const data = res.data
        //     //do something
        //   },
        //   fail (res) {
        //     console.log('fail')
        //   }
        // })
        // util.request_method('http://120.25.227.183/data.json', (res) => {
        //   console.log(res)
        //   this.setData({
        //     otherData: res
        //   });
        // });
        wx.request({
            url: 'http://120.25.227.183/data.json', //仅为示例，并非真实的接口地址
            data: {
              data: [
                { id: 1, text: "Project #2", start_date: "01-04-2018", duration: 18, progress: 0.4, open: true },
                { id: 2, text: "Task #1", start_date: "02-04-2018", duration: 8, progress: 0.6, parent: 1 },
                { id: 3, text: "Task #2", start_date: "11-04-2018", duration: 8, progress: 0.6, parent: 1 }
              ],
              links: [
                {id: 1, source: 1, target: 2, type: "1"},
                {id: 2, source: 2, target: 3, type: "0"}
              ]
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success (res) {
              console.log(res.data.data)
            }
          })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})