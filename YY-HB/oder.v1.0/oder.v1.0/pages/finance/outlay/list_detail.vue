<template>
	
	<view class="wrapper">
	
	 <uni-nav-bar :status-bar="true" :fixed="true" left-icon="arrowleft" @clickLeft="back" color="#ffffff" background-color="RGBA(70, 184, 91, 1)"/>
	 
	<template v-if="isload">
		<default-page :load="true"></default-page>
	</template> 
	
	<template v-if="isready"> 
	
	<view class="goods-detail"> 
		<view class="header">
			<view class="status">{{orderStatus}}</view> 
			<template v-if="currentItem.orderState == 0"> 
				<view class="txt">您的订单审核中，请耐心等待</view>
			</template>
			<template v-if="currentItem.orderState == 1"> 
				<view class="txt">您的订单正在配送中，请耐心等待</view>
			</template v-if="currentItem.orderState == 2">
				<view class="txt">您的订单已送达，祝您生活愉快</view>
			<template> 
			</template>
		</view> 
		
		
		
		<view class="content">
			<view class="goods-list">
				<view class="title">商品列表</view> 
				<block v-for="(items,index) in currentItem.content" :key="'4'+index">
					<view class="goods-group">
						<view class="tit">{{items.goodsName}} <text class="hot">{{(items.hotSale === '0') ? '' : '热卖' }}</text></view>
						<view class="cont">
							<view class="price">{{parseFloat(items.merchPrice/100).toFixed(2)}} 元</view>
							<view class="unit">{{items.goodsNum}} {{items.goodsUnit}}</view>
						</view>
					</view>
				</block>
			
				<view class="total-list">
					<view class="tit">合计</view> 
					<view class="cont"><text class="price">{{parseFloat(currentItem.orderAmt/100).toFixed(2)}}</text><text class="unit">元</text></view>
				</view>
			</view> 
			 
			<view class="orderList">
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
					<view class="tit">联系方式</view>
					<view class="cont callNo" @click="callNoBtn">
						<view class="callText"><text class="iconfont icondianhua-copy"></text>立即联系</view>
					</view>
				</view>
				<view class="order-group">
					<view class="tit">下单时间</view>
					<view class="cont"><text>{{currentItem.orderTime}}</text></view> 
				</view>
				<view class="order-group">
					<view class="tit">支付方式</view> 
					<view class="cont">{{orderPayType}} </view>
				</view>
				<view class="order-group">
					<view class="tit">备注</view>
					<view class="cont">{{(currentItem.remark == null) ? '无': currentItem.remark }}</view>
				</view>
				<view class="order-group">
					<view class="tit">支付状态</view>
					<view class="cont">{{payStatus}}</view>
				</view>
				<template v-if="payStatus==2">
					<view class="order-group">
						<view class="tit">失败原因</view>
						<view class="cont">{{currentItem.reason}}</view>
					</view>
				</template> 
			</view>
			
		</view>
	 
	
	</view>
	
	<template  v-if="currentItem.payState === 1 && currentItem.orderState !== 2">
		<btn-foot :fixd="true" title="确认收货" @tap="rightBtnList()"></btn-foot>
	</template>
	
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
			};
		},
		components:{
			DefaultPage,
			UniNavBar,
			BtnFoot
		},
		onLoad(option) { 
			// this.orderArg = option 
			if(option.pushNo){
				this.pushMsg = option.pushNo   
			}else{
				this.orderArg = option  				
			} 
			
			this.loginWhether = uni.getStorageSync('status')  
			this.merchNo = uni.getStorageSync('user').merchNo		
			
			this.getDetail()			
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
						return '已审核';
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
			getDetail(){ 			 
				let vVlue = ''
				if(this.pushMsg){ 
					vVlue = {"merchNo":this.merchNo,"orderNo":this.pushMsg,} //必传 
				}else{  
					vVlue = {"merchNo":this.merchNo,"orderNo":this.orderArg.orderNo,} //必传 
				}  
				
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 		 
				this.$request.post('getBreakfastOrderDetail',{
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
						},300)	
					}
				}).catch() 
				
			},
			rightBtnList(){
				// let current = this.orderArg.cindex 	 
				// let oderInfo = this.userOrderList
				let vVlue = {"merchNo":this.merchNo,"orderNo":this.orderArg.orderNo} //必传 
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 	 				
				
				let ordertime = oderInfo[current].orderTime				
				let buytime = ordertime.slice(0,10)				
				let oktime = handleDate()
				let yesterday = handleYesterday() 
				if(oktime == buytime){
					uni.showToast({
						icon:'none',
						title:'订单次日送达，请收到后再确认收货'
					})
					return
				}else if(buytime == yesterday){
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
										this.orderList[current].orderState = 2
										this.userOrderList[current].orderState = 2 
									}
									uni.showToast({
										icon:'none',
										title:res.message,
										duration: 2000
									})
								}).catch()  			 
							}
						}
					})
				}else{				
					uni.showToast({
						icon:'none',
						title:'收货超时'
					})
					return
				} 
			},
		}
	}
</script>

<style lang="scss" scoped> 
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
			padding-bottom: 100rpx;
			
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
