/*
 * Code written by team
 * Code created by: Yizhou LIU
 * Code Modified by: Yizhou LIU
 */
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDate(date){
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

function formatDate4YearMotchDay(year, month, day){
  return [year, month, day].map(formatNumber).join('-')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function compareDate(DateOne, DateTwo) {
  var OneMonth = DateOne.substring(5, DateOne.lastIndexOf("-"));
  var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf("-") + 1);
  var OneYear = DateOne.substring(0, DateOne.indexOf("-"));
  var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf("-"));
  var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf("-") + 1);
  var TwoYear = DateTwo.substring(0, DateTwo.indexOf("-"));
  if (Date.parse(OneMonth + "/" + OneDay + "/" + OneYear) > Date.parse(TwoMonth + "/" + TwoDay + "/" + TwoYear)) {
    return true;
  } else {
    return false;
  }
}

function arrayContains(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
}  

function request(params) {
  const { url, method, header, data } = params
  let taskController;
  let task = new Promise((resolve, reject) => {
    taskController = wx.request({
      url,
      header,
      data,
      method,
      success(res) {
        resolve(res)
      },
      
      fail(err) {
        reject({
          msg: '请求失败',
          url,
          method,
          data,
          header,
          err,
        })
      }
    })
  });
  return { task, taskController };
}

function request_method(url, callback)
{
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      callback && callback(res.data);
    }
  });
}



module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatDate4YearMotchDay: formatDate4YearMotchDay,
  formatNumber: formatNumber,
  compareDate: compareDate,
  arrayContains: arrayContains,
  request: request,
  request_method:request_method,
}
