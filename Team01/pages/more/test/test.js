import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
    onLoad: function (options) {
        // Dialog.alert({
        //   title: '标题',
        //   message: '弹窗内容',
        // }).then(() => 
        {
        //   // on close
        // });

        Dialog.confirm({
          context: this,
          // title: this.data.dictionary.change_lan_confirm,
          // message: '弹窗内容',
        })
          .then(() => {
            // on confirm
          })
          .catch(() => {
            // on cancel
            return
          });
    }
})