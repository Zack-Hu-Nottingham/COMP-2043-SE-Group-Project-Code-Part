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

function formatDate(date){
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 云函数入口函数
exports.main = async (event, context) => {

  const currentTime = formatDate(new Date());

  const _ = cloud.database().command;

  return cloud.database().collection('task')
            .where({
              state: _.neq(2),
              state: _.neq(4),
              startTime: _.gt(currentTime)
            })
            .update({
              data:{
                state: 0,
              }
            })

}