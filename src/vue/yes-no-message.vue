<style>
.message-wrapper{
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0%;
  left: 0%;
  background-color: rgba(54, 54, 54, 0.8);
}

.yes-no-message{
  width: 60%;
  height: 50%;
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  text-align: center;
  font-size: 12px;
  margin: 6% auto;
  box-shadow: 2px 2px 4px rgb(20, 20, 20);
  padding: 20px;
}
.yes-no-message-area{
  height: 70%;
  overflow-x: hidden;
  overflow-y: auto;
}
.button-area{
  margin-top: 10px;
}
.button-area>button{
  /* border: solid gray 1px; */
  background-color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
}

.yes-no-message-enter-active,.yes-no-message-leave-active{
  transition: all 0.3s ease;
  right: 0;
}

.yes-no-message-enter,.yes-no-message-leave-to{
  opacity: 0;
  right: -100%;
}
  
</style>

<template>
<transition name="yes-no-message">
  <div  class="message-wrapper" v-if="show">
    <div class="yes-no-message" :class="level">
      <div class="yes-no-message-area">
        {{message}}
      </div>
      <div class="button-area">
        <button @click="selectYes">yes</button>
        <button @click="selectNo">no</button>
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
      message:'',
      callback:null,
      cancelCallback:null,
      level:'',
    }
  },
  created(){
    eventHub.$on('yes-no-message',this.showMe)
  },
  methods:{
    showMe(message,callback=()=>{}, cancelCallback=()=>{}){
      this.show = true
      this.message = message
      this.callback = callback
      this.cancelCallback = cancelCallback
    },
    selectYes(){
      this.callback()
      this.close()
      return true 
    },
    selectNo(){
      this.cancelCallback()
      this.close()
      return false
    },
    close(){
      this.show = false
      this.callback = null
      this.cancelCallback = null
    },
  }
}
</script>