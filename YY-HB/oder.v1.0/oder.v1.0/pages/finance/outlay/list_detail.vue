<template>
	
	<view class="wrapper">
	
	 
	<template v-if="isload">
		<default-page :load="true"></default-page>
	</template> 
	
	<template v-if="isready">
	
	<view class="" v-if="currentItem.orderState == 1 && !this.maphide">
		<my-map :order-map-data="orderMapData"></my-map>
	</view> 
	<view class="" v-if="currentItem.orderState == 1 && !this.maphide">
		<view class="bg-mapspace"></view>
	</view>	
	<template v-if="currentItem.orderState != 1 || this.maphide"> 
		<uni-nav-bar :status-bar="true" :fixed="true" left-icon="arrowleft" @clickLeft="back" color="#ffffff" background-color="RGBA(70, 184, 91, 1)"/>
	</template>
	<view class="goods-detail"> 
	<!-- this.credit && this.pStates == 0 -->
		<view class="header">
			<template v-if="this.credit && this.unpaid">
			<view class="status">未支付订单</view> 
			</template>
			<template v-else>
				<view class="status">{{orderStatus}}</view> 
			</template>
			<template v-if="currentItem.orderState == 0"> 
				<view class="txt">您的订单等待配送</view>
			</template>
			<template v-if="currentItem.orderState == 1"> 
				<view class="txt">您的订单正在配送中，请耐心等待</view>
			</template> 
			<template v-if="currentItem.orderState == 2">
				<view class="txt">您的订单已送达，祝您生活愉快</view>
			</template> 
		</view> 
		
		
		
		<view class="content">
			<view class="goods-list">
				<view class="title">商品列表</view> 
				<block v-for="(items,index) in currentItem.content" :key="'4'+index">	 
					<view class="goods-group">
						<view class="tit">{{items.goodsName}} <text class="hot">{{(items.hotSale === '0') ? '' : '热卖' }}</text></view> 
						<view class="cont"  v-if="preicePart || maphide">
							<view class="price">{{parseFloat(items.merchPrice * items.goodsNum / items.goodsQuantity * items.goodsQuantity / 100).toFixed(2)/1}} 元</view>
							<view class="unit">{{items.goodsQuantity}} {{items.goodsUnit}} * {{items.goodsNum/items.goodsQuantity}}</view>
						</view>
					</view>
				</block>   
				<template v-if="preicePart">
						
					<view class="giveback-list" v-if="currentItem.couponAmt > 0">
						<view class="group">
							<view class="left"><view class="redicon">￥</view><view class="txt">满减红包</view></view> 
							<view class="right">
								<view class="price">减{{parseFloat(currentItem.couponAmt/100).toFixed(2)/1}}元</view> 
							</view>
						</view>
						<!-- <view class="group">
							<view class="left"><view class="redicon">￥</view><view class="txt">会员折扣</view></view> 
							<view class="right">
								<view class="price">减9元</view> 
							</view>
						</view> -->
					</view>
					<view class="total-list"> 
						<view class="right">
							<view class="sub_left" v-if="currentItem.couponAmt > 0">
								<view class="">已优惠</view> <view class="price">{{parseFloat(currentItem.couponAmt/100).toFixed(2)/1}}</view>元
							</view>
							<view class="sub_right">
								<view class="tit">应付</view>  
								<view class="price">{{parseFloat(currentItem.realAmt/100).toFixed(2)/1}}</view>
								<view class="unit">元</view>
							</view>
							
						</view>
					</view> 
					
				</template>
				
			</view>   
			 
			<view class="orderList">
				<template v-if="this.currentItem.deliverPhone && this.currentItem.deliverName">
					<view class="order-group">
						<view class="tit">配送人手机号</view> 
						<view class="cont callNo" @tap="driverPhone(currentItem.deliverPhone)">
							<view class="callText"><text class="iconfont icondianhua-copy"></text>联系配送</view>
						</view>
						
					</view>
					<view class="order-group">
						<view class="tit">配送人名字</view>
						<view class="cont">{{currentItem.deliverName}}</view>
					</view>
				</template>
				<view class="order-group">
					<view class="tit">订单编号</view>
					<view class="cont">{{currentItem.orderNo}}</view>
				</view> 
				<view class="order-group">
					<view class="tit">营业地址</view>
					<view class="cont">{{currentItem.busiAddr}}</view> 
				</view>
				<view class="order-group">
					<view class="tit">商户名称</view>
					<view class="cont">{{currentItem.merchName}}</view> 
				</view>
				<view class="order-group">
					<view class="tit">下单时间</view>
					<view class="cont"><text>{{currentItem.orderTime}}</text></view> 
				</view>
				<view class="order-group" v-if="!this.suborder || !this.unpaid">
					<view class="tit">支付方式</view> 
					<view class="cont">{{orderPayType}} </view>
				</view>
			<!-- 	<view class="order-group">
					<view class="tit">备注</view>
					<view class="cont">{{currentItem.remark ? currentItem.remark : '无'}}</view>
				</view> -->
				<view class="order-group" v-if="!this.suborder || !this.unpaid">
					<view class="tit">支付状态</view>
					<view class="cont">{{payStatus}}</view>
				</view>
				<template>
					<view class="order-group" v-if="this.currentItem.payState == 2">
						<view class="tit">失败原因</view>
						<view class="cont">{{currentItem.reason}}</view>
					</view>
				</template> 
				<view class="order-group serve_phone">
					<view class="tit">联系客服</view>
					<view class="cont callNo" @tap="callNoBtn()">
						<view class="callText"><text class="iconfont icondianhua-copy"></text>联系客服</view>
					</view>
				</view>
			</view>
			 
			
		</view>
	  
	</view>
	
	</template> 
	</view>
