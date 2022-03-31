/*
 * Code written by team
 * Code created by: Yuhong Wei
 * Code Modified by: Yuhong Wei
 */
// 云函数入口文件
const cloud = require('../updateTaskDate/node_modules/wx-server-sdk')

cloud.init({
  env: 'cloud1-2gqr09fl444e3a8c'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return await cloud.database().collection('task')
    .doc(event.id)
    .update({
    data: {
      currentPriority: event.currentPriority
      }
    })
}