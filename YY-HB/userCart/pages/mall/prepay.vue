<template>
	<view class="prePayOrder"> 
		<view class="gopay-main">
			<block v-for="(carItem,index) in cartGoods">
				 <view class="gopay-group bor-der">
					 <view class="name">{{carItem.goodsName}}</view>
					 <view class="info">
						 <view class="price">{{carItem.goodsPrice  | filprie()}} 元</view>
						 <view class="nums">{{carItem.boxNums}} {{carItem.goodsUnit}}</view>					 
					 </view>	 
				 </view>
			 </block>
			 <view class="gopay-group">
				 <view class="name title">合计：</view>
				 <view class="total">
					<view class="price">{{totalPrice | filprie()}} </view> <text class="txt">元</text>
				 </view>
			 </view> 
		 </view>
		 
		<btn-foot title="确认订单" @tap="btnClick()"></btn-foot>
		
		
		<uni-popup ref="popup" type="bottom">
			<view class="pay_checked" style="">
				<view class="title">订单合计</view>
				<view class="totalNum">{{totalPrice | filprie()}}</view> 
				<btn-foot title="去支付" 
				class="topayBtn" @tap="toPayBtn()"></btn-foot> 
			</view>
		</uni-popup>
		
	</view>
</template>

<script> 
	import { mapState, mapGetters} from 'vuex'
	import BtnFoot from '@/components/btn-foot.vue'
	import UniPopup from '@/components/uni-popup.vue' 
	export default {
		data(){
			return {     
				newOrderGoods:[],
				lastPrice:'', 
				getOrderNo:'', 
				chooseType:'', 
			}
		},
		components:{
			BtnFoot,
			UniPopup,
		},  
		computed:{ 
			...mapState(['cartGoods']),
			...mapGetters(['totalCount','totalPrice'])  
		}, 
		filters:{
		  filprie(price){
			return  '￥' + parseFloat(price/100).toFixed(2)
		  }
		},
		onLoad() {
			this.perpay()
		},
		methods:{
			toPayBtn(){				
			    var userAgent = navigator.userAgent.toLowerCase();			
			    if(userAgent.match(/Alipay/i) == "alipay") {
			       this.chooseType = 'alipay'
			    } else if(userAgent.match(/MicroMessenger/i) == "micromessenger") { 
					this.chooseType = 'weixin'					
			    } 
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
			perpay(){ 
				let cartGoods = this.cartGoods 
				for(let i in cartGoods){
					let res = { 
						goodsNo:cartGoods[i].goodsNo,
						goodsNum:JSON.stringify(cartGoods[i].boxNums), 
					}
					this.newOrderGoods.push(res) 
				} 				 
			},  
			payWeixin(){  
				let userInfo = uni.getStorageSync('getUserInfo')  
				let getPayOrderNo = this.getOrderNo.orderNo  
				uni.request({
				    url: 'https://gworder.yiyichina.cn/v1/wap/wxPayOrder',
				    data: {
						"userNo":userInfo.user,
						"orderNo":getPayOrderNo,
						"uid":userInfo.uid,
						"doSign":userInfo.doSign,
				    }, 
					method:'POST',
				    success: (res) => {		
						let resData = res.data.data 
						let enddata = {
							"appId":resData.appId,
							"timeStamp":resData.timeStamp,  
							"nonceStr":resData.nonceStr,
							"package":resData.package,     
							"signType":"MD5",  
							"paySign":resData.paySign					
						} 			  
						if (typeof WeixinJSBridge == "undefined"){
						   if( document.addEventListener ){
						       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);							
							   
						   }else if (document.attachEvent){
						       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
						       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
						   }
						}else{
						   this.onBridgeReady(enddata); 
						}  
						
				    },
				});  
			},
			onBridgeReady(wxGetOrder){
				let userInfo = uni.getStorageSync('getUserInfo')  
				let getPayOrderNo = this.getOrderNo.orderNo 
				let payAmt = this.totalPrice 
				WeixinJSBridge.invoke('getBrandWCPayRequest', wxGetOrder, (res)=>{
			      if(res.err_msg == "get_brand_wcpay_request:ok" ){ 
					  
					window.location.href = "https://gworder.yiyichina.cn/v1/wap/getOrderResult?orderNo="+getPayOrderNo+"&payAmt="+payAmt+"&userNo="+userInfo.user+"&uid="+userInfo.uid+"&doSign="+userInfo.doSign
				
				  }
			   });
			   
			},
			
			payAlipay(){  
				let userInfo = uni.getStorageSync('getUserInfo')  
				let getPayOrderNo = this.getOrderNo.orderNo  
				uni.request({
				    url: 'https://gworder.yiyichina.cn/v1/wap/aliPayOrder',
				    data: {
						"userNo":userInfo.user,
						"orderNo":getPayOrderNo,
						"uid":userInfo.uid,
						"doSign":userInfo.doSign,
				    }, 
					method:'POST',
				    success: (res) => {					 
						const div = document.createElement('div')
						div.innerHTML = res.data
						document.body.appendChild(div)
						document.forms[0].submit()
				    },
				}); 
				
			},
			btnClick(){  				
				let userInfo = uni.getStorageSync('getUserInfo')    
				uni.request({
				    url: 'https://gworder.yiyichina.cn/v1/wap/order',
				    data: {
						"userNo":userInfo.user,
						"uid":userInfo.uid, 
						"merchNo":userInfo.merchNo,
						"orderType":1,
						"orderAmt":this.totalPrice,
						"orderGoods":JSON.stringify(this.newOrderGoods),
						"doSign": userInfo.doSign
				    }, 
					method:'POST',
				    success: (res) => { 
						this.getOrderNo = res.data.data; 
						this.$refs.popup.open()
				    }, 
				}); 
			},
			
		},
	}
</script>

<style lang="scss" scoped> 
page{
	
	background-color: #F2F2F2;
}
.prePayOrder{ 
	padding: 20rpx;
	.gopay-main{				
		background-color: #FFFFFF;
		border-radius: 8px;
		padding: 20rpx;
		.bor-der{				
			border-bottom: 1px dashed #d4d4d4;
		}
		.gopay-group{
			padding: 20rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.name{
				flex: 1;
				font-size: 30rpx;
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
			.title{
				font-size: 30rpx;
			}
			
			.total{ 
				display: flex;
				align-items: center; 
				
				.price{ 
					font-size: 40rpx; 
				}
				.txt{
					font-size: 26rpx;
					padding-left: 4rpx;
					padding-top: 8rpx; 
				}
				
			} 
			
		}   
	 
	} 
	.pay_checked{
		padding: 40rpx;
		position: relative; padding-bottom: 120rpx;
		
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