</template>

<script> 
	
	import {mapState} from 'vuex'
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii, arrayExclude,handleDate,handleYesterday,} from '@/common/util/utils.js' 
	
	import UniNavBar from '@/components/uni/uni-nav-bar.vue'
	import DefaultPage from '@/components/basic/default-page.vue'
	import BtnFoot from '@/components/basic/btn-foot.vue' 
	import MyMap from '@/components/maps/myMap.nvue'
	
	export default {
		data() {
			return {
				index:0,
				orderArg:'',
				currentItem:'', 
				pays:'',
				loginWhether:'',//登陆状态 
				merchNo:'', //商户号
				isload:true,
				isnostore:false,
				isnohave:false,
				isready:false,
				pushMsg:'',
				orderMapData:'', 
				mapDistance:'',
				preicePart:false,
				credit:false,
				maphide:false,
				pStates:0,
				suborder:true,
				unpaid:true,
			};
		},
		components:{
			DefaultPage,
			UniNavBar,
			BtnFoot, 
			MyMap,
		},
		onLoad(option) {  
			if(option.pushNo){
				this.pushMsg = option.pushNo
			}else{
				this.orderArg = option  
			}   
			
			this.loginWhether = uni.getStorageSync('status')  
			this.merchNo = uni.getStorageSync('user').merchNo		 
			if(option.navto == 'keepon'){				
				this.getDetail('getBreakfastOrderDetail')	
			}else{		
				this.credit = true
				this.pStates = option.pStates
				this.getDetail('getUnpaidOrderDetail')	 
			}
			
			
			if(this.orderArg.from == 'parents'){
				this.preicePart = true 
			}else if(this.orderArg.from == 'suborder'){
				this.suborder = true
			}
			if(this.orderArg.from == 'allsub'){
				this.maphide = true   
				this.preicePart = true
			}
			if(this.orderArg.from == 'unpaid'){ 
				this.unpaid = true		
				this.preicePart = true
			}
		},
		computed:{  
			...mapState(['userOrderList'],),
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
						return '待配送';
						break;					
					case 1 :
						return '配送中';
						break;
					case 2 :
						return '已送达';
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
					delta: 1
				})
			},
			callNoBtn(){	  
				let no = this.currentItem.serviceContactMobile 
				let arr = JSON.parse(no)
				let newNo = [].concat.apply([], arr) 
				uni.showActionSheet({
				    itemList: newNo,
				    success: (res)=>{ 
						uni.makePhoneCall({
							phoneNumber: newNo[res.tapIndex]
						});  
				    }
				}); 
			},
			driverPhone(option){
				uni.makePhoneCall({
					phoneNumber: option
				})
			},
			getDetail(urls){ 			 
				if(this.merchNo=='35110000000000'){
					let testDate = {"orderNo":"FZ000002-20210308152511-2","orderType":0,"instantPay":0,"orderAmt":7040,"couponAmt":0,"realAmt":7040,"orderState":0,"orderTime":"2021-03-08 15:25:11","deliverName":"司机测试","deliverPhone":"18516600318","payType":0,"payState":0,"merchName":"移移-好友便利店 XM1002","longitude":118.115329,"latitude":24.431151,"busiAddr":"福建省厦门市思明区曾厝垵西路珍珠湾软件园创新大厦A区","reason":"","remark":"无","orderContent":null,"content":[{"goodsNo":"MD0MG000000082","merchPrice":"160","goodsPrice":"250","categoryNo":"ZGL0016","goodsQuantity":"4","goodsUnit":"个","goodsNum":"44","goodsName":"米糕","goodsSpec":"袋","hotSale":"0"}],"serviceContactMobile":"[[\"0592-2096880\",\"0592-2096882\"]]","vanLongitude":"","vanLatitude":""}
					setTimeout(()=>{
						this.isload = false
						this.isready = true						
						this.currentItem = testDate
						
						let orderMapData = {
							longitude:testDate.vanLongitude,
							latitude:testDate.vanLatitude,
							shopName:testDate.merchName,
							shoplongitude:testDate.longitude,
							shoplatitude:testDate.latitude 
						}
						this.orderMapData = orderMapData
					},300)	 
					return
				}
				let vVlue = ''
				if(this.pushMsg){ 
					vVlue = {"merchNo":this.merchNo,"orderNo":this.pushMsg,}  
				}else{  
					vVlue = {"merchNo":this.merchNo,"orderNo":this.orderArg.orderNo,}  
				}  
				
				let sSort = getSortAscii(vVlue) 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase()		  
				this.$request.post(urls,{
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
							
							let orderMapData = {
								longitude:res.data.vanLongitude,
								latitude:res.data.vanLatitude,
								shopName:res.data.merchName,
								shoplongitude:res.data.longitude,
								shoplatitude:res.data.latitude 
							}
							this.orderMapData = orderMapData
						},300)	 
					}
				}).catch() 
				
			},	
		}
	}
