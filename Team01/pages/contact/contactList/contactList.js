// pages/contact/contactList/contactList.js
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'
Page({
    // Additional feature: 已被选中的项目在下次展示时会置顶显示（云端调取）
    data: {
        result: [],
        list: [{
          //user data
          _id: '1',
          name: 'zzz',
          position: 'Project Manager',
          isProjectManager: '1',
      },{
        //user data
        _id: '2',
        name: 'yyy',
        position: 'House Owner',
        isProjectManager: '0',
    },{
        //user data
        _id: '3',
        name: 'xxx',
        position: 'Construction Team',
        isProjectManager: '2',
    },{
        //user data
        _id: '4',
        name: 'www',
        position: 'Construction Team',
        isProjectManager: '2',
    },{
        //user data
        _id: '5',
        name: 'vvv',
        position: 'Construction Team',
    },],
    contactNumber: '18663358058',
    },
  
    onChange(event) {
        console.log(event.detail)
      this.setData({
        result: event.detail,
      });
    },
  
    toggle(event) {
      const { index } = event.currentTarget.dataset;
      const checkbox = this.selectComponent(`.checkboxes-${index}`);
      checkbox.toggle();
    },

    longTap: function (e) {
        var contactNumber = this.data.contactNumber
        console.log("long tap")
        wx.setClipboardData({
            data: contactNumber,
        })
        Toast('Success')
        // wx.showModal({
        //   title: '提示',
        //   content: '长按事件被触发',
        //   showCancel: false
        // })
  },
  
    noop() {},
  });