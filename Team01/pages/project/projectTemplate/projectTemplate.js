// pages/project/newProject/projectTemplate/projectTemplate.js
var app = getApp()

const languageUtils = require("../../../language/languageUtils");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        
        // 存放双语
        dictionary: {},
        language: 0,
        languageList: ["简体中文", "English"],

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
