<template>
	<view> 
		
		<template v-if="isload">
			<default-page :load="true"></default-page>
		</template> 
		
		<view class="ourStock">  
			
			<template v-if="isnostore"> 
				<default-page :nostore="true"></default-page>
			</template> 
			
			<template v-if="isready">
			<view class="mian-wrap"> 
				 
				<view class="navbar-left" :style="'height:'+ scrollH +'px;'">
					<scroll-view scroll-y :scroll-into-view="scrollInto" show-scrollbar="true" scroll-with-animation :scroll-top="left_scroll"
					class="navbar-main left_height">
						<block v-for="(items,index) in stockStock">
							<view class="navlist"
							:id=" 'navid'+ index" @click="changeTab(index)"
							:class="tabIndex === index ? 'navlist-avtice':''" >
								<view :class="items === '热门' ? 'color-red' : '' ">{{items}}</view>
							</view> 
						</block> 
					</scroll-view>
					
				</view>
				
				<view class="detail-right"> 
					
					<scroll-view scroll-y :scroll-into-view="scrollInto" show-scrollbar="true" scroll-with-animation @scroll="myscroll"
					class="right-main" :style="'height:'+ scrollH +'px;'">
						<view class="swiper-item" v-for="(item,index) in stockFoods" :key="index">   
							<goods-group :goods="item" :category="stockStock[index]" :id="'gdsItem' + index"></goods-group> 
						</view> 
					</scroll-view>  
					
				</view>
		
			</view> 
			 
			
		</template>
		
		</view> 
		
		
	</view>
</template>

<script> 
	import {mapState} from 'vuex'
	import {b64Md5,hexMD5,} from '@/network/md5.js'	
	import {getSortAscii, arrayExclude} from '@/common/util/utils.js' 
	
	import GoodsGroup from '@/components/basic/ourstock/goods-group.vue'
	import DefaultPage from '@/components/basic/default-page.vue'		
	export default {
		data() {
			return { 
				loginWhether:'',//登陆状态 
				merchNo:'', //商户号
				tabIndex:0,  
				scrollH:0,
				scrollInto:"",  //左侧索引 
				left_scroll:0,  //左侧滑动值
				ourStock:true, 
				isload:true,
				isnostore:false, 
				isready:false,				  
			}
		},
		computed:{
			...mapState(['stockStock','stockFoods','stockTopScroll'])
		},
		onLoad() { 
			this.loginWhether = uni.getStorageSync('status')  
			this.merchNo = uni.getStorageSync('user').merchNo	 
			
			uni.getSystemInfo({
				success:res=>{
					this.scrollH = res.windowHeight - 44
				}
			}) 
			this.getMerchDayStore('getMerchDayStore',1)
		},
		components:{ 
			GoodsGroup,
			DefaultPage,  
		},  
		methods: { 
			 // 切换选项
			changeTab(index){
			 	if (this.tabIndex === index) {
			 		return
			 	} 
			 	this.tabIndex = index
			 	// 滚动到指定元素
			 	this.scrollInto = 'gdsItem' + index  
			}, 
			getMerchDayStore(post,type){
				let vVlue = {"merchNo":this.merchNo,"merchType":type,} //必传 
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 	  
				
				this.$request.post(post,{
					...vVlue, 
					"sign": sSign,
				},{
					token:true
				}).then(res => {	 
					this.$api.initPage(res.code,res.message) 
					if(res.code == 200){ 
						let resDataStore = res.data.store
						setTimeout(()=>{  
							if(resDataStore.length){ 
								this.isload = false
								this.isnostore = false  
								this.isready = true
								
								let result = resDataStore  		
								let nKeys = []
								let nValue = []
								for(let i in result){
								  let keys = Object.keys(result[i])
								  let val = Object.values(result[i])
								  nKeys = [...nKeys,...keys]
								  nValue = [...nValue,...val]
								}
								 
								this.$store.commit('receive_stock_goods',{
									sort:nKeys,
									goods:nValue,
								})  
								
							}else{ 
								this.isload = false
								this.isready = false	 
								this.isnostore = true  
							}
						},300)
						 
					} 									
				}).catch() 
			}, 
			myscroll(e) {  
				let scroll_top = e.detail.scrollTop 
				let active_index = this.stockTopScroll.findIndex((value, index, arr) => {
					return scroll_top >= value && scroll_top < arr[index + 1]
				}); 
				this.tabIndex = active_index   
			}, 
		},
	}
</script>

<style lang="scss" scoped>
	.ourStock{
		width: 100vw; 
		height:100vh;
		padding: 20rpx;
	 
	.color-red{
		color: #FF0000;
	}
	
	.mian-wrap{ 
		position: relative; 
		display: flex; 
		width: 100%; 
		height: 100%;
		justify-content: space-between;  
			
		.navbar-left{ 
			width: 23vw;  
			height:inherit;
			
			.navbar-main{
				width: 100%;
				height: inherit;
				.navlist{
					padding: 26rpx 10rpx;
					text-align: center;
					align-items: center;
					border-radius: 12rpx;
				}
				.navlist-avtice{
					color: #49B75D;
					background-color: #FFFFFF;
				}
			}
			
		}
		.detail-right{   
			width: 70vw;  
			background-color: #FFFFFF; 
			padding: 20rpx; 
			border-radius: 12rpx; 
		}
		
		
		}  
	}   
	
</style>
