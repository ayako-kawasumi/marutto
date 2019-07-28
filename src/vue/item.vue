<style lang="stylus">
  .item
    display flex
    padding 1px
    align-items center
    word-break break-all
    .icon
      vertical-align middle
      margin 0
      margin-right 1px
      padding 0
      display inline-block
      height 20px
      width 20px
      background-repeat no-repeat
      background-position center
      background-size cover
      font-size 16px
      line-height 20px
      text-align center
    .name
      width calc(100% - 21px)
</style>
<template>
  <div class="item"
       @dblclick="open($event,item.path)"
       @click.right="popupMenu"
       @dragstart="setData">
    <div class="icon">
      <span class="icon-globe" v-if="item.browser === 'default'"></span>
      <span class="icon-internetexplorer" v-else-if="item.browser === 'IE'"></span>
      <span class="icon-mozillafirefox" v-else-if="item.browser === 'FF'"></span>
      <span class="icon-googlechrome" v-else-if="item.browser === 'GC'"></span>
      <img :src="dirPng" v-else-if="item.type === 'dir'">
      <div class="icon" v-else :style="{'background-image':dataUrl}"></div>
    </div>
    <div class="name" :style="{'font-size':`${config.fontSize}px`}">{{filename}}</div>
  </div>
</template>
<script>
import {remote,shell,clipboard} from 'electron'
import {mapState} from 'vuex'
import {join,dirname,basename} from 'path'
import {spawn} from 'child_process'
import _ from 'lodash'
import {IMG_DIR,ieExe,ffExe,gcExe,dirPng} from '../js/master'
import eventHub from '../js/event-hub'
import {statAsync} from '../js/promisify'
const {Menu,MenuItem} = remote
export default {
  data(){
    return{
      isDisabled:true,
      showMenu:false,
      dirPng
    }
  },
  props:{
    index:Number
  },
  computed:{
    ...mapState({
      canSort:'canSort',
      config:'config',
      categories:'categories',
      selectedCategory:'selectedCategory'
    }),
    item(){
      return this.selectedCategory.items[this.index]
    },
    dataUrl(){
      return `url(${this.item.icon})`
    },
    filename(){
      return this.item.name || basename(this.item.path)
    }
  },
  methods:{
    popupMenu(ev){
      const menu = new Menu()
      const menuList = [
        {
          icon:join(IMG_DIR,'settings.png'),
          label:'Edit',
          click:()=>{
            eventHub.$emit('showItemConfig',this.index)
          }
        },
        {
          icon:join(IMG_DIR,'folder.png'),
          label:'Open parent',
          click:()=>{
            this.open(null,dirname(this.item.path))
          }
        },
        {
          icon:join(IMG_DIR,'globe.png'),
          label:'Open with',
          enabled:false,
          submenu:[
            {
              icon:join(IMG_DIR,'internetexplorer.png'),
              label:'Internet Explorer',
              click:()=>{
                this.item.browser = 'IE'
                this.$store.dispatch('save',this.categories)
              }
            },
            {
              icon:join(IMG_DIR,'mozillafirefox.png'),
              label:'Firefox',
              click:()=>{
                this.item.browser = 'FF'
                this.$store.dispatch('save',this.categories)
              }
            },
            {
              icon:join(IMG_DIR,'googlechrome.png'),
              label:'Google Chrome',
              click:()=>{
                this.item.browser = 'GC'
                this.$store.dispatch('save',this.categories)
              }
            },
            {
              icon:join(IMG_DIR,'globe.png'),
              label:'Default',
              click:()=>{
                this.item.browser = 'default'
                this.$store.dispatch('save',this.categories)
              }
            },
          ]
        },
        {
          icon:join(IMG_DIR,'copy.png'),
          label:'Copy path',
          click:()=>{
            clipboard.writeText(this.item.path)
          }
        },
        {
          icon:join(IMG_DIR,'trash-2.png'),
          label:'Delete',
          click:()=>{
            this.$store.dispatch('deleteItem',this.index)
          }
        }
      ]
      menuList.forEach(m=>{
        if(m.label === 'Open with' && this.item.type === 'url'){
          m.enabled = true
        }
        menu.append(new MenuItem(m))
      })
      menu.popup({
        window:remote.getCurrentWindow(),
        x:ev.x,
        y:ev.y
      })
    },
    async open(ev,path){
      if(this.item.type === 'url'){
        let browserOpen
        switch(this.item.browser){
          case 'default':
            shell.openExternal(path)
            break
          case 'IE':
            browserOpen = spawn(ieExe,[path])
            break
          case 'FF':
            browserOpen = spawn(ffExe,[path])
            break
          case 'GC':
            browserOpen = spawn(gcExe,[path])
            break
        }
        browserOpen.on('error',e=>{
          console.log(e)
          shell.openExternal(path)
        })
      }else{
        try{
          await statAsync(path)
          shell.openExternal(path)
        }catch(e){
          console.log(e)
          return eventHub.$emit('showMessage','パスが存在しないため開けません')
        }
      }
    },
    setData(ev){
      const {dataTransfer:dt} = ev
      dt.setData('marutto',this.item)
    }
  }
}
</script>