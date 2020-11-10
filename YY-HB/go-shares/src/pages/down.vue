<template>
  <div id="home">  
      <down-load @click="getAPP" :isGetBtn="isGetBtn"></down-load> 
  </div>
</template>

<script>
import DownLoad from '../components/DownLoad.vue'
import {getPromote} from '../network/index'
export default {
    name:'home',
    components:{ 
        DownLoad,
    },
    data(){
        return {
            isDowns:false,
            isGetBtn:false,  
        }
    },
    mounted(){ 
       this.initApp()
    },
    methods:{ 
        initApp(){            
            var userAgent = navigator.userAgent//.toLowerCase()
            // if(userAgent.match(/MicroMessenger/i) == "MicroMessenger"){
            if(userAgent.indexOf("MicroMessenger") === -1){   
                this.isGetBtn = true 
            }else{
                this.isGetBtn = false   
            }
        },
        getAPP(type){   
            let android = 'http://apk.yiyichina.cn/tq9s'
            let ios = 'http://apk.yiyichina.cn/tq9s'
            if(type === "android"){ 
                getPromote(android,'GET').catch() 
            }else if(type ==="ios"){
                getPromote(ios,'GET').catch() 
            } 
        },
    },

    
}
</script>

<style>

</style>