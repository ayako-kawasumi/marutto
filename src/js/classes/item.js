import {remote} from 'electron'
export default class Item{
  constructor(obj){
    Object.assign(this,obj)
  }
  async getIcon(){
    const icon = await remote.app.getFileIcon(this.path,{size:'normal'})
    const resized = icon.resize({
      height:18,
      width:18,
      quality:'best'
    })
    this.icon = resized.toDataURL()
  }
}