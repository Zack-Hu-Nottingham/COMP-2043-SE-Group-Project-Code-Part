### Dev Convention



#### 颜色

颜色参考：https://www.sioe.cn/yingyong/yanse-rgb-16/

底色：浅背景-深色字 / 深背景-浅色字

文字蓝色：#1296db

图片灰底色：#696969

分割线：#efefef

背景色：#efefef



#### 页面格式

 标题栏文字(navigationBarTitleText)：统一显示当前页面功能



#### 代码规范

- 尽量使用Vant Weapp组件库
- 外层同级组件之间空行
- px->rpx
- 格式居中：alignment



#### 数据格式

```
project {
	name: "",
	startTime: "",
	endTime: "",
	task: [],
	owner: "", //responsible person
	member: [], //paticipant
	stage: "",
	template: "", //project template
	
	//number of tasks:
  unstarted: "",
  processing: "",
  completed: "",
  total: "",
  delayed: "",
	
	//unnecessary:
	visibility: "", 
	description: "", //Notes or detailed description
}

task {
  name: "",
  startTime: "",
  endTime: "",
  subtask: [],
	belongTo: "",
  member: [],
  state: "",
  stage: "", //stage of the subordinate project
  
	//unnecessary:
	priority: "",
	description: "",
	//number of subtasks:
  unstarted: "",
  processing: "",
  completed: "",
  total: "",
  delayed: "",
}

subtask {
  name: "",
  startTime: "",
  endTime: "",
  member: [],
  state: "",
  stage: "", //stage of the subordinate project
	belongTo: "",
	
	//unnecessary:
	description: "",
}

"priority":[{
            "name": "Highest",
            "value": 1,
        },{
            "name": "Higher",
            "value": 2,
        },{
            "name": "Normal",
            "value": 3,
        },{
            "name": "Lower",
            "value": 4,
        },{
            "name": "Lowest",
            "value": 5,
        }],

"stage":[{
						"name": "Unstarted",
						"value":"0"
        },{
            "name": "Progressing",
            "value":"1"
        },{
            "name": "Need to rework",
            "value":"2"
        },{
            "name": "Completed",
            "value":"3"
        }],

```

