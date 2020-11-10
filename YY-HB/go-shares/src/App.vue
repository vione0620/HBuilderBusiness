<template>
  <div id="app"> 
    <transition>
        <router-view></router-view>
    </transition> 
  </div>
</template>

<script>  

export default {
    name:'App',
    data(){
        return { 
        }
    }, 
} 
</script>

<style> 
    body {
        padding:0;
        margin:0;
    }
    ul,li{
        list-style: none;
        padding:0;
        margin:0;
        }
    #app{ 
        -webkit-font-smoothing: antialiase;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        font-size: 16px; 
    }
    
@media (max-width: 320px) {  
    .card-info{
        padding-bottom: .8rem !important;
    }
    .card-wrap{
        padding: 1rem !important;
    }
    .footer-wrap{ 
        height: 7rem !important;
        background-image: linear-gradient(#fc9f39, #fb9c36) !important;
    }
     
    #welcome .title{ 
        padding-top: 2rem !important;
        padding-bottom: 1rem !important;
    }
}
    
@media (min-width: 375px) {   
    .footer-card{
        left: 11% !important;
        background-size: 88% !important;
    } 
}

</style> 