// // vue.config.js  
module.exports = { 
  publicPath: process.env.NODE_ENV === 'production'
  ? 'share/'
  : '/',    
  devServer: {
    proxy: {
      '/anno': {
        target: 'http://www.yiyichina.cn', 
        changeOrigin: true, 
      },
    },
  },
}