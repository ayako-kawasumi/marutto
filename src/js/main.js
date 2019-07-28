import Vue from 'vue'
import semver from 'semver'
import {remote,shell} from 'electron'
import fs from 'fs'
import store from './store'
import Root from '../vue/root.vue'
// const installerPath = '\\\\coe\\nttcom\\COMENG_SYS_TOOLS\\cordova2\\cordova2-installer.exe'
// const toolInfoJson = '//coe/nttcom/COMENG_SYS_TOOLS/cordova2/info.json'
// const {version} = JSON.parse(fs.readFileSync(toolInfoJson,'utf8'))
// const packageVersion = remote.app.getVersion()
// console.log(version,packageVersion)
// const isUpdate = checkVersion()
// if(isUpdate){
//   bootInstaller()
// }

new Vue({
  el:'#app',
  store,
  render(createElement){
    return createElement(Root);
  }
});

/*バージョンチェックとアップデート*/
// function checkVersion(){
//   const isUpdate = semver.gt(version,packageVersion)
//   return isUpdate
// }
// function bootInstaller(){
//   shell.openItem(installerPath)
// }