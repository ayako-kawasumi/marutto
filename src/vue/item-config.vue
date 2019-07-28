<style lang="stylus">
  .item-conf
    width 240px
    background-color white
    border-radius 6px
    display flex
    flex-direction column
    justify-content center
    padding 10px
    color black
    table
      text-align center
      width 100%
      border-collapse collapse
      input
        width 100%
        box-sizing border-box
    div
      display flex
      justify-content center
      margin-top 10px
      button
        margin 0 2px
</style>
<template>
  <div class="cover" v-if="show">
    <div class="item-conf">
      <table>
        <tr>
          <td>Name</td>
          <td><input type="text" v-model="item.name"></td>
        </tr>
        <tr>
          <td>Path</td>
          <td><input type="text" v-model="item.path"></td>
        </tr>
      </table>
      <div>
        <button @click="save">Save</button>
        <button @click="hideMe">Cancel</button>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import eventHub from '../js/event-hub';
export default {
  data(){
    return{
      show:false,
      index:null
    }
  },
  computed:{
    ...mapState({
      categories:'categories',
      selectedCategory:'selectedCategory'
    }),
    item(){
      return this.selectedCategory.items[this.index]
    },
  },
  created(){
    eventHub.$on('showItemConfig',this.showMe)
  },
  methods:{
    showMe(index){
      this.index = index
      this.show = true
    },
    hideMe(){
      this.show = false
    },
    save(){
      this.$store.dispatch('save',this.categories)
      this.hideMe()
    }
  }
}
</script>
