<template>
    <div id="download"> 
        <div class="main">
            <div class="logo">
                <img src="../assets/imgs/yy_download@2x.png">
            </div>
        </div>
        <div class="name">移移</div>
        <div v-if="!isGetBtn" class="info">微信/QQ内无法下载应用，用在浏览器中打开</div>
        <div v-if="isGetBtn">
            <div class="bottoms">  
                <a href="http://res.yiyichina.cn/yiyi.apk" class="gobtn">安卓下载</a>
            </div> 
            <div class="bottoms">   
                <!-- http://itunes.apple.com/us/app/id1441621965          -->
                <a href="#" class="gobtn">苹果下载</a>
            </div>
        </div>
        <div v-if="!isGetBtn" class="fiexd">请点击右上角<br>选择“浏览器中打开” <span class="arrow"></span></div>
    </div>
</template>

<script>
export default {
    name:'DownLoad',
    props:{
        isGetBtn:Boolean
    }, 
}
</script>

<style lang="sass" scoped>
#download
    .main
        background-color:#f3f3f3
        height: 30vh
        width: 100vw
        display: flex
        align-items: flex-end
        justify-content: center
        .logo
            width: 100px
            height: 100px
            img
                max-width: 100%
    .name 
        text-align: center
        background-color:#f3f3f3
        font-size:1.2rem
        padding:1rem 0 3rem 0
    .info
        font-size: .8rem
        text-align: center
        padding-top:1.5rem
    .fiexd
        background-color:#5AB431
        color:#fff
        font-size:.8rem
        position: fixed
        top:.5rem
        right:0.5rem
        padding:0.5rem
        border-radius:.5rem
        text-align: center
        line-height:1.2
        .arrow
            display: inline-block
            vertical-align: text-top
            margin-top: -28px
            margin-left: -3px
            margin-right: -12px
            width: 0
            height: 0
            border-left: 8px solid transparent
            border-right: 8px solid transparent
            border-bottom: 12px solid #5ab431
            transform: rotate(30deg)
        
    .bottoms
        width: 100vw
        display: flex 
        justify-content: center
        padding-top:1.5rem
        .gobtn
            background-color:#5AB431
            color:#ffffff
            border-radius:1.2rem
            width: 40%
            padding:.5rem 1.5rem
            text-align: center
            margin:0 .8rem
            text-decoration: none



    
</style>
 