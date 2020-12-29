<template>
	<view class="">		
		<view class="group" :class="'check_state'" @tap="returnParam(receiveData)">
			<view class="main_side">
				<view class="round" v-for="(round,index) in 16" :key="index">{{round}}</view>
			</view>
			<view class="main_left">
				<view class="right"> 
					<view class="unit">￥</view>
					<view class="price">{{parseFloat(receiveData.couponAmt/100)}}</view>
				</view> 
			</view> 
			<view class="main_right">
				<view class="top">
					<view class="left">
						<view class="tit">{{receiveData.couponName}}</view>
						<view class="txt">满{{parseFloat(receiveData.limitAmt/100)}}减{{parseFloat(receiveData.couponAmt/100)}}</view> 
					</view>
					<view class="right">
						<template v-if="this.type == 1">
							<view class="btn">去使用</view> 
						</template>
						<template v-else-if="this.type == 2">
							<view class="btn">已使用</view>
						</template> 
						<template v-else-if="this.type == 0">
							<view class="btn">已过期</view>
						</template> 						
					</view>
				</view>
				<view class="foot">有效期：{{receiveData.effectTime}} 至 {{receiveData.expireTime}}</view>
				   
			</view>
		</view>	
	</view>
</template>

<script>
	import EvanCheckbox from '../plugin-ui/evan-checkbox.vue'
	export default{
		props:{
			receiveData:Object,
			type:[String,Number]
		},
		data(){
			return {
				isget:false
			}
		},
		components:{
			EvanCheckbox
		}, 
		methods:{
			returnParam(e){ 
				this.$emit('get-coupon',e) 
				
				if(this.type == 1){
					uni.navigateTo({
						url: '../../pages/utility/mall/mall'   
					}); 
				}
			}, 
		},
	}
</script>

<style lang="scss" scoped>
	.group{
		width: 100%; 
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		position: relative;
		.main_side{
			background-color: #46b959; 
			height:222rpx;
			width: 20rpx;
			margin-left: -12rpx;
			overflow: hidden;
			
			.round{
				background-color: #f2f2f2;
				border-radius: 50%;
				font-size: 0;
				color: #f2f2f2; 
				width: 20rpx;
				height: 20rpx;
				margin-bottom: 5rpx; 
				&:first-child{
					margin-top: 5rpx;
				}
			}
		}
		.main_left{
			background-color: #e4e4e4;	 			  
			padding: 60rpx 0;	
			height: 222rpx; 
			display: flex;
			justify-content: center;
			align-items: center;
			width: 30%; 
			.right{
				color: #999999;
				display: flex;
				justify-content: center;
				align-items: baseline;
				
				.price{
					font-size: 80rpx;
					font-weight: bolder;
				}
				.unit{
					font-size: 20rpx;
				}
			}
		}
		// .main_conter{
		// 	// height: 40rpx;
		// 	padding: 20rpx 0;
		// 	position: relative;
		// 	background-color: #ffffff; 
			
		// 	// .top{
		// 	// 	width: 38rpx;
		// 	// 	height: 38rpx;
		// 	// 	border-radius: 50%;
		// 	// 	position: absolute;
		// 	// 	left:  -20rpx;
		// 	// 	right: -10rpx;
		// 	// 	top: -20rpx;
		// 	// 	background-color: #f2f2f2;
		// 	// 	border: 1px dashed #f2f2f2;
		// 	// }
		// 	// .border{
		// 	// 	border-bottom: 1rpx solid #F2F2F2;
		// 	// 	height: 1rpx;
		// 	// }
		// 	// .bot{
		// 	// 	width: 38rpx;
		// 	// 	height: 38rpx;
		// 	// 	border-radius: 50%;
		// 	// 	position: absolute;
		// 	// 	left:  -20rpx;
		// 	// 	right: -10rpx;
		// 	// 	bottom: -20rpx;
		// 	// 	background-color: #f2f2f2;
		// 	// 	border: 1px dashed #f2f2f2;
		// 	// }
			
			
		// }
		.main_right{  
			background-color: #FFFFFF;		 	
			padding: 28rpx 28rpx 0 28rpx;	  
			width: 70%; 
			
			.top{
				width: 100%;
				display: flex;
				justify-content: space-between;
				margin-bottom: 28rpx;
				.left{
					color: #323232;
					font-size: 32rpx;
					.tit{
						font-weight: bold;
						color: #333333;
						font-size: 32rpx;
						padding-bottom: 30rpx;
					}
					.txt{
						color: #999999;
						font-size: 28rpx;
					}
				}
				.right{
					display: flex;
					align-items: flex-end;
					.btn{
						font-size: 24rpx;
						border-radius: 30rpx;
						padding: 12rpx 20rpx; 
					}
				} 
			}
			.foot{
				border-top: 1rpx dashed #F2F2F2;
				font-size: 24rpx;
				color: #666666;
				padding: 20rpx 0;
			}
		} 
	} 
	
	.validity{ 
		.main_left{
			background-color: #46b959;
			.left{
				.tit{
					color: #ffffff;
				}
				.txt{
					color: #f9f9f9;
				}
			}
			.right{
				color: #FFFFFF; 
			}
		}
		.main_conter{ 
			padding: 10rpx 0;
			background-color: #46b959;
		}
		.main_right{
			.right{
				.btn{
					color: #46b959; 
					border: 1px solid #46b959;
				}
			}
		}
	}
	.normalUsed{ 
		
		.main_side{
			background-color: #e4e4e4;
			}
		.main_right{
			.right{
				.btn{
					color: #999; 
					border: 1px solid #d4d4d4;
				}
			}
		}
	}
	.exprires{ 
		.main_side{
			background-color: #e4e4e4;
			}
		.main_right{
			.right{
				
				.btn{
					color: #999; 
					border: 1px solid #d4d4d4;
				}
			}
		}
	}
</style>
