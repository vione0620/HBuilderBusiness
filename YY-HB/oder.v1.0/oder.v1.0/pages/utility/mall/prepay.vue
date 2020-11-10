<template>
	<view class="prePayOrder"> 
		<view class="wrapper">
		<scroll-view scroll-y scroll-with-animation show-scrollbar="true" :style="'height:'+ scrollH +'px;'">
			<view class="gopay-main"> 
					<view class="group-wrap"> 
						 <view class="gopay-group" v-for="(food,index) in cartGoods" :key="'4'+index">
							 <view class="name">{{food.goodsName}} 
							 <text class="red">{{(food.goodsNo === "YP0YWDJ0000014") ? '必选' : ''}}</text>
							 <text class="hots">{{(food.hotSale==='0' || food.hotSale === undefined) ? '' : '热门'}}</text>
							 </view>
							 <view class="info">
								 <view class="price">{{parseFloat(food.merchPrice * food.boxNums /100).toFixed(2) + '元'}}</view>
								 <view class="nums">{{food.boxNums}} {{food.goodsUnit}}</view>					 
							 </view>	 
						 </view>
					</view> 
				 
				 <view class="group-wrap-tot">		
					 <view class="gopay-group">
						 <view class="name">合计：</view>
						 <view class="total">
							<view class="price">{{parseFloat(totalPrice/100).toFixed(2)}} </view> <text class="txt">元</text>
						 </view>
					 </view> 
				 </view>
				 
			</view>
			 
			<view class="editMark">		
				 <view class="name">备注</view>
				 <textarea class="markArea" :value="markText" @blur="bindTextAreaBlur" auto-height placeholder-style="color:#777" placeholder="请准时送到"></textarea>
			</view>
		</scroll-view>
		<btn-foot title="确认订单" @tap="btnClick" :fixd="true"></btn-foot>
			
		</view> 
		 
		
		<uni-popup ref="popup" type="bottom">
			<view class="pay_checked" style="">
				<view class="title">订单合计</view>
				<view class="totalNum">{{parseFloat(totalPrice/100).toFixed(2)}}</view> 
				
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

