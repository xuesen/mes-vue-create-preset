module.exports = (api, options, rootOptions) => {
  // 复制并用 ejs 渲染 `./template` 内所有的文件
  api.render('../template')
  // api.render('https://itc-gitlab.itc.inventec/frontend-for-MES/mes-pda-portal-preset/-/archive/master/mes-pda-portal-preset-master.zip?path=template/src/pages')  
  // 修改 `package.json` 里的字段
  api.extendPackage({
    'scripts': {
      'serve': 'vue-cli-service serve',
      'serve.production': 'vue-cli-service serve --mode production',
      'build': 'vue-cli-service build',
      'lint': 'vue-cli-service lint'
    },
    dependencies: {
      'core-js': '^3.6.4',
      'register-service-worker': '^1.7.1',
      'vue': '^2.6.11',
      'vue-class-component': '^7.2.3',
      'vue-property-decorator': '^8.4.1',
      'vue-router': '^3.1.6',
      'vuex': '^3.1.3',
      'vue-i18n': '^8.11.2',
      'axios': '^0.19.2',
      '@itc-mes/maintain-element': '',
      'vue-session': '^1.0.0',
      'lodash-es': '^4.17.15',
      "compression-webpack-plugin": "^6.0.5",
      'module': "^1.2.5"
    },
    devDependencies: {
      'svg-sprite-loader': '^4.2.5'
    }
  })
  api.render({
    './.env.development'     : '../template/.env.development',
    './.env.production'       : '../template/.env.production'
  })  
}