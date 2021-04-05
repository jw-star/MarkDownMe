module.exports={

    lintOnSave:false,
    
  css: {
    extract: false
  }
,
    devServer: {
        // port: '8088', //指定前端访问的端口号
        proxy: {
            '/api': {
                target: 'https://api.github.com',//代理地址
                changeOrigin: true,//是否允许开启代理
                ws: true,
                pathRewrite: {//代理地址重写
                    '^/api': ''
                }
            }

        }
    },
    configureWebpack: config => {
        //生产环境取消 console.log
        if (process.env.NODE_ENV === 'production') {
          config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        }
      }

}