# Maintenance Documentation

[toc]



## 1. Introduction 

Here is the maintenance documentation for the WeChat applet "**Intelli-Home**" developed by Team 202101.

You could find the following information in this documentation:

- **Installation instructions** with **Environment requirements**
- 
- Detailed **user manual**
- 



For more detailed information please refer to our [GitLab page](https://csprojects.nottingham.edu.cn/scyzh6/team202101.git) and [website](http://cslinux.nottingham.edu.cn/~Team202101/index.html)

If you have any suggestions or find problems with the current applet, it is welcome to contact us:

- WeChat: HZX2001227
-  Email: scyzh6@nottingham.edu.cn

## 2. Installation instructions & Environment requirements

### 2.1 Installation list

- Recommended  IDE: WeChat development tool
- Basic component: WeChat



### 2.2 Instruction for developer & maintainer

To maintain this applet as a maintainer, it is suggested to install the WeChat development tools.



##### 2.2.1 Mac user

Operating system requirements:  **macOS 10.9+**

Click the links below to install the stable version of WeChat development tools:

- [macOS](https://servicewechat.com/wxa-dev-logic/download_redirect?type=darwin&from=mpwiki&download_version=1052203070&version_type=1)
- [macOS(ARM64)](https://dldir1.qq.com/WechatWebDev/beta/wechat_devtools_1.06.2203070.dmg)

After downloading the files, click **"Open"**

<img src="images\mac_download1.png" style="zoom: 50%;" />

Then drag the **"WeChat Devtools"** to "Applications"

<img src="images\mac_download2.png" style="zoom:50%;" />

Cheers, you could start coding with WeChat development tools now~

For more detailed WeChat development tools installation instructions please refer to the [official website](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)



##### 2.2.2 Windows user

Operating system requirements:  **Windows 7 or above**

Click the links below to install the stable version of WeChat development tools: 

- [Windows 64](https://servicewechat.com/wxa-dev-logic/download_redirect?type=x64&from=mpwiki&download_version=1052203070&version_type=1)
- [Windows 32](https://servicewechat.com/wxa-dev-logic/download_redirect?type=ia32&from=mpwiki&download_version=1052203070&version_type=1)

After downloading the .exe file, click it to start the installation process. 

Then click **"Next step"**, "I Allow" and choose the location of installation, finally click **"Install"** to end up.

Cheers, you could start coding with WeChat development tools now~

For more detailed WeChat development tools installation instructions please refer to the WeChat [official website](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)



### 2.3 Instruction for applet user

##### 2.3.1 Prerequisite: WeChat installation (skip to 1.2.2 if already installed)

For iOS users, download the latest version of WeChat from the "App store".

For Android users, download the latest version of  WeChat from your trusted app store.



##### 2.3.2 Search for the applet

Search the applet **"Intelli-Home"** from the top search bar in WeChat.



Then click **"Search Intelli-Home"**.

<img src="images\search.jpg" style="zoom:25%;" />





##### 2.3.3 Start the journey with "Intelli-Home"

Now, you could register an account and start the journey with **"Intelli-Home"**~  

For a more detailed guide, please refer to the user manual in chapter 2.

**Note:** The default login users are with house owner identities, which means you could not create projects or invite members. If you want to create projects please contact your project manager, or contact the manager of this applet (refer to the front of this documentation)



### 2.4 Instruction for tester

2.4.1 Pre-requested implementation environment

- WeChat development tool installed (Follow the instruction in 1.2 to install)
- Node.js installed and version above 8.0
- The base library version is 2.7.3 or above
- Developer tools version 1.02.1907232 or above



2.4.2 Installation of automator SDK

- Open the terminal at the location of the file

- Enter the following code:

  ```
  npm i miniprogram-automator --save-dev
  ```



2.4.3 Function enable

- Turn on **CLI/HTTP** call function in the tool security settings.
- Bring in the SDK directly and start writing control scripts



2.4.4 Initialization

- Create a new folder **miniprogram-demo-test** to place the test code and execute the following command to install the dependencies:

  ```bash
  npm i miniprogram-automator jest
  npm i jest -g
  ```

  

2.4.5 Script execution

- After writing the script, execute the following script directly: 

  ```bash
  jest index.spec.js
  ```

- If you see the following message output from the console, the test is successful.

  ```bash
  PASS  ./index.spec.js (5.341s)
    index
      √ desc (18ms)
      √ list (14ms)
      √ list action (1274ms)
  
  Test Suites: 1 passed, 1 total
  Tests:       3 passed, 3 total
  Snapshots:   0 total
  Time:        6.378s
  Ran all test suites matching /index.spec.js/i.
  ```





For more detailed WeChat development tools installation instructions please refer to the WeChat [official website](https://developers.weixin.qq.com/miniprogram/dev/devtools/auto/demo.html)



## 3. User manual

Click [here](User_manual.md) to open the detailed user manual.

## 4. Quality assurance



## Third-party libraries and licenses

这一部分放到report里



