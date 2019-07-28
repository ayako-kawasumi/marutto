<style lang="stylus">
html,body,.app
  height 100%
  width 100%
  margin 0
  padding 0
  box-sizing border-box
  font-family 'メイリオ'
  font-size 13px
  overflow hidden
  -webkit-app-region no-drag
  .header
    height 24px
    display flex
    justify-content flex-end
    -webkit-app-region drag
    button
      margin 1px 2px
      padding 0px
      font-size 20px
      border-radius unset
      -webkit-app-region no-drag
    .sort
      transform rotate(90deg)
  .body
    display flex
    height calc(100% - 24px)
    .left
      width 40%
      overflow-y scroll
    .right
      width 60%
      overflow-y scroll
</style>
<template>
  <div class="app" @keydown.tab.prevent>
    <div class="header">
      <button class="normal" title="AddCategory" @click="addCategory">
        <span class="icon-plus-square"></span>
      </button>
      <button class="normal sort" title="SortMode" :class="{'can-sort':canSort}" @click="switchSortMode">
        <span class="icon-repeat"></span>
      </button>
      <button class="normal" title="Config" @click="showAppConfig">
        <span class="icon-list"></span>
      </button>
      <button class="warn" title="Close" @click="close">
        <span class="icon-x"></span>
      </button>
    </div>
    <div class="body" @drop.prevent="recieve" @dragenter.prevent @dragover.prevent>
      <draggable class="left"
                 :list="categories"
                 :animation="200"
                 :delay="50"
                 :move="checkMove">
        <category v-for="(c,index) in categories" :key="index" :index="index"/>
      </draggable>
      <draggable class="right"
                 :list="selectedCategory.items"
                 :animation="200"
                 :delay="50"
                 :move="checkMove">
        <item v-for="(i,index) in selectedCategory.items" :key="index" :index="index"/>
      </draggable>
    </div>
    <app-conf/>
    <item-conf/>
    <message/>
  </div>
</template>
<script>
import {remote} from 'electron'
import {mapState} from 'vuex'
import draggable from 'vuedraggable'
import appConf from './app-config.vue'
import category from './category.vue'
import item from './item.vue'
import itemConf from './item-config.vue'
import message from './message.vue'
import {statAsync} from '../js/promisify'
import eventHub from '../js/event-hub';
export default {
  data(){
    return{}
  },
  computed:{
    ...mapState({
      canSort:'canSort',
      config:'config',
      categories:'categories',
      selectedCategory:'selectedCategory'
    })
  },
  components:{
    draggable,
    appConf,
    category,
    item,
    message,
    itemConf
  },
  async created(){
    await Promise.all([
      this.$store.dispatch('getConfig'),
      this.$store.dispatch('getCategories')
    ])
  },
  mounted(){
  },
  methods:{
    addCategory(){
      let newName
      for(let i = 1;;i++){
        newName = `New Category${i}`
        const regExp = new RegExp(`^${newName}$`)
        const newCategories = this.categories.find(c=>{
          return c.name.match(regExp)
        })
        if(!newCategories){
          break
        }
      }
      this.$store.commit('addCategory',{name:newName})
      this.$store.dispatch('save',this.categories)
    },
    switchSortMode(){
      this.$store.commit('switchSortMode')
    },
    showAppConfig(){
      eventHub.$emit('showAppConfig')
    },
    async recieve(ev){
      const {dataTransfer:dt} = ev
      if(dt.getData('marutto')){
        return
      }
      console.log(dt,dt.items)
      const files = Array.from(dt.files)
      if(files.length){
        await Promise.all(
          files.map(async f=>{
            const stat = await statAsync(f.path)
            const obj = {
              type:stat.isDirectory() ? 'dir' : 'file',
              name:null,
              path:f.path
            }
            this.$store.dispatch('addNewItem',obj)
          })
        )
      }else{
        const url = dt.getData('text/plain')
        const obj = {
          type:'url',
          name:null,
          path:url,
          browser:'default'
        }
        this.$store.dispatch('addNewItem',obj)
      }
    },
    close(){
      remote.app.quit()
    },
    checkMove(){
      return this.canSort
    },
  }
}
</script>
