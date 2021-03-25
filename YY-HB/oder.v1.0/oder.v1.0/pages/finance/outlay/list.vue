<template> 
	<view class="wrap">   
	 <uni-nav-bar :status-bar="true" :fixed="true" left-icon="arrowleft" @clickLeft="back()" color="#ffffff" background-color="RGBA(70, 184, 91, 1)" >
		<view class="navTagBar" v-for="(items,index) in navTag">			
			<view class="title" :class="tabIndex === index ? 'active':''" @tap="changeTab(index)">{{items}}</view> 
		</view>
	 </uni-nav-bar>
 
 
	<template v-if="isload">
		<default-page :load="true"></default-page>
	</template>
	<template v-if="isnohave">
		<default-page :nohave="true"></default-page>
	</template>
	
	<template v-if="isready">

 
	<view id="oderList">  
		<view class="orderlist_main">
			<swiper :style="'height:'+ scrollH +'px;'" :current="this.tabIndex" @change="linktabindex" previous-margin="50" next-margin="50">
				<swiper-item>
					<scroll-view scroll-y :style="'height:'+ scrollH +'px;'" @scrolltolower="allOrderList">
						
						<template v-if="this.orderList.length > 0">
							<block v-for="(orderItem,index) in this.orderList">
								<view class="group">
									<view class="head">
										<view class="tit">  
											<text class="titIcon iconfont iconstauts-ing"></text>  
											<template v-if="orderItem.payState==1">
												<template v-if="orderItem.orderState == 0">
													<view class="titTxt">等待配送</view> 	
												</template>
												<template v-if="orderItem.orderState == 1"><text class="titTxt">工厂接单（配送中）</text></template>
												<template v-if="orderItem.orderState == 2"><text class="titTxt">已确认收货</text></template> 
											</template>
											<template v-else>
												<template v-if="orderItem.payState == 0"><view class="titTxt isright">待付款 
												<text class="titTxt" v-if="orderItem.orderState == 1">(配送中)</text>
												</view></template>
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
																v-if="itemList.orderState == 2">完成</view>
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
																<view class="gotobtn" 
																@tap="navTo({page:itemList.orderNo,from:'suborder',tStates:itemList.orderType})">查看其余{{itemList.content.length -3}}件</view>
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
												<block v-for="(itemList,index) in orderItem.content.slice(0,3)"> 
													<view class="sigleItem">
														<view class="name">{{itemList.goodsName}} <view v-if="itemList.hotSale == 1" class="hots">&nbsp;&nbsp; 热门</view></view>
														<view class="unit">{{itemList.goodsNum}} {{itemList.goodsUnit}}</view>
													</view> 
												</block>
											</view>
											<template v-if="orderItem.content.length > 3">
												<view class="more">	 
													<view class="">···</view>
													<view class="gotobtn">查看其余{{orderItem.content.length-3}}件</view>
												</view>
											</template>
										</view>				
									</template>
									
									<view class="footbtn">
										<view class="left-footbtn" v-if="orderItem.content.length > 0">
											<template v-if="orderItem.payState==1">
											<view class="checkOk isfeed" v-if="orderItem.orderState == 2">已完成</view>
											
											</template>
											<template v-if="orderItem.orderState !== 2 && orderItem.orderType !== 2">
												<view class="checkOk isright" @tap="rightBtn({list:index,from:'parents'})">确认收货</view> 
											</template>
											<template v-if="orderItem.payState == 0 && orderItem.orderType !== 2">
												<view class="checkOk isno" @tap="checkOkBtn(index,'keepon','nopop')">去支付</view> 
											</template>
											<template v-if="orderItem.orderType==2">
												<view class="checkOk isfeed">失效订单</view>							
											</template>	
										</view> 
										
										<view class="left-footbtn" v-if="orderItem.subOrder.length > 0">	
											<template v-if="orderItem.payState==1">
												<view class="checkOk isfeed" v-if="orderItem.orderState == 2">已完成</view> 
											</template>
											<template v-if="orderItem.payState == 0 && orderItem.orderType !== 2">
												<view class="checkOk isno" @tap="checkOkBtn(index,'keepon','nopop')">去支付</view> 
											</template>		
											<template v-if="orderItem.orderType == 2">
												<view class="checkOk isfeed">已失效</view>							
											</template>				
											<view class="checkOk isfeed" @tap="navTo({page:orderItem.orderNo,from:'allsub',tStates:orderItem.orderType})">下单详情</view>	
										</view>  
										
										<view class="right-moeny">{{parseFloat(orderItem.realAmt/100).toFixed(2) / 1}} <text class="txt">元</text></view> 
										
									</view>
									
								</view>
								
							</block>
							
							<view class="lodingMore" v-if="!Nothing">{{loadmore}}</view>
						</template>
						<template v-else>
							<view class="nothing">
								<image src="@/static/default_null@1x.png" class="gifimg" mode="scaleToFill"></image>
								<view class="txt">暂无记录</view>
							</view>
						</template>
					
					</scroll-view>
				</swiper-item>
				
				<swiper-item>
					<scroll-view scroll-y :style="'height:'+ scrollH +'px;'" @scrolltolower="unPaidOrderList"> 
					
						<template v-if="this.userUnPayList.length > 0">
							<block v-for="(orderItem,index) in this.userUnPayList">
								<view class="group">
									
									<view class="head">
										<view class="tit">  
											<text class="titIcon iconfont iconstauts-ing"></text> 										
											<view class="titTxt isright">待结算</view> 	 													
										</view><view class="time">{{orderItem.orderTime}}</view>
									</view> 
									<view class="main_cont" @tap="creditNavto({page:orderItem.orderNo,from:'unpaid',pStates:orderItem.instantPay,navto:'credit'})">
										<view class="itemBlock">
											<block v-for="(itemList,index) in orderItem.content.slice(0,3)">
												<view class="sigleItem">
													<view class="name">{{itemList.goodsName}}</view>
													<view class="unit">{{itemList.goodsNum}} {{itemList.goodsUnit}}</view>
												</view> 
											</block>
										</view>
										<template v-if="orderItem.content.length > 3">
											<view class="more">					
												<view class="">···</view>
												<view class="gotobtn">查看其余{{orderItem.content.length-3}}件</view>
											</view>
										</template>
									</view>					 
									
									<view class="footbtn">
										<view class="left-footbtn">  
											<template v-if="orderItem.instantPay == 0">
												<template v-if="index == 0">
													<view class="checkOk isno" @tap="checkOkBtn(index,'unPay','nopop')">去支付</view>  		
													<view class="checkOk isfeed">已铺货</view> 											 
												</template>
												<template v-else>
													<view class="checkOk isno" @tap="checkOkBtn(index,'unPay','yespop')">立即付</view>  												
													<view class="checkOk isfeed" @tap="cancelOrder(index)">删除</view>  												
												</template>
											</template>
											<template v-if="orderItem.instantPay == 1">     
												<template v-if="otherBtn && otherCanCredit">
													<view class="checkOk isright" @tap="creditOrder(index,'unPay')">先铺货</view>  			
												</template>  
												<view class="checkOk isno" @tap="checkOkBtn(index,'unPay','yespop')">立即付</view> 
												<view class="checkOk isfeed" @tap="cancelOrder(index)">删除</view> 	
											</template>		 	 
										</view>  
										
										<view class="right-moeny">{{parseFloat(orderItem.realAmt/100).toFixed(2) / 1}} <text class="txt">元</text></view> 
										
									</view>
									
								</view>
								
							</block>
						
							<view class="lodingMore" v-if="!Nothing">{{loadmore}}</view>
						</template>
						<template v-else>
							<view class="nothing">
								<image src="@/static/default_null@1x.png" class="gifimg" mode="scaleToFill"></image>
								<view class="txt">暂无记录</view>
							</view>
						</template>
					</scroll-view>
				</swiper-item>
				
			<!-- 	<swiper-item>
					<scroll-view scroll-y :style="'height:'+ scrollH +'px;'" @scrolltolower="unPaidOrderList">
						<template>
							<view class="serve-order">
								<view class="group">
									<view class="head">待配送</view>
									<view class="content">
										<view class=""></view>
									</view>
									<view class="foot">
										<view class="servebtn" @tap="servebtn()">售后服务</view>
									</view>
								</view>
							</view>
						</template>						
					</scroll-view>
				</swiper-item> -->
				
				
			</swiper>
		</view>
		 
		 
		
		</view>
		
		
		<uni-popup ref="popup" type="bottom" :maskClick="false">
			<view class="pay_checked" style="">  
				<view class="title">合计：{{PayActual}}元<view @tap="closePopup()" class="iconfont iconclose closePrev"></view></view>
				<template v-if="this.hasGoodness"> 
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
				</template>
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
				<template v-if="this.tabIndex === 0">
					<btn-foot title="去支付" class="topayBtn" @tap="toPayBtn('keepon')"></btn-foot> 
				</template>
				<template v-else>
					<btn-foot title="去支付" class="topayBtn" @tap="toPayBtn('unPay')"></btn-foot> 
				</template>
			</view>
		</uni-popup>
		
		
		<!-- 有订单未结清 -->
		<uni-popup ref="hasUnpaid" type="center" :maskClick="false">
			<view class="unpaid_checked" style="">
				<view class="title">您有一笔未结清订单！ <view @tap="closePrev()" class="iconfont iconclose closePrev"></view></view> 
				<scroll-view :scroll-top="scrollTop" style="height: 160px; width: 260px" show-scrollbar="true"
				class="unpaid-list" scroll-y="true">  
					<view class="conten_list" v-for="(foods,index) in this.UnPaidData.content">  
						<view class="group">
							<view class="tit">{{foods.goodsName}} * {{foods.goodsNum}}</view>
							<view class="cont">
								<view class="price">{{parseFloat(foods.merchPrice * foods.goodsNum / 100).toFixed(2)/1}}元</view>
								<view class="unit">{{foods.goodsQuantity}}{{foods.goodsUnit}} * {{foods.goodsNum / foods.goodsQuantity}}</view>
							</view>
						</view>
					</view>
					<view class="info_detail">
						<view class="group"><view class="">订单号</view><view class="txt">{{this.UnPaidData.orderNo}}</view></view>
						<view class="group"><view class="">下单时间</view><view class="txt">{{this.UnPaidData.orderTime}}</view></view>
						<view class="group"><view class="">商户名称</view><view class="txt">{{this.UnPaidData.merchName}}</view></view>
						<view class="group"><view class="">收货地址</view><view class="txt">{{this.UnPaidData.busiAddr}}</view></view> 
					</view>    
				</scroll-view> 
				<view class="listmore down">﹀ 向下滑动查看更多</view> 
				<view class="totalNum"><view class="left">实际应支付：</view><view class="right">{{prePayActual}}元</view></view>
				<radio-group @change="radioChange">
					<pop-up names="支付宝支付" iconImg="alipay">
						<view slot="radioPay"><radio :value="checktype[0]" color="#09BB07" /></view>
					</pop-up>
					<pop-up names="微信支付" iconImg="weixin">
						<view slot="radioPay"><radio :value="checktype[1]" color="#09BB07" /></view>
					</pop-up>
				</radio-group>
				<btn-foot title="立即结清" class="topayBtn" @tap="getUnpaidOrder()"></btn-foot> 
			</view>
		</uni-popup>
		<!-- 有订单未结清 end-->
		
	
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
				unOrderList:[], 
				pages:1,
				loadmore:'上拉加载更多',
				btnIndex:'',
				totalPriceN:'', 
				Nothing:false,
				navtoDetail:'',
				navtoIndex:'',
				checktype:['alipay','weixin'],
				chooseType:'', 
				isload:true,
				isnohave:false,
				isready:false, 
				couponid:'',
				actualPay:'', 
				got:false, 
				clock:false,
				navTag:['已配送订单','未支付订单'],
				tabIndex:0,
				scrollH:0,
				scrollTop:0, 
				toPayOrderNo:'',
				hasFinalPay:false,
				UnPaidData:[],
				instantPay:10,
				popShow:false, //上一笔是否弹出
				hasGoodness:false,//是否可享优惠
				otherBtn:false, //其它待支付状态
				otherCanCredit:false,//铺货总开关
			}
		},
		onLoad() { 			 
			this.loginWhether = uni.getStorageSync('status')  
			this.merchNo = uni.getStorageSync('user').merchNo		
			uni.getSystemInfo({
				success:res=>{
					this.scrollH = res.windowHeight
				}
			})			
			
			this.getListData('allOrderList','getBreakfastOrder')
			this.getListData('unPaidOrderList','getUnpaidMerchOrder')
			this.getPrevOrder()
			
			this.$store.dispatch('get_coupon_id','')
			this.$store.dispatch('get_cart_amt','') 
		},
		computed:{ 
			...mapState(['userOrderList','userUnPayList','getCouponId','getCartAmt','getUnusualAmt','getUnusualNo','canCredit']),  
			...mapGetters(['totalCount','totalPrice','prevOrderPrice']),  
			Payable:function(){
				// this.totalPriceN = this.totalPrice
				return this.numFloat(this.totalPriceN).toFixed(2) / 1
			},
			PayActual:function(){
				// console.log(this.totalPriceN,this.getUnusualAmt)
				// this.totalPrice = this.totalPrice
				let actualNums = ''
				if(this.clock){					
					let org = this.totalPriceN,
						now = this.getUnusualAmt ? this.getUnusualAmt : 0; 
					actualNums = this.numFloat(org - now).toFixed(2) / 1 
				}else{
					let org = this.totalPriceN,
						now = this.getCartAmt ? this.getCartAmt : 0 ;
					
					actualNums = this.numFloat(org -now).toFixed(2) / 1 					
				}
				
				return actualNums
			},			
			prePayActual:function(){
				// this.totalPriceN = this.totalPrice
				let actualNums = ''
				if(this.clock || this.prevOrderPrice){	 
					let org = this.prevOrderPrice,
						now = this.getUnusualAmt ? this.getUnusualAmt : 0;
					actualNums = this.numFloat(org - now).toFixed(2) / 1 
				}else{ 
					let org = this.totalPriceN,
						now = this.getCartAmt ? this.getCartAmt : 0 ;
						actualNums = this.numFloat(org - now).toFixed(2) / 1 
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
				// this.totalPriceN = this.totalPrice
				
				this.actualPay = this.numFloat(this.totalPriceN - this.getCouponId.couponAmt) 		 
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
		
		methods: {
			servebtn(){
				console.log('点击售后服务')
				uni.navigateTo({
					url:'../../aftersale/check'
				})
				
			},
			allOrderList(e){
				this.scrolltolower('allOrderList','getBreakfastOrder')
			},			
			closePopup(){
				this.$store.dispatch('get_unusual_amt','')
				this.$refs.popup.close()
			}, 
			unPaidOrderList(){				
				this.scrolltolower('unPaidOrderList','getUnpaidMerchOrder')
			},
			scrolltolower(type,url){
				let initPages = this.pages+1
				let morePages = initPages++
				this.pages = morePages 
				
				uni.showLoading({
					title: '加载中'
				})
				let vVlue = {"merchNo":this.merchNo,"pageNum":morePages,"pageLimt":'20',}
				let sSort = getSortAscii(vVlue)
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase()
				 
				this.$request.post(url,{
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
			linktabindex(e){ 
				this.tabIndex = e.detail.current
			},
			changeTab(index){ 
			 	if (this.tabIndex === index) {
			 		return
			 	} 
			 	this.tabIndex = index 
			}, 
			numFloat(param){
				return parseFloat(param / 100)
			},
			navtoGetCoupon(){ 
				// this.totalPrice = this.totalPrice
				if(!this.clock){
					uni.navigateTo({
						url:'../../account/coupon/usable?type='+ this.totalPriceN,
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
			toPayBtn(type){				 
				let getPayType = this.chooseType 
				if(this.hasFinalPay && type == 'unPay' && this.popShow){
					this.$refs.hasUnpaid.open()
				}else{
					switch (getPayType){
						case 'alipay':
							this.payAlipay(type) 
						break;
						case 'weixin':
							this.payWeixin(type) 
						break;					
					}					
				}		
			}, 
			payAlipay(type){   
				let unpaidOderInfo = this.userUnPayList  
				let vVlue = '' 
				if(this.getCouponId.couponNo && !this.clock){ 
					vVlue = {
						"merchNo":this.merchNo,
						"orderNo":this.toPayOrderNo,
						"couponNo":this.getCouponId.couponNo ? this.getCouponId.couponNo : '',
						"instantPay":this.instantPay
						}
				}else if(this.clock){ 
					vVlue = {
						"merchNo":this.merchNo,
						"orderNo":this.toPayOrderNo,
						"couponNo":this.getUnusualNo ? this.getUnusualNo : '',
						"instantPay":this.instantPay
						}
					
				}else{  
					vVlue = {
						"merchNo":this.merchNo,
						"orderNo":this.toPayOrderNo,
						"instantPay":this.instantPay
						}
				}
				let sSort = getSortAscii(vVlue)
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() 
				this.$request.post('aliPayOrder',{
					...vVlue,
					"sign":sSign
				},{
					token:true
				}).then(res => {
					if(res.code == 200){
						let ordinfo = res.data.toString()
						uni.requestPayment({
							provider: 'alipay',
							orderInfo: ordinfo,
							success: (res)=>{ 
								this.$refs.popup.close()
								if(type == 'unPay'){					
									unpaidOderInfo.splice(this.tabIndex,1)	
									this.toPayOrderNo = ''
								}
								this.clock = false
								this.getListData('allOrderList','getBreakfastOrder')
								this.getListData('unPaidOrderList','getUnpaidMerchOrder')
							},
							fail: (err)=>{ 
								uni.showToast({
									icon:'none',
									title:'支付失败',
									duration: 2000
								}) 
							},
							complete:()=>{
								this.$store.dispatch('get_coupon_id','')
								this.$store.dispatch('get_cart_amt','')								
							}
						})
					}else{
						uni.showToast({
							icon:'none',
							title:res.message,
							duration: 2000
						}) 
					}
					
				}).catch()
			},
			payWeixin(type){   
				let unpaidOderInfo = this.userUnPayList 
				let vVlue = ''
				if(this.getCouponId.couponNo){
					vVlue = {
						"merchNo":this.merchNo,
						"orderNo":this.toPayOrderNo,
						"couponNo":this.getCouponId.couponNo ? this.getCouponId.couponNo : '',
						"instantPay":this.instantPay
						}
				}else if(this.clock){ 
					vVlue = {
						"merchNo":this.merchNo,
						"orderNo":this.toPayOrderNo,
						"couponNo":this.getUnusualNo ? this.getUnusualNo : '',
						"instantPay":this.instantPay
						} 
				}else{ 
					vVlue = {
						"merchNo":this.merchNo,
						"orderNo":this.toPayOrderNo,
						"instantPay":this.instantPay
						}
				}
				let sSort = getSortAscii(vVlue)
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase()	 
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
								this.$refs.popup.close() 
								if(type == 'unPay'){					
									unpaidOderInfo.splice(this.btnIndex,1)																	
								}			
								this.clock = false
								this.getListData('allOrderList','getBreakfastOrder')
								this.getListData('unPaidOrderList','getUnpaidMerchOrder')
							},
							fail: (err)=>{ 
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
						
					}else{
						uni.showToast({
							icon:'none',
							title:res.message,
							duration: 2000
						}) 
					} 
					 
				}).catch() 
			},
			checkOkBtn(index,type,other){  
				let orderInfo = this.unOrderList   
				// console.log(this.totalPrice,this.totalPriceN,orderInfo[index].realAmt)
				// this.totalPrice = this.totalPrice
			 
				//当前页继续支付   
				if(type == 'keepon'){
					let orderInfo = this.userOrderList  
					this.totalPriceN = orderInfo[index].realAmt
					this.btnIndex = index;  
					this.instantPay = orderInfo[index].instantPay
					this.toPayOrderNo = orderInfo[index].orderNo 
					
				}else if(type== 'unPay'){
					let orderInfo = this.unOrderList  
					this.totalPriceN = orderInfo[index].realAmt
					this.btnIndex = index;
					this.instantPay = orderInfo[index].instantPay
					this.toPayOrderNo = orderInfo[index].orderNo 		 
				} 
				if(other =='nopop'){
					this.popShow = false 
					this.hasGoodness = false
				}else if(other =='yespop'){
					this.popShow = true 	
					this.hasGoodness = true
				} 
				 
				//获取不寻常订单信息getUnusual  			 
				this.getOrderCoupon(this.toPayOrderNo) 				 
			},
			//铺货
			creditOrder(index,type){
				
				let orderInfo = this.unOrderList   
				this.toPayOrderNo = orderInfo[index].orderNo 
				
				let vVlue = {"merchNo":this.merchNo,"orderNo":this.toPayOrderNo} 
				let sSort = getSortAscii(vVlue)
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase()
				this.$request.post('creditOrder',{
					...vVlue,
					"sign": sSign
				},{
					token:true
				}).then(res => {  						
					if(res.code == 200){
						 uni.showLoading({
							mask:true,
							title:'恭喜您，铺货成功！'
						 })
						orderInfo[index].instantPay = 1
						this.getListData('unPaidOrderList','getUnpaidMerchOrder')
						setTimeout(()=>{
							uni.hideLoading()
						},1000)
					}else{				
						uni.showToast({
							icon:'none',
							title:res.message,
							duration: 2000
						}) 	
					}
				}).catch()
			}, 
			//取消订单
			cancelOrder(index){
				let orderInfo = this.userUnPayList 
				let getOno = orderInfo[index].orderNo
				let vVlue = {"merchNo":this.merchNo,"orderNo":getOno,}
				let sSort = getSortAscii(vVlue)
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码
				 
				uni.showLoading({
					mask:true,
				})				  
				
				this.$request.post('cancelOrder',{
					...vVlue, 
					"sign": sSign
				},{
					token:true
				}).then(res => {    
					setTimeout(()=>{
						uni.hideLoading() 
						uni.showToast({
							icon:'none',
							title:res.message,
							duration: 2000
						})	
						if(res.code == 200){ 	
							setTimeout(()=>{	
								// let del = orderInfo.filter(items => {
								// 	items == orderInfo[index]
								// 	return items
								// }) 
								orderInfo.splice(index,1)  
							},100)  
						}
					},2000)  			
				}).catch() 
			},
			//获取不寻常订单信息
			getOrderCoupon(option){
				if(this.merchNo=='35110000000000'){						
					this.$refs.popup.open()
					return
				}
				let vVlue = {"merchNo":this.merchNo,"orderNo":option}
				let sSort = getSortAscii(vVlue)
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase()
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
								}
								this.$store.dispatch('get_unusual_amt',unusual)
							}else{
								this.clock = false
								this.couponid = '不使用优惠券'
								this.$store.dispatch('get_unusual_amt','')
								
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
					let vVlue = {"merchNo":this.merchNo,"orderNo":type.list}
					let sSort = getSortAscii(vVlue)
					let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase()	 	
					
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
				let vVlue = {"merchNo":this.merchNo,"orderNo":oderInfo[type].orderNo}
				let sSort = getSortAscii(vVlue)
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase()	 				
				
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
			
			getListData(type,url){
				if(this.merchNo=='35110000000000'){
					let testDate
					if(url == 'getBreakfastOrder'){
						testDate = [{"orderNo":"FZ000002-20210308152511-2","orderType":0,"instantPay":0,"sourceNo":"","realAmt":7040,"orderState":0,"orderTime":"2021-03-08 15:25:11","payState":0,"reason":"","subOrderNo":"","orderContent":"","subOrder":[],"content":[{"goodsNo":"MD0MG000000082","merchPrice":"160","goodsPrice":"250","categoryNo":"ZGL0016","goodsQuantity":"4","goodsUnit":"个","goodsNum":"44","goodsName":"米糕","goodsSpec":"袋","hotSale":"0"}]},{"orderNo":"FZ000002-20210303235422-2","orderType":0,"instantPay":1,"sourceNo":"","realAmt":360,"orderState":2,"orderTime":"2021-03-03 23:54:22","payState":1,"reason":"","subOrderNo":"","orderContent":"","subOrder":[],"content":[{"goodsNo":"MD0HTMT0000079","merchPrice":"120","goodsPrice":"200","categoryNo":"MT00014","goodsQuantity":"3","goodsUnit":"个","goodsNum":"3","goodsName":"红糖馒头","goodsSpec":"袋","hotSale":"0"}]}]
					} else if(url == 'getUnpaidMerchOrder') {
						testDate = {
							"unpaidOrder":[
								{
									"orderNo":"FZ000002-20210308152511-2",
									"realAmt":7040,
									"orderTime":"2021-03-08 15:25:11",
									"reason":"",
									"orderContent":null,
									"content":[
										{
											"goodsNo":"MD0MG000000082",
											"merchPrice":"160",
											"goodsPrice":"250",
											"categoryNo":"ZGL0016",
											"goodsQuantity":"4",
											"goodsUnit":"个",
											"goodsNum":"44",
											"goodsName":"米糕",
											"goodsSpec":"袋",
											"hotSale":"0",
										},
									],
									"instantPay":0,
								},
								{
									"orderNo":"FZ000002-20210304172619-2",
									"realAmt":31280,
									"orderTime":"2021-03-04 17:26:19",
									"reason":"","orderContent":null,
									"content":[
										{
											"goodsNo":"MD0HTMT0000079",
											"merchPrice":"120",
											"goodsPrice":"200",
											"categoryNo":"MT00014",
											"goodsQuantity":"3",
											"goodsUnit":"个",
											"goodsNum":"90",
											"goodsName":"红糖馒头",
											"goodsSpec":"袋",
											"hotSale":"0",
										},
									]
								},
							]
						}
					}
					setTimeout(()=>{
						this.isload = false
						this.isready = true
						if(type == 'allOrderList'){
							this.orderList = testDate
							this.$store.dispatch('receive_order_list',testDate)
						}
						if(type == 'unPaidOrderList'){
							let resDataUn = testDate.unpaidOrder
							this.unOrderList = resDataUn 
							// this.otherBtn = false
							this.otherBtn = true 									
							this.$store.dispatch('receive_unpay_order_list',resDataUn)	 
							//铺货总开关
							if(testDate.canCredit == 0){
								this.otherCanCredit = true 
							}else if(testDate.canCredit == 1){
								this.otherCanCredit == false
							}
						} 
					},1000)
					return
				}
				let vVlue = {"merchNo":this.merchNo,"pageNum":'1',"pageLimt":'20',}
				let sSort = getSortAscii(vVlue)
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase()		  
				this.$request.post(url,{
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
								if(type == 'allOrderList'){ 
									this.orderList = resData
									this.$store.dispatch('receive_order_list',resData)
								}
								this.loadmore  = res.data.length < 20 ? '没有更多了' : '上拉加载更多';  
							}
							if(type == 'unPaidOrderList'){ 
								let resDataUn = resData.unpaidOrder 
								this.unOrderList = resDataUn 
								if(resDataUn.length > 0){
									if(resDataUn[0].instantPay == 0){ 
										this.otherBtn = false
									}else if(resDataUn[0].instantPay == 1){
										this.otherBtn = true 
									}										
								}
								this.$store.dispatch('receive_unpay_order_list',resDataUn)	 
								//铺货总开关
								if(res.data.canCredit == 0){
									this.otherCanCredit = true 
								}else if(res.data.canCredit == 1){
									this.otherCanCredit == false
								}
							} 
						},1000)	
						
					}									
				}).catch() 
			},
			
			//获取上一笔订单
			getPrevOrder(){
				if(this.merchNo=='35110000000000'){
					let testDate = {"orderNo":"FZ000002-20210308152511-2","orderAmt":"7040"}
					this.prevOrder = testDate
					this.$store.dispatch('receive_previous_order',testDate)
					if(testDate.orderNo){
						this.hasFinalPay = true 
						this.getBreakfastOrderDetail(testDate.orderNo)
					}
					return
				}
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
							this.getBreakfastOrderDetail(res.data.orderNo)
						}
					}
				})
			},
				
			getBreakfastOrderDetail(option){
				if(this.merchNo=='35110000000000'){
					let testDate = {"orderNo":"FZ000002-20210308152511-2","orderType":0,"instantPay":0,"orderAmt":7040,"couponAmt":0,"realAmt":7040,"orderState":0,"orderTime":"2021-03-08 15:25:11","deliverName":"司机测试","deliverPhone":"18516600318","payType":0,"payState":0,"merchName":"移移-好友便利店 XM1002","longitude":118.115329,"latitude":24.431151,"busiAddr":"福建省厦门市思明区曾厝垵西路珍珠湾软件园创新大厦A区","reason":"","remark":"无","orderContent":null,"content":[{"goodsNo":"MD0MG000000082","merchPrice":"160","goodsPrice":"250","categoryNo":"ZGL0016","goodsQuantity":"4","goodsUnit":"个","goodsNum":"44","goodsName":"米糕","goodsSpec":"袋","hotSale":"0"}],"serviceContactMobile":"[[\"0592-2096880\",\"0592-2096882\"]]","vanLongitude":"","vanLatitude":""}
					this.UnPaidData = testDate
					return
				}
				
				let vVlue = {"merchNo":this.merchNo,"orderNo":option}
				let sSort = getSortAscii(vVlue)
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase()  
				
				this.$request.post('getBreakfastOrderDetail',{
				  ...vVlue, 
				  "sign": sSign
				},{
					token:true
				}).then((res)=>{  
					if(res.code == 200){  
						this.UnPaidData = res.data  
					}
				}) 
			},	
			closePrev(){ 
				this.$refs.hasUnpaid.close()
			},				
			navTo(option) {   
				if(option.from == "suborder"){
					if(option.tStates !== 2){		 
						uni.navigateTo({ 
							url:`./list_detail?orderNo=${option.page}&from=${option.from}&navto=keepon`
						})
					} 
				}else{
					if(option.tStates !== 2){						
						uni.navigateTo({ 
							url:`./list_detail?orderNo=${option.page}&from=${option.from}&navto=keepon` 
						})
					}					
				}
			},
			creditNavto(option){ 
				uni.navigateTo({
					url:`./list_detail?orderNo=${option.page}&navto=${option.navto}&pStates=${option.pStates}&from=${option.from}`
				})
			},
		},
	}
