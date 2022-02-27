// pages/more/moreInfo/moreInfo.js

import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        openid : "",
        title:'More Information',
        position:'project manager',
        phonenumber: '10086',
        weixinid:'10010',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        canIUseGetUserProfile: false,
        canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
        show: false,
        value: '', 

    },
    showPopup() {
        this.setData({ show: true });
    },
    
    onClose() {
        this.setData({ show: false});
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

    },
   // forNotice: function (e) {
     // Dialog.confirm({
       // title:'是否修改',
        //customStyle:'display= flex;flex-direction: column;',
        //context: this,
        // title: this.data.dictionary.change_lan_confirm,
        // message: '弹窗内容',
     // })
        //.then(() => {
          // on confirm
       // })
       // .catch(() => {
          // on cancel
         // return
        //});

    //}
    forNotice: function (e) {
      Toast({
        type: 'success',
        message: '提交成功',
        onClose: () => {
           this.setData({ show: false});
          //console.log('执行OnClose函数');
        },
      });
    }
})