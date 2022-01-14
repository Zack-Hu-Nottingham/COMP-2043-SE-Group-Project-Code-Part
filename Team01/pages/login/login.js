// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:'1', //控制注册，登录，找回密码的控制量
    loginBtnState:'true',
    registerPhoneNumber:'',
    registerPassword:'',
    comeBackPassword:'',
    strLoginUser:'',
    strLoginPassword:'',
    switchChecked:''
  },
  //获取是否记住密码的状态值
  bindSwitchChange:function(e){
    console.log(e)
    var that = this
    var value = e.detail.value
    if(value == true)
    {
      that.setData({
        switchChecked: value,
      })
    }
    else if(value == false) {
      that.setData({
        switchChecked: value,
      })
    }
  },
  //登录手机号判断
  phoneNumber1:function(e){
    console.log(e.detail.value)
    var that = this
    var loginNumber = e.detail.value
    if(loginNumber != '' && loginNumber.length == 11)
    {
      that.setData({
        strLoginUser: loginNumber
      })
      if(that.data.strLoginPassword != '')
      {
        that.setData({
          loginBtnState:false
        })
      }
      else {
        that.setData({
          loginBtnState:true
        })
      }
    }
    else {
      that.setData({
        loginBtnState:true
      })
    }n
  },
  //登录密码判断
  password1:function(e){
    console.log(e.detail.value)
    var that = this
    var loginPassword = e.detail.value
    if(loginPassword!='')
    {
      that.setData({
        strLoginPassword: loginPassword
      })
      if(that.data.strLoginUser != '' && that.data.strLoginUser.length == 11)
      {
        that.setData({
          loginBtnState:false
        })
      }
      else {
        that.setData({
          loginBtnState:true
        })
      }
    }
    else {
      that.setData({
        loginBtnState:true
      })
    }
  },
  //登录
  onlogin:function(e){
    var that = this 
    if(that.data.switchChecked == true)
    {
      wx.setStorageSync('iphone1', that.data.strLoginUser);
      wx.setStorageSync('password1', that.data.strLoginPassword);
      wx.setStorageSync('checkedValue1', that.data.switchChecked);
      wx.setStorageSync('wxlogin1', false);
    }
    else if(that.data.switchChecked == false){
      wx.setStorageSync('iphone1', "");
      wx.setStorageSync('password1', "");
      wx.setStorageSync('checkedValue1', false);
      wx.setStorageSync('wxlogin1', true);
    }
    var getValue = wx.getStorageSync('userAccount')
    if(that.data.strLoginUser == getValue.iphone)
    {
      if(that.data.strLoginPassword == getValue.password) 
      {
        wx.showToast({
          title: 'Login successful',
          icon: 'none',
        })
        wx.switchTab({
          url: '../index/index',
        })
      }
      else{
        wx.showToast({
          title: 'Wrong password',
          icon: 'none',
        })
      }
    }
    else {
      wx.showToast({
        title: 'Number not registered',
        icon: 'none',
      })
    }
  },
  //找回密码手机号判断
  getBack:function(e){
    console.log(e.detail.value)
    var that = this
    var number = e.detail.value
    if(number != '' && number.length == 11)
    {
      that.setData({
        comeBackPassword: number,
        loginBtnState: false
      })
    }
    else {
      that.setData({
        loginBtnState:true
      })
    }
  },
  //找回密码
  combackpassword:function(e){
    var that = this
    var value = wx.getStorageSync('userAccount')
    if(that.data.comeBackPassword == value.iphone)
    {

    }
    else {
      wx.showToast({
        title: 'Number not registered',
      })

    }

  },
  //注册手机号判断
  phoneNumber2:function(e){
    console.log(e.detail.value)
    var that = this
    var newNumber = e.detail.value
    if(newNumber != '' && newNumber.length == 11)
    {
      that.setData({
        registerPhoneNumber: newNumber
      })
      if(that.data.registerPassword != '')
      {
        that.setData({
          loginBtnState:false
        })
      }
      else {
        that.setData({
          loginBtnState:true
        })
      }
    }
    else {
      that.setData({
        loginBtnState:true
      })
    }
  },
  //注册密码判断
  password2:function(e){
    console.log(e.detail.value)
    var that = this
    var newPassword = e.detail.value
    if(newPassword!='')
    {
      that.setData({
        registerPassword: newPassword
      })
      if(that.data.registerPhoneNumber != '' && that.data.registerPhoneNumber.length == 11)
      {
        that.setData({
          loginBtnState:false
        })
      }
      else {
        that.setData({
          loginBtnState:true
        })
      }
    }
    else {
      that.setData({
        loginBtnState:true
      })
    }
  },
  //注册
  formSubmit:function(e){
    console.log(e)
    var obj={}
    obj.iphone = e.detail.value.registerInputNumber
    obj.password = e.detail.value.registerInputPassword
    wx.setStorageSync('userAccount', obj)
    wx.showToast({
      title: 'Registration successful',
      icon: 'none',
    })
    this.setData({
      isLogin:1
    })
  },
  //To sign up
  register:function(e){
    this.setData({
      isLogin:3
    })
  },
  //To retrieve password
  forget:function(e){
    this.setData({
      isLogin:2
    })
  },
  //To log in
  login:function(e){
    this.setData({
      isLogin:1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      strLoginUser: wx.getStorageSync('iphone1'),
      strLoginPassword: wx.getStorageSync('password1'),
      switchChecked: wx.getStorageSync('checkedValue1'),
      loginBtnState: wx.getStorageSync('wxlogin1'),
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