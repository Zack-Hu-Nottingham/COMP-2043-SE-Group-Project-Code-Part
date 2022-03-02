// pages/project/newProject/projectTemplate/projectTemplate.js
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 基于房型对模板进行分类
        templates:[{
            name: "Townhouse Decoration", // 联排别墅
            content: "More info...",
            duration: 233,
            useFrq: "7", // 使用频率（记录使用次数，数组按照使用频率进行排序）
            id: '1'
        },{
            name: "Detached Villa Decoration", // 独立式别墅
            content: "More info...",
            useFrq: "6",
            id: '2'
        },{
            name: "Garden Villa Decoration", // 花园洋房式住宅
            content: "More info...",
            useFrq: "4",
            id: '3'
        },],
        radio: '',

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    onChange(event) {
        this.setData({
          radio: event.detail,
        });
      },
    
    onClick(event) {
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面
        var templates = this.data.templates;
        var i;
        const { name } = event.currentTarget.dataset;
        this.setData({
          radio: name,
        });
        for(i=0;i<templates.length;i++){
            if(name == i+1){
                prevPage.setData({
                    selectedTemplate: templates[i].name,
                    selectedTemplateIndex: i,
                    duration: templates[i].duration
                });
            }
        }
    },
})
