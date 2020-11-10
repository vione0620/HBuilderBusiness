<template>
  <div class="shares">  
    <div class="header">  
      <div class="title">{{sharesData.promoteName}}</div> 
    </div>
    <div class="signage"> 
    <img :src="sharesData.merchPic" :alt="sharesData.merchName"> 
    </div> 
    <ul class="info">
      <li><div class="title">店铺名称：</div><div class="cont">{{sharesData.merchName}}</div></li>
      <li><div class="title">商家编号：</div><div class="cont">{{sharesData.joinNo}}</div></li>
      <li><div class="title">上线时间：</div><div class="cont">{{sharesData.onlineDate}}</div></li>
      <li><div class="title">活动时间：</div><div class="cont">{{(`${sharesData.startDate} 至 ${sharesData.endDate}`)}}</div></li>
      <li><div class="title">上线时间：</div><div class="cont">{{sharesData.merchPhone}}</div></li>
      <li><div class="title">店铺地址：</div><div class="cont">{{sharesData.merchAddr}}</div></li>
    </ul>   
    <div class="ticket" :class="isGot ? 'ticket-got' : ''" @click="getTicket()"> 
        <div class="left">
          <div class="title">{{sharesData.couponName}}</div>
          <div class="subtitle">{{nameType}}</div>
          <div class="time">{{(`${sharesData.effectTime} - ${sharesData.expireTime}`)}}</div>
        </div>
        <div class="right">
          <div v-if="sharesData.couponType == 12">
            <span class="lines">{{sharesData.discountRate/10}}</span>
            <span class="unit">折</span>
          </div> 
          <div v-if="sharesData.couponType == 10">
            <span class="less">减{{parseFloat(sharesData.couponAmt/100)}}元</span>
          </div>
          <div style="text-align:center">点击领券</div>
        </div> 
    </div>
    <div class="location"> 
      <el-amap vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo" dragEnable>
          <el-amap-marker vid="component-marker" :position="center"></el-amap-marker>
          <el-amap-marker vid="component-marker" :position="center" :offset="offset" :content="markcont"></el-amap-marker> 
      </el-amap> 
    </div>
  </div>
</template>


<script>
export default {
    name: 'Shares',
    props: {
        shares: Object,
        isGot: Boolean
    }, 
    data(){ 
        return{
            sharesData:this.shares,   
            zoom:16,
            center:[this.shares.longitude,this.shares.latitude],
            dragEnable: false, //禁止拖拽
            markcont: `<div style="background-color:#aed3ff; white-space:nowrap; padding:4px; border-radius:4px;font-size: 12px; border:solid #3590f5 1px;color: #000">${this.shares.merchName}</div>`,
            offset:[-10,-60], 
        }  
    },  
    methods:{
        getTicket(){
            this.$emit('click')
        }, 
    },
    computed: {
        nameType: function () {
            let use = this.shares.issuerType 
            if(use === 2){
                return `${this.sharesData.merchName}（店可用）`
            }else{
                return `全网可用`
            }
        }
    }, 
}
</script>

<style lang="sass" scoped>
    .amap-demo
        width: 100%
        height: 16rem 
    .shares
        padding: .8rem
        height: auto
        background-color:#f2f2f2
    .header
        padding-bottom: .5rem
        text-align: left
        .title
            font-size: 1.2rem
            font-weight: bold
        .time
            font-size: .8rem
            color: #9a9a9a
    .signage 
        height: 10rem
        border-radius: .2rem   
        display: flex
        justify-content: center 
        img 
            width: 100%
            max-height: 100%
            object-fit: cover
            border-radius: .2rem
    .info 
        padding: .5rem 0
        li
            padding-bottom:4px
            display: flex  
            line-height:1.2 
            .title  
                color: #343434 
            
            .cont
                width: 70%
                text-align: left
    .ticket
        display: flex
        background-color: #F1BC7E
        margin-bottom: 1rem
        padding: .5rem
        border-radius: .2rem
        color: #8e4e03
        align-items: center
        .left
            flex: 7
            text-align: left
            font-weight: bold
            .title
                font-size: 1.2rem
                padding-bottom: .5rem
            .subtitle
                font-size: 1rem
                padding-bottom: .5rem
                border-bottom: 1px solid #8e4e02 
            .time
                font-size: .8rem
                padding-top: .5rem
        .right
            font-weight: bold
            padding-left: .6rem  
            text-align: center
            .lines
                font-size: 2.2rem
            .less
                font-size:1.5rem
            .unit
                font-size: 1.2rem
            .sub
                font-size: 1rem  
        .location
            background-color: #f00f0f0
            width: 100%
            height: 10rem
            border-radius: .5rem
    .ticket-got
        background-color: #d4d4d4
        color: #666 
        .left
            .subtitle
                border-bottom: 1px solid #000 

</style>