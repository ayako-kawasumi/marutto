const gulp = require('gulp')
const builder = require('electron-builder')

gulp.task('build',()=>{
  return builder.build({
    arch:'ia32',
    config:{
      directories:{
        app:'app',
        output:'dist'
      },
      win:{
        target:'nsis',
        icon:'app/icon.ico'
      },
      nsis:{
        oneClick:true,
        installerIcon:'app/icon.ico',
        artifactName:'${productName}-installer.${ext}'
      }
    }
  })
})

// const rename = require('gulp-rename')
// const UPLOAD_URL = ''
// const {version} = require('./app/package.json')
// const {readFileAsync,writeFileAsync} = require('./src/js/promisify')

// task('build',()=>{
//   return builder.build({
//     config:{
//       directories:{
//         app:'app',
//         output:'dist'
//       },
//       win:{
//         target:[
//           {
//             target:'nsis-web',
//             arch:[
//               'x64',
//               'ia32'
//             ]
//           }
//         ],
//         icon:'app/icon.ico'
//       },
//       nsisWeb:{
//         appPackageUrl:UPLOAD_URL + 'latest'
//       },
//       nsis:{
//         oneClick:true,
//         installerIcon:'app/icon.ico',
//         createDesktopShortcut:'always'
//       },
//     }
//   }).catch((err)=>{
//     console.log(err)
//   })
// })

// task('deploy-installer',done=>{
//   const EXE_PATH = `D://WINXP//marutto//dist//nsis-web/marutto Web Setup ${version}.exe`
//   const DEST_PATH = ''
//   const gulpSrc = src(EXE_PATH)
//     .pipe(rename('marutto-installer.exe'))
//     .pipe(dest(DEST_PATH))
//   gulpSrc.on('finish',()=>{
//     done()
//   })
// })
// task('deploy-app',done=>{
//   const getSpmounter = require('./lib/sp-mounter/index.js')
//   const mounter = getSpmounter('Z')
//   const ZIP_PATH = `D:/WINXP/marutto/dist/nsis-web/marutto-${version}-ia32.nsis.7z`
//   mounter.mount(UPLOAD_URL)
//   const gulpSrc = src(ZIP_PATH)
//     .pipe(rename('latest'))
//     .pipe(dest('Z:\\'))
//   gulpSrc.on('finish',()=>{
//     mounter.unmount()
//     done()
//   })
// })
// task('version-up',async()=>{
//   const INFO_JSON_PATH = ''
//   const data = await readFileAsync(INFO_JSON_PATH,'utf8')
//   const info = JSON.parse(data)
//   info.version = version
//   console.log(info)
//   await writeFileAsync(INFO_JSON_PATH,JSON.stringify(info))
//   return
// })


// task('deploy',
//   series('build',parallel('deploy-installer','deploy-app'),'version-up',function(done){
//     done()
//   })
// )