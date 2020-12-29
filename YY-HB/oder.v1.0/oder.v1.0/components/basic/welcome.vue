<template> 
	<view class="welcome"> 
		<swiper class="swiper" :indicator-dots="indicatorDots" :duration="duration">
			<swiper-item class="group"> 
				<image src="../../static/welcome/mdpi_one.jpg" mode="aspectFill" class="image"></image> 
				<view class="jump" @tap="launchFlag()">跳过</view>
			</swiper-item>
			<swiper-item class="group"> 
				<image src="../../static/welcome/mdpi_two.jpg" mode="aspectFill" class="image"></image> 
				<view class="jump" @tap="launchFlag()">跳过</view>
			</swiper-item>
			<swiper-item class="group"> 
				<image src="../../static/welcome/mdpi_three.jpg" mode="aspectFill" class="image"></image>  
				<view class="entry" @tap="launchFlag()">立即体验</view>
			</swiper-item>
		</swiper>
	</view>
	
</template>

<script> 
	export default {
		components:{ 
		},
		data(){
			return {
				indicatorDots: true, 
				interval: 2000,
				duration: 800 
			}
		},
		methods:{
			launchFlag(){
				uni.setStorage({
					key: 'launchFlag',
					data: true,
				})
				uni.reLaunch({
					url:'../../account/login/login'
				})
				
			},
			
		},
	}
</script>

<style lang="scss">
	page,
	.welcome{ 
		width: 100vw;
		height: 100vh;  
	}
	.swiper{
		width: 100vw;
		height: 100vh;
	}
	.image{
		margin: 0;
		width: 100%;
		height: 100%;
	}
	
	.group{
		display: flex;
		justify-content: center;
		align-items: center;
		
		.jump{
			position: absolute;
			right: 20px;
			top: 40px;
			background: rgba(0,0,0,0.1);
			padding: 16rpx 30rpx;
			text-align: center;
			color: #F1F1F1;
			font-size: 24rpx;
			border-radius: 30rpx;
			
		}
		
		.entry{
			position: absolute;
			bottom: 100rpx;
			background:RGBA(34, 181, 115, 1);
			color: #FFFFFF;
			width: 280rpx;
			padding: 20rpx 0;
			font-size: 32rpx;
			text-align: center;
			border-radius: 30rpx;
		}
	}
	
	
</style>
