const proxy = require('http-proxy-middleware')
module.exports = {     
    devServer: { 
        proxy: {
            '/anno':{  //自定义代理名称，使用时须替换掉请求baseUrl，须保持相同
                target:'http://localhost:8080',
                changeOrigin:true,
                pathRewrite:{
                    '/anno':''
                }
            },
        },
    }, 
}