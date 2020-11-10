import Vue from 'vue'
import App from './App.vue'
import VueAMap from 'vue-amap'
import router from './router'

Vue.config.productionTip = false

//高德地图
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '842cc0edc0ce22bb3b1df0fbfece4b17',
  plugin: ['Autocomplete', 'PlaceSearch', 'Scale', 'OverView', 'ToolBar', 'MapType', 'PolyEditor', 'AMap.CircleEditor']
})




new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
