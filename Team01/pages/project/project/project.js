var app = getApp()
Page( {  
  data: {
    myTaskNum: 0,
    relMeNum: 0,
    animation4Reward: {},
    animation4Pull: {},
    rewardHidden: true,
    
    project: [],

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
  },

  getDetail(){
    wx.cloud.database().collection('project')
      .get()
      .then(res => {
        this.setData({
          project: res.data,
        })
      })
      .catch(err => {
        console.log('请求失败', err)
      })
  },

})