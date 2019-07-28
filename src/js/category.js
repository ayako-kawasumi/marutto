import {itemJsonPath} from './master.js'
import fs from 'fs'
export default class Category{
  // constructor(obj){//constructorは、下のstatic createでnewされたときに実行される。
  //   Object.assign(this, obj)
  //   this.privilege = JSON.parse(this.privs || '{}')
  // }
  // static create(obj){
  //   return new Category(obj)
  // }
  static getAllCategories(){
    return new Promise((resolve)=>{
      let jsonData
      fs.readFile(itemJsonPath,'utf8',(err,data)=>{
        if(err){
          fs.writeFile(itemJsonPath,'[]',()=>{
            fs.readFile(itemJsonPath,'utf8',()=>{})
          })
          jsonData = []
        }else{
          jsonData = JSON.parse(data)
        }
        resolve(jsonData)
      })
    })
  }
}
