<template>
	<view id="YYmall">  
		<template v-if="isload">
			<default-page :load="true"></default-page>
		</template>
		<template v-if="isnohave">
			<default-page :nohave="true"></default-page>
		</template>
		
		<template v-if="isready">
			<!-- <view class="markTips">温馨提示：点击热门标签将商品加入到热门分类</view>  -->
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
			
			<mall-cart 
			:bottomCart="this.bottomCars" 
			:first-order="this.FirstOrder" 
			:has-final-pay="this.hasFinalPay"
			@open-sum-rebate="openSumRebate" @nums-fulfill="shopNumsFulfill"></mall-cart>
					
		</template>
		
		
		<!-- 凑单提醒begin -->
		<uni-popup ref="openSumRebate" type="center" :backbg="false" :maskClick="false">
			<view class="rebateNum_checked"> 			
				<view class="title">是否继续凑单</view> 
				<view class="content"> 
					支付满300元可领取50元优惠券
				</view>  
				<view class="checkOnShop">
					<view class="checkBtn yes" @tap="checkOnShop(true)">凑单，领取</view>
					<view class="checkBtn no" @tap="checkOnShop(false)">放弃，付款</view>
				</view>
			</view>
		</uni-popup>
		<!-- 凑单提醒end -->
		
	</view>
</template>

