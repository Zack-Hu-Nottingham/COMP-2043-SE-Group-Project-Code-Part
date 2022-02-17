// pages/contact/contactList/contactList.js
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
  
    noop() {},
  });