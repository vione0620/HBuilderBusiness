<template>
	<view class="wrap">
		<view class="group"> 
			<view v-if="firstTimeGetMoney == 0">
				<uni-list-item title="设置密码"  @click="navTo('./setup?type=setup&page=prev')"></uni-list-item>				
			</view>
			<uni-list-item title="修改密码"  @click="navTo('./setup?type=change')"></uni-list-item>
			<uni-list-item title="忘记密码"  @click="navTo('./setup?type=forget')"></uni-list-item> 
		</view>
	</view>
</template>

<script>
	import UniListItem from '@/components/uni/uni-list-item.vue'
	export default {
		components:{
			UniListItem,
		},
		data() {
			return {
				firstTimeGetMoney:1,
			}
		},
		onLoad() { 			
			this.firstTimeGetMoney = uni.getStorageSync('initPayPaswd')
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
	page{
		width: 100vw;
		
		
		.wrap{
			padding: 20rpx;
			width: 100%;
			
			.group{
				width: 100%;
				background-color: #FFFFFF;
				border-radius: 12rpx;
			}
		}
		
	}
</style>
