// pages/projectInfo/projectInfo.js
import * as echarts from '../../../ec-canvas/echarts';

const app = getApp()
// line 5-441: function initChart() 甘特图填充信息
function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#fff",


    title: {
      text: "Gantt Diagram(Demo)",
      padding: 15,
      textStyle: {
          fontSize: 17,
          fontWeight: "bolder",
          color: "#333"
      },
      subtextStyle: {
          fontSize: 13,
          fontWeight: "bolder"
      }
    },
    legend: {
      data: ["计划总工期", "施工放线阶段", "施工放样阶段", "项目实施阶段", "项目验收阶段"],
      align: "left",
      top: '5%'
  },
  grid: {
    containLabel: true,
    show: false,
    right: '25%',
    left: '2%',
    bottom: '10%',
    top: '15%'
},
xAxis: {
  type: "time",
  axisLabel: {
      "show": true,
  }
},
yAxis: {
  axisLabel: {
      show: true,
      interval: 0,
      formatter: function(value, index) {
          var last = ""
          var max = 5;
          var len = value.length;
          var hang = Math.ceil(len / max);
          if (hang > 1) {
              for (var i = 0; i < hang; i++) {
                  var start = i * max;
                  var end = start + max;
                  var temp = value.substring(start, end) + "\n";
                  last += temp; //拼接最终的字符串
              }
              return last;
          } else {
              return value;
          }
      }
  },
  data: ["土木工程", "水电工程", "泥水工程"]
},
dataZoom: [{
  type: 'inside'
}, {
  handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
  handleSize: '80%',
  handleStyle: {
      color: '#fff',
      shadowBlur: 3,
      shadowColor: 'rgba(0, 0, 0, 0.6)',
      shadowOffsetX: 2,
      shadowOffsetY: 2
  }
}],

