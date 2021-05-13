<template>
	<uni-popup ref="menu" type="bottom" :maskClick="false">
		<view class="menu_box">
			<view v-if="title" class="menu_title">{{title}}</view>
			<view class="menu_items">
				<view v-for="(item,index) in classList" :key="index" :id="index" class="menu_item" :class="{second_active:item.Second}" @click="click">
					<view>{{item.Stair}}</view>
					<view v-if="item.Second" class="item_second">{{item.Second}}</view>
				</view>
			</view>
			<view class="menu_cancel" @click="cancel">{{cancelText}}</view>
		</view>
	</uni-popup>
	
</template>

<script>
import UniPopup from '@/components/uni/uni-popup.vue'

export default{
	name: 'BottomMenu',
	components: {
		UniPopup
	},
	props: {
		open: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			default: ''
		},
		cancelText: {
			type: String,
			default: '取消'
		},
		classList: {
			type: Array,
			default: null
		}
	},
	methods: {
		cancel(){
			this.$refs.menu.close()
			this.$emit('cancel',false)
		},
		click(e){
			this.$emit('click',e.currentTarget.id)
		}
	},
	watch: {
		open: {
			handler(val){
				if(val){
					this.$refs.menu.open()
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.menu_box{
		width: 100vw;
		background-color: #F2F2F2;
		font-size: 28rpx;
		color: #333333;
		text-align: center;
		.menu_items{
			background-color: #FFFFFF;
			.menu_item{
				padding: 36rpx 0;
				border-bottom: 1px solid #EEEEEE;
				.item_second{
					font-size: 22rpx;
					padding-top: 14rpx;
				}
			}
			.second_active{
				padding: 16rpx 0;
				color: #999999;
			}
			.menu_item:nth-last-child(1){
				border: none;
			}
		}
		.menu_title,.menu_cancel{
			padding: 40rpx 0;
			border-bottom: 1px solid #EEEEEE;
			background-color: #FFFFFF;
		}
		.menu_title{
			color: #999999;
			font-size: 24rpx;
		}
		.menu_cancel{
			color: #666666;
			border: none;
			margin-top: 20rpx;
			padding-bottom: 60rpx;
		}
	}
</style>