</script>

<style lang="scss" scoped> 
.bg-mapspace{
	background-color: #46B85B;
	height: 40rpx;
}
	.goods-detail{
		width: 100vw; 
		position: relative; 
		.header{
			background-color: #46B85B;
			height: 200rpx;
			padding: 0 30rpx;
			color: #FFF;
			
			.status{font-size: 50rpx;}
			.txt{font-size: 26rpx; padding-top: 16rpx;padding-bottom: 16rpx;}
		}
		 
		
		.content{
			position: absolute;
			top: 120rpx;
			left: 30rpx;
			right: 30rpx;  
			
			.goods-list{
				margin-bottom: 30rpx;
				padding: 30rpx;
				border-radius: 12rpx;			 
				background-color: #FFFFFF;
				
				.title{ color:#999999; font-size:26rpx; padding-bottom: 20rpx; border-bottom: 1rpx solid #D4D4D4;}
				.goods-group{
					display: flex; 
					align-items: center;
					padding: 32rpx 0;
					border-bottom: 1px solid #d4d4d4;
					
					.tit{
						flex: 1;
						font-size: 30rpx;
						padding-top: 12rpx;
						display: flex;
						align-items: flex-start;
												
						.hot{ font-size:16rpx; color: #FF0000; padding-left: 8rpx;}
					} 
					.units{
						flex: 1;
						font-size: 30rpx; 
					}
					.cont{
						flex: 1;
						text-align: right;
						.price{
							font-size: 26rpx;
						}
						.unit{ font-size: 20rpx; color: #999999;}
						
						
					}
					
				}
				&:last-child{
					margin: 0;
				}
			}
			
			
			.giveback-list{
				align-items: center;
				padding: 32rpx 0;
				border-bottom: 1rpx solid #D4D4D4;
				.group{
					display: flex;
					justify-content: space-between;
					margin-bottom: 20rpx;
					.left{				
						display: flex;		
						color: #666666;
						.redicon{
							background-color: #E20F0F;
							color: #FFFFFF;
							font-weight: bolder;
							font-size: 24rpx; 
							border-radius: 4rpx;
							align-items: center;
							padding: 6rpx;
							text-align: center;
						} 
						.txt{
							padding-left: 8rpx;
						}
					}
					.right{
						color: #E20F0F;
					}
					&:last-child{
						margin-bottom: 0;
					}
				}
			}
			.total-list{
				display: flex; 
				justify-content: flex-end; 
				align-items: flex-end; 
				padding: 30rpx 0;
				// .left{ 
				// 	.btncancel{
				// 		align-items: center;
				// 		border:1px solid #CCCCCC;
				// 		border-radius: 24rpx;					
				// 		font-size: 30rpx;
				// 		padding: 8rpx 16rpx;
				// 		color: #929292;
				// 	}
				// }
				.right{
					display: flex;
					justify-content: flex-end;
					align-items: flex-end;
					.sub_left{
						display: flex;
						padding-right: 30rpx;
						color: #666666;
						.price{
							color: #E20F0F;
						}
					}
					.sub_right{
						display: flex;
						color: #666666;
						align-items: flex-end;
						
						.price{
							color: #E20F0F;
							font-size: 48rpx;
							font-weight: bold;
							margin-bottom: -8rpx;
						}  
					} 
				}
			}
			
		}
		 
		.btnwrap{
			display: flex;
			justify-content: flex-end;
			padding-bottom: 40rpx;
			.btncancel{
				align-items: center;
				border:1px solid #CCCCCC;
				border-radius: 24rpx;					
				font-size: 30rpx;
				padding: 8rpx 16rpx;
				color: #929292;
			}
			
		} 
		.orderList{
			margin: 30rpx 0;
			padding: 30rpx; 
			border-radius: 12rpx;
			background-color: #FFFFFF;
			.order-group{
				color: #333;
				border-bottom: 1px solid #d4d4d4;
				padding: 30rpx 0;
				display: flex;
				justify-content: space-between;
				align-items: center; 
				
				
				.tit{font-size: 30rpx; flex: 3;}
				
				.cont{ font-size: 26rpx; flex: 7; text-align: right;}
				
				&:last-child{
					border: 0;
				}
				
				.callNo{
					display: flex;  
					justify-items: flex-end;   
					flex: 1.2;
					margin-right: -20rpx;
					.callText{  
						color: #46B85B;
						border-radius:30rpx; 
						display: flex;
						align-items: center;  
						padding:8rpx 16rpx;
						background-color: #F1F1F1; 
						
						.iconfont{
							font-size: 40rpx;
						}
					}
				} 				
				
			}
		}
		
		
		
		
		
	} 
</style>