tooltip: {
  trigger: "axis",
  formatter: function(params) {
      var res = "";
      var name = "";
      var start0 = "";
      var start = "";
      var end0 = "";
      var end = "";
      for (var i in params) {
          var k = i % 2;
          if (!k) { //奇数
              name = params[i].seriesName;
              end0 = params[i].data;
              end = end0.getFullYear() + "-" + (end0.getMonth() + 1) + "-" + end0.getDate();
          }
          if (k) { //偶数
              start0 = params[i].data;
              start = start0.getFullYear() + "-" + (start0.getMonth() + 1) + "-" + start0.getDate();
              res += name + " : " + start + "~" + end + "</br>";
          }
      }
      return res;
  }
},
series:[
    //计划总工期 End time:
    {
        name: "计划总工期",
        type: "bar",
        stack: "s0",
        label: {
            normal: {
                show: true,
                color: "#000",
                position: "right",
                formatter: function(params) {
                    return params.seriesName
                }
            }
        },
        itemStyle: {
            normal: {
                color: "#1296db",
                borderColor: "#fff",
                borderWidth: 2
            }
        },
        zlevel: 0,
        //zlevel: -1,
        data: [new Date("2021-05-01"), new Date("2021-03-30"), new Date("2021-03-14")]
    },
    //计划总工期 Start time:
    {
        name: "计划总工期",
        type: "bar",
        stack: "s0",
        itemStyle: {
            normal: {
                color: "white",
            }
        },
        zlevel: 0,
        //zlevel: -1,
        z: 3,
        data: [new Date("2021-04-01"), new Date("2021-02-01"), new Date("2021-01-12")]
    },
    {
        name: "施工放线阶段",
        type: "bar",
        stack: "s1",
        label: {
            normal: {
                show: true,
                color: "#000",
                position: "right",
                formatter: function(params) {
                    return params.seriesName
                }
            }
        },
        itemStyle: {
            normal: {
                color: "#afeeee",
                borderColor: "#fff",
                borderWidth: 2
            }
        },
        //zlevel: -1,
        data: [new Date("2021-04-10"), new Date("2021-02-20"), new Date("2021-01-20")]
    },
    {
        name: "施工放线阶段",
        type: "bar",
        stack: "s1",
        itemStyle: {
            normal: {
                color: "white"
            }
        },
        //zlevel: -1,
        z: 3,
        data: [new Date("2021-04-01"), new Date("2021-02-01"), new Date("2021-01-12")]
    },
    {
        name: "施工放样阶段",
        type: "bar",
        stack: "s2",
        label: {
            normal: {
                show: true,
                color: "#000",
                position: "right",
                formatter: function(params) {
                    return params.seriesName
                }
            }
        },
        itemStyle: {
            normal: {
                color: "#add8e6",
                borderColor: "#fff",
                borderWidth: 2
            }
        },
        //zlevel: -1,
        data: [new Date("2021-04-20"), new Date("2021-03-09"), new Date("2021-01-25")]
    },
    {
        name: "施工放样阶段",
        type: "bar",
        stack: "s2",
        itemStyle: {
            normal: {
                color: "white",
            }
        },
        //zlevel: -1,
        z: 3,
        data: [new Date("2021-04-11"), new Date("2021-02-25"), new Date("2021-01-21")]
    },
    {
        name: "项目实施阶段",
        type: "bar",
        stack: "s3",
        label: {
            normal: {
                show: true,
                color: "#000",
                position: "right",
                formatter: function(params) {
                    return params.seriesName
                }
            }
        },
        itemStyle: {
            normal: {
                color: "#87cefa",
                borderColor: "#fff",
                borderWidth: 2
            }
        },
        //zlevel: -1,
        data: [new Date("2021-04-30"), new Date("2021-03-15"), new Date("2021-02-15")]
    },
    {
        name: "项目实施阶段",
        type: "bar",
        stack: "s3",
        itemStyle: {
            normal: {
                color: "white",
            }
        },
        //zlevel: -1,
        z: 3,
        data: [new Date("2021-04-21"), new Date("2021-03-10"), new Date("2021-01-26")]
    },
    {
        name: "项目验收阶段",
        type: "bar",
        stack: "s4",
        label: {
            normal: {
                show: true,
                color: "#000",
                position: "right",
                formatter: function(params) {
                    return params.seriesName
                }
            }
        },
        itemStyle: {
            normal: {
                color: '#00bfff',
                borderColor: "#fff",
                borderWidth: 2
            }
        },
        //zlevel: -1,
        data: [new Date("2021-05-01"), new Date("2021-03-30"), new Date("2021-03-13")]
    },
    {
        name: "项目验收阶段",
        type: "bar",
        stack: "s4",
        itemStyle: {
            normal: {
                color: 'white',
            }
        },
        //zlevel: -1,
        z: 3,
        data: [new Date("2021-04-30"), new Date("2021-03-15"), new Date("2021-02-16")]
    },
]

  };
  /*var option={
  barWidth: '20%',
  barGap: '10%',
  title: {
    text: '工作流甘特图'
  },
  legend: {
    data: ['计划完成时间', '实际完成时间'],
    left: 150
  },
  xAxis: {
    type: 'time',
    position: "top"
  },

  yAxis: {
    type: "category",
    data: ['测试', '开发', '设计', '总进度']

  },
  tooltip: {
    trigger: 'axis',
    formatter: function(params) {
      var res = params[0].name + "</br>"
      var date0 = params[0].data;
      var date1 = params[1].data;
      var date2 = params[2].data;
      date0 = date0.getFullYear() + "-" + (date0.getMonth() + 1) + "-" + date0.getDate();
      date1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
      date2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
      res += params[0].seriesName + ":" + date0 + "</br>"
      res += params[1].seriesName + ":" + date1 + "</br>"
      res += params[2].seriesName + ":" + date2 + "</br>"
      console.log(params[0]);
      return res;
    }
  },
  series: [
    {
      name: '计划开始时间',
      type: 'bar',
      stack: '总量',
      itemStyle: {
        normal: {
          color: 'rgba(0,0,0,0)'
        }
      },
      data: [
        new Date("2017/09/23"),
        new Date("2017/09/10"),
        new Date("2017/09/1"),
        new Date("2017/09/1"),

      ]
    },
    {
      name: '计划完成时间',
      type: 'bar',
      stack: '总量',
      data: [
        new Date("2017/09/31"),
        new Date("2017/09/20"),
        new Date("2017/09/15"),
        new Date("2017/09/30"),
      ]
    }, {
      name: '实际完成时间',
      type: 'bar',
      stack: '总量',
      data: [
        new Date("2017/09/30"),
        new Date("2017/09/23"),
        new Date("2017/09/14"),
        new Date("2017/09/30"),

      ]
    }
  ]}*/
  

  chart.setOption(option);
  return chart;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "project1",
    owner: "Loc",
    startTime: "2022-01-10",
    endTime: "2023-02-20",
    projectDescription: "None",
    stateDescription: "None",
    currentState: "Normal",
    task: [],
    unstarted: 5,
    processing: 1,
    completed: 1,
    total: 7,
    delayed: 0,
    navbar: ['Project Information', 'Task Management', 'Gantt Diagram'],
    currentTab: 0,
    index: 0,
    query: {},
    option1: [
      { text: 'Not started tasks', value: 0 },
      { text: 'Progressing tasks', value: 1 },
      { text: 'Finished tasks', value: 2 },
    ],  
    value1: 0,
    activeNames: ['1'],
    
    //gantt diagram
    ec: {
      onInit: initChart
    }

  },

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  
  bindStartDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      startTime: e.detail.value
    })
  },

  bindEndDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      endTime: e.detail.value
    })
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  navbarTap: function(e) {
    console.log(e)
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    app.globalData.currentTab = e.currentTarget.dataset.idx;
  },

  changeValue(e) {
    this.setData({
      value1: e.detail
    })
  },

  onshow() {
    this.setData({
      currentTab: app.globalData.currntTab
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData ({
      query: options
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // console.log(this.data.name)
    // console.log(capitalizeFirstLetter(this.data.name))

    wx.setNavigationBarTitle({
      title: capitalizeFirstLetter(this.data.name) 
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function () {
    
  // },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
