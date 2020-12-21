<template> 
	<view class="wrap">  
	 <uni-nav-bar :status-bar="true" :fixed="true" left-icon="arrowleft" @clickLeft="back()" title="商家订单列表" color="#ffffff" background-color="RGBA(70, 184, 91, 1)" />
 
 
	<template v-if="isload">
		<default-page :load="true"></default-page>
	</template>
	<template v-if="isnohave">
		<default-page :nohave="true"></default-page>
	</template>
	
	<template v-if="isready">

 
	<view id="oderList"> 
		
		<view v-if="!Nothing">
		<block v-for="(orderItem,index) in orderList"><!-- :key="'orderItem' + index"> -->
			<view class="group">
				<view class="head">
					<view class="tit">  
						<text class="titIcon iconfont iconstauts-ing"></text> 
					
						<template v-if="orderItem.payState==1">
							<template v-if="orderItem.orderState == 0">
								<view class="titTxt">商家下单</view> 							
							</template>
							<template v-if="orderItem.orderState == 1"><text class="titTxt">工厂接单（配送中）</text></template>
							<template v-if="orderItem.orderState == 2"><text class="titTxt">已确认收货</text></template> 
						</template>
						<template v-else>
							<template v-if="orderItem.payState == 0"><view class="titTxt isright">待付款</view></template>
							<template v-if="orderItem.payState == 2"><view class="titTxt">支付失败</view></template>
						</template> 
								
					</view><view class="time">{{orderItem.orderTime}}</view>
				</view>
				
				<template v-if="orderItem.subOrder.length > 0"> 
					<view class="sub_cont">					
						<view class="itemBlock">
							<block v-for="(itemList,cindex) in orderItem.subOrder">
								<view class="subwrap">									
									<view class="sigleTitle">
										<view class="title_type">配送 {{cindex +1}}</view> 
										<view class="btn_type">
											<view class="btn btn_run" 
											v-if="itemList.orderState == 1" 
											@tap="rightBtn({list:itemList.orderNo,from:'suborder',tStates:orderItem.orderType,Pindex:index,Cindex:cindex})">确认收货</view>
											<view class="btn btn_ok" 
											v-if="itemList.orderState == 2">订单完成</view>
										</view>
									</view>
									<view class="sigleWrap" @tap="navTo({page:itemList.orderNo,from:'suborder',tStates:itemList.orderType})">
										
										<block v-for="(child,index) in itemList.content.slice(0,3)">							
											<view class="sigleItem">
												<view class="name">{{child.goodsName}}</view>
												<view class="unit">{{child.goodsNum}} {{child.goodsUnit}}</view>
											</view>  
										</block>
									</view>	
									<template v-if="itemList.content.length > 3">
										<view class="more">						
											<view class="">···</view>
											<view class="gotobtn" @tap="navTo({page:itemList.orderNo,from:'suborder',tStates:itemList.orderType})">查看其余{{itemList.content.length -3}}件</view>
										</view>
									</template>					 
								</view> 
							</block>
						</view>
					</view>	
				</template>
				
				<template v-if="orderItem.content.length > 0"> 
					<view class="main_cont" @tap="navTo({page:orderItem.orderNo,from:'parents',tStates:orderItem.orderType})">					
						<view class="itemBlock">
							<block v-for="(itemList,index) in orderItem.content.slice(0,3)"><!-- :key="'itemList' + index"> -->
								<view class="sigleItem">
									<view class="name">{{itemList.goodsName}} <view v-if="itemList.hotSale == 1" class="hots">&nbsp;&nbsp; 热门</view></view>
									<view class="unit">{{itemList.goodsNum}} {{itemList.goodsUnit}}</view>
								</view> 
							</block>
						</view>
						<template v-if="orderItem.content.length > 3">
							<view class="more">						<!-- @tap="navTo(orderItem.orderNo)" -->
								<view class="">···</view>
								<view class="gotobtn">查看其余{{orderItem.content.length-3}}件</view>
							</view>
						</template>
					</view>				
				</template>
				
				<view class="footbtn">
					<view class="left-footbtn" v-if="orderItem.content.length > 0">
						<template v-if="orderItem.payState==1">
						<view class="checkOk isfeed" v-if="orderItem.orderState == 2">订单完成</view>
						
						</template>
						<template v-if="orderItem.orderState !== 2 && orderItem.orderType !== 2">
							<view class="checkOk isright" @tap="rightBtn({list:index,from:'parents'})">确认收货</view> 
						</template>
						<template v-if="orderItem.payState == 0 && orderItem.orderType !== 2">
							<view class="checkOk isno" @tap="checkOkBtn(index)">继续支付</view> 
						</template>
						<template v-if="orderItem.orderType==2">
							<view class="checkOk isfeed">失效订单</view>							
						</template>
					</view> 
					
					<view class="left-footbtn" v-if="orderItem.subOrder.length > 0">	
						<template v-if="orderItem.payState==1">
							<view class="checkOk isfeed" v-if="orderItem.orderState == 2">订单完成</view> 
						</template>
						<template v-if="orderItem.payState == 0 && orderItem.orderType !== 2">
							<view class="checkOk isno" @tap="checkOkBtn(index)">继续支付</view> 
						</template>		
						<template v-if="orderItem.orderType == 2">
							<view class="checkOk isfeed">失效订单</view>							
						</template>				
					</view>  
					
					<view class="right-moeny">{{parseFloat(orderItem.realAmt/100).toFixed(2)}} <text class="txt">元</text></view> 
					
				</view>
				
			</view>
		</block>
		</view>
		<view class="lodingMore" v-if="!Nothing">{{loadmore}}</view>
		
		<uni-popup ref="popup" type="bottom" :maskClick="false">
			<view class="pay_checked" style=""> 
				<view class="title">合计：{{PayActual}}元</view>
				<view class="get_coupon">
					<view class="group"> 
						<view class="left">满减券/优惠</view>
						<view class="right" @tap="navtoGetCoupon('thisone')"> 							
							<view :class="this.got ? 'txt' : ''">{{this.couponid}}</view>
						</view> 
					</view>
				</view>
				<view class="totalNum"> 
					<view class="left">待支付总计：</view> 
					<view class="right"> {{Payable}}元</view>
				</view> 
				<view class="totalNum" v-if="this.getCouponId || this.clock">
					<view class="left">实际应支付：</view>
					<view class="right"> {{PayActual}}元</view>
				</view>
				
				
				<radio-group @change="radioChange">
					<pop-up names="支付宝支付" iconImg="alipay">
						<view slot="radioPay"><radio :value="checktype[0]" color="#09BB07" /></view>
					</pop-up>
					<pop-up names="微信支付" iconImg="weixin">
						<view slot="radioPay"><radio :value="checktype[1]" color="#09BB07" /></view>
					</pop-up>
				</radio-group>
				<btn-foot title="去支付" class="topayBtn" @tap="toPayBtn()"></btn-foot> 
			</view>
		</uni-popup>
		 
		
		</view>
		
	
	</template>
		
		
	</view>
