<template>
	<view class="prePayOrder"> 
		<view class="wrapper">
			<scroll-view scroll-y scroll-with-animation show-scrollbar="true" :style="'height:'+ scrollH +'px;'">
				<!-- 预支付商品列表 -->
				<pre-pay-list :pre-pay-list="PrePayListData"></pre-pay-list>
				<!-- 预支付商品列表 end--> 
			</scroll-view>
			<btn-foot title="确认订单" @tap="btnClick" :fixd="true"></btn-foot> 
		</view>
		
		<!-- 立即支付 -->
		<uni-popup ref="popup" type="bottom"> 
			<view class="pay_checked" style="">
				<view class="title">合计：{{PayActual}}元</view>
				<view v-if="disablepay" class="oncredit">您选择了先铺货后付款</view> 
				<view class="get_coupon" v-if="!disablepay">
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
				<view class="totalNum" v-if="!disablepay">
					<view class="left">实际应支付：</view> 
					<view class="right"> {{PayActual}}元</view>
				</view> 
				
				<radio-group @change="radioChange">
					<pop-up names="支付宝支付" iconImg="alipay">
						<template v-if="!disablepay">
							<view slot="radioPay"><radio :value="checktype[0]" color="#09BB07" /></view>
						</template>
					</pop-up>
					<pop-up names="微信支付" iconImg="weixin">
						<template v-if="!disablepay">
							<view slot="radioPay"><radio :value="checktype[1]" color="#09BB07" /></view>
						</template>
					</pop-up>
				</radio-group> 
				
				<template v-if="disablepay"> 
					<btn-foot title="确认下单" class="topayBtn" @tap="toOnCredit()"></btn-foot> 
				</template>
				<template v-if="!disablepay"> 
					<btn-foot title="立即结清" class="topayBtn" @tap="getUnpaidOrder('nowPay')"></btn-foot> 
				</template>
			</view>
		</uni-popup>
		<!-- 立即支付 end-->
		
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
				<btn-foot title="立即结清" class="topayBtn" @tap="getUnpaidOrder('prevPay')"></btn-foot> 
			</view>
		</uni-popup>
		<!-- 有订单未结清 end-->
		 
		<!-- 预支付选择支付方式 -->
		<uni-popup ref="onCredit" type="center">
			<view class="credit_checked" style="">
				<view class="title">您可以先铺货后付款！</view> 
				<view class="content"> 
					本次订单款项于下次进货前结清
				</view>  
				<view class="checkOnCredit"> 
					<view class="checkBtn yes" @tap="checkOnCredit(true)">后付款</view>
					<view class="checkBtn no" @tap="checkOnCredit(false)">立即付款</view>
				</view> 
			</view>
		</uni-popup>
		<!-- 预支付选择支付方式 end-->	
		
	</view>
</template>

