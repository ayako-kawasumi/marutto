import Vue from 'vue'
import Vuex from 'vuex'
import Category from './classes/category'
import Item from './classes/item'
import {readFileAsync,writeFileAsync} from '../js/promisify'
import {JSON_PATH,CONFIG_PATH} from './master'
import themeColors from './theme-colors'
import eventHub from './event-hub'
Vue.use(Vuex)

const store = new Vuex.Store({
  state:{
    canSort:false,
    categories:[],
    selectedCategory:{},
    config:{}
  },
  mutations:{
    setCategories(state,categories){
      state.categories = categories
    },
    setSelectedCategory(state,selectedCategory){
      state.selectedCategory = selectedCategory
    },
    addCategory(state,obj){
      state.categories.push(new Category(obj))
    },
    addItem(state,item){
      state.selectedCategory.items.push(item)
    },
    setConfig(state,config){
      state.config = config
    },
    switchSortMode(state){
      state.canSort = !state.canSort
    }
  },
  actions:{
    async getCategories(store){
      const res = await getJsonData(JSON_PATH,'[]')
      const data = res.map(p=>{
        p.isDisabled = false
        return new Category(p)
      })
      store.commit('setCategories',data)
      store.dispatch('getSelectedCategory',data[0] || new Category())
    },
    async deleteCategory(store,index){
      store.state.categories.splice(index,1)
      store.dispatch('save',this.categories)
    },
    async getSelectedCategory(store,selectedCategory){
      store.commit('setSelectedCategory',selectedCategory)
    },
    async save(store,data){
      await writeFileAsync(JSON_PATH,JSON.stringify(data),'utf8')
    },
    async getConfig(store){
      const init = {
        fontSize:13,
        themeColor:themeColors[1]
      }
      const config = await getJsonData(CONFIG_PATH,JSON.stringify(init))
      store.commit('setConfig',config)
      document.getElementById('theme').href = config.themeColor.css
    },
    async saveConfig(store){
      const config = store.state.config
      await writeFileAsync(CONFIG_PATH,JSON.stringify(config),'utf8')
    },
    async addNewItem(store,obj){
      const item = new Item(obj)
      await item.getIcon()
      store.commit('addItem',item)
      const categories = store.state.categories
      store.dispatch('save',categories)
    },
    async deleteItem(store,index){
      store.state.selectedCategory.items.splice(index,1)
      store.dispatch('save',store.state.categories)
    }
  }
})
export default store

async function getJsonData(jsonPath,str){
  let result
  try{
    result = JSON.parse(await readFileAsync(jsonPath,'utf8'))
  }catch(e){
    await writeFileAsync(jsonPath,str,'utf8')
    result = JSON.parse(str)
  }
  return result
}