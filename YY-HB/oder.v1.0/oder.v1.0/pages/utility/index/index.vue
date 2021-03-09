<template>
	<view id="oderIndex">  
	<template v-if="isload">
		<default-page :load="true"></default-page>
	</template>
	
	<template v-if="isready">    
		<view id="mian">
			<view class="total">{{parseFloat(recAmt/100).toFixed(2)/1}}<text class="txt">元</text></view>
			<view class="getMoney">
				<navigator class="btn" url="../../wallet/moeny/moeny">提现</navigator> 
			</view>

			<view class="count-wrap">
				<view class="count">
					<view class="item main_title">
						<text class="txt">今日付款数</text>
						<view class="txt">{{payOrderNum}}</view> 
					</view>
					<view class="line">|</view>
					<view class="item main_title">
						<view class="txt">{{visitorNum}}</view>
						<text class="txt">今日访客量</text>
					</view>
				</view>
			</view>
 
			<view class="tools">
				<view class="item" @tap="openScanCode">
					<view class="icon iconfont iconscan"></view>
					<text class="txt">取货码</text>
				</view>
				<view class="item" @tap="orderScanCode">
					<view class="icon iconfont iconercode"></view>
					<text class="txt">商家码</text>
				</view>
				<view class="item" @tap="openUserList">
					<view class="icon iconfont iconorderlist"></view>
					<text class="txt">买家订单</text>
				</view> 
			</view>

		</view>
 

		<view id="entry-list">
			<block v-for="(item,index) in gotolist" :key="'4'+ index">
				<view class="item" @tap="navTo(item.urls,item.navto)">
					<view class="icon" :class="item.icon"></view>
					<view class="txt">{{item.text}}</view>
				</view>
			</block>
			<block v-for="(item,index) in serVer" :key="'7'+ index">
				<view class="item" :phone="item.phone" @tap="openSever(index)">
					<view class="icon" :class="item.icon"></view>
					<view class="txt">{{item.text}}</view> 
				</view>
			</block>

		</view>

		<view class="unlinkto">
			<!-- <view class="text">违约申述</view> --> 
			<view class="text" @tap="navTo('../helper/helper')">帮助中心</view>
		</view>
		<!-- {{pushmessage}} -->


	</template>
	
	<uni-popup ref="openAds" type="center" :backbg="false" :adsb="true" style="top: -100px;">
		<view class="pop_content">
			<image src="../../../static/popbg.png" @tap="openPlaceOrder()" mode="aspectFit" class="adimg"></image>
			<view class="title iconfont iconclose" @tap="closeAd()"></view>  
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
			
			<!-- <view class="get_coupon">
				<view class="group">  
					<view class="left">满减券/优惠</view>
					<view class="right" @tap="navtoGetCoupon('prev')"> 							
						<view :class="this.got ? 'txt' : ''">{{this.couponid}}</view>
					</view>
				</view>
			</view> -->
			<!-- <view class="totalNum"><view class="left">待支付总计：</view><view class="right">{{prePayable}}元</view></view> -->
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

	</view>
</template>

