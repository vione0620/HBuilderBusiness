<template>
	<view class="">
		<view class="main">	
		<template v-if="typeOk"> 
			<view class="success">
				<view class="icon iconfont iconsuccess"></view>
				<view class="title">提现成功</view>
				<view class="subtitle">预计2小时内到账</view>
			</view>		
		</template>	
			
		<template v-if="typeFail"> 
			<view class="fail">
				<view class="icon iconfont iconiconfail"></view>
				<view class="title">提现失败</view> 
				<view class="txt">{{failMsg}}</view>
			</view>	
		</template>		
			
			<view class="foot-btn"> 
				<view class="goback" @tap="navto('../../utility/index/index')">返回首页</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return { 
				typeOk:false,
				typeFail:false,
				failMsg:'',
			}
		},
		onLoad(option) {
			switch (option.type){
				case 'ok':
				this.typeOk = true; 
				uni.setNavigationBarTitle({
					title: '提现成功'
				})
				break;
				case 'fail':
				this.typeFail = true; 
				this.failMsg = option.msg
				uni.setNavigationBarTitle({
					title: '提现失败'
				})
				break; 
			}  
		},
		methods:{		
			navto(urls){
				uni.redirectTo({ 
					url:urls					
				})
			}
		},
		
	}
</script>

<style scoped lang="scss">
	page{
		width: 100vw;
		height: 100vh;
	
	.main{
		width: 100vw;
		background-color: #FFFFFF;
		text-align: center;
		
		.success{
			padding: 40rpx;
			.icon{
				font-size: 160rpx;
				color:#46B85B;
			}
			
			.title{
				font-size: 40rpx;
				padding-bottom: 20rpx;
			}
			.subtitle{
				font-size: 30rpx;
				color: #999999;
			}
			
		}
		
		.fail{
			padding: 40rpx;
			
			.icon{
				font-size: 160rpx;
				color:#FF0000 ;
			}
			
			.title{
				font-size: 40rpx;
				padding-bottom: 20rpx;
			}
			.subtitle{
				font-size: 30rpx;
				color: #FF0000;
			}
			
		}
		
		
		.foot-btn{
			width: 100vw;
			display: flex;
			justify-content: center;
			padding:40rpx 0;
			.goback{
				width: 290rpx;
				height: 70rpx;
				border: 1px solid #46B85B;
				color: #46B85B;
				text-align: center;
				line-height: 2;
				border-radius: 6rpx;
				font-size: 32rpx;
			}
		}
		
		
		
	}
	
	
	}
</style>
