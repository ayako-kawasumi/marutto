<style>
  button{
    outline: none;
  }
  .main{
    width: 100%;
    height:calc(100% - 22px);
    display:flex;
    font-size:11px;
  }
  .categories{
    background-color: rgb(70, 70, 80);
    color: white;
    width:40%;
    overflow: auto;
    overflow-x:hidden;
  }
  .category{
    overflow : hidden;
    background-color: rgb(30, 30, 40);
    font-size: 12px;
  }
  .category-name:hover{
    background-color:rgb(223, 246, 96);
    color:black;
  }
  .category-name{
    width: calc(100% - 24px);
    float:left;
    height: 100%;
    text-align: center;
    padding:4px 0;
  }
  .category>button{
    background-color:unset;
    border:none;
    color: white;
    width:24px;
    height: 26px;
    vertical-align: middle;
    float:left;
  }
  .category>button:hover{
    color:rgb(216, 255, 0);
  }
  .button-text{
    font-size:20px;
    height: 100%;
  }
  .category:nth-child(even){
    background-color: black
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
  <div class="main">
    <div class="categories">
      <div class="category" v-for="cate in categories" :key="cate.name"
       :style="[category.name === cate.name ? selected : false]">
        <button>
          <div class="button-text" @dblclick="bootDevelopSet(cate.paths)">
            ●
          </div>
        </button>
        <!-- <div class="category-name" @click="selectCategory(cate)"
          @drop.prevent="recieveItem($event,cate)" @dragstart.prevent @dragover.prevent
          @click.right="removeCate($event,cate.name)"> -->
        <div class="category-name" @click="selectCategory(cate)"
          @drop.prevent="recieveItem($event,cate)" @dragstart.prevent @dragover.prevent
          @click.right="showCateMenu(cate.name)">
          {{cate.name}}
        </div>
      </div>
    </div>
    <items/>
    <cate-menu/>
  </div>
</template>
<script>
import electron from 'electron'
import path from 'path'
import fs from 'fs'
import {JsonDir,itemJsonPath} from '../js/master.js'
import Category from '../js/category.js'
import {mapState} from 'vuex'
import eventHub from '../js/event-hub.js'
import _ from 'lodash'
import items from './items.vue'
import cateMenu from './category-menu.vue'
export default {
  data(){
    return{
      beforeCate:null,
      selectedCate:null,
      selected:{
        color:'rgb(216, 255, 0)',
        'font-weight':'bold'
      },
    }
  },
  created(){
    fs.mkdir(JsonDir,()=>{})
    this.$store.dispatch('getAllCategories')
  },
  components:{
    items,
    cateMenu
  },
  computed:
    mapState({
      categories:'categories',
      category:'category'
    }),
  methods:{
    bootDevelopSet(openItems){
      openItems.forEach(item=>{
        electron.shell.openExternal(item) 
      })
      eventHub.$emit('message','★開きました★')
    },
    selectCategory(category){
      this.$store.dispatch('getCategory',category)
    },
    // recieveItem(ev,selectedCate){
    //   var files = ev.dataTransfer.files;
    //   if(files.length){
    //     var paths = Array.prototype.map.call(files, file=> file.path)
    //     console.log(files)
    //     paths.forEach(f =>{
    //       selectedCate.paths.push(f)
    //     })
    //     fs.writeFile(itemJsonPath, JSON.stringify(this.categories, 0, 1),'utf8', ()=>{})
    //     return
    //   }
    // },
    // removeCate(ev,selectedCate){
    //   eventHub.$emit('yes-no-message',`${selectedCate}を削除しますか？`,()=>{
    //     //storeのcategoriesを更新
    //     const index = this.categories.findIndex(({name}) => name === selectedCate)
    //     if(index >= 0){
    //       this.categories.splice(index, 1)
    //     }
    //     this.$store.dispatch('saveJsonData',this.categories)
    //     //storeのcategoryを更新
    //     if(this.category.name === selectedCate){
    //       if(this.categories.length === 0){
    //         this.$store.dispatch('getCategory','')
    //       }else{
    //         this.$store.dispatch('getCategory',this.categories[0])
    //       }
    //     }
    //     console.log(this.categories,this.category)
    //   },()=>{})
    // },
    showCateMenu(selectedCate){
      eventHub.$emit('showCateMenu',selectedCate)
    }
  }
}
</script>
