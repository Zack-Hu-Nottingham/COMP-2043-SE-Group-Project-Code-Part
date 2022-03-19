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
    page = await miniProgram.reLaunch('/pages/indexs/indexOfHouseOwner/indexOfHouseOwner')
    await page.waitFor(500)
  }, 30000)

  test('get current start page', async () => {
    expect(await page.path).toBe('pages/indexs/indexOfHouseOwner/indexOfHouseOwner')
  },30000);

  test('jump to specific page', async () => {
    await page.setData(
      {
        active: 1
      }
    )
    await miniProgram.redirectTo('/pages/project/projectInfo/projectInfo');
    //await page.callMethod('onLoad')
    //获取发起页面 按钮
    // element = await page.$('.clickProjectForTest');
    // //点击发起  点击后跳转到发起页面
    // await element.tap();
    await page.waitFor(500);

    currentPageIndex = await miniProgram.currentPage();
    //验证是否成功跳转到发起页面
    expect(await currentPageIndex.path).toBe('pages/project/projectInfo/projectInfo');

  },30000);

  test('get back to start page', async () => {
    await miniProgram.navigateBack();
    expect(await page.path).toBe('pages/indexs/indexOfHouseOwner/indexOfHouseOwner')
    await page.waitFor(500);
  },30000);

  test('jump to statistics report page', async () => {
    await miniProgram.redirectTo('/pages/indexs/indexOfHouseOwner/indexOfHouseOwner');
    
    page = await miniProgram.currentPage();
    await page.setData(
      {
        active: 0
      }
    )
    //获取发起页面 按钮
    element = await page.$('.statisticReportForTest');
    //点击发起  点击后跳转到发起页面
    await element.tap();
    await page.waitFor(500);

    currentPageIndex = await miniProgram.currentPage();
    //验证是否成功跳转到发起页面
    expect(await currentPageIndex.path).toBe('pages/project/statisticReport/statisticReport');

  },30000);

  

  

  test('switch pages between projectInfo', async () => {
    await miniProgram.redirectTo('/pages/project/projectInfo/projectInfo');
    page = await miniProgram.currentPage();
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
    expect(await currentPageIndex.path).toBe('pages/project/projectInfo/projectInfo');
  },30000);

// test('jump to Dashboard and taskInfo', async () => {
//     //获取发起页面 按钮
//     await miniProgram.redirectTo('/pages/indexs/indexOfHouseOwner/indexOfHouseOwner');
//     page = await miniProgram.currentPage();
//     await page.setData(
//       {
//         active: 2
//       }
//     )
//     // element = await page.$('.taskForTest');
//     // //点击发起  点击后跳转到发起页面
//     // await element.tap();
//     // await page.waitFor(500);

//     // currentPageIndex = await miniProgram.currentPage();
//     // //验证是否成功跳转到发起页面
//     // expect(await currentPageIndex.path).toBe('pages/project/taskInfo/taskInfo');

