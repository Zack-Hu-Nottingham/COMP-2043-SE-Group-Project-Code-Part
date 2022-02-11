// pages/project/newTask/newTask.js
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        name: "",
        details: "",

        // Task state 数据格式
        // 0 - unstarted
        // 1 - progressing
        // 2 - finished
        // 3 - delayed
        // 4 - reworking
        // * 5 - accepted

        "taskState":[{
            "name": "Unstarted",
            "value": '0',
        },{
            "name": "Progressing",
            "value": '1',
        },{
            "name": "Finished",
            "value": '2',
        },{
            "name": "Accepted",
            "value": '5'
        },{
            "name": "Reworking",
            "value": '4',
        }],
        "priority":[{
            "name": "high",
            "value": '2'
        },{
            "name": "normal",
            "value": '1'
        },{
            "name": "low",
            "value": '0'
        }],
        selectedPriority: '',
        selectedState: '',
        isLoading: false,
        show: false,
        show2: false,
        startTime: '',
        endTime: '',
        project: "",
        Owner: [],
        fileList: []
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
    // Type the task name
    typeName: function(e){
        this.setData({
            name: e.detail
        })
    },

    // Type task details
    typeDetails: function(e){
        this.setData({
            details: e.detail
        })
    },

    // Change start/end time
    showPopup() {
        this.setData({ show: true });
    },

    onClose() {
        this.setData({ show: false });
    },
    
    formatDate(date) {
        date = new Date(date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      },
    
      onConfirm(event) {
        const [start, end] = event.detail;
        this.setData({
          startTime: this.formatDate(start),
          endTime: this.formatDate(end),
          show: false,
          date: `${this.formatDate(start)} - ${this.formatDate(end)}`,
        });
    
        //调用云函数
        wx.cloud.callFunction({
          name: 'updateProjectDate',
          data:{
            id: id,
            startTime: `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
            endTime: `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`
          }
        }).then(res => {
          console.log('调用云函数成功', res),
          this.getDetail()
        }).catch(res => {
          console.log('调用云函数失败', res)
        })
      },

    changeState: function(){
        var arr = this.data.taskState
        var arrName = new Array()
        for(var i in arr){
            arrName.push(arr[i].name)
        }
        wx.showActionSheet({
            itemList: arrName,
            itemColor: "gray",
            success: (res) =>{
                this.setData({
                    selectedState: arrName[res.tapIndex]
                })
            }
        })
    },
    changePriority: function(){
        var arr = this.data.priority
        var arrName = new Array()
        for(var i in arr){
            arrName.push(arr[i].name)
        }
        wx.showActionSheet({
            itemList: arrName,
            itemColor: "gray",
            success: (res) =>{
                this.setData({
                    selectedPriority: arrName[res.tapIndex]
                })
            }
        })
    },
    afterRead: function(event) {
        const { file } = event.detail;
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        wx.uploadFile({
          url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
          filePath: file.url,
          name: 'file',
          formData: { user: 'test' },
          success(res) {
            // 上传完成需要更新 fileList
            const { fileList = [] } = this.data;
            fileList.push({ ...file, url: res.data });
            this.setData({ fileList });
          },
        });
      },
    formSubmit: function (e) {
        var that = this
        if(this.data.name==""){
            Toast('Name is null');
        }
        else if(this.data.startTime>this.data.endTime){
            Toast('Wrong time setting')
        }
        // else if(this.data.project==""){
        //     Toast('No superior project');
        // }
        // else if(this.data.Owner==""){
        //     Toast('None owner');
        // }
        else if(this.data.details==""){
            Toast('No detail description');
        }
        else{
            this.setData({
                isLoading: true
            })
            setTimeout(function(){
                Toast({
                    forbidClick: 'true',
                    type: 'success',
                    message: 'Success!',
                  });
            },1500)
            setTimeout(function(){
                that.setData({
                    isLoading: false
                })
            },2400)
            setTimeout(function(){
                wx.navigateTo({
                  url: '../task/task',
                })
            },2500)
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
        }
        
    }
})