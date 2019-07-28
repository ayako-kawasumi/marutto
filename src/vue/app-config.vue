<style lang="stylus">
.app-config
    width 240px
    background-color white
    border-radius 6px
    display flex
    flex-direction column
    justify-content center
    padding 10px
  table
    table-layout fixed
    td:nth-child(1)
      width 60px
  .colors
    height 80px
    overflow-y scroll
    background-color whitesmoke
    padding 0 2px
    .color
      align-items center
      padding-right 2px
      color gray
      label
        display flex
        justify-content space-between
        input
          display none
        .is-selected-theme
          color black
          font-weight bold
        .palette
          display flex
          height 16px
          div
            &:nth-child(1)
              width 20px
            &:nth-child(2)
              width 15px
            &:nth-child(3)
              width 15px
            &:nth-child(4)
              width 15px
  .buttons
    display flex
    justify-content center
    button
      margin 0 1px
</style>
<template>
  <div class="cover" v-if="show">
    <div class="app-config">
      <table>
        <tr>
          <td>Font size</td>
          <td>
            <select v-model="config.fontSize">
              <option value="15">Large</option>
              <option value="13">Medium</option>
              <option value="11">Small</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>Color</td>
          <td>
            <div class="colors">
              <div class="color" v-for="(color,index) in themeColors" :key="index">
                <div>
                  <label :for="color.name">
                    <input type="radio" :id="color.name" :value="color" v-model="config.themeColor">
                    <div :class="{'is-selected-theme':isSelected(color.name)}">{{color.name}}</div>
                    <div class="palette">
                      <div :style="{'background-color':color.color1}"></div>
                      <div :style="{'background-color':color.color2}"></div>
                      <div :style="{'background-color':color.color3}"></div>
                      <div :style="{'background-color':color.color4}"></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </table>
      <div class="buttons">
        <button @click="save">Save</button>
        <button @click="hideMe">Cancel</button>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import eventHub from '../js/event-hub'
import themeColors from '../js/theme-colors'
export default {
  data(){
    return{
      show:false,
      themeColors,
    }
  },
  computed:{
    ...mapState({
      config:'config'
    }),
    isSelected(){
      return function(name){
        return this.config.themeColor.name === name
      }
    }
  },
  created(){
    eventHub.$on('showAppConfig',this.showMe)
  },
  methods:{
    showMe(){
      this.show = true
    },
    hideMe(){
      this.show = false
    },
    save(){
      this.$store.dispatch('saveConfig')
      this.$store.dispatch('getConfig')
      this.hideMe()
    }
  }
}
</script>
