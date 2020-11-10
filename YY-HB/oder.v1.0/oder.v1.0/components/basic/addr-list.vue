<template> 
	<view class="addr-list" @click="onClick" hover-class="addr-list--hover"> 
		<view class="addr-list-left">
			<view class="title-group">
				<template v-if="icons"> 
					<view class="icons iconfont iconmark"></view>
				</template>
				<view class="title">{{ title }}</view> 
				<view class="phone">{{ phone }}</view> 
			</view>
			<template v-if="addr"> 
				<view class="addr">{{ addr }}</view> 
			</template>
		</view>
		<view class="addr-list-right">
			<view class="iconfont iconedit"></view>
		</view>  
			
	</view> 
</template>

<script>
	export default {
		name:"AddrList",
		props:{  
			disabled: {
				// 是否禁用
				type: [Boolean, String],
				default: false
			},
			icons: {
				type: [Boolean, String],
				default: false
			}, // 图标
			title: {
				type: String,
				default: ''
			}, // 昵称标题
			phone: {
				type: String,
				default: ''
			}, // 电话
			addr:{ 
				type: String,
				default: ''
			},//地址
		},
		methods: {
			onClick() {
				this.$emit('click')
			}, 
		}
		
		
	}
</script>

<style lang="scss"> 
	.addr-list{
		display: flex;
		margin-bottom: 20rpx;
		padding: 20rpx;
		background-color: #FFFFFF;
		border-radius: 6rpx;
		
		.addr-list-left{
			flex: 1;
			
			.title-group{
				padding-bottom: 12rpx;
				display: flex; 
				align-items:center;
				height: 60rpx;
				
				.icons{
					font-size: 48rpx; 
					color: #E20F0F; 
				}
				.title{  
					font-size: 30rpx;
					font-weight: 500;
				}
				
				.phone{
					font-size: 26rpx; 
					 padding-left: 12rpx; 
					 padding-top: 8rpx;
				}
			}
			
			.addr{
				font-size: 26rpx;
				color: #999999;
				padding-bottom: 8rpx;
			}
		}
		
		.addr-list-right{
			width: 10%; 
			text-align: center;
			justify-content: center;
			align-items: center;
			margin-top: 22rpx;
			
			.iconfont{
				font-size: 40rpx;
			}
		}
		
	}
	
	.addr-list--hover{
		background-color: #F1F1F1
	}
	
	
	
</style>