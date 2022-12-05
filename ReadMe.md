# Dev Convention




</br>


### Color

Color reference: https://www.sioe.cn/yingyong/yanse-rgb-16/

Base color: light background - dark lettering / dark background - light lettering

Text blue: #1296db

Image gray background color: #696969

Dividing line: #efefef

Background color: #efefef

</br>






### Page format

 Title bar text (navigationBarTitleText): unified display of the current page function
 
</br>





### Code specification

- Use Vant Weapp component library as much as possible
- Empty lines between outer sibling components
- px->rpx
- Format centering: alignment

</br>




### Data format
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
### Database objects and properties
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


