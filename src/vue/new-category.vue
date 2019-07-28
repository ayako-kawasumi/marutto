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
.new-category{
  /* width: 300px;
  height: 60px; */
  background-color: white;
  text-align: center;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  box-shadow: 2px 2px 4px rgb(50, 50, 50);
}
.new-category>input{
  width: 240px;
  height: 24px;
  border: none;
  padding: 10px;
  border-radius: 10px;
  outline: none;
}
</style>
<template>
  <transition name="cover">
    <div class="cover" v-if="show" @keydown.esc.prevent="hideMe">
      <div class="new-category">
        <input placeholder="input category name here & press Enter"
        v-model="newCateName" @keydown.enter.prevent="addNewCate(newCateName)"
        autofocus>
      </div>
    </div>
  </transition>
</template>
<script>
import eventHub from '../js/event-hub.js'
import fs from 'fs'
import {itemJsonPath} from '../js/master.js'
import {mapState} from 'vuex'
export default {
  data(){
    return{
      show:false,
      newCateName:'',
      level:'',
      selectedCate:''
    }
  },
  created(){
    eventHub.$on('showNewCate',this.showMe)
  },
  computed:
    mapState({
      categories:'categories',
      category:'category'
    }),
  methods:{
    showMe(level = 'newCate',selectedCate){
      this.show = true
      this.level = level
      this.selectedCate = selectedCate
    },
    hideMe(){
      this.show = false
    },
    addNewCate(newCateName){
      if(!newCateName){
        return this.hideMe()
      }
      let jsonData
      //*******新規のカテゴリ追加*******
      if(this.level === 'newCate'){
        jsonData = this.mergeData(newCateName)
        
      //******************************
      //*****既存のカテゴリの名前変更*****
      }else if(this.level === 'renameCate'){
        const index = this.categories.findIndex(({name}) => name === this.selectedCate)
        console.log(this.categories[index])
        jsonData = this.changeData(newCateName,index)
      }
      //*******************************
      jsonData.then(result=>{
          this.$store.dispatch('saveJsonData',result)
          if(!this.category){
            this.$store.dispatch('getCategory',this.categories[0])
          }
        })
      this.hideMe()
      this.newCateName = ''
    },
    mergeData(newCateName){
      return new Promise((resolve)=>{
        //*******重複チェック*******
        let sameName = 0
        this.categories.forEach(obj => {
          if(newCateName === obj.name){
            sameName++
          }
        })
        if(sameName > 0){
          this.hideMe()
          this.newCateName = ''
          return eventHub.$emit('message','その名前は使用済みです。','error')
        }
        //*************************
        //元々のjsonのデータに新しいデータを追加する。
        this.categories.push({
          name:newCateName,
          paths:[]
        })
        resolve(this.categories)
      })
    },
    changeData(newCateName,index){
      return new Promise((resolve)=>{
        //*******重複チェック*******
        let sameName = 0
        this.categories.forEach(obj => {
          if(newCateName === obj.name){
            sameName++
          }
        })
        if(sameName > 0){
          this.hideMe()
          this.newCateName = ''
          return eventHub.$emit('message','その名前は使用済みです。','error')
        }
        //*************************
        this.categories[index].name = newCateName
        resolve(this.categories)
      })
    }
  }
}
</script>