<style>
  .items{
    width:60%;
    background-color: white;
    font-size: 11px;
    overflow:auto;
    overflow-x:hidden;
  }
  .item{
    overflow : hidden;
    background-color: white;
    font-size: 11px;
  }
  .item-name{
    width:100%;
    /* float: left; */
    height: 100%;
    padding: 3px 2px;
  }
  .item:nth-child(even){
    background-color: rgb(235, 235, 245);
  }
  .item-name:hover,.copy-button:hover{
    background-color:rgb(251, 255, 0);
  }
  .copy-button>img {
    margin: 2px;
  }
  ::-webkit-scrollbar {
    width: 6px;
    border-radius: 50px;
    box-shadow:0px 0px 1px 1px rgb(200,200,210) inset;
    background-color: rgba(255, 255, 255, 0.9)
  }
  ::-webkit-scrollbar-button {
    width: 0px;
    height: 0px;
  }
  ::-webkit-scrollbar-thumb {
    background:rgb(170, 170, 180);
    border-radius: 50px;
  }

</style>
<template>
  <div class="items"
  @drop.prevent="recieveItem($event,category)"
  @dragstart.prevent
  @dragover.prevent>
    <div class="item" v-for="itemPath in category.paths" :key="itemPath"
    @dblclick="bootDevelopItem(itemPath)" v-if="category.name"
    @click.right="showItemMenu(itemPath)">
      <div class="item-name">{{itemPath | basename}}</div>
    </div>
    <item-menu/>
  </div>
</template>
<script>
import electron from 'electron'
import Category from '../js/category.js'
import {mapState} from 'vuex'
import eventHub from '../js/event-hub.js'
import path from 'path'
import fs from 'fs'
import {itemJsonPath} from '../js/master.js'
import itemMenu from './item-menu.vue'
export default {
  data(){
    return{
    }
  },
  created(){
  },
  components:{
    itemMenu
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
    bootDevelopItem(path){
      electron.shell.openExternal(path)
    },
    recieveItem(ev,selectedCate){
      var files = ev.dataTransfer.files
      let paths
      if(files.length){
        paths = Array.prototype.map.call(files, file=> file.path)
        console.log(files)
        paths.forEach(f =>{
          selectedCate.paths.push(f)
        })
      }else if(!files.length){
        paths = ev.dataTransfer.getData('text/plain')
        selectedCate.paths.push(paths)
      }
      console.log(paths)
      fs.writeFile(itemJsonPath, JSON.stringify(this.categories, 0, 1),'utf8', ()=>{})
      return
    },
    showItemMenu(itemPath){
      eventHub.$emit('showItemMenu',itemPath)
    }
  }
}
</script>
