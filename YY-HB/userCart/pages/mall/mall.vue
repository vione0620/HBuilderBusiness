<template>
	<view id="YYmall">  
		<view class="mian-wrap">		
			  
			<view class="navbar-left">
			 	<scroll-view scroll-y :scroll-into-view="scrollInto" scroll-with-animation
			 	class="navbar-main left_height" show-scrollbar="true">
					<block v-for="(items,index) in mallSrot" :key="index">
						<view class="navlist" @click="changeTab(index)" :class="tabIndex === index?'navlist-avtice':''"> 
							<view :class="items == '热门' ? 'hot' : ''">{{items}}</view>
						</view>  
					</block>
			 	</scroll-view>
			</view>
						
			<view class="detail-right">			 
				<scroll-view scroll-y :scroll-into-view="scrollInto"  :style="'height:'+ scrollH +'px;'" @scroll="myscroll"
				scroll-with-animation class="right-main" show-scrollbar="true">
					<view class="swiper-item" v-for="(item,index) in mallFoods" :key="index" :id="'gdsItem' + index">   
						<view class="title">{{mallSrot[index]}}</view>
						 <goods-group :goods="item" :gimg="goodsImg"></goods-group>
					</view> 					 
				</scroll-view> 
			</view> 
			
		</view> 
		 <mall-cart></mall-cart>  
	</view>
</template>

<script> 
	import {mapState} from 'vuex'	  
	import GoodsGroup from '@/components/goods-group.vue'   	
	import MallCart from '@/components/mall-cart.vue'   
	
	export default {
		components:{  
			GoodsGroup,  
			MallCart,
		},
		data() { 
			return { 
				tabIndex:0,  
				scrollH:500, 
				scrollInto:"",  //左侧索引  
				sortList:[],
				goodsList:[],
				goodsImg:'', 
				bottomCars:[],	 		
			}
		},   
		onReady() { 
			uni.getSystemInfo({
				success:res=>{
					this.scrollH = res.windowHeight - 50
				}
			})  
		}, 
		computed:{
			...mapState(['mallSrot','mallFoods','goodsTopScroll']),
			
			currentIndex:function(){
				const {scrollY,tops} = this
				const index = tops.findIndex((top,index) =>{
					return scroll >=top && scrollY < tops[index + 1]
				})
				return index
			}
		},
		created() {
			this.getUserData() 
		},
		methods: {  
			getUserData(){				
				let url = window.location.search;     
				 
				let urlSite = url.indexOf('?')
				let endSite = url.indexOf('&')
				let urlRes = ''
				if(url.includes('&')){					
				    urlRes = url.slice(urlSite+6,endSite)  
				}else{ 
				    urlRes = url.slice(urlSite+6) 
				}				
				let enddddd = decodeURIComponent(urlRes)
				
				let endDatass = enddddd ? enddddd : 'null'
				let urlDataCat = JSON.parse(endDatass)	   
				let resDataCat = urlDataCat.merch 
				this.goodsImg = resDataCat.picPreUrl  
				let userInfo = {
					user:urlDataCat.user.userNo,
					uid:urlDataCat.user.uid,
					doSign:urlDataCat.doSign,
					merchNo:resDataCat.merchNo,
					merchName:resDataCat.merchName,
					picPreUrl:resDataCat.picPreUrl
				} 
				uni.setStorageSync('getUserInfo',userInfo)  
				
				let goodsData = resDataCat.category 
				let newRes = new Array		
				let nKey = []
				let nVal = []
				for(let i in goodsData){ 
				    let keys = Object.keys(goodsData[i]) 
				    let vals = Object.values(goodsData[i])	
				    nKey = [...nKey,...keys]			
				    nVal = [...nVal,...vals]
				} 		
				this.$store.dispatch('receive_mall_goods',{sort:nKey,goods:nVal}) 
				 
			},			 
			 // 切换选项
			changeTab(index){
			 	if (this.tabIndex === index) {
			 		return;
			 	}
			 	this.tabIndex = index
			 	// 滚动到指定元素
			 	this.scrollInto = 'gdsItem' + index  
			}, 
			// 监听滑动			
			myscroll(e) {  
				let scroll_top = e.detail.scrollTop 				 
				let active_index = this.goodsTopScroll.findIndex((value, index, arr) => { 
					return scroll_top >= value && scroll_top < arr[index + 1] 
				});  
				this.tabIndex = active_index  
			},
		}
	}
</script>

<style lang="scss" scoped>
page{
	background-color: #ffffff; 
	height: 100vh;
} 
.hot{
	color: #FF0000;
}
#YYmall{   
	
	.mian-wrap{  
		display: flex;  
		justify-content: space-between; 		
			
		.navbar-left{ 
			width: 24vw;  
			height:100vh; 
			background-color: #f2f2f2;
			
			.navbar-main{ 
				height: inherit;
				.navlist{ 
					font-size: 32rpx;
					width: 100%; 
					padding: 20rpx;
					box-sizing: border-box;
					border-radius: 6rpx; 
				}
				.navlist-avtice{
					color: #49B75D;
					background-color: #FFFFFF;
				}
			}
			
		}
		.detail-right{     
			width: 75vw;
			height: 100vh;
			.swiper-item{
				padding: 20rpx;
				 .title{
					 font-size: 30rpx; 
					 padding-bottom: 20rpx;
					 font-weight: 700;
				 }   
			} 
		}
		
		
	}
	 
}

</style>
