const {remote} = require('electron')
const {join} = require('path')
const rootDir = remote.getGlobal('rootDir')
const IMG_DIR = join(rootDir,'css','themes')
module.exports = [
  {
    name:'Basic',
    css:join(IMG_DIR,'basic.css'),
    color1:'#222831',
    color2:'#393e46',
    color3:'#00adb5',
    color4:'#eeeeee'
  },
  {
    name:'Blue',
    css:join(IMG_DIR,'blue.css'),
    color1:'#00204a',
    color2:'#005792',
    color3:'#00bbf0',
    color4:'#d9faff'
  },
  {
    name:'Green',
    css:join(IMG_DIR,'green.css'),
    color1:'#344419',
    color2:'#556b2f',
    color3:'#bdb76b',
    color4:'#ffffff'
  },
  // {
  //   name:'brown',
  //   css:join(IMG_DIR,'brown.css'),
  //   color1:'#c36a2d',
  //   color2:'#e2c275',
  //   color3:'#eadca6',
  //   color4:'#f4f4f4'
  // },
  // {
  //   name:'red',
  //   css:join(IMG_DIR,'red.css'),
  //   color1:'#ff5151',
  //   color2:'#ff8571',
  //   color3:'#f0f8ff',
  //   color4:'#ffffff'
  // },
  {
    name:'Pastel',
    css:join(IMG_DIR,'pastel.css'),
    color1:'#ffe1eb',
    color2:'#fffff0',
    color3:'#d3d3f7',
    color4:'#87ceeb'
  },
  {
    name:'Violet',
    css:join(IMG_DIR,'violet.css'),
    color1:'#182952',
    color2:'#1c1852',
    color3:'#2b3595',
    color4:'#e14594'
  },
]