<template>
    <div id="home">   
        <div v-if="isReady" class="shares"> 
            <!-- <shares :shares="sharesData" @click="getTicket" :isGot="isGot"></shares> -->
            <shares :shares="sharesData" :isGot="isGot"></shares>
        </div> 
        <div v-if="isWelcome" class="welcome">
            <home-welcome @click="goToNext" :welcomeData="welcomeData"></home-welcome>
        </div>
    </div>
</template>

<script> 
import HomeWelcome from '../components/Welcome'
import Shares from '../components/Shares.vue'
import {getPromote} from '../network/index'
// import dsBridge from 'dsbridge' 
export default {
    name:'home',
    components:{ 
        Shares, 
        HomeWelcome, 
    },
    data(){
        return {
            sharesData:{}, 
            welcomeData:{},
            isGot:false,
            isReady:false, 
            isWelcome:false,  
        }
    },
    mounted(){ 
       this.getData() 
    },
    methods:{ 
        // getTicket(){ 
        //     var userAgent = navigator.userAgent
        //     if(userAgent.indexOf("YYAPP") === -1) {    
        //         setTimeout(()=>{
        //             this.isReady = false
        //             this.isDowns = true 
        //             window.location.href = 'dym://yiyi'
        //             this.$router.push({path:'down'}) 
        //         },500)
        //     }else{         
        //         dsBridge.call("clickCoupon",this.sharesData.couponDefCode, function (response) {
        //             if(response == 1){
        //                 this.isGot = true
        //             }
        //         })
        //         dsBridge.register('addValue',function(l,r){
        //             return l+r
        //         })
        //     }    
        // }, 
        getData(){     
            const param = window.location.search     
            // const param = 'http://www.yiyichina.cn/share.html?s=92dd661737d0ec6d47a523ddd0067ce9'
            let _index = param.indexOf('?s=') 
            let urls = param.slice(_index+3)
            
            var userAgent = navigator.userAgent	 
            getPromote(urls)
            .then((res)=>{           
               if(res.code === 200){ 
                   this.sharesData = res.data            
                    //客户端不展示             
                    if(userAgent.indexOf("YYAPP") === -1) {
                        this.isWelcome = false 
                        this.isReady = true 
                    }else{
                        this.isWelcome = false    
                        setTimeout(() => {
                            this.isReady = true  
                        }, 100) 
                    }
                   this.welcomeData = {
                       discountRate:res.data.discountRate,
                       couponType:res.data.couponType,
                       couponName:res.data.couponName,
                       couponAmt:res.data.couponAmt 
                   } 
               }
            })
            .catch()

        },         
        goToNext(){ 
            this.isWelcome = false
            setTimeout(() => {
                this.isReady = true 
            }, 100) 
        }
    },

    
}
</script>

<style lang="sass" scoped> 
#home  
    height: 100%
    .welcome
        background-color:#fc9e39
        height: 100vh 
</style>