var app = getApp()
Page( {  
  data: {
    myTaskNum: 0,
    relMeNum: 0,
    animation4Reward: {},
    animation4Pull: {},
    rewardHidden: true,
  },  
  onLoad: function() {
  },
  onReady: function(){
  },
  enterSpecificTask: function (e) {
    wx.navigateTo({
      url: '../task/task'
    })
    console.log(e)
  },
  createPro: function (e) {
    wx.navigateTo({
      url: '../newProject/newProject'
    })
    console.log(e)
  },
  enterSpecificPro: function (e) {
    wx.navigateTo({
      url: '../projectInfo/projectInfo'
    })
    console.log(e)
  }
})