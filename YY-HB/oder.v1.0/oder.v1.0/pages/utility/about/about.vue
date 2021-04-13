<template>
	<view class="about">
		<view class="main">
			<image class="icon" src="@/static/myicon.png"></image>
			<view class="txt">v1.5.6版本</view>
		</view>
		<view class="list"> 
			<view class="group">
				<uni-list-item title="服务协议" @click="navTo('treaty')"></uni-list-item>
				<uni-list-item title="隐私政策" @click="navTo('privacy')"></uni-list-item>
				<!-- <uni-list-item title="公司信息" @click="navTo('firm')"></uni-list-item> -->
			</view>  
		</view> 
	</view>
</template>

<script>
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii} from '@/common/util/utils.js'
	
	import UniListItem from '@/components/uni/uni-list-item.vue' 
	export default {
		data() {
			return { 
				
			}
		},
		onLoad() { 	  
		},
		components:{
			UniListItem,
		},
		methods:{  			
			navTo(path){
				uni.navigateTo({
					url: path, 
				});  
			},
			
		},
	}
</script>

<style lang="scss" scoped>
	page{
		padding: 40rpx;
		display: flex; 
		justify-content: center;
	}
	.about{
		width: 100vw; 
	
		.main{
			width: 100%;
			text-align: center;
			padding: 100rpx 0;
			.icon{
				width: 120rpx;
				height: 120rpx;
			}
			.txt{
				padding-top: 20rpx;
				font-size: 32rpx;
			}
		}
		
		.group{ 
			border-radius: 8rpx; 
			background-color: #FFFFFF;
			position: relative; 
			margin-bottom: 20rpx;
			.userpic{
				font-weight: 550;
				color: #bbb;
			}
			.picImg{
				border-radius: 50%;
				width: 80rpx;
				height: 80rpx;
			}
			.text-muted{
				color: #999999;
				text-align: right;
				justify-content: center;
			}
			 .tel{
				 color: #5AB431;
			 }
		}
	}
</style>
