export default class Category{
  constructor(obj){
    this.items = []
    Object.assign(this,obj)
  }
}