// pages/more/moreInfo/moreInfo.js
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
        wx.getUserProfile({
            desc: '展示更多信息', // 声明获取用户更多信息
            success: (res) => {
              // console.log(res)
              this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true,
                name: res.userInfo.userNickName,
                
              })
            }
          })
        wx.setNavigationBarTitle({
          title: this.data.title
        })
        this.setData({
          openid : app.globalData.userInfo._openid
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