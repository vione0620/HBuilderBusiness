<template>
	<view id="YYmall"> 
		
		<template v-if="isload">
			<default-page :load="true"></default-page>
		</template>
		<template v-if="isnohave">
			<default-page :nohave="true"></default-page>
		</template>
		
		<template v-if="isready">
			<view class="markTips">温馨提示：点击热门标签将商品加入到热门分类</view>  
			<view class="mian-wrap">
				 
				<view class="navbar-left">
					<scroll-view scroll-y :scroll-into-view="scrollInto" show-scrollbar="true" scroll-with-animation :scroll-top="left_scroll"
					class="navbar-main left_height">
						<block v-for="(items,index) in mallSrot" :key="'4' + index">
							<view class="navlist"
							:id="'navid'+ index" @click="changeTab(index)"
							:class="tabIndex === index?'navlist-avtice':''">
								{{items}}
							</view> 
						</block>
					</scroll-view>
				</view>
				
				<view class="detail-right"> 
					<scroll-view scroll-y :scroll-into-view="scrollInto" show-scrollbar="true" scroll-with-animation @scroll="myscroll"
					class="right-main" :style="'height:'+ scrollH +'px;'">
						<view class="swiper-item" v-for="(goods,index) in mallFoods" :key="'7'+index">  
						  <goods-group :goods="goods" :id="'gdsItem' + index"></goods-group> 
						</view> 
					</scroll-view> 
				</view>
			</view> 
			
			<mall-cart :bottomCart="this.bottomCars"></mall-cart>
				
		
		</template>
		
	</view>
</template>

<script>  
	import {mapState} from 'vuex'
	import {b64Md5,hexMD5} from '@/network/md5.js'	
	import {getSortAscii} from '@/common/util/utils.js'	 
	
	import UniBadge from '@/components/uni/uni-badge.vue' 
	import GoodsGroup from '@/components/basic/cartbox/goods-group.vue' 
	import DefaultPage from '@/components/basic/default-page.vue'  
	import MallCart from '@/components/basic/mall-cart.vue'  
	export default {
		computed:{
			...mapState(['mallSrot','mallFoods','cartGoods','goodsTopScroll'])
		},
		components:{
			UniBadge, 
			GoodsGroup,
			DefaultPage,
			MallCart,
		},
		data() { 
			return { 		 
				loginWhether:'',//登陆状态
				userStore:'', //用户信息
				merchNo:'', //商户号
				index:0,
				tabIndex:0, 
				scrollH:600,
				scrollInto:"",  //左侧索引
				left_height: 0, //左侧总高度
				left_scroll:0,  //左侧滑动值
				sortList:[],
				goodsList:[],
				bottomCars:{},
				downOrderTime:'', 
				isload:true,
				isnostore:false,
				isnohave:false,
				isready:false, 
			}
		}, 
		onLoad() {  
			this.loginWhether = uni.getStorageSync('status') 
			this.userStore = uni.getStorageSync('user')
			this.merchNo = uni.getStorageSync('user').merchNo				 	
		},  
		onReady() {  
			uni.getSystemInfo({
				success:res=>{
					this.scrollH = res.windowHeight - 104
				}
			})  
		},
		onShow() {		
			this.setDownOrderTime() 
			let setordertime = '(' + this.downOrderTime + ')'
			if(this.downOrderTime){
				uni.setNavigationBarTitle({
					title:`商家下单${setordertime}` 
				})				
			} 
		},  
		created() {
			this.handleFunc() 
		},
		methods: {
			async handleFunc(){
				await this.getBreakfastGoods()
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
			 
			setDownOrderTime(){
				let dtime = uni.getStorageSync('downtime') 
				if(dtime == this.downOrderTime){ 
				}else{
					this.downOrderTime = dtime 
				} 
			},
			 // 获取数据
			getBreakfastGoods(){
				let vVlue = {"merchNo":this.merchNo} //必传 
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				
				this.$request.post('getBreakfastGoods',{
				  ...vVlue, 
				  "sign": sSign
				},{
					token:true
				}).then((res)=>{ 
					
					this.$api.initPage(res.code,res.message)
					if(res.code == 200){
						let resData = res.data							
						//交给vuex
						this.$store.commit('receive_mall_goods',resData) 
						this.$store.commit('clear_cart',[])						
						setTimeout(()=>{
							this.isload = false
							this.isready = true
							if(resData.length == 0){
							 	this.isnohave = true
								
							}
						},300) 
						//存储更新下单时间
						this.downOrderTime = resData.downOrderTime
						uni.setStorageSync('downtime',resData.downOrderTime)
							
					} 
						
				}).catch()  
				
			 }, 
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

<style lang="scss">
	
	.lodingmore{
		text-align: center;
		padding: 20rpx;		
	}
	.loding{
		width: 100vw;
		padding: 200rpx;
		display: flex; 
		justify-content: center;
		align-items: center;
	}
	#YYmall{ 
		width: 100vw;
		// height:calc(100vh - 120rpx);
		// padding:120rpx 20rpx 0 20rpx;
		padding: 16rpx;
		
		.mian-wrap{
			
			
			position: relative; 
			display: flex; 
			width: 100%;
			justify-content: space-around; 
			
			
				
			.navbar-left{ 
				width: 24vw;  
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
				height: calc(100vh - 115px); 
				border-radius: 12rpx; 
			}
		
		
		}
		 
		 
		
		.markTips{
			// position: absolute;
			// top: 20rpx; 
			margin-bottom: 16rpx;
			padding: 24rpx;
			background-color: #FFFFFF; 
			border-radius: 12rpx;
			font-size: 26rpx;
			width: 100%;
		}
		
		  
	}

</style>
