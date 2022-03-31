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

  if(event.state == 0){
    return cloud.database().collection('project')
            .where({
              _id: _.eq(event.id),
            })
            .update({
              data:{
                unstarted: event.count,
              }
            })
  }else if(event.state == 1){
    return cloud.database().collection('project')
            .where({
              _id: _.eq(event.id),
            })
            .update({
              data:{
                progressing: event.count,
              }
            })
  }else if(event.state == 2){
    return cloud.database().collection('project')
            .where({
              _id: _.eq(event.id),
            })
            .update({
              data:{
                completed: event.count,
              }
            })
  }else if(event.state == 3){
    return cloud.database().collection('project')
            .where({
              _id: _.eq(event.id),
            })
            .update({
              data:{
                delayed: event.count,
              }
            })
  }else if(event.state == 4){
    return cloud.database().collection('project')
            .where({
              _id: _.eq(event.id),
            })
            .update({
              data:{
                reworking: event.count,
              }
            })
  }

  
}