<template>
	<view class="footPopup"> 		
		<view class="prepyPop">
			<view class="left">
				<image src="../../static/pay_alipay@2x.png" class="img" v-if="iconImg == 'alipay'"></image>
				<image src="../../static/pay_weixin@2x.png" class="img" v-if="iconImg == 'weixin'"></image>
				<image src="../../static/pay_ccb@2x.png" class="img" v-if="iconImg == 'ccb'"></image> 
				<view class="txtbtn">{{names}}</view> 
			</view>
			<label class="right">
				<slot name="radioPay"></slot>
			</label>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return { 
				title:'footpopup', 
			}
		},
		props:{ 
			names: {
				type: String,
				default: ''
			}, // 服务商
			iconImg: {
				type: String,
				default: ''
			}, // 图标
		},
		methods: {
			btnClick(e) { 
				this.$emit('click', e) 
			}
		} 
	}
</script>

<style scoped lang="scss"> 
	.prepyPop{
		padding: 32rpx 0;
		display: flex; 
		align-items: center;
		width: 100%;
		justify-content: space-between;
		.left{
			width: 80%;
			display: flex;
			align-items: center;
			.img{
				width: 48rpx;
				height: 48rpx;
			} 
			.txtbtn{
				padding-left: 32rpx;
			}
		}
		
		.right{
			
		}
		
	}
</style>
