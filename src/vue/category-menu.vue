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
.cate-menu{
  width: 30%;
  height: 74px;
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
.cate-action-button{
  height: 18px;
  width:100%;
  background-color: unset;
  border: unset;
  text-align: left;
  font-size: 12px;
}
.hide-cate-menu-button{
  font-size: 16px;
  font-weight: bold;
  border:none;
  float: right;
  background-color: unset
}
.cate-action-button:hover,.hide-cate-menu-button:hover{
  background-color: rgb(223, 246, 96);
}
.cate-action-button>img{
  float: left;
}
.cate-action-name{
  margin:2px;
  float: left;
}
</style>
<template>
    <transition name="cover">
    <div class="cover" v-if="show" @keydown.esc.prevent="hideMe">
      <div class="cate-menu">
        <button class="hide-cate-menu-button" @click="hideMe">×</button>
        <button class="cate-action-button" @click="renameCate">
          <img src="../lib/edit-button.png">
          <div class="cate-action-name">Rename</div>
        </button>
        <button class="cate-action-button" @click="removeCate">
          <img src="../lib/delete-button.png">
          <div class="cate-action-name">Delete</div>
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
      selectedCate:''
    }
  },
  created(){
    eventHub.$on('showCateMenu',this.showMe)
  },
  computed:
  mapState({
    categories:'categories',
    category:'category'
  }),
  methods:{
    showMe(selectedCate){
      this.show = true
      this.selectedCate = selectedCate
      console.log(this.selectedCate,this.categories,this.category)
    },
    hideMe(){
      this.show = false
    },
    removeCate(){
      this.hideMe()
      eventHub.$emit('yes-no-message',`${this.selectedCate}を削除しますか？`,()=>{
        //storeのcategoriesを更新
        const index = this.categories.findIndex(({name}) => name === this.selectedCate)
        if(index >= 0){
          this.categories.splice(index, 1)
        }
        this.$store.dispatch('saveJsonData',this.categories)
        //storeのcategoryを更新
        if(this.category.name === this.selectedCate){
          if(this.categories.length === 0){
            this.$store.dispatch('getCategory','')
          }else{
            this.$store.dispatch('getCategory',this.categories[0])
          }
        }
        console.log(this.categories,this.category)
      },()=>{})
    },
    renameCate(){
      this.hideMe()
      eventHub.$emit('showNewCate','renameCate',this.selectedCate)
    }
  }
}
</script>
