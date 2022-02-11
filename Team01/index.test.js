const automator = require('miniprogram-automator')

describe('index', () => {
  let miniProgram
  let page

  beforeAll(async () => {
    miniProgram = await automator.launch({
      projectPath: '/Users/edison/Team01/Team01',
    })
    page = await miniProgram.reLaunch('/pages/project/project/project')
    await page.waitFor(500)
  }, 30000)

  test('get current start page', async () => {
    expect(await page.path).toBe('pages/project/project/project')
  },30000);

  test('jump to specific page', async () => {
    //获取发起页面 按钮
    const element = await page.$('.myTaskCellForTest');
    //点击发起  点击后跳转到发起页面
    await element.tap();
    await page.waitFor(500);

    const currentPageIndex = await miniProgram.currentPage();
    //验证是否成功跳转到发起页面
    expect(await currentPageIndex.path).toBe('pages/project/task/task');

  },30000);


  afterAll(async () => {
    await miniProgram.close()
  })
})
