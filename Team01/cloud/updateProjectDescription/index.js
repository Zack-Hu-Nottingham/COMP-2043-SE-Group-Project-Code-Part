// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection('project')
    .doc(event.id)
    .update({
    data: {
      projectDescription: event.projectDescription,
      stateDescription: event.stateDescription
      }
    })
}