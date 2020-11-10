import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = () => import('../pages/index') 
const Down = () => import('../pages/down')  
 

export default new VueRouter({
    routes:[ 
        {
          path: '/',
          redirect: '/home', 
        },
        {
            path:'/home',
            component:Home
        }, 
        {
            path:'/down',
            component:Down
        },  
    ],    
    mode: 'hash',
    base:'/',
})