<template> 
	<view class="default-page">	
		<view class="pageCont" v-if="load">
			<view class="cont">
				<image src="@/static/default_icon_loading.gif" class="gifimg" mode="aspectFit"></image> 
			</view>
		</view> 
		<view class="pageCont" v-if="nohave">
			<view class="cont">
				<image src="@/static/default_order@1x.png" class="img" mode="scaleToFill"></image>
				<view class="txt">暂无数据</view>
			</view>
		</view>
		<view class="pageCont" style="height: calc(100vh - 80px)" v-if="nostore">
			<view class="cont">
				<image src="@/static/default_null@1x.png" class="img" mode="scaleToFill"></image>
				<view class="txt">当前无库存</view>
				<view class="txt txt-red">请在有效时间内订购商品</navigator></view>
			</view>
		</view>
		
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				inipage:'基础页面',
			}
		},
		props: {
		  load: {
			type: Boolean,
			default: false
		  }, 
		  nohave:{ 
			type: Boolean,
			default: false
		  }, 
		  nostore:{ 
			type: Boolean,
			default: false
		  }, 
		},
	}
</script>

<style lang="scss" scoped>
	
	.pageCont{
		width: 100vw;
		height: 100vh; 
		display: flex;
		justify-content: center;
		align-items: top;
		
		.cont{
			text-align: center;
			padding-top: 200rpx;
			.img{
				width: 512rpx;
				height: 332rpx; 
			}
			.gifimg{
				max-width: 100%;
				max-height: 100%;
			}
			
			.txt{
				padding-top: 60rpx;
				font-size: 32rpx;
				color: #777777;
				display: flex;
				justify-content: center;
			}
			
			.txt-red{
				color: #FF0000;
			}
			.txt-green{
				color: #49B75D;
			}
			
		}
		
	} 
	
	
	
</style>
