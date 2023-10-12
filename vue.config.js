const path = require('path')
const webpack = require('webpack')
const moment = require('moment')
const version = moment().format('YYYYMMDDHHmmss');
const CompressionPlugin = require('compression-webpack-plugin') //压缩插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //样式表打包插件
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

process.env.VUE_APP_ENV = process.env.NODE_ENV

if (process.env.NODE_ENV === 'test') {
  process.env.NODE_ENV = 'production'
}

// vue.config.js
module.exports = {

  outputDir: 'html',

  // publicPath: (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') ? 'xa-center-client' : '/',
  publicPath: '/',

  /*
    Vue-cli3:
    Crashed when using Webpack `import()` #2463
    https://github.com/vuejs/vue-cli/issues/2463
   */
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  // 多入口配置
  // pages: {
  //   index: {
  //     entry: 'src/main.js',
  //     template: 'public/index.html',
  //     filename: 'index.html',
  //   }
  // },
  //  打包app时放开该配置
  //  publicPath:'./',
  configureWebpack: config => {
    //  生产环境取消 console.log
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
      config.output['filename'] = 'js/[name].' + version + '.js' //'js/[name].[contenthash:8].js'
      config.output['chunkFilename'] = 'js/[name].' + version + '.js' //'js/[name].[contenthash:8].js'
    }

  },
  chainWebpack: (config) => {
    // config.cache(true);
    // config.plugin('cache').use(HardSourceWebpackPlugin)

    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@mixins', resolve('src/mixins'))
      .set('@store', resolve('src/store'))
      .set('@tools', resolve('src/tools'))
      .set('@utils', resolve('src/utils'))
      .set('@views', resolve('src/views'))

    //  生产环境，开启js\css压缩
    if (process.env.NODE_ENV === 'production') {

      config.plugin('ignore').use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)) // 忽略/moment/locale下的所有文件
      // config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin) //webpack打包文件分析
      config.plugin('mini-css-extract-plugin').use(new MiniCssExtractPlugin({
        filename: 'css/[name].' + version + '.css',
        chunkFilename: 'css/[name].' + version + '.css'
      }))
      config.plugin('compressionPlugin').use(new CompressionPlugin({
        test: /\.(js|css|less|sass)$/, // 匹配文件名
        threshold: 10240, // 对超过10k的数据压缩
        minRatio: 0.8,
        deleteOriginalAssets: false // 不删除源文件
      }))
    }
    config.plugin('chunkPlugin').use(webpack.optimize.LimitChunkCountPlugin, [{
      maxChunks: 10, // 必须大于或等于 1
      minChunkSize: 10000
    }])

    // 配置 webpack 识别 markdown 为普通的文件
    config.module
      .rule('markdown')
      .test(/\.md$/)
      .use()
      .loader('file-loader')
      .end()

    // 编译某些npm包里的es6代码
    config.module
      .rule('vxe')
      .test(/\.js$/)
      .include
      .add(resolve('node_modules/vxe-table'))
      .add(resolve('node_modules/vxe-table-plugin-antd'))
      .end()
      .use()
      .loader('babel-loader')
      .end()
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */
          'primary-color': '#1890FF',
          'link-color': '#1890FF',
          'border-radius-base': '4px'
        },
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    port: 3002,
    proxy: 'http://127.0.0.1:8777'
  },

  lintOnSave: undefined
}