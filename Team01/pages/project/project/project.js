var app = getApp()
Page( {  
  data: {
    myTaskNum: 0,
    relMeNum: 0,
    animation4Reward: {},
    animation4Pull: {},
    rewardHidden: true,
    
    project: [{
      name: "project1"
    },{
      name: "project2"
    },{
      name: "project3"
    },{
      name: "project4"
    }]
  },  
  onLoad: function() {
  },
  onReady: function(){
  },
  enterSpecificTask: function (e) {
    wx.navigateTo({
      url: '../task/task'
    })
  },
  createProject: function (e) {
    wx.navigateTo({
      url: '../newProject/newProject'
    })
  },
  enterSpecificPro: function (e) {
    wx.navigateTo({
      url: '../projectInfo/projectInfo'
    })
  },
  enterStatisticReport: function (e) {
    wx.navigateTo({
      url: '../statisticReport/statisticReport'
    })
  }
})