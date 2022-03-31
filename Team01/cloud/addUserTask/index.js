/*
 * Code written by team
 * Code created by: Yuhong Wei
 * Code Modified by: Yuhong Wei
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {

  const _ = cloud.database().command;

  return cloud.database().collection('user')
              .where({
                _openid: _.eq(event.id),
              })
              .update({
                data:{
                  task: _.push(event.task),
                }
              })
  
}