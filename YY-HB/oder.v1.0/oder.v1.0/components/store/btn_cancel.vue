<template>
	<view>
		<view v-if="type==='cancel'" class="btn_cancel" @click="cancel" :style="{fontSize: size+'rpx',color: color,width:width+'rpx',padding:width/10+'rpx'}">取消</view>
		<view v-if="type==='confirm'" class="btn_confirm" @click="confirm" :style="{fontSize: size+'rpx',color: color,width:width+'rpx',padding:width/10+'rpx'}">确定</view>
	</view>
</template>

<script>
	export default{
		props: {
			type: {
				type: String,
				default: 'confirm'
			},
			color: {
				type: String,
				default: '#FFFFFF'
			},
			size: {
				type: Number,
				default: 32
			},
			width: {
				type: Number,
				default: 330
			}
		},
		methods:{
			cancel(){
				this.$emit('click')
			},
			confirm(){
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss">
	.btn_cancel,.btn_confirm{
		text-align: center;
		background: #FFFFFF;
		border: 1px solid #EEEEEE;
		border-radius: 50rpx;
	}
	.btn_confirm{
		background: #4FB562;
		border: 1px solid #4FB562;
	}
</style>