<script>  
	import {mapState,mapGetters} from 'vuex'
	import {b64Md5,hexMD5} from '@/network/md5.js'	
	import {getSortAscii} from '@/common/util/utils.js'	  
	
	import UniBadge from '@/components/uni/uni-badge.vue'  
	import GoodsGroup from '@/components/basic/cartbox/goods-group.vue' 
	import DefaultPage from '@/components/basic/default-page.vue'  
	import MallCart from '@/components/BuyMall/mall-cart.vue'
	
	import UniPopup from '@/components/uni/uni-popup.vue' 
	
	export default {
		computed:{
			...mapState(['mallSrot','mallFoods','cartGoods','goodsTopScroll']),
			...mapGetters(['totalCount','totalPrice','prevOrderPrice']), 
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
				newOrderGoods:[], //预支付下单时的商品数据
				bottomCars:{},
				downOrderTime:'', 
				isload:true,
				isnostore:false,
				isnohave:false,
				isready:false,
				FirstOrder:false,
				hasFinalPay:false, 
				webview:false,//电子合同
				prevOrder:[],//上一笔订单
				prevOrderDetail:[],//上一笔订单详情 
				isAds:0,//优惠开关
				eContract:false,//是否签合同
				// orderNums:'', 
			}
		}, 
		onLoad() {  
			this.loginWhether = uni.getStorageSync('status') 
			this.userStore = uni.getStorageSync('user')
			this.merchNo = uni.getStorageSync('user').merchNo
			
			this.$nextTick(()=>{  
				this.getPrevOrder() 
				this.handleFunc()  
			})
			this.getPlatParam()
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
		// created() {
		// 	this.handleFunc() 
		// },
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
			openSumRebate(e){ 
				if(this.isAds == 0){
					this.$refs.openSumRebate.open()					
				}else{
					this.prePayOrder()
				}
			},
			shopNumsFulfill(e){				
				this.prePayOrder()
			},
			checkOnShop(option){
				if(option == true){
					this.$refs.openSumRebate.close()
				}else{
					this.prePayOrder() 
				}
			},  
			getPlatParam(){				
				let vVlue = {"merchNo":this.merchNo}
				let sSort = getSortAscii(vVlue)
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase()  
				
				this.$request.post('getPlatParam',{
				  ...vVlue, 
				  "sign": sSign
				},{
					token:true
				}).then((res)=>{   
					if(res.code == 200){ 
						this.isAds = res.data.actionSwitch						
					}
				})
			},
			perpay(){ 
				//转换商品数据，准备支付时调用
				let getCarList = this.cartGoods
				for(let i in getCarList){
					let res = { 
						goodsNo:getCarList[i].goodsNo,
						goodsNum:JSON.stringify(getCarList[i].boxNums * getCarList[i].goodsQuantity),
						hotSale:getCarList[i].hotSale ? getCarList[i].hotSale : '0',
					}  	
					this.newOrderGoods.push(res)  
				}  
			},	
			prePayOrder(type){
				this.perpay()
				setTimeout(()=>{
					let vVlue = {
						"merchNo":this.merchNo,
						"orderType":1,
						"orderAmt":this.totalPrice,
						"remark":this.markText ? this.markText : '无',
						"orderGoods":JSON.stringify(this.newOrderGoods),
						}  
					let sSort = getSortAscii(vVlue) 
					let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase()   
					
					this.newOrderGoods = []
					this.$request.post('prePayOrder',{
						...vVlue,
						"sign": sSign
					},{
						token:true
					}).then(res => {  	
						if(res.code === 200){	 
							this.$refs.openSumRebate.close() 
							let orderNo = res.data.orderNo 
							// console.log(orderNo,res)
							// uni.setStorageSync('orderNums',res.data.orderNo)
							// this.orderNums = res.data.orderNo
							// if(type =='fulfill'){
								
							// }
							uni.navigateTo({
								url:`/pages/utility/mall/prepay?status=${this.hasFinalPay}&orderno=${orderNo}`,
								animationType: 'pop-in',
								animationDuration: 200,
							}) 
						}else if(res.code === 400){
							uni.showToast({
								icon:'none',
								title:res.message
							})
						}
					}).catch()					
				},0)
			}, 
			// closeAd(){
			// 	this.$refs.openAds.close() 
			// },
			getPrevOrder(){
				let vVlue = {"merchNo":this.merchNo,"orderType":1}  
				let sSort = getSortAscii(vVlue) 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase()    
				
				this.$request.post('getPrevOrder',{
				  ...vVlue, 
				  "sign": sSign
				},{
					token:true
				}).then((res)=>{  
					if(res.code == 200 && res.data){ 
						
						this.prevOrder = res.data
						this.$store.dispatch('receive_previous_order',res.data) 
						 
						if(res.data.orderNo){
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
				let vVlue = {"merchNo":this.merchNo}  
				let sSort = getSortAscii(vVlue) 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase()    
				 
				
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
			top: -30px;
			color: #FFFFFF;
			border: 1px solid #FFFFFF;
			border-radius: 50%; 
			font-size: 32rpx;
			padding: 8rpx 10rpx;
		}
		
	}
	
	.rebateNum_checked{			
		background-color: #FFFFFF;
		border-radius: 8rpx;
		width: 600rpx;
		
		.title{
			text-align: center; 
			font-size: 40rpx;
			font-weight: bold;
			padding: 50rpx 0;
			
			.closePrev{
				position: absolute;
				top: -14rpx;
				right: 0;
				font-size: 48rpx;
			}
		}
		.content{ 
			text-align: center;
			padding: 0 12rpx 60rpx 12rpx;
		}
		
		.checkOnShop{ 
			display: flex;
			padding: 32rpx 0; 
			border-top: 1px solid #ccc;
			.checkBtn{
				flex: 1;
				text-align: center; 
				&:first-child{
					border-right: 1px solid #ccc;
				}
			} 
			.yes{
				color: #09BB07;
				
			}
			.no{
				color: #f00;
			}
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
		padding: 24rpx 16rpx 16rpx 12rpx;
		
		.mian-wrap{ 
			position: relative; 
			display: flex; 
			width: 100%;
			justify-content: space-around;  
				
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
				width: 68vw;  
				background-color: #FFFFFF; 
				height: calc(100vh - 84px); 
				border-radius: 12rpx; 
			}
		
		
		} 
		.markTips{ 
			margin-bottom: 16rpx;
			padding: 24rpx;
			background-color: #FFFFFF; 
			border-radius: 12rpx;
			font-size: 26rpx;
			width: 100%;
		}
		
		
		
		  
	}

</style>
