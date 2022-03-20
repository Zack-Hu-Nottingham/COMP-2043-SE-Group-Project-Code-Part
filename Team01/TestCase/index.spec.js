const automator = require('miniprogram-automator')

describe('index', () => {
  let miniProgram
  let page
  let element
  let currentPageIndex

  beforeAll(async () => {
    miniProgram = await automator.launch({
      projectPath: '/Users/edison/Team01/Team01',
      account: 'o_jxV5cv5StM3IW4L-4obHf50dY4'
    })
    //const db = wx.cloud.database();
    page = await miniProgram.reLaunch('/subpages/pack_PM/pages/index/index')
    await page.waitFor(500)
  }, 30000)

  test('get current start page', async () => {
    expect(await page.path).toBe('subpages/pack_PM/pages/index/index')
  },30000);

  test('jump to specific page', async () => {
    await page.setData(
      {
        active: 1
      }
    )
    await miniProgram.redirectTo('/subpages/pack_PM/pages/projectInfo/projectInfo');
    //await page.callMethod('onLoad')
    //获取发起页面 按钮
    // element = await page.$('.clickProjectForTest');
    // //点击发起  点击后跳转到发起页面
    // await element.tap();
    await page.waitFor(500);

    currentPageIndex = await miniProgram.currentPage();
    //验证是否成功跳转到发起页面
    expect(await currentPageIndex.path).toBe('subpages/pack_PM/pages/projectInfo/projectInfo');

  },30000);

  test('get back to start page', async () => {
    await miniProgram.navigateBack();
    expect(await page.path).toBe('subpages/pack_PM/pages/index/index')
    await page.waitFor(500);
  },30000);

  test('jump to statistics report page', async () => {
    await miniProgram.redirectTo('/subpages/pack_PM/pages/index/index');
    
    page = await miniProgram.currentPage();
    await page.setData(
      {
        active: 1
      }
    )
    //获取发起页面 按钮
    element = await page.$('.statisticReportForTest');
    //点击发起  点击后跳转到发起页面
    await element.tap();
    await page.waitFor(500);

    currentPageIndex = await miniProgram.currentPage();
    //验证是否成功跳转到发起页面
    expect(await currentPageIndex.path).toBe('subpages/pack_PM/pages/statisticReport/statisticReport');

  },30000);

  test('jump to create new project', async () => {
    await miniProgram.redirectTo('/subpages/pack_PM/pages/index/index');
    page = await miniProgram.currentPage();
    await page.setData(
      {
        active: 1
      }
    )
    //获取发起页面 按钮
    element = await page.$('.createNewProjectForTest');
    //点击发起  点击后跳转到发起页面
    await element.tap();
    await page.waitFor(500);

    currentPageIndex = await miniProgram.currentPage();
    //验证是否成功跳转到发起页面
    expect(await currentPageIndex.path).toBe('subpages/pack_PM/pages/newProject/newProject');
  },30000);

  test('get the value of project name', async () => {
    page = await miniProgram.currentPage();
    //获取发起页面 按钮
    await page.setData({
      name: "Lokkk's Project for Test"
    })
    //console.log(await page.data.name);
    // .toBe("Lokkk's Project for Test")
  },30000);

  test('get the value of project description', async () => {
    page = await miniProgram.currentPage();
    //获取发起页面 按钮
    await page.setData({
      description: "Description of project for test"
    })
     //expect(await page.data("name")).toBe("Lokkk's Project for Test")

  },30000);

  test('switch pages between projectInfo', async () => {
    await miniProgram.redirectTo('/subpages/pack_PM/pages/projectInfo/projectInfo');
    page = await miniProgram.currentPage();
    await page.setData(
      {
        currentTab: 1
      }
    )
    await page.waitFor(2000);

    await page.setData(
      {
        currentTab: 2
      }
    )
    await page.waitFor(2000);

    await page.setData(
      {
        currentTab: 0
      }
    )
    await page.waitFor(2000);

    await page.setData(
      {
        currentTab: 1
      }
    )
    await page.waitFor(2000);

    // element = await page.$('.releaseStartedItemForTest');
    // await element.tap();
    await page.waitFor(5000);

    // element = await page.$('.startedTaskForTest');
    // await element.tap();
    // await page.waitFor(500);
    
    currentPageIndex = await miniProgram.currentPage();
    expect(await currentPageIndex.path).toBe('subpages/pack_PM/pages/projectInfo/projectInfo');
  },30000);


  test('jump to create new task', async () => {
    
    //获取发起页面 按钮
    await miniProgram.redirectTo('/subpages/pack_PM/pages/projectInfo/projectInfo');
    page = await miniProgram.currentPage();
    await page.setData(
      {
        currentTab: 1
      }
    )
    element = await page.$('.createNewProjectForTest');
    //点击发起  点击后跳转到发起页面
    await element.tap();
    await page.waitFor(500);

    currentPageIndex = await miniProgram.currentPage();
    //验证是否成功跳转到发起页面
    expect(await currentPageIndex.path).toBe('subpages/pack_PM/pages/newTask/newTask');

  },30000);

  test('jump to Message', async () => {
    await miniProgram.redirectTo('/subpages/pack_PM/pages/index/index');
    page = await miniProgram.currentPage();
    await page.setData(
      {
        active: 0
      }
    )
    // element = await page.$('.messageForTest');
    // //点击发起  点击后跳转到发起页面
    // await element.tap();
    // await page.waitFor(500);

    // currentPageIndex = await miniProgram.currentPage();
    //验证是否成功跳转到发起页面
    // expect(await currentPageIndex.path).toBe('pages/project/fileList/fileList');

  },30000);

  test('jump to create new project', async () => {
    //获取发起页面 按钮
    await miniProgram.redirectTo('/subpages/pack_PM/pages/index/index');
    page = await miniProgram.currentPage();
    await page.setData(
      {
        active: 1
      }
    )
    element = await page.$('.createNewProjectForTest');
    //点击发起  点击后跳转到发起页面
    await element.tap();
    await page.waitFor(500);

    currentPageIndex = await miniProgram.currentPage();
    //验证是否成功跳转到发起页面
    expect(await currentPageIndex.path).toBe('subpages/pack_PM/pages/newProject/newProject');

  },30000);

  test('enter project name', async () => {
    //获取发起页面 按钮
    page = await miniProgram.currentPage();
    element = await page.$('.projectNameForTest');
    //点击发起  点击后跳转到发起页面
    await element.tap();
    await page.waitFor(500);
  },30000);

  test('choose template', async () => {
    //获取发起页面 按钮
    element = await page.$('.templateForTest');
    //点击发起  点击后跳转到发起页面
    await element.tap();
    await page.waitFor(500);

    currentPageIndex = await miniProgram.currentPage();
    //验证是否成功跳转到发起页面
    expect(await currentPageIndex.path).toBe('subpages/pack_PM/pages/projectTemplate/projectTemplate');

  },30000);

  // test('choose template in detail', async () => {
  //   page = await miniProgram.currentPage();
  //   //获取发起页面 按钮
  //   element = await page.$('.chooseTemplateForTest');
  //   //点击发起  点击后跳转到发起页面
  //   await element.tap();
  //   await page.waitFor(500);


  // },30000);

  test('choose template in detail', async () => {
    page = await miniProgram.currentPage();
    //获取发起页面 按钮
    element = await page.$('.chooseTemplateForTest');
    //点击发起  点击后跳转到发起页面
    await element.tap();
    await page.waitFor(500);


  },30000);

  test('choose start time', async () => {
    await miniProgram.navigateBack();
    page = await miniProgram.currentPage();
    //获取发起页面 按钮
    element = await page.$('.startTimeForTest');
    await element.tap();
    await page.waitFor(500);


  },30000);

  test('choose house owner', async () => {
    //获取发起页面 按钮
    element = await page.$('.chooseHouseOwnerForTest');
    await element.tap();
    await page.waitFor(500);
    currentPageIndex = await miniProgram.currentPage();
    expect(await currentPageIndex.path).toBe('subpages/pack_PM/pages/contactList/houseOwnerList/houseOwnerList');

  },30000);

  test('choose participant', async () => {
    await miniProgram.navigateBack();
    page = await miniProgram.currentPage();
    //获取发起页面 按钮
    element = await page.$('.chooseParticipantForTest');
    await element.tap();
    await page.waitFor(500);
    currentPageIndex = await miniProgram.currentPage();
    expect(await currentPageIndex.path).toBe('subpages/pack_PM/pages/contactList/participantList/participantList');

  },30000);
  test('test enter description in the taskinfo', async () => {
    await miniProgram.redirectTo('/subpages/pack_PM/pages/taskInfo/taskInfo');
    page = await miniProgram.currentPage();
    //获取发起页面 按钮
    await page.setData({
      belongTo: "Lokkk's for Test"
    })
    await page.waitFor(500);
  },30000);

  test('jump to comment page', async () => {
    await miniProgram.redirectTo('/subpages/pack_PM/pages/taskInfo/taskInfo');
    page = await miniProgram.currentPage();
    //获取发起页面 按钮
    // element = await page.$('.addComment');
    // //点击发起  点击后跳转到发起页面
    // await element.tap();
    // await page.waitFor(500);

    // currentPageIndex = await miniProgram.currentPage();
    // //验证是否成功跳转到发起页面
    // expect(await currentPageIndex.path).toBe('pages/project/addComment/addComment');

  },30000);

  test('set description in comment', async () => {
    page = await miniProgram.currentPage();
    //获取发起页面 按钮
    await page.setData({
      details: "comment for Test"
    })
    await page.waitFor(500);

  },30000);

  test('jump to setting page', async () => {
    await miniProgram.redirectTo('/subpages/pack_PM/pages/index/index');
    page = await miniProgram.currentPage();
    await page.setData(
      {
        active: 2
      }
    )
    //获取发起页面 按钮
    element = await page.$('.settingForTest');
    //点击发起  点击后跳转到发起页面
    await element.tap();
    await page.waitFor(500);

    currentPageIndex = await miniProgram.currentPage();
    //验证是否成功跳转到发起页面
    expect(await currentPageIndex.path).toBe('pages/languageSetting/languageSetting');

  },30000);

  // test('jump to moreInfo page', async () => {
  //   await miniProgram.redirectTo('/subpages/pack_PM/pages/index/index');
  //   page = await miniProgram.currentPage();
  //   await page.setData(
  //     {
  //       active: 2
  //     }
  //   )
  //   //获取发起页面 按钮
  //   element = await page.$('.moreInfoForTest');
  //   //点击发起  点击后跳转到发起页面
  //   await element.tap();
  //   await page.waitFor(500);

  //   currentPageIndex = await miniProgram.currentPage();
  //   //验证是否成功跳转到发起页面
  //   expect(await currentPageIndex.path).toBe('pages/more/moreInfo/moreInfo');

  // },30000);

  test('check the triggers for priority in task info', async () => {
    await miniProgram.redirectTo('/subpages/pack_PM/pages/taskInfo/taskInfo');
    page = await miniProgram.currentPage();
    //获取发起页面 按钮
    // element = await page.$('.priorityForTest');
    // //点击发起  点击后跳转到发起页面
    // await element.tap();
    // await element.trigger('change', { value:1 });
   
    await page.waitFor(500);

    currentPageIndex = await miniProgram.currentPage();
  },30000);

  test('check the triggers for start time in task info', async () => {
    await miniProgram.redirectTo('/subpages/pack_PM/pages/taskInfo/taskInfo');
    page = await miniProgram.currentPage();
    //获取发起页面 按钮
    element = await page.$('.startTimeForTest');
    //点击发起  点击后跳转到发起页面
    await element.tap();
    await page.waitFor(500);
  },30000);

  test('check the triggers in new project page', async () => {
    await miniProgram.redirectTo('/subpages/pack_PM/pages/newProject/newProject');
    page = await miniProgram.currentPage();
    //获取发起页面 按钮
    element = await page.$('.startTimeForTest');
    //点击发起  点击后跳转到发起页面
    await element.tap();
    await page.waitFor(500);
    await page.setData({
      startDate:"2021-12-2"
    })
  },30000);

  test('check the description project info', async () => {
    await miniProgram.redirectTo('/subpages/pack_PM/pages/projectInfo/projectInfo');
    page = await miniProgram.currentPage();
    //获取发起页面 按钮
    element = await page.$('.projectInfoDescriptionForTest');
    await page.waitFor(500);
    //点击发起  点击后跳转到发起页面
    //await element.tap();
    expect(await element.property('placeholder')).toBe(null);

    currentPageIndex = await miniProgram.currentPage();
  },30000);

 

  afterAll(async () => {
    await miniProgram.close()
  })
})



  