<script>
	import {mapState,mapMutations,mapGetters} from 'vuex'
	import {b64Md5,hexMD5,} from '@/network/md5.js'
	import {getSortAscii} from '@/common/util/utils.js'

	import UniNavBar from '@/components/uni/uni-nav-bar.vue'
	import UniBadge from '@/components/uni/uni-badge.vue' 
	import DefaultPage from '@/components/basic/default-page.vue' 
	import UniPopup from '@/components/uni/uni-popup.vue' 
	import PopUp from '@/components/BuyMall/rk-pop.vue'	
	import BtnFoot from '@/components/basic/btn-foot.vue'
	
	const gotolist = [{
			"icon": 'iconfont iconorder-report',
			"text": "经营报表",
			"urls": "../../wallet/report/report",
			"navto":"report",
		},
		{
			"icon": 'iconfont iconorder-home',
			"text": "商家下单",
			"urls": "../mall/mall",
			"navto":"mall",
		},
		{
			"icon": 'iconfont iconoder-stock',
			"text": "商家库存",
			"urls": "../../utility/newstock/newstock",
			"navto":"newstock",
		},
		{
			"icon": 'iconfont iconmanage',
			"text": "服务商家",
			"urls": "../../utility/manage/manage",
			"navto":"manage",
		},
		{
			"icon": 'iconfont iconoder-entry',
			"text": "我的订单",
			"urls": "../../finance/outlay/list",
			"navto":"list",
		},
		{
			"icon": 'iconfont iconoder-entry-history',
			"text": "收款记录",
			"urls": "../../wallet/entry/entry",
			"navto":"entry",
		},
		{
			"icon": 'iconfont icon-agency',
			"text": "订制管理",
			"urls": "../../finance/agent/agent",
			"navto":"agent",
		},
		{
			"icon": 'iconfont icon-money',
			"text": "订制红包",
			"urls": "../../wallet/rebate/rebate",
			"navto":"rebate",
		},  
	]
	const serVer = [{
			"icon": 'iconfont iconcontact',
			"text": "客服",
			"phone":[]
		}, 
	]



	export default {
		components: {
			UniBadge, 
			DefaultPage, 
			UniNavBar,
			UniPopup,
			PopUp,
			BtnFoot,
		},
		data() {
			return { 
				gotolist,
				serVer, 
				payOrderNum: '0',
				visitorNum: '0',
				recAmt: '0', 
				loginWhether:'',//登陆状态
				userStore:'', //用户信息
				merchNo:'', //商户号
				getScan:'',//扫码 
				isload:false,
				isnohave:false,
				isready:true,  
				refreshed:'',
				fromlogin:false,
				//关于上一笔订单
				prevOrder:[],
				checktype:['alipay','weixin'],
				chooseType:'', 
				scrollTop:0,
				couponid:String, 
				got:false,
				PreStatus:false,
				UnPaidData:Object,//有订单未结清
				FirstOrder:false,
				isAds:0,//优惠开关
				eContract:false,//是否签合同
				// webview:false,//电子合同
				// pushmessage:'',
			}
		}, 
		computed:{ 
			...mapState(['cartGoods','previousOrder','getCouponId','getCartAmt','limitAmt','getUnusualAmt','getUnusualNo']),
			...mapGetters(['totalCount','totalPrice','prevOrderPrice']),   
			prePayActual:function(){
				let actualNums = ''
				if(this.clock || this.prevOrderPrice){	 
					let org = this.prevOrderPrice,
						now = this.getUnusualAmt ? this.getUnusualAmt : 0;
					actualNums = this.numFloat(org - now).toFixed(2) / 1 
				}else{ 
					let org = this.totalPrice,
						now = this.getCartAmt ? this.getCartAmt : 0 ;
						actualNums = this.numFloat(org - now).toFixed(2) / 1 
				} 
				return actualNums
			}, 
		},
		onLoad(option) {    
			this.loginWhether = uni.getStorageSync('status') 
			this.userStore = uni.getStorageSync('user')
			this.merchNo = uni.getStorageSync('user').merchNo
			 
			let login_type = option.loginType  
			if(login_type === 'login'){ 
				this.fromLogin() 
			}else{ 
				this.initUser() 
			} 
		},  
		onNavigationBarButtonTap(tap){
			if(tap.index === 0){
				uni.navigateTo({
					url:'../../account/option/option',
					animationType: 'pop-in',
					animationDuration: 200
				})
			}
		}, 
		methods: {
			openEcontract(){
				// this.webview = true
				uni.navigateTo({
					url:'../../../hybrid/html/e_contract/e_contract'
				})
			},
			getPlatParam(refreshKey){ 
				let vVlue = {"merchNo":this.merchNo}
				let sSort = getSortAscii(vVlue)
				let sSign = hexMD5(sSort + "&key=" + refreshKey).toUpperCase()   
				
				this.$request.post('getPlatParam',{
				  ...vVlue, 
				  "sign": sSign
				},{
					token:true
				}).then((res)=>{   
					// console.log(res.data)
					if(res.code == 200){ 
						this.isAds = res.data.actionSwitch						
						if(res.data.actionSwitch == 0){
							this.openAds()
						}
					}
				})
			},
			openAds(){
				setTimeout(()=>{
					this.$refs.openAds.open()
				},500) 
			},
			//获取上一笔订单begin
			getPrevOrder(refreshKey){
				let vVlue = {"merchNo":this.merchNo,"orderType":1}
				let sSort = getSortAscii(vVlue)
				let sSign = hexMD5(sSort + "&key=" + refreshKey).toUpperCase()   
				
				this.$request.post('getPrevOrder',{
				  ...vVlue, 
				  "sign": sSign
				},{
					token:true
				}).then((res)=>{   
					if(res.code == 200){ 
						this.prevOrder = res.data
						if(res.data.orderNo){ 
							this.getOrderCoupon(res.data.orderNo,refreshKey)
							// //3.获取上一订单信息
							this.getBreakfastOrderDetail(res.data.orderNo,refreshKey)							
						}
						this.$store.dispatch('receive_previous_order',res.data)  
					}
				})
			},
			getBreakfastOrderDetail(option,refreshKey){   
				let vVlue = {"merchNo":this.merchNo,"orderNo":option}
				let sSort = getSortAscii(vVlue)
				let sSign = hexMD5(sSort + "&key=" + refreshKey).toUpperCase()   
				
				this.$request.post('getBreakfastOrderDetail',{
				  ...vVlue, 
				  "sign": sSign
				},{
					token:true
				}).then((res)=>{ 
					this.$api.initPage(res.code,res.message)
					if(res.code == 200){  
						this.UnPaidData = res.data 
						// //4.显示弹窗
						this.$refs.hasUnpaid.open()
					}
				}) 
			},	
			//获取不寻常订单信息
			getOrderCoupon(option,refreshKey){
				let vVlue = {"merchNo":this.merchNo,"orderNo":option}
				let sSort = getSortAscii(vVlue) 
				let sSign = hexMD5(sSort + "&key=" + refreshKey).toUpperCase() 
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
							} 
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
			//立即结算
			getUnpaidOrder(){
				this.toPayBtn()
			},			
			toPayBtn(){
				let getPayType = this.chooseType	
				let keys = this.refreshed ? this.refreshed : this.loginWhether.md5key  
				switch (getPayType){
					case 'alipay':
						this.payAlipay(keys)
					break;
					case 'weixin':
						this.payWeixin(keys)
					break;
				}				 
			},
			 
			payAlipay(refreshKey){ 
				let vVlue = ''
				
				if(this.getCouponId.couponNo){
					vVlue = {
					"merchNo":this.merchNo,
					"orderNo":this.previousOrder.orderNo,
					"couponNo":this.getCouponId.couponNo ? this.getCouponId.couponNo : '',
					"instantPay":0,
					}
				}else if(this.clock){ 
					vVlue = {
						"merchNo":this.merchNo,
						"orderNo":this.previousOrder.orderNo,
						"couponNo":this.getUnusualNo ? this.getUnusualNo : '',
						"instantPay":0,
						} 
				}else{
					vVlue = {
					"merchNo":this.merchNo,
					"orderNo":this.previousOrder.orderNo, 
					"instantPay":0,
					}
				}	 
				let sSort = getSortAscii(vVlue) 
				let sSign = hexMD5(sSort + "&key=" + refreshKey).toUpperCase()   
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
						success: (res) => { 
							this.$refs.hasUnpaid.close() 
							this.PreStatus = false  
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
					});
				}).catch()
			},
			
			payWeixin(refreshKey){   
				let vVlue = ''
				if(this.getCouponId.couponNo && !this.clock){
					vVlue = {
					"merchNo":this.merchNo,
					"orderNo":this.previousOrder.orderNo,
					"couponNo":this.getCouponId.couponNo ? this.getCouponId.couponNo : '',
					"instantPay":0,
					}
				}else if(this.clock){ 
					vVlue = {
						"merchNo":this.merchNo,
						"orderNo":this.previousOrder.orderNo,
						"couponNo":this.getUnusualNo ? this.getUnusualNo : '',						
						"instantPay":0,
						} 
				}else{
					vVlue = {
					"merchNo":this.merchNo,
					"orderNo":this.previousOrder.orderNo, 
					"instantPay":0,
					}					
				}
				let sSort = getSortAscii(vVlue)  
				let sSign = hexMD5(sSort + "&key=" + refreshKey).toUpperCase() 	 
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
							success: (res) => { 
								this.$refs.hasUnpaid.close() 
								this.PreStatus = false
								this.$store.dispatch('get_coupon_id','')				 
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
					} 
					 
				}).catch() 
			},
			//关于上一笔订单
			async aboutPrevOrder(refreshKey){
				//1.是否有上一笔订单
				await this.getPrevOrder(refreshKey)
				// console.log(refreshKey,this.prevOrder.orderNo,this.previousOrder.orderNo)
				// //2.是否满足使用优惠券条件(不寻常订单)
				// await this.getOrderCoupon(this.previousOrder.orderNo)
				// //3.获取上一订单信息
				// this.getBreakfastOrderDetail()
				// //4.显示弹窗
				// this.$refs.hasUnpaid.open()
			},			
			closePrev(){ 
				this.$refs.hasUnpaid.close()
			},			
			navtoGetCoupon(urls){ 
				let amt = ''
				let page = ''
				if(urls == "thisone"){ 
					this.prevTime = false
					
					uni.navigateTo({
						url:`../../account/coupon/usable?type=${this.totalPrice}&page=thisone`,
					}) 
				}else{ 
					
					if(!this.clock){	
						this.prevTime = true
						uni.navigateTo({
							url:`../../account/coupon/usable?type=${this.prevOrderPrice}&page=prevtime`,
						}) 
					}else{
						uni.showLoading({
							icon:'none',
							title:'已选，不可修改',
							duration: 2000
						})
					}
				} 
			},
			//获取上一笔订单 end
			
			numFloat(param){
				return parseFloat(param / 100)
			},
			closeAd(){
				this.$refs.openAds.close() 
			},
			radioChange(e){ 
				this.chooseType = e.target.value
				 console.log(e.target.value)
			},
			clickOption(){
				uni.navigateTo({
					url:'../../account/option/option',
					animationType: 'pop-in',
					animationDuration: 200
				})
			}, 
			fromLogin(){				  
				this.getDayBusiStat('getDayBusiStat',this.loginWhether.md5key) 
				this.getServiceMobile('getServiceMobile',this.loginWhether.md5key)  
				this.$api.getUserDev()
				this.getUploadDev()
				this.ownPaypwd('ownPaypwd',this.loginWhether.md5key)
				this.fromlogin = true 
				this.aboutPrevOrder(this.loginWhether.md5key)
				
				//获取优惠开关 begin
				this.getPlatParam(this.loginWhether.md5key)		 
			}, 
			initUser() {  
				let vVlue = {"merchNo": this.merchNo} 
				let sSort = getSortAscii(vVlue)   		
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase()	
				
				this.$request.post('refresh',{
					...vVlue, 
					"sign": sSign,
					},{
						token: true
					}).then((res) => {
						
						this.isload = true
						this.isready = false	
						if (res.code === 200) {
							let haslogin = {
								status:true,
								token:res.data.token,
								md5key:res.data.md5key,
								merchNo:this.merchNo,
								joinCategory:this.userStore.joinCategory,
								serverTime:this.userStore.serverTime,
							}
							uni.setStorageSync('status',haslogin)  
							this.fromlogin = false 
							this.refreshed = res.data.md5key 
							this.getDayBusiStat('getDayBusiStat',this.refreshed) 
							this.getServiceMobile('getServiceMobile',this.refreshed) 
							
							//获取优惠开关 begin
							this.getPlatParam(this.refreshed)
							// console.log(this.isAds)
							
							
							//获取优惠开关 end
							
							//走一遍未接订单流程 
							this.aboutPrevOrder(res.data.md5key)	
							
							
						}else if(res.code === 500){
							uni.showToast({ 
								icon:'none',
								title:res.message + '请稍后重试',
								duration: 2000
							})
						}else{							
							uni.showToast({
								icon:'none',
								title:res.message
							})
							uni.reLaunch({
								url:'../../account/login/login'
							}) 
						}
					}).catch((err)=>{ 
						this.isload = true
						this.isready = false	
						uni.reLaunch({
							url:'../../account/login/login'
						}) 
					}) 
			},
			getServiceMobile(post,key){
				let vVlue = {"merchNo": this.merchNo} 
				let sSort = getSortAscii(vVlue)   		
				let sSign = hexMD5(sSort + "&key=" + key).toUpperCase()	
				this.$request.post('getServiceMobile', {
					...vVlue,
					"sign": sSign
				},{
					token:true
				}).then((res) => {   
					if (res.code === 200) { 		
						let newNo = JSON.parse(res.data.serviceMobile)  									
						this.serVer[0].phone = [].concat.apply([], newNo)  
					}
				}).catch()  
			},
			getDayBusiStat(post,key){
				let vVlue = {"merchNo": this.merchNo} 
				let sSort = getSortAscii(vVlue)
				let sSign = hexMD5(sSort + "&key=" + key).toUpperCase() 			
				this.$request.post('getDayBusiStat', {
					...vVlue,
					"sign": sSign
				},{
					token:true
				}).then((res) => { 	 
					if(res.code === 200){	
						let resData = res.data
						setTimeout(()=>{	
							this.isload = false
							this.isready = true	
							
							this.payOrderNum = resData.payOrderNum
							this.visitorNum = resData.visitorNum
							this.recAmt = resData.recAmt
						},300)
					}
				}).catch()
			},
			ownPaypwd(post,key){ 
				let vVlue = {"merchNo": this.merchNo} 
				let sSort = getSortAscii(vVlue)   		
				let sSign = hexMD5(sSort + "&key=" + key).toUpperCase()	 
				this.$request.post('ownPaypwd', {
					...vVlue,
					"sign": sSign
				},{
					token:true
				}).then((res) => {  
					if (res.code === 200) { 
						uni.setStorageSync('initPayPaswd',res.data.own) 
					}
				}).catch() 
			},
			getUploadDev(){ 
				let userSystem = uni.getStorageSync('user-system') 
				
				if(userSystem.cid === '' || userSystem.platform === ''){
					return
				}
				let vVlue = {
					"merchNo": this.merchNo,
					"devType":userSystem.platform,
					"cid":userSystem.cid,
				}
				let sSort = getSortAscii(vVlue)    
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() 
				
				if(userSystem.platform || userSystem.cid){				
					this.$request.post('uploadDev', {	
						...vVlue,
						"sign": sSign
					},{
						token:true
					}).catch()  
				}
			}, 
			  
			navTo(path,navto) {
				// console.log(uni.getStorageSync('agreeChecked')) 
				if(navto == 'mall'){
					if(uni.getStorageSync('agreeChecked') == true){
						console.log('sssss')/
						this.openEcontract()
					}else{				
						uni.navigateTo({ 
							url:path,
							animationType: 'pop-in',
							animationDuration: 200
						});						
					}
				}else{					
					uni.navigateTo({ 
						url:path,
						animationType: 'pop-in',
						animationDuration: 200
					});
				}
			},			
			openSever(index) { 
				let newNo = this.serVer[index].phone 
				console.log(newNo)
				uni.showActionSheet({
					itemList: newNo,
					success: (res)=>{  
						uni.makePhoneCall({
							phoneNumber: newNo[res.tapIndex]
						});  
					}
				});  
			},
			openScanCode() {
				uni.scanCode({
					onlyFromCamera: true,
					success: (res)=>{   
						let allright = res.result.indexOf('osign') 
						if(res.scanType === "QR_CODE"){
							let scan = JSON.parse(res.result)  
							if(allright){									
								this.$request.postAlone(scan.main,{ 
									"merchNo": this.merchNo,
									"orderNo":scan.orderNo,
									"userNo": scan.userNo,
									"osign":scan.osign, 
								},{
									token:true
								}).then(res => {   
									uni.showToast({
										icon:'none',
										title:res.message,
										duration: 2000
									})
								}).catch()
							}else{
								uni.showToast({
									icon:'none',
									title:'请核对取货码',
									duration:2000
								})
							}
						}else{ 
							uni.showToast({
								icon:'none',
								title:'二维码扫描不完整',
								duration: 2000
							}) 
						}
					},
					fail:(err)=>{
						console.log(err)
					}

				});
			},
			orderScanCode() {
				uni.navigateTo({
					url: '../shop/code',
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			openUserList() { 
				uni.navigateTo({
					url: '../../finance/sell/unity/unity',
					animationType: 'pop-in',
					animationDuration: 200
				}); 
			},		  
			openPlaceOrder() {
				this.$refs.openAds.close() 
				uni.navigateTo({
					url: '../mall/mall',
					animationType: 'pop-in',
					animationDuration: 200
				}); 
			},	
			onPullDownRefresh(){
				let platform = uni.getSystemInfoSync().platform
				if(platform == "android"){ 
					uni.startPullDownRefresh()										
				}				
				if(this.fromlogin){
					this.getDayBusiStat('getDayBusiStat',this.loginWhether.md5key) 	
				}else{
					if(this.refreshed){
						this.getDayBusiStat('getDayBusiStat',this.refreshed) 							
					}else{
						setTimeout(()=>{								
							this.getDayBusiStat('getDayBusiStat',this.refreshed) 	
						},100)
					}
				}
				setTimeout(function () {
					uni.stopPullDownRefresh()
				}, 1000)
			},
		}
	}
</script>

<style lang="scss">
	 
	
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
					padding: 16rpx 20rpx 16rpx 0;
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
							padding-top: 10rpx;
							font-size: 25rpx;
							color: #999;
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
					padding: 16rpx 20rpx 16rpx 0;
					
					.txt{
						width: 78%;
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
	
	.pop_content{   
		position: relative;
		left:0; 
		text-align: center;
		display: flex;
		justify-content: center;
		padding-bottom: 80px;
		.title{ 
			position: absolute; 
			bottom: 40rpx;
			color: #FFFFFF;
			border: 1px solid #FFFFFF;
			border-radius: 50%; 
			font-size: 40rpx;
			padding: 8rpx 10rpx;
		}
		.adimg{
			height: 664rpx;
		}
	}
	#oderIndex {
		#mian {
			width: 100%;
			height: 330rpx;
			background-color: #46B85B;
			position: relative;
			margin-bottom: 94rpx;
		}

		.total {
			font-size: 60rpx;
			text-align: center;
			color: #FFFFFF;

			.txt {
				font-size: 20rpx;
				padding-left: 8rpx;
			}

		}

		.getMoney {
			text-align: center;
			padding: 16rpx 0 10rpx 0;

			.btn {
				display: inline-flex;
				font-size: 30rpx;
				color: #FFFFFF;
				border: 1px solid #FFFFFF;
				padding: 6rpx 80rpx;
				border-radius: $uni-border-radius-lg;
				line-height: 1.8;
			}
		}


		
		.count-wrap {
			display: flex;
			padding: 28rpx 28rpx 20rpx 28rpx;
			// padding: 28rpx 0 8px 0;
			font-size: 26rpx;
			// line-height: 1;
			// width: 80%; 
			justify-content: center;
			.count{
				width: 90%;
				display: flex;
				justify-content: space-between;
				.line{
					color: #FFFFFF;
					
				}
				.item {
					flex: 1;
					
					display: flex;
					align-items: center;
					color: #FFFFFF;
					// padding-left: 20rpx;

					.txt {
						justify-content: space-between;
						flex: 1;
						text-align: center;
						// font-weight: bolder;
					// 	font-weight: normal;
					}

					// .txt:first-child {
					// 	width: 70%;
					// }

				}
				.main_title{
					font-size: 30rpx;
				}
				
			}

		}


		.tools {
			display: flex;
			position: absolute;
			background-color: #FFFFFF;
			width: 84%;
			left: 8%;
			right: 8%;
			bottom: -21%;
			box-shadow: 0 3px 4px #e1e5e9;
			border-radius: 12rpx;
			padding: 20rpx 12rpx;

			.item {
				flex: 1;
				text-align: center;
				justify-content: center;
			}

			.icon {
				font-size: 80rpx;
				color: #46B85B;
				line-height: 1;
				position: relative;

				.newsBadge {
					position: absolute;
					top: 0;
					right: 0;
					width: 0;
					height: 0;

					.badge {
						position: absolute;
						right: 44rpx;
						top: -8rpx;
						color: #FF0000;
					}
				}

			}

			.txt {
				font-size: $uni-font-size-sm;
				color: #333333;
			}
		}

		#entry-list {
			border-radius: 12rpx;
			box-shadow: 0px 0px 2px #CCCCCC;
			width: 90%;
			margin: 0 auto;
			height: auto;
			display: flex;
			flex-wrap: wrap;
			padding-top: 30rpx;
			background-color: #FFFFFF;
			padding: 40rpx;

			.item {
				width: 33.33333333333%;
				text-align: center;
				padding-bottom: 30rpx;
				padding-top: 20rpx;

				.icon {
					color: #46B85B;
					border-radius: 50%;
					border: 1px solid #9E9E9E;
					width: 100rpx;
					height: 100rpx;
					font-size: 60rpx;
					line-height: 1.6;
					margin: 0 auto;
				}

				.txt {
					color: #333333;
					font-size: 30rpx;
					padding-top: 22rpx;
				}
			}

		}

		.unlinkto {
			padding: 20rpx;
			text-align: center;
			font-size: 26rpx;
			display: flex;
			justify-content: center;
			.text {
				padding: 12rpx;
				color: #295FEB;
			}
		}
	}
</style>
