// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-2gqr09fl444e3a8c'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection('task')
    .doc(event.id)
    .update({
    data: {
      startTime: event.startTime,
      endTime: event.endTime
      }
    })
}