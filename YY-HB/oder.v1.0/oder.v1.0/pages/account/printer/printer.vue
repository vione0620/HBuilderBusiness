<template>
	<view class="wrap">
		<view class="group">
			<uni-list-item title="蓝牙打印机" :rightText="this.blueStatus.text" @click="navTo('./bluetooth')"></uni-list-item>
		</view>
<!-- 		<view class="group">
			<uni-list-item title="WIFI/GPRS打印机" @click="navTo('./bluetooth')"></uni-list-item>
		</view>
		<view class="group">
			<uni-list-item title="打印小票" @click="navTo('./bluetooth')"></uni-list-item>
		</view> -->
	</view>
</template>

<script>
	import UniListItem from '@/components/uni/uni-list-item.vue'
	import app from '../../../App.vue'
	
	export default{
		components: {
			UniListItem
		},
		data(){
			return{
				blueStatus: {
					status: false,
					text: ''
				}
			}
		},
		onLoad(){
			let bs = uni.getStorageSync('blueStatus')
			if(bs.status){
				this.blueStatus = bs
			} else {
				this.blueStatus.status = false
				this.blueStatus.text = '未连接'
			}
		},
		onShow(){
			let bs = uni.getStorageSync('blueStatus')
			if(!bs){
				this.blueStatus.status = false
				this.blueStatus.text = '未连接'
			} else {
				this.blueStatus = bs
			}
		},
		methods: {
			navTo(urls){
				uni.navigateTo({
					url:urls
				})
			}, 
		}
	}
</script>

<style scoped lang="scss">
	page {
			width: 100vw;
			
			.wrap{
				padding: 20rpx;
				width: 100%;
				.group{
					width: 100%;
					background-color: #FFFFFF;
					border-radius: 12rpx;
					margin-bottom: 20rpx;
				}
			}
		}
</style>
