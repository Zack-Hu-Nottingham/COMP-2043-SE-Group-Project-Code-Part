// pages/project/addComment/addComment.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 存放双语
        dictionary: {},
        language: 0,
        languageList: ["简体中文", "English"],
        selectedFeedback: '',

        showFeedback: false,
        feedbackValue: [{
            "name": "Project Delay",
            "value": '0'
        },{
            "name": "Task Delay",
            "value": '1'
        },{
            "name": "Task need rework",
            "value": '2'
        }],

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 初始化语言
        var lan = wx.getStorageSync("languageVersion");
        this.initLanguage();
        this.setData({
            language: lan
        })

        // 设置
        wx.setNavigationBarTitle({
            title: this.data.dictionary.comment_title,
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

    changeFeedback: function(){
        this.setData({
            showFeedback: true,
        })
    },

    onCloseFeedback() {
        this.setData({ showFeedback: false });
    },

    onSelectFeedback(event) {
        // console.log(event.detail.value);
        this.setData({
            selectedFeedback: this.data.feedbackValue[event.detail.value].name
        })
    },

    formSubmit: function (e) {
        var that = this
        // if(this.data.name == ""){
        //     Toast.fail('Name is null');
        // }
        // if(this.data.startTime > this.data.endTime){
        //     Toast('Wrong time setting')
        // }
        // else if(this.data.startTime > this.data.endTime){
        //     Toast('Wrong time setting')
        // }
        // else if (this.data.startTime == '' || this.data.endTime == '') {

        // }
        // // else if(this.data.project==""){
        // //     Toast('No superior project');
        // // }
        // // else if(this.data.Owner==""){
        // //     Toast('None owner');
        // // }
        // else if(this.data.details==""){
        //     Toast('No detail description');
        // }
        // else{
        //     this.setData({
        //         isLoading: true
        //     })
        //     setTimeout(function(){
        //         Toast({
        //             forbidClick: 'true',
        //             type: 'success',
        //             message: 'Success!',
        //           });
        //     },1500)
        //     setTimeout(function(){
        //         that.setData({
        //             isLoading: false
        //         })
        //     },2400)
        //     setTimeout(function(){
        //         wx.navigateTo({
        //           url: '../task/task',
        //         })
        //     },2500)
            /*wx.request({
                url: '接口路径',
                header: {
                "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                data: { xingming: e.detail.value.xingming, xingbie: e.detail.value.xingbie, aihao: e.detail.value.aihao },
                success: function (res) {
                console.log(res.data);
                if (res.data.status == 0) {
                    wx.showToast({
                    title: '提交失败！！！',
                    icon: 'loading',
                    duration: 1500
                    })
                } else {
                    wx.showToast({
                    title: '提交成功！！！',//这里打印出登录成功
                    icon: 'success',
                    duration: 1000
                    })
                }
                } */
        
        
    },


       // 初始化语言
       initLanguage() {
        var self = this;
        //获取当前小程序语言版本所对应的字典变量
        var lang = languageUtils.languageVersion();

        // 页面显示
        self.setData({
        dictionary: lang.lang.index,
        });
    },
})