const {remote} = require('electron')
const {join} = require('path')
const rootDir = remote.getGlobal('rootDir')
const IMG_DIR = join(rootDir,'img')
module.exports = {
  IMG_DIR,
  JSON_PATH:join(remote.app.getPath('userData'),'items.json'),
  CONFIG_PATH:join(remote.app.getPath('userData'),'config.json'),
  ieExe:'C:\\Program Files\\Internet Explorer\\iexplore.exe',
  ffExe:'C:\\Program Files\\Mozilla Firefox\\firefox.exe',
  gcExe:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  dirPng:join(IMG_DIR,'dir.png')
}