<script> 
	import { mapState, mapGetters} from 'vuex'
	import {b64Md5,hexMD5} from '@/network/md5.js'	
	import {getSortAscii} from '@/common/util/utils.js'
	
	import UniPopup from '@/components/uni/uni-popup.vue'
	import BtnFoot from '@/components/basic/btn-foot.vue'
	import PopUp from '@/components/BuyMall/rk-pop.vue'	
	
	import PayNow from '@/components/BuyMall/PayNow.vue'
	
	import PrePayList from '@/components/BuyMall/PrePayList.vue'
	export default {
		data(){
			return { 
				loginWhether:'',//登陆状态
				merchNo:'', //商户号				
				newOrderGoods:[], //预支付下单时的商品数据
				markText:'', 
				getOrderNo:'', 
				checktype:['alipay','weixin'],
				chooseType:'', 
				scrollH:"", 
				scrollTop:0,
				disablepay:false, 
				maskUnpaid:false,  
				couponid:String, 
				actualPay:'',
				PayNowData:Object,//立即支付数据
				UnPaidData:Object,//有订单未结清
				PrePayListData:Object,//预支付订单列表展示
				got:false,
				prevTime:false,
				clock:false,
				PreStatus:false,
				prePOrder:'',
			}
		},
		components:{
			BtnFoot,
			UniPopup,
			PopUp,
			PayNow, 
			PrePayList,
		}, 
		computed:{ 
			...mapState(['cartGoods','previousOrder','getCouponId','getCartAmt','limitAmt','canCredit','getUnusualAmt','getUnusualNo']),
			...mapGetters(['totalCount','totalPrice','prevOrderPrice']), 
			
			Payable:function(){
				return this.numFloat(this.totalPrice).toFixed(2) / 1
			},
			PayActual:function(){
				let org = this.totalPrice, 
					now = this.getCartAmt ? this.getCartAmt : 0 ,
					actualNums = this.numFloat(org -now).toFixed(2) / 1
				return actualNums
			},
			prePayable:function(){
				return this.numFloat(this.prevOrderPrice).toFixed(2) / 1
			},
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
			this.merchNo = uni.getStorageSync('user').merchNo				
			this.perpay() 
			
			this.prePOrder = option.orderno 
			if(option.status == 'true' && option.from != 'mallcar'){ 	
				// 滞后弹出 begin
				// this.PreStatus = true
				// this.getPrevOrder()		
				// 滞后弹出 end
				// 预先弹出 begin
				this.getPrevOrder()
				this.$nextTick(()=>{
					this.$refs.hasUnpaid.open()	
				})		
				// 预先弹出 end
			} 
		},
		
		onShow() {			
			uni.getSystemInfo({
				success:res=>{
					this.scrollH = res.windowHeight - 70 
				}
			}) 
			if(this.getCouponId){
				let c_one = this.numFloat(this.getCouponId.limitAmt),
					c_two = this.numFloat(this.getCouponId.couponAmt);
				this.got = true
				this.couponid = `满${c_one}减${c_two}`	  
				if(this.prevTime){					
					this.actualPay = this.numFloat(this.prevOrderPrice - this.getCouponId.couponAmt) 
				}else{					
					this.actualPay = this.numFloat(this.totalPrice - this.getCouponId.couponAmt) 	 
				}
			}else{						 
				this.couponid = '不使用优惠券'
			}
		},
		onBackPress(options) {  
			this.$store.dispatch('get_cart_amt','')
			this.$store.dispatch('get_coupon_id','')
		},
		methods:{ 
			closePrev(){ 
				this.$refs.hasUnpaid.close()
			},
			closePopup(){
				this.$refs.popup.close()
			},
			//预支付处理 begin
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
			// bindTextAreaBlur(e){ 
			// 	this.markText = e.detail.value ? e.detail.value : '无' 
			// },
			btnClick(){   
				// if(this.PreStatus){
				// 	this.getPrevOrder()
				// 	this.$refs.hasUnpaid.open()					
				// }else 
				if(this.canCredit == 1){ 
					this.$refs.popup.open()	
				}else{
					this.$refs.onCredit.open()
				} 
			},			
			checkOnCredit(option){
				this.$refs.onCredit.close()
				if(option === true){ 
					this.disablepay = true   
					if(this.limitAmt > 0 && this.totalPrice > this.limitAmt){
						setTimeout(()=>{
							uni.showModal({
								title:'下单提醒',
								content:`当前购买限额${this.limitAmt / 100}`,
								showCancel:false,
								success:(res)=> {
									uni.navigateTo({ 
										delta:1
									})
								},
							}) 
						},500)
					}else{
						this.$refs.popup.open()						
					}
					
				}else if(option === false){ 
					this.disablepay = false
					this.$refs.popup.open() 
						
					// 计算优惠券 
					if(this.getCouponId){
						let c_one = this.numFloat(this.getCouponId.limitAmt),
							c_two = this.numFloat(this.getCouponId.couponAmt);
						this.got = true
						this.couponid = `满${c_one}减${c_two}`						
						this.actualPay = this.numFloat(this.totalPrice - this.getCouponId.couponAmt) 
					}else{						 
						this.couponid = '不使用优惠券'
					}
					
					
				}
			},
			numFloat(param){
				return parseFloat(param / 100)
			},
			radioChange(e){ 
				this.chooseType = e.target.value 
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
			//预支付处理 end
			
			//有未结清订单			
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
							this.getBreakfastOrderDetail()
							this.getOrderCoupon(res.data.orderNo) 							
						}
					}
				})
			},
			getBreakfastOrderDetail(){   
				let vVlue = {"merchNo":this.merchNo,"orderNo":this.previousOrder.orderNo} 
				let sSort = getSortAscii(vVlue)
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase()  
				
				this.$request.post('getBreakfastOrderDetail',{
				  ...vVlue, 
				  "sign": sSign
				},{
					token:true
				}).then((res)=>{ 
					this.$api.initPage(res.code,res.message)
					if(res.code == 200){  
						this.UnPaidData = res.data 
					}
				}) 
			},		
			getUnpaidOrder(type){ 
				this.toPayBtn(type)   
			},  
			
			//获取不寻常订单信息
			getOrderCoupon(option){
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
			//有为结清订单end
			
			
			//先铺货后付款			
			toOnCredit(){  
				if(this.canCredit == 0){
					this.creditOrder()	 
				}
			}, 
			creditOrder(){ 
				let vVlue = {"merchNo":this.merchNo,"orderNo":this.prePOrder}
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
							title:'恭喜您，下单成功！'
						 }) 
						 setTimeout(()=>{
							 uni.hideLoading()
						 },1500)
						 uni.redirectTo({ 
							url:'../../finance/outlay/list'
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
			//先铺货后付款 end
			 
			toPayBtn(type){								
				let getPayType = this.chooseType	 
				switch (getPayType){
					case 'alipay': 
						this.payAlipay(type)
					break;
					case 'weixin':
						this.payWeixin(type)
					break;
				}				 
			}, 
			 
			payAlipay(type){ 
				let vVlue = ''
				let thisOrderNo = ''
				let instantPay = ''
				if(type == 'prevPay'){
					thisOrderNo = this.previousOrder.orderNo
					instantPay = 0
				}else if(type == 'nowPay'){ 
					thisOrderNo = this.prePOrder
					instantPay = 1
				} 
				if(this.getCouponId.couponNo){
					vVlue = {
					"merchNo":this.merchNo,
					"orderNo":thisOrderNo,
					"couponNo":this.getCouponId.couponNo ? this.getCouponId.couponNo : '',
					"instantPay":instantPay,
					} 
				}else if(this.clock){ 
					vVlue = {
						"merchNo":this.merchNo,
						"orderNo":thisOrderNo,
						"couponNo":this.getUnusualNo ? this.getUnusualNo : '',
						"instantPay":instantPay,
						}  
				}else{
					vVlue = {
						"merchNo":this.merchNo,
						"orderNo":thisOrderNo,
						"instantPay":instantPay,
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
							success: (res) => { 
								this.$refs.hasUnpaid.close() 
								this.PreStatus = false  
								if(type == 'nowPay'){
									setTimeout(()=>{
										uni.redirectTo({
											url:'../index/index'
										})
									},2000)								 					
								}
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
					}else if(res.code == 400){
						this.getPrevOrder()
						this.$refs.hasUnpaid.open()			
					}
				}).catch()
			},
			
			payWeixin(type){  
				let vVlue = ''
				let thisOrderNo = ''
				let instantPay = ''
				if(type == 'prevPay'){
					thisOrderNo = this.previousOrder.orderNo
					instantPay = 0
				}else if(type == 'nowPay'){
					thisOrderNo = this.prePOrder
					instantPay = 1
				}
				
				if(this.getCouponId.couponNo && !this.clock){
					vVlue = {
					"merchNo":this.merchNo,
					"orderNo":thisOrderNo,
					"couponNo":this.getCouponId.couponNo ? this.getCouponId.couponNo : '',
					"instantPay":instantPay,
					} 
				}else if(this.clock){ 
					vVlue = {
						"merchNo":this.merchNo,
						"orderNo":thisOrderNo,
						"couponNo":this.getUnusualNo ? this.getUnusualNo : '',
						"instantPay":instantPay,
						}  
				}else{
					vVlue = {
					"merchNo":this.merchNo,
					"orderNo":thisOrderNo,
					"instantPay":instantPay,
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
							success: (res) => { 
								this.$refs.hasUnpaid.close() 
								this.PreStatus = false 
								this.$store.dispatch('get_coupon_id','')
								if(type == 'nowPay'){
									setTimeout(()=>{
										uni.redirectTo({
											url:'../index/index'
										})
									},2000)		 					 					
								} 
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
			 
			
		},
	}
</script>

<style lang="scss"> 
	.prePayOrder{ 
		width: 100vw;  
		padding: 20rpx;
		
		
		 
		.editMark{  
			margin-top: 20rpx;
			background-color: #FFFFFF;
			border-radius: 8rpx;
			padding: 20rpx;
			
			.name{
				font-size: 30rpx;
				padding-bottom: 20rpx;
			}
			.markArea{
				padding: 20rpx;
				width: 100%;
				min-height: 160rpx;
				background-color: #f2f2f2;
			}
			
		} 
		
		
		.pay_checked{
			// background-color: #FFFFFF;
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
				// border-bottom: 1px dashed #f2f2f2;
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
				// border-bottom:1px dashed #eeeeee;
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
				
		} 
		
		
		.oncredit{
			color: #f00;
			text-align: center;
			padding: 24rpx 0;
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
				// border-bottom: 1px dashed #eeeeee;
			}
			// .totalNum{
			// 	padding: 32rpx 0;
			// 	font-size:36rpx;
			// 	font-weight: bold; 
			// }
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
		
		.credit_checked{			 
			border-radius: 8rpx;
			width: 600rpx;
			
			.title{
				text-align: center; 
				font-size: 40rpx;
				font-weight: bold;
				padding: 60rpx 0;
			}
			.content{ 
				text-align: center;
				padding: 0 12rpx 60rpx 12rpx;
			}
			
			.checkOnCredit{ 
				display: flex;
				padding: 32rpx 0; 
				border-top: 1px solid #EEEEEE;
				.checkBtn{
					flex: 1;
					text-align: center; 
					&:first-child{
						border-right: 1px solid #EEEEEE;
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
		
		
		 
	} 
	
</style>