<script> 
	import { mapState, mapGetters} from 'vuex'
	import {b64Md5,hexMD5} from '@/network/md5.js'	
	import {getSortAscii} from '@/common/util/utils.js'
	
	import UniPopup from '@/components/uni/uni-popup.vue'
	import BtnFoot from '@/components/basic/btn-foot.vue'
	import PopUp from '@/components/basic/rk-pop.vue'	
	export default {
		data(){
			return { 
				loginWhether:'',//登陆状态
				merchNo:'', //商户号
				title:'prePayOrder', 
				newOrderGoods:[],
				markText:'', 
				getOrderNo:'', 
				checktype:['alipay','weixin'],
				chooseType:'', 
				scrollH:"", 
			}
		},
		components:{
			BtnFoot,
			UniPopup,
			PopUp
		}, 
		onLoad() {   
			this.loginWhether = uni.getStorageSync('status') 
			this.merchNo = uni.getStorageSync('user').merchNo				
			this.perpay() 
		},
		onShow() {			
			uni.getSystemInfo({
				success:res=>{
					this.scrollH = res.windowHeight - 70 
				}
			})  
		},
		computed:{ 
			...mapState(['cartGoods']),
			...mapGetters(['totalCount','totalPrice'])  
		}, 
		methods:{ 			
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
			bindTextAreaBlur(e){
				if(e.detail.value){
					this.markText = e.detail.value
				}else{
					this.markText = '无'
				} 
			},
			
			perpay(){ 
				let getCarList = this.cartGoods
				for(let i in getCarList){
					let res = { 
						goodsNo:getCarList[i].goodsNo,
						goodsNum:JSON.stringify(getCarList[i].boxNums),
						hotSale:getCarList[i].hotSale ? getCarList[i].hotSale : '0',
					}
					this.newOrderGoods.push(res) 
				} 
				
			}, 
			payWeixin(){ 
				let getPayOrderNo = this.getOrderNo.orderNo
				let vVlue = {"merchNo":this.merchNo,"orderNo":getPayOrderNo,} //必传 
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post('wxPayOrder',{
					...vVlue,
					"sign":sSign
				},{
					token:true
				}).then(res => { 
					let getRes = res.data
					if(res.code == 200){ 
						uni.showToast({
							icon:'none',
							title:res.message,
							duration: 2000
						})				
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
								uni.redirectTo({
									url:'../../finance/outlay/list?type=prepay'
								})
							},
							fail: (err)=>{
								uni.showToast({
									icon:'none',
									title:'支付失败',
									duration: 2000
								})
								uni.redirectTo({
									url:'../../finance/outlay/list?type=prepay'
								})
							}
						});	 
						
					}else{
						uni.showToast({
							icon:'none',
							title:res.message,
							duration: 2000
						})
					}
					 
				}).catch() 
			},
			payAlipay(){ 
				let getPayOrderNo = this.getOrderNo.orderNo
				let vVlue = {"merchNo":this.merchNo,"orderNo":getPayOrderNo,} //必传 
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
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
							success: (res)=> {
								uni.redirectTo({
									url:'../../finance/outlay/list?type=prepay'
								})
							},
							fail: (err)=>{
								uni.showToast({
									icon:'none',
									title:'支付失败',
									duration: 2000
								})
								uni.redirectTo({
									url:'../../finance/outlay/list?type=prepay'
								})
							}
						});
						
					}else{
						uni.showToast({
							icon:'none',
							title:res.message,
							duration: 2000
						})
					}
					
				}).catch() 
			},
			btnClick(){
				let vVlue = {
					"merchNo":this.merchNo,
					"orderType":1,
					"orderAmt":this.totalPrice,
					"remark":this.markText,
					"orderGoods":JSON.stringify(this.newOrderGoods),
					} //必传 
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 		
				
				this.$request.post('prePayOrder',{
					...vVlue,
					"sign": sSign
				},{
					token:true
				}).then(res => {
					if(res.code === 200){
						this.getOrderNo = res.data;			 
						this.$refs.popup.open()
					}else if(res.code ===400 ){ 
						uni.showModal({
							title:'下单提醒',
							content:`营业中，请${res.message}`,
							success: (res) => {
								if(res.confirm){
									uni.navigateTo({
										url:'../../account/option/option'
									})
								}
							}
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
		 
		.gopay-main{
				
			background-color: #FFFFFF;
			border-radius: 8px;
			padding: 20rpx;
			
			.group-wrap{
			// 	background-color: #FFFFFF;
				
			// 	.title{				
			// 		padding:18rpx;
			// 		font-size: 28rpx;
			// 		background-color: #f2f2f2;
			// 		border-bottom: 1px solid #d4d4d4;
			// 	}
				
				}	
				.gopay-group{
					padding: 20rpx;
					display: flex;
					justify-content: space-between;
					border-bottom: 1px dashed #d4d4d4;
					align-items: center;
					
					.name{
						flex: 1;
						font-size: 30rpx;
						.red{
							color: #f00;
							font-size: 22rpx;
							vertical-align: text-top;
						}
						.hots{
							font-size: 22rpx;
							color: #FF0000;
							vertical-align: text-top;
							padding-left: 8rpx;
						}
					}
					
					.info{
						flex: 1;
						text-align: right; 
						
						.price{
							font-size: 30rpx;
						}
						.nums{
							font-size: 26rpx;
							color: #999;
						}
					}
					
					.total{ 
						display: flex;
						align-items: center;
						
						.price{ 
							font-size: 50rpx; 
						}
						.txt{
							font-size: 26rpx;
							padding-left: 4rpx;
							padding-top: 8rpx; 
						}
						
					}
					
						
					
					&last-child{
						border-bottom: 0;
					}
					
				}  
			
		 
		}
		 
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
			padding: 40rpx;
			position: relative; padding-bottom: 160rpx;
			
			.title{
				text-align: center;
			}
			.totalNum{
				font-size: 80rpx;
				padding: 40rpx;
				text-align: center;
				border-bottom: 1px dashed #f2f2f2;
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
			
				
		} 
		
		 
	}
	
	
	
	 
	
	
</style>
