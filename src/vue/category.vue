<style lang="stylus">
  .category
    box-sizing border-box
    min-height 20px
    input
      background-color inherit
      border none
      width 100%
      outline none
      font-weight bold
</style>
<template>
  <div class="category" :class="{'while-editing':whileEditing}"
       @click="selectCategory"
       @click.right="popupMenu"
       @dragstart="setData">
    <input type="text"
    v-model="category.name"
    :disabled="isDisabled"
    :class="{'is-selected':isSelected}"
    :style="{'font-size':`${config.fontSize}px`}"
    @change="turnIntoDisabled"
    @keydown.enter="turnIntoDisabled"
    ref="name">
  </div>
</template>

<script>
import {remote,shell} from 'electron'
import {mapState} from 'vuex'
import {join} from 'path'
import _ from 'lodash'
import {IMG_DIR} from '../js/master'
import eventHub from '../js/event-hub'
const {Menu,MenuItem} = remote
export default {
  data(){
    return{
      isDisabled:true,
      whileEditing:false,
      showMenu:false
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
    category(){
      return this.categories[this.index]
    },
    isSelected(){
      return _.isEqual(this.category,this.selectedCategory)
    }
  },
  methods:{
    selectCategory(){
      this.$store.dispatch('getSelectedCategory',this.category)
    },
    popupMenu(ev){
      const menu = new Menu()
      const menuList = [
        {
          icon:join(IMG_DIR,'edit.png'),
          label:'Rename',
          click:()=>{
            this.isDisabled = false
            this.whileEditing = true
            this.$nextTick(()=>this.$refs.name.focus())
          }
        },
        {
          icon:join(IMG_DIR,'star.png'),
          label:'Open all',
          click:()=>{
            eventHub.$emit('showMessage',`このカテゴリのアイテムをすべて開きます\n${this.category.name}`,()=>{
              this.category.items.forEach(i=>{
                shell.openExternal(i.path)
              })
            })
          }
        },
        {
          icon:join(IMG_DIR,'trash-2.png'),
          label:'Delete',
          click:()=>{
            eventHub.$emit('showMessage',`このカテゴリを削除しますか？\n${this.category.name}`,()=>{
              this.$store.dispatch('deleteCategory',this.index)
            })
          }
        }
      ]
      menuList.forEach(m=>{
        menu.append(new MenuItem(m))
      })
      menu.popup({
        window:remote.getCurrentWindow(),
        x:ev.x,
        y:ev.y
      })
    },
    async turnIntoDisabled(){
      const res = this.categories.find((c,i)=>{
        if(i !== this.index){
          return c.name === this.category.name
        }
      })
      if(res){
        return eventHub.$emit('showMessage','カテゴリ名が重複しています')
      }
      this.isDisabled = true
      this.whileEditing = false
      this.$store.dispatch('save',this.categories)
    },
    setData(ev){
      const {dataTransfer:dt} = ev
      dt.setData('marutto',this.category)
    }
  }
}
</script>