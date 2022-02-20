// pages/project/fileList/fileList.js
const db = wx.cloud.database();
const _ = db.command;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        fileList: [],
        name: 'Detail images',
        feedbackType: '',
        details: '',
        createTime: '',
        ownerId: '',
        sponsor:'',

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        db.collection('project')
      .doc(options.id)
      .get({
        success: res => {
            var type = 'Project Delay';
            if(res.data.feedback[options.index].type==2){
                type = 'Task Need Rework';
            }
            else if(res.data.feedback[options.index].type==1){
                type = 'Task Delay';
            }

          this.setData({
            fileList: res.data.feedback[options.index].fileList,
            details: res.data.feedback[options.index].details,
            createTime: res.data.feedback[options.index].createTime,
            feedbackType: type,
            ownerId: res.data.feedback[options.index].owner,
          }),

          wx.setNavigationBarTitle({
            title: this.data.name,
          }),
          console.log(this.data.ownerId)
          this.getOwner();
        },
        fail: function(err) {
          console.log(err)
        }
      })
    },
    getOwner() {
        return new Promise((resolve, reject) => {
        db.collection('user')
          .where({
            _openid: _.eq(this.data.ownerId)
          })
          .get()
          .then(res => {
            this.setData({
              sponsor: res.data[0].name
            })
          })
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