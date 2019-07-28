<style lang="stylus">
.message-wrapper
  background-color white
  box-sizing border-box
  padding 10px
  text-align center
  white-space pre
  display flex
  flex-direction column
  justify-content center
  border-radius 6px
  .button-wrapper
    padding 6px
</style>
<template>
  <transition name="trans">
    <div class="cover" v-if="show">
      <div class="message-wrapper">
        <div class="message">{{message}}</div>
        <div class="button-wrapper" v-if="requireAnswer">
          <button @click="selectYes">YES</button>
          <button @click="selectNo">NO</button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import eventHub from '../js/event-hub.js'
export default {
  data(){
    return{
      show:false,
      message:null,
      callback:null,
      cancellCallback:null,
    }
  },
  computed:{
    requireAnswer(){
      return (this.callback || this.cancellCallback) ? true : false
    }
  },
  created(){
    eventHub.$on('showMessage',this.showMe)
  },
  methods:{
    showMe(message,callback,cancellCallback){
      this.show = true
      this.message = message
      this.callback = callback
      this.cancellCallback = cancellCallback
      if(!this.requireAnswer){
        setTimeout(()=>{
          this.hideMe()
        },3000)
      }
    },
    hideMe(){
      this.show = false
      this.callback = null
      this.cancellCallback = null
    },
    selectYes(){
      this.callback ? this.callback() : false
      this.hideMe()
    },
    selectNo(){
      this.cancellCallback ? this.cancellCallback() : false
      this.hideMe()
    }
  }
}
</script>