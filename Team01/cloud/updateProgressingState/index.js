// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

function formatDate(date){
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].join('-')
}

// 云函数入口函数
exports.main = async (event, context) => {
  const currentTime = formatDate(new Date());

  const _ = cloud.database().command;

  return cloud.database().collection('task')
            .where({
              state: _.neq(2),
              state: _.neq(4),
              startTime: _.lt(currentTime),
              endTime: _.gt(currentTime)
            })
            .update({
              data:{
                state: 1,
              }
            })
}