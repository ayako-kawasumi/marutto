//git bundle create marutto.bundle HEAD master

const el = require('electron')
const {join} = require('path')
const {app} = el
let mainWindow
/*electronのセキュリティわーにんぐを抑制*/
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '0'
const isDev = process.execPath.includes('electron.exe')
global.isDev = isDev
global.rootDir = __dirname

app.on('ready',()=>{
  const path = require('path')
  const fullPath = path.join(__dirname,'html','index.html')
  const {BrowserWindow} = el
  mainWindow = new BrowserWindow({
    height:200,
    minHeight:200,
    width: 300,
    minWidth: 300,
    resizable: true,
    frame:false,
    icon:join(__dirname,'icon.ico'),
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.loadFile(fullPath)
  const isDev = process.execPath.includes('electron.exe')
  if(isDev){
    const devtool = path.join(__dirname,'..','node_modules','vue-devtools','vender')
    BrowserWindow.addDevToolsExtension(devtool)
    mainWindow.webContents.openDevTools()
  }
  // mainWindow.removeMenu()
  mainWindow.on('close',()=>{
    app.quit()
  })
})