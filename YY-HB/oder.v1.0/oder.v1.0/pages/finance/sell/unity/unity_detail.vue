	<template>
	
	<view class="wrapper">
	 
	 <uni-nav-bar :status-bar="true" :fixed="true" left-icon="arrowleft" @clickLeft="back" color="#ffffff" background-color="RGBA(70, 184, 91, 1)"/>
	 
	<template v-if="isload">
		<default-page :load="true"></default-page>
	</template> 
	
	<template v-if="isnohave">
		<default-page :nohave="true"></default-page>
	</template>
	
	<template v-if="isready">
	
	
		<view class="goods-detail"> 
			<view class="header">
				<view class="status">{{orderStatus}}</view>
				<view class="txt">{{orderInfoTxt}}</view> 
			</view> 
			<view class="content">
				<view class="goods-list">
					<view class="title">商品列表</view> 
					<block v-for="(items,index) in currentItem.content" :key="'4'+index">
						<view class="goods-group">
							<view class="tit">{{items.goodsName}}</view>
							<view class="cont">
								<view class="price">{{parseFloat(items.goodsPrice/100).toFixed(2)}} 元</view>
								<view class="unit">{{items.goodsNum}} {{items.goodsUnit}}</view>
							</view>
						</view>
					</block>
					<view class="other-type">
						<view class="goods-group">
							<view class="tit">配送费</view>
							<view class="cont"><view class="price">{{parseFloat(currentItem.orderFee/100).toFixed(2)}}元</view></view>
						</view>
						
						<template v-if="currentItem.helpState == 1">
							<view class="goods-group">
								<view class="tit">垃圾分类</view>
								<view class="cont"><view class="price">{{parseFloat(currentItem.helpFee/100).toFixed(2)}}元</view></view>
							</view>
						</template>
						<view class="goods-group">
							<view class="tit">优惠券</view>
							<view class="cont"><view class="price">{{parseFloat(currentItem.couponAmt/100).toFixed(2)}}元</view></view>
						</view>
						<view class="goods-group">
							<view class="tit">会员折扣</view>
							<view class="cont"><view class="price">省{{parseFloat(currentItem.discountAmt/100).toFixed(2)}}元</view></view>
						</view> 
					</view>
				
					<view class="total-list">
						<view class="tit">合计</view>
						<view class="cont"><text class="price"> {{parseFloat(currentItem.realAmt/100).toFixed(2)}}</text> <text class="unit">元</text></view>
					</view>
				</view> 
				 
				<view class="orderList"> 
					<view class="title">订单信息</view> 
					<template v-if="currentItem.deliverType !== 2">
						<view class="order-group">
							<view class="tit">收货地址</view>
							<view class="cont">{{currentItem.reachAddr}}</view> 
						</view>
						<view class="order-group">
							<view class="tit">收货人</view>
							<view class="cont">{{currentItem.merchName}}</view> 
						</view> 
					</template>
					<view class="order-group">
						<view class="tit">备注</view>
						<view class="cont">{{currentItem.remark|| '无'}}</view>
					</view>
					<view class="order-group">
						<view class="tit">配送方式</view>
						<view class="cont">{{deliverType}}</view> 
					</view>
					<view class="order-group">
						<view class="tit">收货人性别</view>
						<view class="cont">{{(currentItem.sex == 1) ? '男' : '女'}}</view> 
					</view>
					<view class="order-group">
						<view class="tit">收货人电话</view>
						<view class="cont" :class="currentItem.recPhone ? 'callNo' : '' " @tap="callUser(currentItem.recPhone)">{{(currentItem.recPhone) || '无'}}</view>
					</view> 
				</view>
				<view class="orderList"> 
					<view class="order-group">
						<view class="tit">订单编号</view>
						<view class="cont">{{currentItem.orderSn}}</view>
					</view>
					<view class="order-group">
						<view class="tit">下单时间</view>
						<view class="cont"><text>{{currentItem.orderTime}}</text></view> 
					</view>
					<view class="order-group">
						<view class="tit">支付方式</view> 
						<view class="cont">{{orderPayType}}</view>
					</view>
				</view>
				<view class="orderList"> 
					<view class="order-group">
						<view class="tit">商户电话</view>
						<view class="cont">{{currentItem.merchContactPhone}}</view>
					</view>
					<view class="order-group">
						<view class="tit">客服电话</view>
						<view class="cont callNo" @click="callNoBtn">{{currentItem.serviceContactMobile.replace(',',' ')}}</view>
					</view>
					<!-- <view class="order-group">
						<view class="tit">支付状态</view>
						<view class="cont">{{payStatus}}</view>
					</view> -->
					
				</view>
				
			</view>		 
		</view>
	
	</template>
	
	</view>
	
</template>

