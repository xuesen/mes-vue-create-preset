const webpack = require('webpack')
const path = require('path')
const CompressionPlugin = require("compression-webpack-plugin")
module.exports = {
  runtimeCompiler: true,
  filenameHashing: true,
  // 将部署应用程序的基本URL
  // 将部署应用程序的基本URL。
  // 默认情况下，Vue CLI假设您的应用程序将部署在域的根目录下。
  // https://www.my-app.com/。如果应用程序部署在子路径上，则需要使用此选项指定子路径。例如，如果您的应用程序部署在https://www.foobar.com/my-app/，集baseUrl到'/my-app/'.

  publicPath: process.env.NODE_ENV === 'production' ? './' : './',

  // outputDir: 在npm run build时 生成文件的目录 type:string, default:'dist'

  outputDir: 'dist',

  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    // config.module
    //   .rule('fonts')
    //   .test(/\.(code|eot|ttf|otf|woff|woff2?)(\?.*)?$/)
    //   .use('url-loader')
    //   .loader('url-loader')
    //   .tap(options => Object.assign(options, {
    //     limit: 1024000
    //   }))

    // config.module
    //   .rule('i18n')
    //   .resourceQuery(/blockType=i18n/)
    //   .type('javascript/auto')
    //   .use('i18n')
    //   .loader('@kazupon/vue-i18n-loader')
    // 拆包
    config.optimization.splitChunks({
      chunks: 'all',
      name: true,
      // minSize: 100000,
      // maxSize: 2000000,
      cacheGroups: {
        'element-ui': {
          test: /[\\/]node_modules[\\/]element-ui[\\/]/,
          name: 'element-ui',
          priority: 108
        },
        'xlsx': {
          test: /[\\/]node_modules[\\/]xlsx[\\/]/,
          name: 'xlsx',
          priority: 107
        },
        'gojs': {
          test: /[\\/]node_modules[\\/]gojs[\\/]/,
          name: 'gojs',
          priority: 106
        },
        'lodash': {
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          name: 'lodash',
          priority: 105
        },
        'mes-common': {
          test: /[\\/]node_modules[\\/]@itc-mes[\\/]common[\\/]/,
          name: 'mes-common',
          priority: 104
        },
        'mes-maintain-element': {
          test: /[\\/]node_modules[\\/]@itc-mes[\\/]maintain-element[\\/]/,
          name: 'mes-maintain-element',
          priority: 103
        },
        // split modules
        'vendors': {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -20
        }
      }
    })

    config.resolve.alias.set('lodash', path.resolve(process.cwd(), 'node_modules', 'lodash'))
    config.resolve.alias.set('bn.js', path.resolve(process.cwd(), 'node_modules', 'bn.js'))
    // 优化lodash
    config.plugin("moment_locale")
      .use(new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(zh-cn|zh-tw|)$/i))
  },
  transpileDependencies: [
    '@itc-mes/common/packages',
    '@itc-mes/maintain-element/packages'
  ],
  configureWebpack: config => {
 
    const plugins = []
    // start 生成 gzip 压缩文件
    plugins.push(
        new CompressionPlugin({
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/, // 处理所有匹配此 {RegExp} 的资源
            threshold: 102400,// 只处理比这个值大的资源。按字节计算(楼主设置10K以上进行压缩)
            minRatio: 0.8 // 只有压缩率比这个值小的资源才会被处理
        })
    )

    // End 生成 gzip 压缩文件
    config.plugins = [...config.plugins, ...plugins]
  },
  //   css: {
  //     loaderOptions: {
  //       // 给 sass-loader 传递选项
  //       sass: {
  //         // @/ 是 src/ 的别名
  //         // 所以这里假设你有 `src/variables.scss` 这个文件
  //         data: '@import "mes-maintain-element/packages/styles/variables.scss";'
  //       }
  //     }
  //   },
  // pages:{ type:Object,Default:undfind }
  /*
  构建多页面模式的应用程序.每个“页面”都应该有一个相应的JavaScript条目文件。该值应该是一
  个对象，其中键是条目的名称，而该值要么是指定其条目、模板和文件名的对象，要么是指定其条目
  的字符串，
  注意：请保证pages里配置的路径和文件名 在你的文档目录都存在 否则启动服务会报错的
  */
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.ts',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      chunks: ['element-ui', 'xlsx', 'gojs', 'lodash', 'mes-common', 'mes-maintain-element', load_modules'vendors', 'index']
    }
    // when using the entry-only string format,
    // template is inferred to be `public/subpage.html`
    // and falls back to `public/index.html` if not found.
    // Output filename is inferred to be `subpage.html`.
    // subpage: 'src/subpage/main.js'
  },

  //   lintOnSave：{ type:Boolean default:true } 问你是否使用eslint
  lintOnSave: true,
  // productionSourceMap：{ type:Bollean,default:true } 生产源映射
  // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
  productionSourceMap: true,
  // devServer:{type:Object} 3个属性host,port,https
  // 它支持webPack-dev-server的所有选项

  devServer: {
    port: 8090, // 端口号
    host: 'localhost',
    https: false, // https:{type:Boolean}
    compress: true, // 启用Gzip压缩
    open: true, // 配置自动启动浏览器
    // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
    proxy: {
      '/datacenterservice': {
        target: 'http://10.190.80.224:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/datacenterservice': ''
        }
      },
      '/dataimportservice': {
        target: 'http://10.190.80.224:3001',
        changeOrigin: true,
        pathRewrite: {
          '^/dataimportservice': ''
        }
      }
    }
  }
}
