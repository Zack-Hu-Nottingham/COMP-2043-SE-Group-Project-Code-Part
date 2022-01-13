var app = getApp()
Page( {  
  data: {  
    winWidth: 0,  
    winHeight: 0,  
    currentTab: 1,
    notStartDatas: [],
    notStartTotalNums: 1,
    notStartTaskName: "Task1",
    progressDatas:[],
    progressTotalNums: 1,
    progressTaskName: "Task2",
    doneDatas: [],
    doneTotalNums: 1,
    doneTaskName: "Task3",
    pageSize: 15,
    startTime: "2022/01/10",
  },  
  onShow: function() {  
    var that = this;
    var res = wx.getSystemInfoSync()
    that.setData( {
      winWidth: res.windowWidth,  
      winHeight: res.windowHeight,
      pageSize: Math.floor((res.windowHeight - 80) / 40)
    });
  }, 
  swichNav: function (e) {
    var that = this;
    var currentTab = e.target.dataset.current
    if (this.data.currentTab === currentTab) {
      return false;
    } else {
      that.setData({
        currentTab: currentTab
      })
    }
  },
  createTask: function (e) {
    wx.navigateTo({
      url: '../newTask/newTask'
    })
    console.log(e)
  },
})  
