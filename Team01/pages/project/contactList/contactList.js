// pages/project/contactList/contactList.js
Page({
    // Additional feature: 已被选中的项目在下次展示时会置顶显示（云端调取）
    data: {
        dictionary: {},
        language: 0,
        languageList: ["简体中文", "English"],
        result: [],
        owners: [],
        // isManager: 
        // 0 - House Owner
        // 1 - Project Manager
        // 2 - follower
        initial: [],
        list: [],
        pageIndex: '',
        searchKey: "",
    },

    onLoad(options){

        // console.log(options.index)

        //按首字母顺序排序联系人列表(先英后中)
        db.collection('user')
        .orderBy('name','asc')
        .get()
        .then(res => {
            // console.log(res.data)
        })

        this.getList(options.index);
        this.setData({
          pageIndex: options.index,
        })

        // 初始化语言
        var lan = wx.getStorageSync("languageVersion");
        this.initLanguage();
        this.setData({
        language: lan
        })
    },

    getList(index){
        return new Promise((resolve, reject) => {
            db.collection('user')
            .where({
              isManager: _.eq(parseInt(index))
            })
            .get()
            .then(res => {
              // console.log(res)
              this.setData({
                initial: res.data,
                list: res.data
              })
            })
          })
    },

    /*监听搜索输入框的值*/
    onSearchChange(event){
      // console.log(event.detail)
      this.setData({
        searchKey: event.detail
      })
    },
    /*输入框搜索商品*/
    onSearch(){
      var newList = [];
      for(var i=0;i<this.data.initial.length;i++){
        if(this.data.initial[i].name.indexOf(this.data.searchKey)>=0){
          newList.push(this.data.initial[i]);
        }
      }
      this.setData({
        list: newList
      })
      // console.log(newList)
    },
  
    onChange(event) {
      this.setData({
        result: event.detail,
      });
      
      //console.log(this.data.owners);
    },

    bindTouchStart: function(e) {
        this.startTime = e.timeStamp;
    },
    bindTouchEnd: function(e) {
        this.endTime = e.timeStamp;
    },

    toggle(event) {
        if(this.endTime  - this.startTime < 350) {
            const { index } = event.currentTarget.dataset;
            const checkbox = this.selectComponent(`.checkboxes-${index}`);
            checkbox.toggle();
        }
    },

    bindLongTap(event) {
        const { index } = event.currentTarget.dataset;
        wx.setClipboardData({
            data: this.data.list[index].phone,
            success: res => {
              wx.showToast({
                title: this.data.dictionary.copy_phone_confirm,
                icon: 'none',
                duration: 1000,
              })
            },
        })
  },
    noop() {},


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
    
    onUnload(){
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面

        for(var i=0; i<this.data.result.length; i++){
          db.collection('user')
              .where({
                _id: _.eq(this.data.result[i])
              })
              .get()
              .then(res => {
                this.data.owners.push(res.data[0].name)
              })
        }
        // console.log(this.data.owners)

      // 传回姓名
      if(this.data.pageIndex==0){
          prevPage.setData({
            owner: this.data.owners
        })
      }
      else{
          prevPage.setData({
            participant: this.data.owners
        })
      }

    }
  });
