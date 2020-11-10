<template> 
	<view class="item-wrap">
		<view class="news-item" @click="onClick" hover-class="news-list--hover">
			<view class="item-left">
				<view class="icons-wrap">
					<view class="iconfont iconnews icons">
						<template v-if="badge"> 
							<uni-badge class="badge animate__animated animate__zoomOut" 
							type="error" size="small" text="x"></uni-badge>
						</template>
					</view>
					
				</view>
				<view class="content">
					<view class="title">{{ title }}</view>
					<view class="date">{{ date }}</view> 
				</view>
			</view>
			<template  v-if="icons"> 
				<view class="item-right">
					<view class="iconfont icondelete"></view>
				</view> 
			</template>
		</view>
			
	</view> 
</template>

<script>
	import UniBadge from '../uni/uni-badge.vue'
	export default {
		name:"newsitem",
		components:{
			UniBadge
		},
		props:{  
			disabled: {
				// 是否禁用
				type: [Boolean, String],
				default: false
			},
			badge: {
				type: [Boolean, String],
				default: false
			}, // 红点
			icons: {
				type: [Boolean, String],
				default: false
			}, // 删除
			title: {
				type: String,
				default: ''
			}, // 昵称标题 
			date:{ 
				type: String,
				default: ''
			},//时间
		},
		methods: { 
			onClick(e) { 
				this.$emit('click', e) 
			},
		}
		
		
	}
</script>

<style lang="scss"> 
page{
	padding: 20rpx;
}
	.item-wrap{ 
		// padding: 40rpx;
		margin-bottom: 20rpx; 
	}
	.news-item{   
		display: flex;
		background-color: #FFFFFF;
		border-radius: 6rpx;
		
		.item-left{ 
			width: 90%;
			display: flex;
			padding-bottom: 16rpx;
			
			.icons-wrap{
				
				width: 120rpx;
				height: 120rpx; 
				
				.icons{
					font-size: 120rpx;
					color: #47B85B;
					position: relative; 
					.badge{
						position: absolute;
						right: 12rpx;
						top: 12rpx;
						color: #FF0000;
					} 
				}
			}
			
			.content{ 
				 padding-left: 8rpx;
				 flex: 1;
				 padding-top: 16rpx;
				.title{
					padding-bottom: 12rpx;
					display: flex; 
					align-items:center;
					height: 72rpx;   
					font-size: 36rpx;
					font-weight: 500;  
					padding-bottom: 8rpx;
				}
				
				.date{
					font-size: 26rpx;
					color: #999999;
					padding-bottom: 8rpx;
				}
			}
			
		}
		
		.item-right{
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
	
	.news-list--hover{
		background-color: #F1F1F1
	}
	
	
	
</style>