</template>

<script>
	import {mapState,mapGetters} from 'vuex'
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii, arrayExclude,handleDate,handleYesterday,} from '@/common/util/utils.js'
	
	import UniPopup from '@/components/uni/uni-popup.vue'
	import UniNavBar from '@/components/uni/uni-nav-bar.vue'
	
	import BtnFoot from '@/components/basic/btn-foot.vue'
	import PopUp from '@/components/BuyMall/rk-pop.vue'
	import DefaultPage from '@/components/basic/default-page.vue'
	 
	
	export default {
		data() {
			return {
				loginWhether:'',//登陆状态 
				merchNo:'', //商户号
				orderList:[], 
				pages:1,
				loadmore:'上拉加载更多',
				btnIndex:'',
				totalPrice:'', 
				Nothing:false,
				navtoDetail:'',
				navtoIndex:'',
				checktype:['alipay','weixin'],
				chooseType:'', 
				isload:false,
				isnohave:false,
				isready:false, 
				couponid:'',
				actualPay:'', 
				got:false, 
				clock:false,
			}
		},
		onLoad() { 			 
			this.loginWhether = uni.getStorageSync('status')  
			this.merchNo = uni.getStorageSync('user').merchNo		 
			
			this.getBreakfastOrder()
			
			this.$store.dispatch('get_coupon_id','')
			this.$store.dispatch('get_cart_amt','') 
		},
		computed:{ 
			...mapState(['userOrderList','getCouponId','getCartAmt','getUnusualAmt','getUnusualNo']), 
			Payable:function(){
				return this.numFloat(this.totalPrice).toFixed(2)
			},
			PayActual:function(){
				let actualNums = ''
				if(this.clock){					
					let org = this.totalPrice,
						now = this.getUnusualAmt ? this.getUnusualAmt : 0; 
					actualNums = this.numFloat(org - now).toFixed(2) 
				}else{
					let org = this.totalPrice,
						now = this.getCartAmt ? this.getCartAmt : 0 ;
					
					actualNums = this.numFloat(org -now).toFixed(2) 					
				}
				
				return actualNums
			},
		},
		onShow() { 
			if(this.getCouponId){  
				let c_one = parseFloat(this.getCouponId.limitAmt/100),
					c_two = parseFloat(this.getCouponId.couponAmt/100)
					
				this.got = true
				this.couponid = `满${c_one}减${c_two}`
				
				this.actualPay = this.numFloat(this.totalPrice - this.getCouponId.couponAmt) 		
			
			}else{ 
				this.couponid = '不使用优惠券'
			}
			
			
		},
		components:{ 
			UniPopup,
			UniNavBar,
			PopUp,
			BtnFoot,
			DefaultPage
		},  
		onReachBottom(){
			let initPages = this.pages+1
			let morePages = initPages++
			this.pages = morePages 
			
			uni.showLoading({
				title: '加载中'
			}) 
			let vVlue = {"merchNo":this.merchNo,"pageNum":morePages,"pageLimt":'20',} //必传 
			let sSort = getSortAscii(vVlue) ///排序
			let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 
			 
			this.$request.post('getBreakfastOrder',{
				...vVlue, 
				"sign": sSign
			},{
				token:true
			}).then(res => {   
				this.$api.initPage(res.code,res.message)
				if(res.code === 200){
					setTimeout(()=>{											
						uni.hideLoading()	 
						if(res.data.length){  
							this.orderList = [...this.orderList,...res.data]   							
						}else{
							this.pages-- 
							this.loadmore  = res.data.length < 20 ? '没有更多了' : '上拉加载更多';
						} 
						
					},500)	  
				}
			}).catch(err=>{  
				this.page--; 
			}) 
		},
		methods: {	  
			numFloat(param){
				return parseFloat(param / 100)
			},
			navtoGetCoupon(){ 
				if(!this.clock){
					uni.navigateTo({
						url:'../../account/coupon/usable?type='+ this.totalPrice,
					})					
				}else{
					uni.showLoading({
						icon:'none',
						title:'已选，不可修改',
						duration: 2000
					})
				}
			},
			back() { 
				uni.navigateBack({ 
					url: '../../utility/index/index'
				})
			},		
			radioChange(e){
				this.chooseType = e.target.value  
			},
			toPayBtn(){				 
				let getPayType = this.chooseType				
				switch (getPayType){
					case 'alipay':
						this.payAlipay() 
					break;
					case 'weixin':
						this.payWeixin() 
					break;					
				} 				
			}, 
			payAlipay(){  
				let oderInfo = this.userOrderList 
				
				let vVlue = '' 
				if(this.getCouponId.couponNo && !this.clock){ 
					vVlue = {
						"merchNo":this.merchNo,
						"orderNo":oderInfo[this.btnIndex].orderNo,
						"couponNo":this.getCouponId.couponNo ? this.getCouponId.couponNo : ''
						} //必传 
				}else if(this.clock){
					// getUnusualNo 
					vVlue = {
						"merchNo":this.merchNo,
						"orderNo":oderInfo[this.btnIndex].orderNo,
						"couponNo":this.getUnusualNo ? this.getUnusualNo : ''
						} //必传 
					
				}else{  
					vVlue = {
						"merchNo":this.merchNo,
						"orderNo":oderInfo[this.btnIndex].orderNo, 
						} //必传 
				}
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码  
				this.$request.post('aliPayOrder',{
					...vVlue,
					"sign":sSign
				},{
					token:true
				}).then(res => { 
					let ordinfo = res.data.toString() 
					uni.requestPayment({
						provider: 'alipay',
						orderInfo: ordinfo,
						success: (res)=>{ 
							uni.reLaunch({ 
								url:'../../utility/index/index'
							})
							this.clock = false
						},
						fail: (err)=>{ 
							this.$refs.popup.close()
							uni.showToast({
								icon:'none',
								title:'支付失败',
								duration: 2000
							}) 
						},
						complete:()=>{
							this.$store.dispatch('get_coupon_id','')
							this.$store.dispatch('get_cart_amt','')								
						},
						
					});
				}).catch()
			},
			payWeixin(){  
				let oderInfo = this.userOrderList 
				 
				let vVlue = ''
				if(this.getCouponId.couponNo){
					vVlue = {
						"merchNo":this.merchNo,
						"orderNo":oderInfo[this.btnIndex].orderNo,
						"couponNo":this.getCouponId.couponNo ? this.getCouponId.couponNo : ''
						} //必传 
				}else if(this.clock){
					// getUnusualNo 
					vVlue = {
						"merchNo":this.merchNo,
						"orderNo":oderInfo[this.btnIndex].orderNo,
						"couponNo":this.getUnusualNo ? this.getUnusualNo : ''
						} //必传 
					
				}else{ 
					vVlue = {
						"merchNo":this.merchNo,
						"orderNo":oderInfo[this.btnIndex].orderNo, 
						} //必传 
				}
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 	 
				this.$request.post('wxPayOrder',{
					...vVlue,
					"sign":sSign
				},{
					token:true
				}).then(res => { 
					let getRes = res.data
					if(res.code === 200){  						
						let getOrderInfo = {
							"appid": getRes.appId,
							"noncestr": getRes.nonceStr,
							"package": getRes.packageValue,
							"partnerid": getRes.partnerId,
							"prepayid": getRes.prepayId,
							"timestamp": getRes.timeStamp,
							"sign":getRes.sign,
						}  

						uni.requestPayment({
						    provider: 'wxpay',
						    orderInfo: getOrderInfo,
							success: (res)=>{ 
								uni.reLaunch({ 
									url:'../../utility/index/index'
								}) 
								this.clock = false
							},
							fail: (err)=>{ 
								this.$refs.popup.close()
								uni.showToast({
									icon:'none',
									title:'支付失败',
									duration: 2000
								})   
							},
							complete:()=>{
								this.$store.dispatch('get_coupon_id','')
								this.$store.dispatch('get_cart_amt','')								
							},
						}) 
						
					} 
					 
				}).catch() 
			},
			checkOkBtn(index){  
				//当前页继续支付  
				let orderInfo = this.userOrderList  
				this.totalPrice = orderInfo[index].realAmt
				this.btnIndex = index; 
				
				let getoNo = orderInfo[index].orderNo 
				//获取不寻常订单信息getUnusual 
				this.getOrderCoupon(getoNo) 				 
			},	 
			//获取不寻常订单信息
			getOrderCoupon(option){
				let vVlue = {"merchNo":this.merchNo,"orderNo":option} //必传 
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 
				this.$request.post('getOrderCoupon',{
					...vVlue,
					"sign": sSign
				},{
					token:true
				}).then(res => {  						
					if(res.code == 200){
						let resData = res.data 
						if(resData.fristPay == 0){
							//首次支付 
							this.$refs.popup.open()
						}else{
							//下单成功-锁定单 
							if(resData.coupon.length){
								this.clock = true
								this.couponid = `满${resData.coupon[0].limitAmt / 100}减${resData.coupon[0].couponAmt / 100}` 
								let unusual = {
									amt:resData.coupon[0].couponAmt,
									no:resData.coupon[0].couponNo
								} //resData.coupon[0].couponAmt
								this.$store.dispatch('get_unusual_amt',unusual)
							}
							//继续支付							
							this.$refs.popup.open()
						}
					}else{							
						uni.showToast({
							icon:'none',
							title:res.message,
							duration: 2000
						})
					
					}
				}).catch() 
			},
			rightBtn(type){ 	
				if(type.from == "parents"){					
					this.reachConfirm(type.list)				
				}else if(type.from == "suborder"){ 
					let vVlue = {"merchNo":this.merchNo,"orderNo":type.list} //必传 
					let sSort = getSortAscii(vVlue) ///排序
					let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 	 	
					
					let pindex = this.orderList[type.Pindex].subOrder
					let cindex = pindex[type.Cindex]
				
					uni.showModal({
						title: '确认收货',
						content: '请确认您已准确无误收到货',
						success: (res)=>{
							if (res.confirm) {								
								this.$request.post('reachConfirm',{
									...vVlue,
									"sign": sSign
								},{
									token:true
								}).then(res => {  
									if(res.code == 200){ 					
										uni.showToast({ 
											icon:'none',
											title:res.message,
											duration: 2000
										})
										
										cindex.orderState = 2
									}else{									
										uni.showToast({
											icon:'none',
											title:res.message,
											duration: 2000
										})
									}							
								}).catch()  			
							} 
						}
					})
				}
				
			}, 
			reachConfirm(type){ 
				
				let oderInfo = this.userOrderList
				let vVlue = {"merchNo":this.merchNo,"orderNo":oderInfo[type].orderNo} //必传 
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 	 				
				
				uni.showModal({
					title: '确认收货',
					content: '请确认您已准确无误收到货',
					success: (res)=>{
						if (res.confirm) {								
							this.$request.post('reachConfirm',{
								...vVlue,
								"sign": sSign
							},{
								token:true
							}).then(res => {  
								if(res.code == 200){ 					
									uni.showToast({ 
										icon:'none',
										title:res.message,
										duration: 2000
									})
									this.orderList[type].orderState = 2
								}else{									
									uni.showToast({
										icon:'none',
										title:res.message,
										duration: 2000
									})
								}							
							}).catch()  			
						} 
					}
				}) 
			},
			getBreakfastOrder(){   
				let vVlue = {"merchNo":this.merchNo,"pageNum":'1',"pageLimt":'20',} //必传 
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 		  
				this.$request.post('getBreakfastOrder',{
					...vVlue, 
					"sign": sSign
				},{
					token:true
				}).then(res => {  
					this.$api.initPage(res.code,res.message)
					if(res.code == 200){
						let resData = res.data	 
						setTimeout(()=>{								
							this.isload = false
							this.isready = true
							if(resData.length){
							 
								this.orderList = resData 
								this.$store.dispatch('receive_order_list',resData)  
								this.loadmore  = res.data.length < 20 ? '没有更多了' : '上拉加载更多';
							}else{
							 	this.isload = false
							 	this.isnohave = true
							}
						},300)	
					} 										
				}).catch() 
			}, 
			
			navTo(option) {  
				if(option.from == "suborder"){
					if(option.tStates !== 2){		 
						uni.navigateTo({ 
							url:`./list_detail?orderNo=${option.page}&from=${option.from}`
						})
					}
				}else{
					if(option.tStates !== 2){						
						uni.navigateTo({ 
							url:`./list_detail?orderNo=${option.page}&from=parents` 
						})
					}					
				}
			},
		},
	}
