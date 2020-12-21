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
			
			<mall-cart :bottomCart="this.bottomCars" :first-order="this.FirstOrder" :has-final-pay="this.hasFinalPay"></mall-cart>
					
		</template>
		
		<uni-popup ref="openAds" type="center" :backbg="false" :maskClick="false">
			<view class="pop_content">
				<image src="../../../static/popbg.png" mode="aspectFit"></image>
				<view class="title iconfont iconclose" @tap="closeAd()"></view> 
				
			</view>
		</uni-popup>
		
	</view>
</template>

<script>  
	import {mapState} from 'vuex'
	import {b64Md5,hexMD5} from '@/network/md5.js'	
	import {getSortAscii} from '@/common/util/utils.js'	 
	
	import UniBadge from '@/components/uni/uni-badge.vue'  
	import GoodsGroup from '@/components/basic/cartbox/goods-group.vue' 
	import DefaultPage from '@/components/basic/default-page.vue'  
	import MallCart from '@/components/BuyMall/mall-cart.vue'
	
	import UniPopup from '@/components/uni/uni-popup.vue' 
	
	export default {
		computed:{
			...mapState(['mallSrot','mallFoods','cartGoods','goodsTopScroll'])
		},
		components:{
			UniBadge,  
			GoodsGroup,
			DefaultPage,
			MallCart,
			UniPopup, 
		},
		data() { 
			return { 		 
				loginWhether:'',//登陆状态
				userStore:'', //用户信息
				merchNo:'', //商户号
				mallTitle:'',//标题
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
				FirstOrder:true,
				hasFinalPay:false, 
				webview:false,//电子合同
				prevOrder:[],//上一笔订单
				prevOrderDetail:[],//上一笔订单详情
				isRegular:0,//是否新用户
			}
		}, 
		onLoad() {  
			this.loginWhether = uni.getStorageSync('status') 
			this.userStore = uni.getStorageSync('user')
			this.merchNo = uni.getStorageSync('user').merchNo
			
			this.$nextTick(()=>{ 
				this.isRegular = uni.getStorageSync('isRegular').isRegular
				
				this.getPrevOrder()
				if(this.isRegular == 1){
					this.getPrevOrder()
					this.FirstOrder = false
				}
				//根据状态如果是首次下单
				let agreeChecked = uni.getStorageSync('agreeChecked')
				
				if(this.FirstOrder && !agreeChecked){  
					setTimeout(()=>{
						this.$refs.openAds.open()
					},500) 
				}else{  
					setTimeout(()=>{
						this.$refs.openAds.open()
					},500)  
				} 
			})
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
			openEcontract(){
				this.webview = true
				uni.navigateTo({
					url:'../../../hybrid/html/e_contract/e_contract'
				})
			},
			back() { 
				uni.navigateBack({ 
					delta:1
				})
			},	
			closeAd(){
				this.$refs.openAds.close()
				let agreeChecked = uni.getStorageSync('agreeChecked')
				if(!agreeChecked){ 
					setTimeout(()=>{
						this.openEcontract()
					},1000)					
				} 
			},
			getPrevOrder(){
				let vVlue = {"merchNo":this.merchNo,"orderType":1} //必传 
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				
				this.$request.post('getPrevOrder',{
				  ...vVlue, 
				  "sign": sSign
				},{
					token:true
				}).then((res)=>{ 
					this.$api.initPage(res.code,res.message)
					if(res.code == 200){ 
						this.prevOrder = res.data
						this.$store.dispatch('receive_previous_order',res.data) 
						
						if(this.prevOrder.payState == 0){
							this.hasFinalPay = true 
						}
					}
				})
			},
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
							if(!resData){
							 	this.isnohave = true								
							}
						},300) 
						//存储更新下单时间
						const downState = resData.closeDownOrder
						this.closeDownOrder = downState
						if(downState.state == 1){
							uni.showModal({
								title:'下单提醒',
								content:`${downState.content} ${downState.closeStartTime} - ${downState.closeEndTime}`,
								showCancel:false,
								success: (res) => {
									if(res.confirm){
										uni.navigateBack({
											animationDuration:2000,
											delta:1,
										})
									}
								}
							})
						}else if(downState.state == 0){ 
							this.downOrderTime = resData.downOrderTime
							uni.setStorageSync('downtime',resData.downOrderTime)
						}
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
	.pop_content{   
		position: relative;
		left: -30rpx;
		.title{ 
			position: absolute;
			right: -30rpx;
			top: 0;
			color: #FFFFFF;
			border: 1px solid #FFFFFF;
			border-radius: 50%; 
			font-size: 32rpx;
			padding: 8rpx 10rpx;
		}
		
	}
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
			margin-bottom: 50rpx;
			padding: 0rpx;
			background-color: #FFFFFF; 
			border-radius: 80rpx;
			font-size: 26rpx;
			width: 80%;
		}
		
		
		
		  
	}

</style>
