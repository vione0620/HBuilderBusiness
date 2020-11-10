<template>
  <div id="welcome">
      <div class="title"><i>免费领取优惠券</i></div> 
      <div class="content-bg">
        <div class="content-wrap">
            <div class="card-wrap"> 
              <div class="card-title">{{this.welcomeData.couponName}}</div>
              <div class="card-info">恭喜你获得优惠券</div>
              <div class="card-type">
                <div class="border">
                  <div class="card-type">— 早餐券 —</div>
                  <div class="card-vigor" 
                  v-if="this.welcomeData.couponType == 12">{{this.welcomeData.discountRate / 10}}折优惠</div>
                  <div class="card-vigor" v-if="this.welcomeData.couponType == 10">立减{{this.welcomeData.couponAmt}}元</div>
                </div>
              </div> 
            </div>
          </div>
      </div>

      <div class="footer-wrap">
        <div class="footer-bg"></div>
        <div class="footer-card"></div>
      </div>

      <div class="buttoms">
        <div class="goToNext" @click="goToNext()">点击领券</div>
      </div>
  </div>
</template>

<script>
export default {
    name:'Welcome',
    props: {
        welcomeData: Object, 
    }, 
    data(){
        return { 
        }
    }, 
    methods:{
      goToNext(){
        setTimeout(() => {
          this.$emit('click')
        }, 500);
      },
    },
    
}
</script> 
<style lang="sass" scoped> 
#welcome  
  height: auto
  width: 100vw
  .title
    color:#ffffff
    background-color:#FFA33F
    font-size: 2.2rem
    padding-top: 2rem
    padding-bottom: 2rem
    text-align: center
    font-weight: bolder
    text-shadow: 5px 2px 2px #cd7719
  .content-bg
    background: url('../assets/imgs/card-right.png')
    background-size: 30% 
    background-repeat: no-repeat
    background-origin: content-box
    background-position: right bottom
    background-color:#FFA33F

    .content-wrap 
      width: 100vw 
      display: flex
      align-items: center
      justify-content: center
      text-align: center
      background: url('../assets/imgs/card-left.png') 
      background-size: 11%
      background-position-y: 20%
      background-repeat: no-repeat 
      .card-wrap
        background-color: #ffffff
        background: url('../assets/imgs/card-bg.png')
        background-size: 100%
        background-repeat: no-repeat 
        width: 65.5%
        border-radius: .5rem
        padding: 2rem 1rem 2rem 1rem
        .card-title
          color: #A87B3F
          font-weight: bolder
          font-size: 1.8rem
          padding-bottom: .5rem
        .card-info
          color: #C0A582
          font-size: 1.2rem
          padding-bottom: 1.2rem
        .card-type
          padding: .5rem
          border-radius: .5rem
          background-color: #ffecd4  

          .border
            border:1px dashed #E5A653
            border-radius: .5rem
            padding: .6rem .5rem
            .card-type
              color: #A87B3F
              text-align: center
              font-weight: bolder
              font-size: 1.5rem
            .card-vigor
              color: #DC1010
              text-align: center
              font-weight: bold
              font-size: 2.2rem
              margin-bottom: 1rem
  .footer-wrap
    width: 100vw
    height: 8.5rem  
    position: relative  
    background-image: linear-gradient(#FFA33F, #fb9c36)
    .footer-bg
      height: 76%
      background: url('../assets/imgs/footer-wrap.png')
      background-size: 100%
      background-repeat: no-repeat 
      position: absolute
      z-index: 2
      left: 0
      right: 0
      bottom: 47%
    .footer-card
      position: absolute
      bottom: 50%
      left: 10%
      right: 0
      background: url('../assets/imgs/footer-c.png')
      background-size: 89%
      height: 100%
      background-repeat: no-repeat 
      z-index: 1
  .buttoms
    background-color:#fc9e39 
    display: flex
    align-items: center
    justify-content: center
    margin-top: -3rem
    padding:0 2rem 2rem 2rem
    position: relative
    .goToNext
      background-image: linear-gradient(#f7e39e,#f2d383,#ebbd5d, #e8b34c) 
      width: 80%
      color: #845f09
      font-size: 1.5rem
      font-weight: 500
      text-align: center
      line-height: 1.8
      border-radius: 1.5rem
    .goToNext:hover
      color: #DC1010
      
 



</style>