</script>

<style lang="scss">
	page{
		width: 100vw;
	}
	#oderList{
		padding: 32rpx;
		width: 100%;
		
		.Nothing{
			height: 200rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #999999;
			font-size: 38rpx;
			padding: 80rpx; 
		}
		
		.group{
			padding: 20rpx 32rpx;
			border-radius: 12rpx;
			background-color: #FFFFFF;
			margin-bottom: 32rpx;
			
			.head{
				border-bottom: 1rpx solid #cccccc;
				padding: 16rpx 0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				.tit{
					font-size: 30rpx;
					display: flex;
					align-items: center;
					
					.titIcon{
						font-size: 40rpx;
						color: #46B85B;
					}
					.titTxt{}
				}
				.time{
					font-size: 22rpx;
				}
			}
			
			.sub_cont{
				.itemBlock{
					width: 100%; 
					padding: 20rpx;
					.subwrap{
						border-bottom:1px solid #f2f2f2;
						background-color: #FFFFFF;
						.sigleTitle{ 
							width: 100%;
							text-align: center; 
							border-radius: 6rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							padding: 20rpx; 
							background-color: #f9f9f9;
							border-bottom: 1px dashed #dddddd;
							.title_type{
								color: #F00;
							}
							.btn_type{  
								.btn{
									border-radius: 4rpx;
									width: 160rpx;
									font-size: 28rpx;
									padding: 8rpx 0;
								}
								.btn_ok{ 
									color: #777;
									border:1px solid #cccccc;
								}
								.btn_run{ 
									background-color: #46b85b;
									border:1px solid #46b85b;
									color: #FFFFFF;
								}
							}
						}
						.sigleWrap{
							width: 100%; 
							padding: 20rpx;
							.sigleItem{
								display: flex;
								padding: 8rpx 0;
								justify-content: space-between;
								
								.name{
									font-size: 28rpx;
									display: flex;
									align-items: flex-start;
									.hots{
										font-size: 20rpx;
										color: #FF0000;
										padding-left: 6rpx;
									}
								}
								
								.unit{
									font-size: 20rpx;
									color: #999999;
								}
								
							}
						}
						&:last-child{ 
							border-bottom:0;
							padding-bottom: 0;
							margin-bottom: 0; 
						}
						.more{
							padding: 20rpx;
						}
					}
					
				}
				.gotobtn{
					color: #46B85B;
					font-size: 26rpx;
				}		
			}
			
			.main_cont{
				padding: 20rpx;
				.itemBlock{
					width: 100%;
					.sigleItem{
						display: flex;
						padding: 8rpx 0;
						justify-content: space-between;
						
						.name{
							font-size: 28rpx;
							display: flex;
							align-items: flex-start;
							.hots{
								font-size: 20rpx;
								color: #FF0000;
								padding-left: 6rpx;
							}
						}
						
						.unit{
							font-size: 20rpx;
							color: #999999;
						}
						
					}
				}
				
				
				.gotobtn{
					color: #46B85B;
					font-size: 26rpx;
				}	
			
			}
			
			.footbtn{
				border-top: 1rpx solid #cccccc;
				display: flex;
				justify-content: space-between;
				padding: 20rpx 0; 
				
				.checkOk{ 
					color: #fff;
					font-size: 30rpx;
					text-align: center; 
					width: 180rpx;
					height: 60rpx; 
					line-height: 60rpx;
					border-radius: 6rpx;
				}
				.isno{
					background-color: #0062CC;
				}
				.iswrong{
					background-color: #DF5000;
				}
				
				.isright{ 
					background-color: #46b85b;
				}
				.isfeed{
					color: #999999;
					border:1px solid #D4D4D4;
					background-color: #FFFFFF;
				}
				.iscannot{
					color: #999999;
					border:1px solid #D4D4D4;
					background-color: #D4D4D4;
				}
				
				.isovertime{
					color: #FF0000;
					border:1px solid #FF0000;
					background-color: #FFFFFF;
				}
				
				.left-footbtn{
					display: flex;
					.checkOk{
						
						&:first-child{
							margin-right: 20rpx;
						}
					}
				}
				.right-moeny{
					text-align: right;
					font-size: 50rpx;
					
					.txt{
						font-size: 24rpx;
					}
				}
				
			}
			 
		}
		
		.lodingMore{
			text-align: center;
			color: #999999;
		}
		
		
		 
		.pay_checked{
			padding: 40rpx;
			position: relative; padding-bottom: 160rpx; 
			
			.title{
				text-align: center;
				font-size: 48rpx;
				padding-bottom: 30rpx;
			}
			.totalNum{
				font-size: 30rpx;
				padding: 20rpx 0;
				text-align: left;
				display: flex;  
				justify-content: space-between;
				align-items: center;
				.left{
					font-size: 30rpx;
				}
				.right{
					color: #f00;
				}
			
				&:last-child{
					border-bottom: 1px solid #f2f2f2;
				}
			}
			.topayBtn{
				position: absolute; bottom: 0; left: 0; right: 0;
			}
			.prepyPop{
				padding: 32rpx 0;
				display: flex; 
				align-items: center;
				width: 100%;
				
				.img{
					width: 48rpx;
					height: 48rpx;
				} 
				.txtbtn{
					padding-left: 32rpx;
				}
				
			}
			
			.get_coupon{
				border-top:1px solid #eeeeee;
				padding: 24rpx 0;
				.group{
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin: 0;
					padding: 0;
					.left{
						color: #666;
						font-size: 30rpx;
					}
					.right{
						color: #999;
						font-size: 30rpx;
						.txt{
							color: #f00;
						}
					}
				}
			}
			
				
		}
		

	}
 


</style>
