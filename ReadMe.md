# Dev Convention




</br>


### 颜色

颜色参考：https://www.sioe.cn/yingyong/yanse-rgb-16/

底色：浅背景-深色字 / 深背景-浅色字

文字蓝色：#1296db

图片灰底色：#696969

分割线：#efefef

背景色：#efefef

</br>






### 页面格式

 标题栏文字(navigationBarTitleText)：统一显示当前页面功能
 
</br>





### 代码规范

- 尽量使用Vant Weapp组件库
- 外层同级组件之间空行
- px->rpx
- 格式居中：alignment

</br>




### 数据格式
```
task stage: 
0 - unstarted
1 - progressing
2 - finished
3 - delayed
4 - reworking

task priority:
0 - low
1 - normal
2 - high
```

</br>

### 数据库对象及属性
```
<!-- For project -->
{
    "_id": "",
    "name": "",
    "houseOwner": "",
    "projectManager": "",
    "startTime": "",
    "endTime": "",
    "projectDescription": "None",
    "stateDescription": "None",
    "task": [],
    "unstarted": [],
    "processing": [],
    "completed": [],
    "delayed": [],
    "currentState": "Normal"
}

<!-- For task -->
{
    "_id": "",
    "name": "",
    "startTime": "",
    "endTime": "",
    "state": 0,
    "currentPriority": "Normal",
    "descriptions": "",
    "participants": [],
    "tag": [],
    "stageOfProject": "",
    "belongTo": ""
}

<!-- For house owner -->
{
    "_id": "",
    "name": "",
    "project": "",
    "projectManager": ""
}

<!-- For project manager -->
{
    "_id": "",
    "name": "",
    "project": [],
}
```