//   },30000);

  test('jump to Dashboard and taskInfo', async () => {
    
    //获取发起页面 按钮
    await miniProgram.redirectTo('/pages/project/projectInfo/projectInfo');
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
    expect(await currentPageIndex.path).toBe('pages/project/newTask/newTask');

  },30000);

  test('jump to Message', async () => {
    await miniProgram.redirectTo('/pages/indexs/indexOfHouseOwner/indexOfHouseOwner');
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

  // test('jump to create new project', async () => {
  //   //获取发起页面 按钮
  //   await miniProgram.redirectTo('/pages/indexs/indexOfHouseOwner/indexOfHouseOwner');
  //   page = await miniProgram.currentPage();
  //   await page.setData(
  //     {
  //       active: 1
  //     }
  //   )
  //   element = await page.$('.createNewProjectForTest');
  //   //点击发起  点击后跳转到发起页面
  //   await element.tap();
  //   await page.waitFor(500);

  //   currentPageIndex = await miniProgram.currentPage();
  //   //验证是否成功跳转到发起页面
  //   expect(await currentPageIndex.path).toBe('pages/project/newProject/newProject');

  // },30000);

  // test('enter project name', async () => {
  //   //获取发起页面 按钮
  //   page = await miniProgram.currentPage();
  //   element = await page.$('.projectNameForTest');
  //   //点击发起  点击后跳转到发起页面
  //   await element.tap();
  //   await page.waitFor(500);
  // },30000);

  // test('choose template', async () => {
  //   //获取发起页面 按钮
  //   element = await page.$('.templateForTest');
  //   //点击发起  点击后跳转到发起页面
  //   await element.tap();
  //   await page.waitFor(500);

  //   currentPageIndex = await miniProgram.currentPage();
  //   //验证是否成功跳转到发起页面
  //   expect(await currentPageIndex.path).toBe('pages/project/projectTemplate/projectTemplate');

  // },30000);

  // test('choose template in detail', async () => {
  //   page = await miniProgram.currentPage();
  //   //获取发起页面 按钮
  //   element = await page.$('.chooseTemplateForTest');
  //   //点击发起  点击后跳转到发起页面
  //   await element.tap();
  //   await page.waitFor(500);


  // },30000);

  // test('choose template in detail', async () => {
  //   page = await miniProgram.currentPage();
  //   //获取发起页面 按钮
  //   element = await page.$('.chooseTemplateForTest');
  //   //点击发起  点击后跳转到发起页面
  //   await element.tap();
  //   await page.waitFor(500);


  // },30000);

  // test('choose start time', async () => {
  //   await miniProgram.navigateBack();
  //   page = await miniProgram.currentPage();
  //   //获取发起页面 按钮
  //   element = await page.$('.startTimeForTest');
  //   await element.tap();
  //   await page.waitFor(500);


  // },30000);

  // test('choose house owner', async () => {
  //   //获取发起页面 按钮
  //   element = await page.$('.chooseHouseOwnerForTest');
  //   await element.tap();
  //   await page.waitFor(500);
  //   currentPageIndex = await miniProgram.currentPage();
  //   expect(await currentPageIndex.path).toBe('pages/project/contactList/houseOwnerList/houseOwnerList');

  // },30000);

  // test('choose participant', async () => {
  //   await miniProgram.navigateBack();
  //   page = await miniProgram.currentPage();
  //   //获取发起页面 按钮
  //   element = await page.$('.chooseParticipantForTest');
  //   await element.tap();
  //   await page.waitFor(500);
  //   currentPageIndex = await miniProgram.currentPage();
  //   expect(await currentPageIndex.path).toBe('pages/project/contactList/participantList/participantList');

  // },30000);

  test('jump to setting page', async () => {
    await miniProgram.redirectTo('/pages/indexs/indexOfHouseOwner/indexOfHouseOwner');
    page = await miniProgram.currentPage();
    await page.setData(
      {
        active: 1
      }
    )
    //获取发起页面 按钮
    element = await page.$('.settingForTest');
    //点击发起  点击后跳转到发起页面
    await element.tap();
    await page.waitFor(500);

    currentPageIndex = await miniProgram.currentPage();
    //验证是否成功跳转到发起页面
    expect(await currentPageIndex.path).toBe('pages/more/languageSetting/languageSetting');

  },30000);

  // test('jump to moreInfo page', async () => {
  //   await miniProgram.redirectTo('/pages/indexs/indexOfHouseOwner/indexOfHouseOwner');
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
    await miniProgram.redirectTo('/pages/project/taskInfo/taskInfo');
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
    await miniProgram.redirectTo('/pages/project/taskInfo/taskInfo');
    page = await miniProgram.currentPage();
    //获取发起页面 按钮
    element = await page.$('.startTimeForTest');
    //点击发起  点击后跳转到发起页面
    await element.tap();
    await page.waitFor(500);
  },30000);

  // test('check the picker for start time in project info', async () => {
  //   await miniProgram.redirectTo('/pages/project/projectInfo/projectInfo');
  //   page = await miniProgram.currentPage();
  //   await page.setData(
  //     {
  //       currentTab: 0
  //     }
  //   )
  //   //点击发起  点击后跳转到发起页面
  //   //获取发起页面 按钮
  //   element = await page.$('.projectInfoStartTimeForTest');
  //   page = await miniProgram.currentPage();
    
  //   await element.tap();
  //   await page.waitFor(500);

  //   currentPageIndex = await miniProgram.currentPage();
  // },30000);

  // test('check the triggers in project info', async () => {
  //   await miniProgram.redirectTo('/pages/project/projectInfo/projectInfo');
  //   page = await miniProgram.currentPage();
  //   //获取发起页面 按钮
  //   element = await page.$('.projectInfoStartTimeForTest');
  //   //点击发起  点击后跳转到发起页面
  //   await element.tap();
  //   await page.waitFor(500);

  //   currentPageIndex = await miniProgram.currentPage();
  // },30000);

  // test('check the triggers in project info', async () => {
  //   await miniProgram.redirectTo('/pages/project/projectInfo/projectInfo');
  //   page = await miniProgram.currentPage();
  //   //获取发起页面 按钮
  //   element = await page.$('.projectInfoEndTimeForTest');
  //   //点击发起  点击后跳转到发起页面
  //   await element.tap();
  //   await page.waitFor(500);

  //   currentPageIndex = await miniProgram.currentPage();
  // },30000);

  test('check the description project info', async () => {
    await miniProgram.redirectTo('/pages/project/projectInfo/projectInfo');
    page = await miniProgram.currentPage();
    //获取发起页面 按钮
    element = await page.$('.projectInfoDescriptionForTest');
    await page.waitFor(500);
    //点击发起  点击后跳转到发起页面
    //await element.tap();
    expect(await element.property('placeholder')).toBe(null);

    currentPageIndex = await miniProgram.currentPage();
  },30000);

  // test('check the description project info of state', async () => {
  //   await miniProgram.redirectTo('/pages/project/projectInfo/projectInfo');
  //   page = await miniProgram.currentPage();
  //   await page.callMethod('onLoad');
  //   await page.callMethod('onReady');
  //   await page.callMethod('onShow');
  //   //获取发起页面 按钮
  //   element = await page.$('.projectInfoStateDescriptionForTest');
  //   await page.waitFor(500);
  //   //点击发起  点击后跳转到发起页面
  //   //await element.tap();
  //   expect(await element.property('placeholder')).toBe(null);

  //   currentPageIndex = await miniProgram.currentPage();
  // },30000);


  afterAll(async () => {
    await miniProgram.close()
  })
})



  