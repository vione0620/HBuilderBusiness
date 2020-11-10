import Vue from 'vue'
import App from './App'
import store from './store/index.js';

//全局 
Vue.prototype.$store = store
Vue.config.productionTip = false

App.mpType = 'app'
 

//共用配置
import $config from './network/config.js'
Vue.prototype.$config = $config

//引入请求
import $request from './network/requrest.js'
Vue.prototype.$request = $request
 
//引入api请求
import $api from './network/api.js'
Vue.prototype.$api = $api 

// import $daliy from 'network/daliy.js'
// Vue.prototype.$daliy = $daliy
 


const app = new Vue({
	store,
	...App,
})
app.$mount()
