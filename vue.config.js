module.exports={

    lintOnSave:false,
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
    }

}