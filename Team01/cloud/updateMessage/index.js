/*
 * Code written by team
 * Code created by: Yuhong Wei
 * Code Modified by: Yuhong Wei
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return await cloud.database().collection('feedback')
    .add({
      data: {
        belongTo: event.belongTo,
        cloudList: event.cloudPath,
        isRead: 0,
        type: event.type,
        _openid: event._openid
      }
    })
}