</script>

<style lang="scss">
	page{
		width: 100vw;
	}
	.serve-order{
		
		.group{
		
		
			.foot{
				padding: 20rpx 0;
				display: flex;
				.servebtn{
					padding:0 20rpx;
					background-color: #1AAD19;
					color: #FFFFFF;
				}
			}
			
			
		}
		
	}
	
	
	
	.unpaid_checked{
			padding: 40rpx;
			position: relative; padding-bottom: 140rpx;
		
		.title{
			text-align: left; 
			font-size: 36rpx;
			border-bottom: 1px solid #eeeeee;
			padding-bottom: 20rpx;
			position: relative;
			
			.closePrev{
				position: absolute;
				top: -14rpx;
				right: 0;
				font-size: 48rpx;
			}
		}
		
		.unpaid-list{
			padding: 20rpx 0;  
			.conten_list{
				font-size: 24rpx;
				border-bottom:1px dashed #eeeeee;
				padding-bottom: 20rpx;
				.group{
					width: 100%;
					display: flex;
					justify-content: space-between;
					padding: 16rpx 8rpx; 
					align-items: center; 
					
					.tit{
						font-size: 32rpx;
					}
					
					.cont{
						text-align: right;
						.price{
							font-size: 32rpx; 
						}
						.unit{
							font-size: 20rpx;
							color: #777777;
						}
					}
				} 
				
			}
			.info_detail{ 
				font-size: 24rpx;
				.group{
					width: 100%;
					display: flex;
					justify-content: space-between;
					padding: 16rpx 8rpx;
					
					.txt{
						width: 80%;
						text-align: right;
					}
				}
			}
		}
		
		.get_coupon{
			border-top:1px solid #eeeeee;
			padding: 24rpx 0;
			border-bottom:1px solid #eeeeee;
			.group{
				display: flex;
				justify-content: space-between;
				align-items: center;
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
		
		
		.listmore{
			color: #999999;
			font-size: 20rpx;
			text-align: right;
			padding: 12rpx 0; 
		} 
		.totalNum{				
				font-size: 30rpx;
				padding: 20rpx 0;
				text-align: left;
				display: flex; 
				border-bottom: 1px dashed #f2f2f2;
				justify-content: space-between;
				align-items: center;
				.left{
					font-size: 30rpx;
				}
				.right{
					color: #f00;
				}
		}
		.topayBtn{
			position: absolute; bottom: 0; left: 0; right: 0;
		}
		.prepyPop{
			padding: 24rpx 0;
			display: flex; 
			align-items: center;
			width: 100%;
			
			.img{
				width: 36rpx;
				height: 36rpx;
			} 
			.txtbtn{
				padding-left: 32rpx;
			}
			
		}
	}
	.navTagBar{
		width: 50%; 
		text-align: center;
		&:last-child{
			text-align: left;
		}
		.title{			
			color: #9ddeaa; 
			font-size: 30rpx;
			// background-color: #F0AD4E;
			
		}
		.active{ 
			color: #FFFFFF;
			font-weight: 500; 
		}
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
		.nothing{
			text-align: center;
			.txt{
				padding-top: 20rpx;
				text-align: center;
			}
			
			uni-image{
				width: 400rpx;
				height: 300rpx;
			}
			.gifimg{
				max-width: 100%;
				max-height: 100%;
			}
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
								color: #3cb552;
							}
							.btn_type{  
								.btn{
									border-radius: 4rpx;
									max-width: 160rpx;
									font-size: 28rpx;
									padding: 8rpx 16rpx;
								}
								.btn_ok{ 
									color: #777;
									border:1px solid #cccccc;
								}
								.btn_run{ 
									background-color: #3cb552;
									border:1px solid #3cb552;
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
					max-width: 180rpx;
					padding:0 20rpx;
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
						margin-left: 20rpx;
						&:first-child{
							margin-left: 0;
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
		 
	}
 
 .pay_checked{
 	padding: 40rpx;
 	position: relative; padding-bottom: 160rpx; 
 	
 	.title{
 		text-align: center;
 		font-size: 48rpx;
 		padding-bottom: 30rpx;
		position: relative;
		
		.closePrev{ 
			position: absolute;
			top: -8rpx;
			right: 0;
			font-size: 48rpx;
		}
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


</style>
