const automator = require('miniprogram-automator')

describe('index', () => {
  let miniProgram
  let page
  let element
  let currentPageIndex

  beforeAll(async () => {
    miniProgram = await automator.launch({
      projectPath: '/Users/edison/Team01/Team01',
    })
    page = await miniProgram.reLaunch('/pages/project/project/project')
    await page.waitFor(500)
  }, 30000)

//   test('get current start page', async () => {
//     expect(await page.path).toBe('pages/project/project/project')
//   },30000);

//   test('jump to specific page', async () => {
//     //获取发起页面 按钮
//     element = await page.$('.myTaskForTest');
//     //点击发起  点击后跳转到发起页面
//     await element.tap();
//     await page.waitFor(500);

//     currentPageIndex = await miniProgram.currentPage();
//     //验证是否成功跳转到发起页面
//     expect(await currentPageIndex.path).toBe('pages/project/task/task');

//   },30000);

//   test('get back to start page', async () => {
//     await miniProgram.navigateBack();
//     expect(await page.path).toBe('pages/project/project/project')
//     await page.waitFor(500);
//   },30000);

//   test('jump to statistics report page', async () => {
//     //获取发起页面 按钮
//     element = await page.$('.statisticReportForTest');
//     //点击发起  点击后跳转到发起页面
//     await element.tap();
//     await page.waitFor(500);

//     currentPageIndex = await miniProgram.currentPage();
//     //验证是否成功跳转到发起页面
//     expect(await currentPageIndex.path).toBe('pages/project/statisticReport/statisticReport');

//   },30000);

//   test('jump to specific project page', async () => {
//     await miniProgram.navigateBack();
//     //获取发起页面 按钮
//     element = await page.$('.projectForTest');
//     //点击发起  点击后跳转到发起页面
//     await element.tap();
//     await page.waitFor(500);

//     currentPageIndex = await miniProgram.currentPage();
//     //验证是否成功跳转到发起页面
//     expect(await currentPageIndex.path).toBe('pages/project/projectInfo/projectInfo');
//   },30000);

//   test('switch pages between projectInfo', async () => {
//     page = await miniProgram.currentPage();
//     await page.setData(
//       {
//         currentTab: 1
//       }
//     )
//     await page.waitFor(2000);

//     await page.setData(
//       {
//         currentTab: 2
//       }
//     )
//     await page.waitFor(2000);

//     await page.setData(
//       {
//         currentTab: 0
//       }
//     )
//     await page.waitFor(2000);

//     await page.setData(
//       {
//         currentTab: 1
//       }
//     )
//     await page.waitFor(2000);

//     element = await page.$('.releaseStartedItemForTest');
//     await element.tap();
//     await page.waitFor(5000);

//     element = await page.$('.startedTaskForTest');
//     await element.tap();
//     await page.waitFor(500);
    
//     currentPageIndex = await miniProgram.currentPage();
//     expect(await currentPageIndex.path).toBe('pages/project/projectInfo/projectInfo');
//   },30000);

// test('jump to Dashboard and taskInfo', async () => {
//     //获取发起页面 按钮
//     await miniProgram.navigateTo('/pages/index/index');
//     page = await miniProgram.currentPage();
//     await page.setData(
//       {
//         active: 2
//       }
//     )
//     element = await page.$('.taskForTest');
//     //点击发起  点击后跳转到发起页面
//     await element.tap();
//     await page.waitFor(500);

//     currentPageIndex = await miniProgram.currentPage();
//     //验证是否成功跳转到发起页面
//     expect(await currentPageIndex.path).toBe('pages/project/taskInfo/taskInfo');

//   },30000);

//   test('jump to Message', async () => {
//     await miniProgram.navigateTo('/pages/index/index');
//     page = await miniProgram.currentPage();
//     await page.setData(
//       {
//         active: 0
//       }
//     )
//     element = await page.$('.messageForTest');
//     //点击发起  点击后跳转到发起页面
//     await element.tap();
//     await page.waitFor(500);

//     currentPageIndex = await miniProgram.currentPage();
//     //验证是否成功跳转到发起页面
//     expect(await currentPageIndex.path).toBe('pages/message/message/message');

//   },30000);

//   test('jump to setting page', async () => {
//     await miniProgram.navigateTo('/pages/index/index');
//     page = await miniProgram.currentPage();
//     await page.setData(
//       {
//         active: 3
//       }
//     )
//     //获取发起页面 按钮
//     element = await page.$('.settingForTest');
//     //点击发起  点击后跳转到发起页面
//     await element.tap();
//     await page.waitFor(500);

//     currentPageIndex = await miniProgram.currentPage();
//     //验证是否成功跳转到发起页面
//     expect(await currentPageIndex.path).toBe('pages/more/setting/setting');

//   },30000);

//   test('jump to moreInfo page', async () => {
//     await miniProgram.navigateTo('/pages/index/index');
//     page = await miniProgram.currentPage();
//     await page.setData(
//       {
//         active: 3
//       }
//     )
//     //获取发起页面 按钮
//     element = await page.$('.moreInfoForTest');
//     //点击发起  点击后跳转到发起页面
//     await element.tap();
//     await page.waitFor(500);

//     currentPageIndex = await miniProgram.currentPage();
//     //验证是否成功跳转到发起页面
//     expect(await currentPageIndex.path).toBe('pages/more/moreInfo/moreInfo');

//   },30000);

  test('check the triggers for priority in task info', async () => {
    await miniProgram.navigateTo('/pages/project/taskInfo/taskInfo');
    page = await miniProgram.currentPage();
    //获取发起页面 按钮
    element = await page.$('.priorityForTest');
    //点击发起  点击后跳转到发起页面
    await element.tap();
    await element.trigger('change', { value:1 });
   
    await page.waitFor(500);

    currentPageIndex = await miniProgram.currentPage();
  },30000);

  test('check the triggers for start time in task info', async () => {
    await miniProgram.navigateTo('/pages/project/taskInfo/taskInfo');
    page = await miniProgram.currentPage();
    //获取发起页面 按钮
    element = await page.$('.startTimeForTest');
    //点击发起  点击后跳转到发起页面
    await element.tap();
    await page.waitFor(500);

    currentPageIndex = await miniProgram.currentPage();
  },30000);

  afterAll(async () => {
    await miniProgram.close()
  })
})



  