/*
 * Code written by team
 * Code created by: Zixiang HU
 * Code Modified by: Zixiang HU
 */
var Languague = {
  // 首页
  index: {
   // page name
    message_page: "Message",
    project_page: "Projects",
    dashboard_page: "Dashboard",
    more_page: "More",
    task_info: "Task Information",
    project_info: "Project Information",
    page_name_for_pm: ['Message', 'Project', 'More'],
    page_name: ['Dashboard', 'More'],
    new_project: "New Project",

    // message page
    notification: "Newest Notification",
    recent_message: "Recent Message",
    no_feedback: "No feedback",

    // project page
    my_task: "My Task",
    statistic_report: "Statistics Report",
    project_statistic_report: "Project's statistic report",
    my_project: "My project",
    project_list: "Projects",
    create_new_project: "Create New Project",
    comment_list: "Comment List",
    view_gantt_diagram: "View gantt diagram",

    // dashboard page
    today_task: "Today's Task",     
    task_list: "Task List",
    filter: "Sort Task",
    select_sort: "Sort By",
    time: "Time",
    priority: "Priority",

    // more page
    user_name: "User name",
    identity: "Identity",
    setting: "Setting",
    more: "More",
    sign_out: "Sign Out",
    invite_member: "Invite Member",
    language: "Language",
    more: "More Information",
    setting: "Setting",
    user_info: "User Info",
    confirm: "Confirm",
    cancel: "Cancel",
    worker: "Worker",
    project_manager: "Project Manager",
    share: "Share",
    save: "Save",
    original_user_name: "OriginalName",
    new_user_name: "NewName",
    changetip: "Input New Name",
    successname: "Successfully Change",
    columns: ["House Owner", "Project Manager", "Worker"],
    description0:"Invite New Project Manager",
    description1:"Invite New Worker",
    description2:"Invite New House Owner",
    
    // about page
    about_button: "About",
    current_version: "Current Version",
    official_phone: "Official Tel.",
    revisions: "Revisions",
    check_for_update: "Check for Updates",
    group_member: "Group Member",
    group_members: "Member",
    group_leader: "Leader",

     // language setting page
    current_lan: "Current language",
    available_lan: "Available language",
    choose: "Choose",
    success_change: "Change successful",
    change_lan_confirm: "Confirm change language",
    
    // Project information page
    project_manager: "Project Manager",
    project_info: "Project Information",
    task_management: "Task Management",
    gantt_diagram: "Gantt Diagram",
    owner: "Owner",
    start_time: "Start Time",
    end_time: "End Time",
    expected_start_time: "Expected Start Time",
    expected_end_time: "Expected End Time",
    current_phase: "Current Phase",
    phase_description: "Phase Description",
    description: "Description",
    description_hint: "less than 500 words",
    state_information: "State Information",
    current_state: "Current State",
    current_state_description: "Current State Description",
    task_progress: "Task Progress",
    completed: "Completed",
    delayed: "Delayed",
    unstarted: "Unstarted",
    progressing: "Progressing",
    total: "Total",
    create_new_task: "Create New Task",
    add_comment: "Add Comment",

    // Task information page
    basic_info: "Basic Information",
    belong_to: "Belong To",
    stage_of_project: "Stage Of Project",
    tag: "Tag",
    participant: "Participant",
    reworking: "Reworking",
    related_photo: "Related photos",
    update_state_history: "Updaate task state history",
    phase: "Phase",


    // New task page
    task_name: "Task Name",
    cancel: "Cancel",
    select_priority: "Select Priority",

    // New project
    project_name: "Project Name",
    enter_name: "Enter name...",
    house_template: ["Townhouse Decoration", "Detached Villa Decoration", "Garden Villa Decoration"],
    house_template_description: ["Townhouses have their own separate gardens to the front and rear, plus a dedicated parking space or garage.", "Detached Villa is a detached house with a high degree of privacy. It has private space above, private garden area and basement below.", "Garden Villa has private gardens and large floor plans for a high level of living comfort."],
    choose_template: "Choose Template",
    choose_start_time: "Choose start time",
    expetced_end_time: "Expected end time",
    expected_duration:"Estimated construction time",
    house_owner: "House Owner",
    description_hint: "less than 200 words",
    choose_period: "Choose period",


    // Comment page
    comment_title:"Feedback",
    select_feedback:"Select feedback type",
    submitErrMsg1:"Feedback type is null",
    submitErrMsg2:"Description is null",
    submitErrMsg3:"No photo uploaded",
    feedback_type0:"Project Delay",
    feedback_type1:"Task Delay",
    feedback_type2:"Task need rework",
    create_comment:"Create comment",
    feedback_type:"Feedback Type",
    creater:"Creater",
    create_time:"Create Time",
    belong_to:"Belong To",

    // Statistic report page
    project_number: "Project number: ",
    task_number: "Task number: ",
    
    // contact list page
    copy_phone_confirm: "Phone number has been copied",
    search: "Search",
    enter_keyword: "Please enter key word of name",
    have_no_project: "No project held",
    have_project: "Held project",

    // Toast message
    null_name: "Name is null",
    null_date_setting: "No date setting",
    null_template_setting: "No template selected",
    null_house_owner: "No house owner selected",
    null_participant: "No participant selected",
    upload_image_success: "Upload image successfully",
    delete_image_success: "Delete image successfully",
    
    // index for worker
    project: ["Project One", "Project Two", "Project Three", "Project Four", "Project Five"],
    task_description: "Task Description",
    task_state: ["Unstarted", "Progressing", "Finished", "Delayed", "Reworking"],
    location: "Location",
    construction_area: "Construction Area",
    construction_requirements: "Extra Construction Requirements",
    start_construction: "Start Construction",
    upload_image_start_construction: "Upload image & Start construction",
    upload_image_finish_construction: "Upload image & Finish construction",
    finish_construction: "Finish Construction",
    finished: "Finished",
    no_project_error: "No project",
    no_assignment_error: "No assignment",
    no_task_error: "No task",
    phase_name: ["Site delivery of demolition and interface treatment", "Getting of more accurate and detailed design plan.", "Remove excess walls.", "Construction setting out for first time.", "Wall Masonry.", "Construction setting out for second time.", "Construction of water and electricity", "Carpentry construction.", "Floor heating installation and floor leveling", "Tiling.", "Oiling construction", "Installation of furnitures.", "Paint repair.", "Clutter disposal.", "Final inspection.", "Other."],
    current_phase_description: ["The project manager gives a technical explanation to the team workers involved in the construction in order to facilitate a more reasonable start of the construction and to avoid accidents caused by unclear explanation.", "Removal of redundant walls.", "Removal of redundant walls.", "First time of setting out, according to the position and height of the object on the design drawings, through specific instruments to confuct field tests.", "Masonry for walls as needed.", "Second time setting out, with higher accuracy.", "Placement of plumbing and electrical pipes.", "Carpenters carry out carpentry work according to the needs of users.", "Make sure the floor is level and then lay the floor heating.", "Laying of tile stone.", "Oiling construction", "Installation and placement of large pieces of furniture", "Repair of peeling paint produced during the installation of furinture", "Disposal of excess building debris in the house", "House owner leaded by project manager to inspect the house see if expectations are met.", "Other."],

 },
};

module.exports = {
   lang: Languague
}
