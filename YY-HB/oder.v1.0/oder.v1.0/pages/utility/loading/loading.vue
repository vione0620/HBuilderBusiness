<template>
	<view>		  
		<template v-if="androidPage">
			<view class="splash">
				<view class="close" @tap="loadpage()">进入</view>
			</view> 
		</template>
		<template v-if="iswelcome"> 
			<welcome></welcome>
		</template>
	</view>
</template>

<script>
	import Welcome from '@/components/basic/welcome.vue'
	export default {
		data() {
			return {				
				iswelcome:true,//欢迎页
				androidPage:false,
			}
		},
		components: { 
			Welcome, 
		},
		onLoad() {						
			// #ifdef APP-PLUS
			const platform = uni.getSystemInfoSync().platform
			const ready = plus.navigator.hasSplashscreen()
			if(platform == "android"){  
				this.androidPage = true
				setTimeout(()=>{
					this.showLoad()
				},0)
			}else{ 
				this.showLoad()
				if(ready && platform == "ios"){
					uni.redirectTo({
						url:'../index/index', 
					})
				}
			}
			// #endif
			
		},
		methods: {
			showLoad(){				
				// #ifdef APP-PLUS
				const ready = plus.navigator.hasSplashscreen()
				const platform = uni.getSystemInfoSync().platform 
				if(ready && !this.iswelcome){ 
					if(platform == "android"){
						if(this.androidPage && !this.iswelcome){
							uni.redirectTo({
								url:'../index/index', 
							}) 
						}else{
							this.androidPage = false
							this.iswelcome = true
						} 
					}
				}else{
					this.loadExecution()  
				} 
				// #endif
			},
			loadpage(){   
				const platform = uni.getSystemInfoSync().platform
				if(platform == "android"){ 
					if(this.androidPage && !this.iswelcome){
						uni.redirectTo({
							url:'../index/index', 
						}) 
					}else{
						this.androidPage = false
						this.iswelcome = true
					} 
				}
			},
			loadExecution(){ 
				try { 
					const value = uni.getStorageSync('launchFlag') 
					if (value) { 
						this.iswelcome = false 
					} else { 
						this.iswelcome = true
					}
				} catch(e) { 
					uni.setStorage({ 
						key: 'launchFlag', 
						data: true,  
					})
					this.iswelcome = true
				}
				return 
			},
		}
	}
</script>

<style scoped lang="scss">
page{ 
	width: 100vw;
	height: 100vh; 
}

.splash{ 
	width: 100vw;
	height: 100vh;
	background-image: url(../../../static/splash.png);
	background-size: 100% 100%;
	position: relative;
	
	.close{
		position: absolute;
		right: 60rpx;
		top: 80rpx;
		background-color: #FFFFFF;
		opacity: .5;
		// width: 120rpx;
		text-align: center;
		// height: 48rpx;
		padding:6rpx 16rpx;
		border-radius: 30rpx;
	}
}
</style>
