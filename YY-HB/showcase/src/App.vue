<template>
  <div id="app"> 
      <div id="main">
          
        <div id="navigation">
            <ul v-for="(item,index) in goodNav" :key="index">
                <li class="item_list" @click="navClick(index)"
                :class="currentIndex === index ? 'active' : ''">{{item}}</li>
            </ul>
        </div>
        
        <div id="goodslist">
            <div class="sort_group" v-for="(goods,index) in goodItem" :key="index" v-show="currentIndex === index">
                <div class="title">{{goodNav[index]}}</div>       
                <ul>
                    <li class="item_group"  v-for="(foods,index) in goods" :key="index">  
                        <div class="item_img"><img :src="foods.goodsPic"></div>
                        <div class="item_cont">                   
                            <div class="tit">{{foods.goodsName}}</div> 
                            <div class="info">库存：0</div>  
                            <div class="info">销量：0</div>  
                            <div class="boot"> 
                                <div class="price red">{{parseFloat(foods.merchPrice/100).toFixed(2)}}元/{{foods.goodsUnit}}</div>
                                <div class="nosale">售罄</div>
                            </div> 
                        </div>
                    </li>
                </ul>
            </div> 
        </div> 

      </div>
  </div>
</template>

<script>    
import GoodsList from './assets/goods.json'
export default {
    name:'App', 
    data(){
        return { 
            goodsData:GoodsList.data,
            goodNav:'',
            goodItem:'',
            currentIndex:0,
        }
    },
    mounted(){
        const data = this.goodsData.breakfastGoods
        this.goodNav = Object.keys(data)
        this.goodItem = Object.values(data) 
    },
    methods:{ 
        navClick(e){
            this.currentIndex = e 
        },
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
    #main{
        display: flex;
        height: 100vh;
    }

    #navigation{
        width: 26vw;
        text-align: left; 
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
    }
    #navigation .item_list{
        margin: .5rem;
        font-size: 1rem; 
        padding: .5rem;
        border-radius: 4px;
        font-weight: bold;
        background-color: #ffffff; 
    }  
    #navigation .item_list.active{
        color: #46b959;
         background-color: #f2f2f2; 
    }  
    #goodslist{
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 75vw;
        background-color: #ffffff; 
    } 
    .sort_group{
        padding: .5rem;
        width: 100%;
    }
    .sort_group .title{
        font-size: 1.2rem;
    }
    .sort_group .item_group{
        display: flex; 
        padding: .5rem 0;
    }
    .sort_group .item_group .item_img{
        width: 6rem;
        height: 6rem;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        justify-items: center;
        border-radius: .2rem;
    }
    .sort_group .item_group .item_img img{ 
        max-height: 100%;
    }
    .sort_group .item_group .item_cont{
        padding: 0 .5rem;
        width: 52%;
    }
    .sort_group .item_group .item_cont .tit{
        font-weight: bold;
        padding-bottom: .2rem;
    }
    .sort_group .item_group .item_cont .info{
        color: #777;
        font-size: .8rem;
    }
    .sort_group .item_group .item_cont .info.red{
        color: #ff0000;
    }
    .sort_group .item_group .item_cont .boot{
        padding-top: .3rem;
        font-size: 1rem;
        display: flex; 
        justify-content: space-between;
        align-items: center;
    }
    .sort_group .item_group .item_cont .boot .price{
        color: #ff0000;
    }
    .sort_group .item_group .item_cont .boot .nosale{
        color: #999;
        font-size: .8rem;
    }

    @media (max-width: 320px) {  
        
    }
        
    @media (min-width: 375px) {   
        
    }

</style> 