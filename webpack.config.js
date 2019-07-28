//webpack.config.js
const path = require('path');
//CSSを別ファイルで切り出すためのモジュール
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//{}忘れないように
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  /*重要 electronアプリの場合これがないとimport * as electron from 'electron'でこける
   * webpack4 で、electron、だけではなくrendererかmainを指定するようになった
   * typescript等つかわないのであれば、mainのほうはコンパイルしないだろう
   */
  target:'electron-renderer',
  /*プログラムエントリーポイント*/
  mode:'production',//production or development
  entry:'./src/js/main.js',
  output:{
    /*出力先*/
    path:path.resolve(__dirname, 'app', 'bundle'),
    /*出力ファイル名*/
    filename:'bundle.js',
  },
  resolve:{
    alias:{
      vue$:path.join(__dirname, 'node_modules', 'vue', 'dist', 'vue.esm.js')
    }
  },
  module:{
    rules:[
      {
        test:/\.vue$/,
        loader:'vue-loader'
      },
      {
        test: /\.stylus$/,
        // this matches plain <style> or <style scoped>
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.css$/,
        // this matches plain <style> or <style scoped>
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ]
      },
      {
        test:/\.png$/,
        loader:'url-loader'
      },
      {
        test:/\.xlsx$/,
        loader:'buffer-loader'
      }
    ]
  },
  plugins:[
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename:'bundle.css'
    })
  ],
  devtool:'cheap-eval-source-map'
};