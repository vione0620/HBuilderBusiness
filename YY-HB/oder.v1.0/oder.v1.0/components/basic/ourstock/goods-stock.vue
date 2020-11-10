<template>
	<view class="goods-group-item"> 
		<image :src="goodsItem.goodsPic ?  goodsItem.goodsPic + '?imageView2/0/w/160/h/160' : '../../../static/noImg.png' " mode="aspectFill" class="urlImg-item"></image>
		<view class="text-item"> 
			<view class="title">
				<view class="name">{{goodsItem.goodsName}}</view> 
			</view>
			<view class="etalon">{{goodsItem.goodsWeight}} 克</view>
			<view class="stockfoot">
				<view class="tit red" :class="goodsItem.storeNum == 0 ? 'green' : 'red'">剩余</view>
				<view class="nums" :class="goodsItem.storeNum == 0 ? 'green' : 'red'">{{goodsItem.storeNum}} 
				<text class="unit">{{goodsItem.goodsUnit}}</text></view> 
			</view> 
			<view class="stockfoot"> 
				<view class="tit" :class="goodsItem.saleNum == 0 ? 'red' : 'green'">售出</view>
				<view class="nums" :class="goodsItem.saleNum == 0 ? 'red' : 'green'">{{goodsItem.saleNum}} 
				<text class="unit">{{goodsItem.goodsUnit}}</text></view>
			</view>  
		</view> 

	</view> 
	
</template>

<script>  

  export default {
	name: "GoodsGroupItem", 
	props: {
	  goodsItem: {
		type: [Array,Object],
		default() {
		  return {}
		}
	  }, 
	  goodsIndex:{ 
		type: [String,Number],
		default() {
		  return {}
		}
	  },
	},  
	data() {
		return { 	  
			msg:'库存'
		}
	}, 
	methods:{ 		 
		 
	}, 
  }
</script>

<style lang="scss">
	.red{
		color: #FF0000;
	}
	.green{
		color: #47b85b;
	}
	.goods-group-item {
		display: flex;
		padding: 20rpx 0;
		width: 100%; 

		.urlImg-item {
			width: 160rpx;
			height: 160rpx; 
			border-radius: 6rpx;
		}


		.text-item { 
			flex: 1;
			padding-left: 20rpx;

			.title{
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.name {
				font-size: 30rpx;
			}
			.hotbtn{
				font-size: 24rpx;
				border: 1px solid #666;
				color:#666;
				width: 100rpx;
				height: 44rpx;
				border-radius: 22rpx; 
				text-align: center;
				line-height:44rpx;
			}
			.hotbtn-active{
				color: #FF0000;
				border: 1px solid #FF0000;
			} 
			.etalon {
				font-size: 20rpx;
				color: #999;
			}

			.boot {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.price {
					color: red; 
					width: 50%;

					.text {
						font-size: 20rpx;
					}
				}
				 

			}
			
			.stockfoot{
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 30rpx;
				padding-top: 12rpx;
				// .tit{
				// 	color: #999999; 
				// }
				
				.nums{ 
					.unit{
						font-size: 26rpx;
					}
				}
				
			} 
			

		}
	}
</style>