<script> 	
	import {b64Md5,hexMD5} from '@/network/md5.js'	
	import {getSortAscii, arrayExclude,} from '@/common/util/utils.js'
	
	import UniNavBar from '@/components/uni/uni-nav-bar.vue'
	import DefaultPage from '@/components/basic/default-page.vue'	
	export default {
		data() {
			return {
				loginWhether:'',//登陆状态 
				merchNo:'', //商户号
				index:0,
				orderArg:'',
				currentItem:'', 
				pays:'',
				orderNo:'',  
				isload:true, 
				isnohave:false,
				isready:false,
			};
		},
		components:{
			DefaultPage,
			UniNavBar,
		},
		onLoad(option) { 
			
			if(option.pushNo){
				this.pushMsg = option.pushNo   
			}else{
				this.orderNo = option.orderNo	 				
			} 			
			
			// this.orderNo = option.orderNo	
			this.loginWhether = uni.getStorageSync('status') 
			this.merchNo = uni.getStorageSync('user').merchNo	
			
			this.getDetail()			
		},
		computed:{
			payStatus:function(){
				let ps = this.currentItem.payState; 
				switch (ps){
					case 0 :
					return '未支付';
					break;
					case 1 :
					return '支付成功';
					break;
					case 2 :
					return '支付失败';
					break;
				}
			},			
			orderStatus:function(){	
				let os = this.currentItem.orderState;	 
				switch (os){
					case 0 :
						return '订单已审核';
						break;
					case 1 :
						return '订单取货中';
						break;
					case 2 :
						return '订单配送中';
						break;
					case 3 :
						return '订单已完成';
						break;
					} 
			},
			orderInfoTxt:function(){	
				let os = this.currentItem.orderState;	 
				switch (os){
					case 0 :
						return '您的订单审核中，请耐心等待';
						break;
					case 1 :
						return '您的订单正在取货中，请耐心等待';
						break;
					case 2 :
						return '您的订单正在配送中，祝您生活愉快';
						break;
					case 3 :
						return '您的订单已完成，祝您生活愉快';
						break;
					} 
			},
			deliverType:function(){				 
				let os = this.currentItem.deliverType;				
				switch (os){
					case 0 :
					return '接单中心';
					break;					
					case 1 :
					return '商家';
					break;
					case 2 :
					return '自取';
					break;
					case 3 :
					return '移移';
					break;
				} 
			},
			orderPayType:function(){
				let opay = this.currentItem.payType
				switch(opay){
					case 1 :
						return '微信';
						break;
					case 2 :
						return '支付宝';
						break;
					default:
						return '无'; 
				}
			},
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 2
				})
			},
			callUser(phone){
				uni.makePhoneCall({
					phoneNumber: phone
				}); 
			},
			callNoBtn(){	 
				let no = this.currentItem.serviceContactMobile
				let newNo = no.split(",") 
				uni.showActionSheet({
				    itemList: newNo,
				    success: (res)=>{ 
						uni.makePhoneCall({
							phoneNumber: newNo[res.tapIndex]
						});  
				    }
				}); 
			},
			getDetail(){  		  
				 			
				let vVlue = ''
				if(this.pushMsg){ 
					vVlue = {"merchNo":this.merchNo,"orderNo":this.pushMsg,} //必传 
				}else{   	 
					vVlue = {"merchNo":this.merchNo,"orderNo":this.orderNo,} //必传 
				}   
				
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 	
									 
				this.$request.post('getUserOrderDetail',{
					...vVlue, 
					"sign": sSign
				},{
					token:true
				}).then(res => {
					this.$api.initPage(res.code,res.message)  
					if(res.code == 200){						
						setTimeout(()=>{								
							this.isload = false
							this.isready = true
							this.currentItem = res.data	
											
							if(res.data.length == 0){ 
								this.isnohave = true
							}
						},300)
						
					}
				}).catch() 
			},
			
		}
	}
</script>

<style lang="scss">
	
	.goods-detail{
		width: 100vw;
		position: relative;
		.header{
			background-color: #46B85B;
			height: 200rpx;
			padding: 0 30rpx;
			color: #FFF;
			
			.status{font-size: 50rpx;}
			.txt{font-size: 26rpx; padding-top: 16rpx;}
		}
		
		
		
		
		.content{
			position: absolute;
			top: 120rpx;
			left: 30rpx;
			right: 30rpx;
			
			.goods-list{
					
				padding: 30rpx;
				border-radius: 12rpx;			 
				background-color: #FFFFFF;
				
				.title{ color:#999999; font-size:26rpx; padding-bottom: 20rpx; border-bottom: 1rpx solid #D4D4D4;}
				
				.goods-group{
					display: flex;
					justify-content: space-between;
					padding: 32rpx 0;
					border-bottom: 1px solid #d4d4d4;
					
					.tit{
						font-size: 30rpx;
						padding-top: 12rpx;
						display: flex;
						font-weight: bold;
						align-items: flex-start;
												
						.hot{ font-size:16rpx; color: #FF0000; padding-left: 8rpx;}
					}
					.cont{
						text-align: right;
						.price{
							font-size: 26rpx;
						}
						.unit{ font-size: 20rpx; color: #999999;}
						
						
					} 
				}
				
				.other-type{
					padding: 12rpx 0;
					border-bottom: 1px solid #d4d4d4;
					.goods-group{
						display: flex;
						justify-content: space-between;
						padding: 12rpx 0;
						border-bottom: 0; 
						.tit{
							font-weight: normal;
						}
					}
					.red{
						color: #FF0000;
					}
					.green{
						color: #46B75B;
					}
					
				}
				
				
			}
			
			.total-list{
				display: flex;
				padding-top: 30rpx;
				justify-content: space-between;
				align-items: center;
				.tit{
					font-size: 30rpx; 
				}
				.cont{
					text-align: right; 
					align-items: flex-end;
					.price{
						font-size: 50rpx;
					}
					.unit{ font-size: 28rpx; color: #999999;}
					
				}
			}
			
		}
		
		
		.orderList{
			margin: 30rpx 0;
			padding: 30rpx; 
			border-radius: 12rpx;
			background-color: #FFFFFF;
			
			.title{ color:#999999; font-size:26rpx; padding-bottom: 20rpx; border-bottom: 1rpx solid #D4D4D4;}
			.order-group{
				color: #333;
				border-bottom: 1px solid #d4d4d4;
				padding: 30rpx 0;
				display: flex;
				justify-content: space-between;
				
				.tit{font-size: 30rpx; flex: 3;}
				
				.cont{ font-size: 26rpx; flex: 7; text-align: right;}
				
				&:last-child{
					border: 0;
				}
								
				.callNo{
					color: #46B85B;
				}
			}
		}
		
		
		
		
		
	} 
</style>
