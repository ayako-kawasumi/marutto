<style>
.cover{
  height: 100%;
  width: 100%;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(54, 54, 54, 0.8);
}
.cover-enter-active, .cover-leave-active{
  transition: all .3s ease;
  opacity: 1;
}
.cover-enter,.cover-leave-to{
  opacity: 0;
}
.item-menu{
  width: 35%;
  height: 110px;
  background-color: white;
  text-align: center;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  box-shadow: 2px 2px 4px rgb(50, 50, 50);
  padding: 5px
}
.item-action-button{
  height: 18px;
  width:100%;
  background-color: unset;
  border: unset;
  text-align: left;
  font-size: 12px;
}
.hide-me-button{
  font-size: 16px;
  font-weight: bold;
  border:none;
  float: right;
  background-color: unset
}
.item-action-button:hover,.hide-me-button:hover{
  background-color: rgb(251, 255, 0);
}
.item-action-button>img{
  float: left;
}
.item-action-name{
  margin:2px;
  float: left;
}
</style>
<template>
    <transition name="cover">
    <div class="cover" v-if="show" @keydown.esc.prevent="hideMe">
      <div class="item-menu">
        <button class="hide-me-button" @click="hideMe">×</button>
        <button class="item-action-button" @click="openWebBrowser">
          <img src="../lib/edit-button.png">
          <div class="item-action-name">Edit(未)</div>
        </button>
        <button class="item-action-button" @click="openParent">
          <img src="../lib/open-parent-button.png">
          <div class="item-action-name">Open Parent</div>
        </button>
        <button class="item-action-button" v-clipboard:copy="itemPath" v-clipboard:success="onCopy">
          <img src="../lib/copy-button.png">
          <div class="item-action-name">Copy Path</div>
        </button>
        <button class="item-action-button" @click="removeItem($event,itemPath)">
          <img src="../lib/delete-button.png">
          <div class="item-action-name">Delete</div>
        </button>
      </div>
    </div>
  </transition>
</template>
<script>
import electron from 'electron'
import {shell} from 'electron'
import eventHub from '../js/event-hub.js'
// import fs from 'fs'
// import {itemJsonPath} from '../js/master.js'
import {mapState} from 'vuex'
import path from 'path'
import {exec} from 'child_process'
export default {
  data(){
    return{
      show:false,
      itemPath:''
    }
  },
  created(){
    eventHub.$on('showItemMenu',this.showMe)
  },
  computed:
  mapState({
    categories:'categories',
    category:'category'
  }),
  filters:{
    basename:itemPath=>path.basename(itemPath)
  },
  methods:{
    showMe(itemPath){
      this.show = true
      this.itemPath = itemPath
    },
    hideMe(){
      this.show = false
    },
    removeItem(ev){
      this.hideMe()
      const itemBasename = path.basename(this.itemPath)
      eventHub.$emit('yes-no-message',`${itemBasename}を削除しますか？`,()=>{
        const index = this.category.paths.indexOf(this.itemPath)
        this.category.paths.splice(index, 1)
        this.$store.dispatch('saveJsonData',this.categories)
      })
    },
    onCopy(){
      this.hideMe()
      eventHub.$emit('message','パスをコピーしました')
    },
    openParent(){
      console.log(this.itemPath,path.dirname(this.itemPath))
      electron.shell.openExternal(path.dirname(this.itemPath))
    },
    openWebBrowser(){
      // shell.openExternal('iexplore.exe')
      // shell.openExternal('firefox.exe')
      // shell.openExternal('chrome.exe')
      // const openWith = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      // const nekoPath = 'https:\\\\www.min-nekozukan.com\\munchkin.html'
      // const comandLine = `${openWith} ${nekoPath}`
      // shell.openExternal(`${openWith} ${this.itemPath}`)

      // console.log(`${openWith} ${nekoPath}`)
    }
  }
}
</script>
