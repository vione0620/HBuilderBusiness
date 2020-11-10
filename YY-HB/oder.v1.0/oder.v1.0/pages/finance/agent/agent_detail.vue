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
				<template v-if="currentItem.orderState === 0"> 
					<view class="txt">您的订单正在配送中，请耐心等待</view>
				</template>
				<template v-else> 
					<view class="txt">您的订单已送达，祝您生活愉快</view> 
				</template>
			</view> 
			
			
			
			<view class="content">
				<view class="goods-list">
					<view class="title">商品列表</view> 
					<block v-for="(items,index) in currentItem.content" :key="'4'+index">
						<view class="goods-group">
							<view class="tit">{{items.goodsName}}</view>
							<view class="cont"> 
								 {{items.goodsNum}}{{items.goodsUnit}}
							</view>
						</view>
					</block> 
				</view> 
				 
				<view class="orderList">
					<view class="order-group">
						<view class="tit">订单编号</view>
						<view class="cont">{{pushMsg ? pushMsg : currentItem.orderSn}}</view>
					</view>  
					<view class="order-group">
						<view class="tit">下单时间</view>
						<view class="cont">{{currentItem.orderTime}}</view> 
					</view> 
					<view class="order-group">
						<view class="tit">联系方式</view> 
						<view class="cont" :class="currentItem.recPhone ? 'callNo' : '' " @tap="callNoBtn(currentItem.recPhone)">{{currentItem.recPhone || '无'}}</view>
					</view>
					<view class="order-group">
						<view class="tit">支付方式</view> 
						<view class="cont">{{orderPayType}} </view>
					</view>
					<view class="order-group">
						<view class="tit">备注</view> 
						<view class="cont">{{currentItem.remark || '无'}}</view>
					</view> 
				</view>
				
			</view> 
		
		</view>
		<template v-if="currentItem.orderState === 0">
			<btn-foot :fixd="true" title="确认收货" @tap="rightBtnAgent()"></btn-foot>
		</template>
	
	
	</template>
	 
	</view>
</template>

<script> 
	
	import {mapState} from 'vuex'
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii, arrayExclude,} from '@/common/util/utils.js'
	
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
			BtnFoot,
		},
		onLoad(option) {   
			
			if(option.pushNo){
				this.pushMsg = option.pushNo  
				console.log(this.pushMsg)
			}else{
				this.orderArg = option  				
			} 
			this.loginWhether = uni.getStorageSync('status')  
			this.merchNo = uni.getStorageSync('user').merchNo		
			
			this.getDirectOrderDetail()			
		},  
		computed:{  
			...mapState(['getAgentList']), 		
			orderStatus:function(){
				let os = this.currentItem.orderState;				
				switch (os){
					case 0 :
						return '等待配送';
						break;					
					case 1 :
						return '商户确认';
						break;
					case 2 :
						return '用户确认';
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
					case 3 :
						return '余额支付';
						break;
					case 3 :
						return '生鲜会员支付';
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
			callNoBtn(recPhone){	 				
				uni.makePhoneCall({
					phoneNumber: recPhone
				})
			},
			getDirectOrderDetail(){ 		 
				let vVlue = ''
				if(this.pushMsg){ 
					vVlue = {"merchNo":this.merchNo,"orderNo":this.pushMsg,} //必传 
				}else{   
					vVlue = {"merchNo":this.merchNo,"orderNo":this.orderArg.orderSn,} //必传 
				} 
				
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 	 
				this.$request.post('getDirectOrderDetail',{
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
			rightBtnAgent(){  
				let vVlue = '' 
				if(this.pushMsg){ 
					vVlue = {"merchNo":this.merchNo,"orderNo":order_no,} //必传
				}else{  
					vVlue = {"merchNo":this.merchNo,"orderNo":this.orderArg.orderSn,} //必传
				}
				 
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 	 
				uni.showModal({
					title: '确认收货',
					content: '请确认您已准确无误收到货',
					success: (res)=>{
						if (res.confirm) {						
							this.$request.post('directConfirm',{
								...vVlue,
								"sign": sSign
							},{
								token:true
							}).then(res => { 
								if(res.code === 200){
									this.currentItem.orderState = 2
									this.getAgentList[current].orderState = 2 
								}
								uni.showToast({
									icon:'none',
									title:res.message,
									duration: 2000
								})						
							}).catch()  	
						 }
					 }, 
				 }) 
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
					}
					.cont{
						text-align: right; 
						font-size: 30rpx;
					}
					&:last-child{
						border-bottom: 0;
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
					color: #46B85B; 
				}
			}
		}
		
		
		
		
		
	} 
</style>
