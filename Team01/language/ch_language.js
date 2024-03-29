/*
 * Code written by team
 * Code created by: Zixiang HU
 * Code Modified by: Zixiang HU
 */
var Languague = {
  // 首页
   index: {
     // page name
     message_page: "消息",
     project_page: "项目",
     dashboard_page: "首页",
     more_page: "更多",
     task_info: "任务信息",
     project_info: "项目信息",
     page_name_for_pm: ['消息', '项目', '更多'],
     page_name: ['首页', '更多'],
     new_project: "新项目",

     // message page
     notification: "最新通知",
     recent_message: "最近的消息",
     no_feedback: "暂无反馈",

     // project page
     my_task: "我的任务",
     statistic_report: "数据报告",
     project_statistic_report: "项目数据报告",
      my_project: "我的家装项目",
     project_list: "项目列表",
     create_new_project: "新建项目",
     comment_list: "评论列表",
     view_gantt_diagram: "查看甘特图",

     // dashboard page
     today_task: "今天的任务",
     task_list: "任务列表",
     filter: "排序",
     select_sort: "选择排序方式",
     time: "时间",
     priority: "优先级",

     // more page
     user_name: "用户名",
     identity: "职位",
     setting: "设置",
     more: "更多",
     sign_out: "登出",
     invite_member: "邀请用户",
     language: "语言",
     more: "更多信息",
     setting: "设置",
     user_info: "用户信息",
     confirm: "确认",
     cancel: "取消",
     worker: "工人",
     project_manager: "项目经理",
     share: "分享",
     save: "保存",
     original_user_name: "旧用户名",
     new_user_name: "新用户名",
     changetip: "请输入新用户名",
     successname: "修改成功",
     description0:"邀请用户为项目管理者",
     description1:"邀请用户为工人",
     description2:"邀请用户为房屋拥有者",
     columns: ["房屋拥有者", "项目管理者", "工人"],

    // about page
    about_button: "关于",
    current_version: "当前版本",
    official_phone: "官方电话",
    revisions: "历史版本",
    check_for_update: "检查更新",
    group_member: "小组成员",
    group_members: "组员",
    group_leader: "组长",

     // language setting page
     current_lan: "当前语言",
     available_lan: "可选语言",
     choose: "选择",
     success_change: "切换成功",
     change_lan_confirm: "确认切换语言",

    // Project information page
    project_manager: "项目管理者",
    project_info: "项目信息",
    task_management: "任务管理",
    gantt_diagram: "甘特图",
    owner: "负责人",
    start_time: "开始时间",
    end_time: "结束时间",
    expected_start_time: "预期开始时间",
    expected_end_time: "预期结束时间",
    current_phase: "当前阶段",
    phase_description: "阶段描述",
    description: "描述",
    description_hint: "少于500字",
    state_information: "状态信息",
    current_state: "当前状态",
    current_state_description: "当前状态描述",
    task_progress: "任务进度",
    completed: "已完成",
    delayed: "延误",
    unstarted: "未开始",
    progressing: "进行中",
    total: "全部",
    create_new_task: "新建任务",
    add_comment: "添加评论",

    // Task information page
    basic_info: "基本信息",
    belong_to: "所属项目",
    stage_of_project: "项目状态",
    tag: "标签",
    participant: "参与者",
   //  reworking: "重加工",
    related_photo: "相关照片",
    update_state_history: "更新任务状态历史记录",
    phase: "阶段",
    

    // New task page
    task_name: "任务名称",
    cancel: "取消",
    select_priority: "选择优先级",

    // New project
    project_name: "项目名称",
    enter_name: "输入名称",
    house_template: ["联排别墅", "独立式别墅", "花园洋房式住宅"],
    house_template_description: ["联排别墅的前后都有自己独立的花园，还有一个专门的停车位或车库。", "独立别墅是一个具有高度私密性的独立房屋。它上面有私人空间，下面有私人花园区和地下室。", "花园别墅拥有私人花园和大面积的平面图，提供高水平的生活舒适度。"],
    choose_template: "选择模板",
    choose_start_time: "选择开始时间",
    expetced_end_time:"预计结束时间",
    expected_duration:"预计工期时长",
    house_owner: "业主",
    description_hint: "不超过200字",
    choose_period: "选择日期",
   
    // Comment page
    comment_title:"反馈",
    select_feedback:"选择反馈类型",
    submitErrMsg1:"反馈类型为空",
    submitErrMsg2:"描述为空",
    submitErrMsg3:"未上传照片",
    feedback_type0:"项目延期",
    feedback_type1:"任务延期",
    feedback_type2:"任务需返工",
    create_comment:"新建评论",
    feedback_type:"反馈类型",
    creater:"创建人",
    create_time:"创建时间",
    belong_to:"所属项目",

    // Statistic report page
    project_number: "项目数量: ",
    task_number: "任务数量: ",


    // contact list page
    copy_phone_confirm: "已复制用户电话",
    search: "搜索",
    enter_keyword: "请输入姓名关键字",
    have_no_project: "无项目",
    have_project: "已有项目",

    // Toast message
    null_name: "名称为空",
    null_date_setting: "未设置日期",
    null_template_setting: "未选择模板",
    null_house_owner: "未选择房主",
    null_participant: "未选择参与者",
    upload_image_success: "上传图片成功",
    delete_image_success: "删除图片成功",

    // index for worker
    project: ["项目一", "项目二", "项目三", "项目四", "项目五"],
    task_description: "任务描述",
    task_state: ["未开始", "进行中", "已完成", "已延期"],
    location: "施工地点",
    construction_area: "施工区域",
    construction_requirements: "额外施工要求",
    start_construction: "开始施工",
    upload_image_start_construction: "上传照片 开始施工",
    upload_image_finish_construction: "上传照片 结束施工",
    finish_construction: "结束施工",
    finished: "已完成",
    no_project_error: "暂无项目",
    no_assignment_error: "暂无任务",
    no_task_error: "暂无任务",
    phase_name: ["现场交底拆改、界面处理", "图纸深化", "拆除", "一次放样", "墙体砌筑", "二次精放样", "水电施工", "木工施工", "地暖、地面找平", "瓷砖、石材", "油工施工", "成品安装", "油漆修补", "杂物处理", "验收、软装摆场", "其他"],
    current_phase_description: ["项目经理针对客户要求向参与施工的团队工人技术性交代，以便于更合理的展开施工，避免交代不清导致的事故", "获得更加精确的房屋信息，", "拆除多余墙体", "第一次放样，根据设计图纸上工程建筑物的平面位置和高度，通过仪器和一定方法在实地进行测试", "根据需要对墙体进行砌筑", "第二次放样，获得更高精度的摆放测试样例", "有关水电管道的布局摆放", "木匠工人根据用户需要进行木工施工", "确保地面平整后铺设地暖", "铺设瓷砖石材", "油工施工", "对于成品的摆放安装", "对成品安装过程中产生的油漆脱落进行修补", "处理房屋内多余建筑杂物", "项目经理带领客户验收，软装摆入家中", "其他"],

   },
};

module.exports = {
   lang: Languague
}