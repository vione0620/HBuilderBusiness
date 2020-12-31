<template> 
	<view class="btn-wrap" :class="fixd ? 'fiexd': ''"> 
	<!-- <view class="" v-if="disable ? 'w-100 bg-green' : 'w-100 bg-gary' "></view> -->
		<template v-if="disable">
			<view class="btn radius-df" :class="double ? 'w-45 bg-red' : 'w-100 bg-gary'" @click="btnClick">{{title}}</view> 			
		</template>
		<template v-else>
			<view class="btn radius-df" :class="double ? 'w-45 bg-red' : 'w-100 bg-green'" @click="btnClick">{{title}}</view> 
		</template>
		<template v-if="double"> 
			<view class="btn bg-green radius-df w-45" @click="btnDouble" hover-class="animate__animated animate__pulse">{{double}}</view> 
		</template> 
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
			}, // 标题
			double: {
				type: String,
				default: ''
			}, // 标题
			fixd: {
				type: Boolean,
				default: false
			}, // 标题
			disable: {
				type: Boolean,
				default: false
			}, // 标题
		},
		methods: {
			btnClick(e) { 
				this.$emit('click', e.detail) 
			},
			btnDouble(e){
				this.$emit('change', e.detail) 
			}
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
	.fiexd{
		position: fixed; 
	}
	.btn{
		padding: 30rpx;
		color: #FFFFFF;
		font-size: 32rpx; 
	}
	.bg-green{
		background-color: #46B85B;
	}
	.bg-red{
		background-color: #E20F0F;
	}
	.bg-gary{
		background-color: #CCCCCC;
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
	
	@media (max-height:400){
	
	 .footer{display:none;}
	
	}
</style>
