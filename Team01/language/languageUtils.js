/*
 * Code written by team
 * Code created by: Zixiang HU
 * Code Modified by: Zixiang HU
 */
const app = getApp();

const languageVersion = function()
{
    var languageVersion = wx.getStorageSync("languageVersion");
    if (languageVersion == 0) 
    {
        // 导入我们定义好的中文字典
        var zh_lang = require('./ch_language.js')
        // console.log(zh_lang)
        return zh_lang
    } 
    else 
    {
        // 导入我们定义好的英文字典
        var en_lang = require('./en_language.js')
        // console.log(en_lang)
        return en_lang
    }
}

const changLanguage = function()
{
    var languageVersion = wx.getStorageSync("languageVersion");
    //修改前面已经定义好的，用于标识小程序的语言版本
    if (languageVersion == 0) 
    {
        wx.setStorage({
            key: "languageVersion",
            data: 1,
        });
    } 
    else if (languageVersion == 1)
    {
        wx.setStorage({
            key: "languageVersion",
            data: 0,
        });
    }
}
//抛出方法
module.exports = {
  'languageVersion': languageVersion,
  'changLanguage': changLanguage
}