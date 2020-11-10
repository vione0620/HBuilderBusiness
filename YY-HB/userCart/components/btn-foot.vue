<template> 
	<view class="btn-wrap"> 
		<view class="btn radius-df w-100" 
		hover-class="bg-hover" 
		:class="bluecolor ? 'bg-blue' :'bg-green'" @click="btnClick">{{title}}</view> 
	</view>
</template>

<script>
	export default {
		data() {
			return {
				index:0
			};
		}, 
		props:{ 
			title: {
				type: String,
				default: ''
			}, // 按钮 
			bluecolor:{
				type:Boolean
			}
		},
		methods: {
			btnClick(e) { 
				this.$emit('click', e.detail)
			}, 
		}
	}
</script>

<style lang="scss"> 
	.btn-wrap{
		padding: 20rpx;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		text-align: center;
		align-items: center;
		display: flex;
		justify-content: space-between;
	}
	.btn{
		padding: 16rpx;
		color: #FFFFFF;
		font-size: 28rpx; 
	}
	.bg-green{
		background-color: #46B85B;
	}
	.bg-hover{
		background-color: #04a722;
	}
	.w-100{
		width: 100%;
	}
	.w-45{
		width: 48%;
	}
	.radius-df{
		border-radius: 6rpx;
	}
	 
</style>
