<template>
	<view class="about">
		<view class="main">
			<image class="icon" src="@/static/myicon.png"></image>
			<view class="txt">v1.0.0版本</view>
		</view>
		<view class="list"> 
			<view class="group">
				<uni-list-item title="用户协议" @click="navTo('user')"></uni-list-item>
				<uni-list-item title="隐私政策" @click="navTo('privacy')"></uni-list-item>
				<uni-list-item title="公司信息" @click="navTo('firm')"></uni-list-item>
			</view>  
		</view>
		 
		<view class="">{{pushmsg}}</view> 
		<view style="padding: 20rpx;">---------分割线----------</view>
		<view class="">{{clickmsg}}</view>
		<view style="padding: 20rpx;">---------分割线----------</view>
		
		<view class="">{{iosMsg}}</view>
		<view style="padding: 20rpx;">---------分割线----------</view>
		<view> {{jsonios}} </view>
	</view>
</template>

<script>
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii} from '@/common/util/utils.js'
	
	import UniListItem from '@/components/uni/uni-list-item.vue' 
	export default {
		data() {
			return {
				StorageInfo:Object,
				navtoRes:Object,
				pushmsg:Object,
				clickmsg:Object,
				iosMsg:Object,
				jsonios:object,
				
			}
		},
		onLoad() { 	 
			this.StorageInfo = uni.getStorageInfoSync()
			this.pushmsg = uni.getStorageSync('receive_pushMsg')
			this.clickmsg = uni.getStorageSync('click_pushMsg')
			this.iosMsg = uni.getStorageSync('receive_iosMsg')
			// this.navtoRes = options
			this.jsonios = JSON.parse(this.iosMsg)
			// const pushlist = {
			// 	"__UUID__":"androidPushMsg101819565",
			// 	"title":"新订单",
			// 	"appid":"__UNI_C709C64",
			// 	"content":"一笔自取的订单",
			// 	"payload":"{\"content\":\"一笔自取的订单\",\"extendParam\":{\"msg_external_param\":\"3502031020000027052\",\"msg_action\":\"1\"},\"notifyType\":\"4\",\"title\":\"新订单\"}"
			// }
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

<style lang="scss">
	page{
		padding: 40rpx;
		display: flex; 
		justify-content: center;
	}
	.about{
		width: 100vw;
		// padding: 0 20rpx;
	
		.main{
			width: 100%;
			text-align: center;
			padding-bottom: 100rpx;
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
