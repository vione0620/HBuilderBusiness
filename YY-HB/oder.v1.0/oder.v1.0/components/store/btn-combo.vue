<template>
	<view class="buttons">
		<view class="cancel" @click="cancel">取消</view>
		<view class="line"></view>
		<view class="confirm" @click="confirm">{{comfirmText}}</view>
	</view>
</template>

<script>
	export default{
		name: 'BtnCombo',
		props: {
			comfirmText: {
				type: String,
				default: '确定'
			}
		},
		methods:{
			cancel(){
				this.$emit('cancel')
			},
			confirm(){
				this.$emit('confirm')
			}
		},
	}
</script>

<style lang="scss" scoped>
	.buttons{
		width: 100%;
		height: 92rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		border-top: 1px solid #EFEFEF;
		font-size: 28rpx;
		font-weight: bold;
		.cancel{
			flex: 1;
			color: #999999;
		}
		.confirm{
			flex: 1;
			color: #257BDC;
		}
		.line{
			width: 1px;
			height: 100%;
			background-color: #EFEFEF;
		}
	}
</style>
