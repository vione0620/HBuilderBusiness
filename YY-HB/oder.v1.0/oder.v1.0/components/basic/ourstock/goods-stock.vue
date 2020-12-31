<template>
	<view class="goods-group-item"> 
		<image :src="goodsItem.goodsPic ?  goodsItem.goodsPic + '?imageView2/0/w/160/h/160' : '../../../static/noImg.png' " 
		mode="aspectFill" class="urlImg-item"></image>
		<view class="text-item"> 
			<view class="title">
				<view class="name">{{goodsItem.goodsName}}</view>  
				<view class="hotbtn" 
				@tap="HotSale(goodsItem)" 
				v-if="this.iShow && goodsItem.hotSale == 0">上热门</view>
				<view class="hotbtn hotbtn-active" 
				@tap="HotSale(goodsItem)" 
				v-if="this.isDown && goodsItem.hotSale == 1">取消</view>
			</view>
			<view class="etalon">{{goodsItem.goodsWeight}} 克</view> 
			<view class="stockfoot">
				<view class="tit red">库存剩余</view>
				<view class="nums red">{{goodsItem.storeNum}}<text class="unit">{{goodsItem.goodsUnit}}</text></view>
			</view> 
			<view class="stockfoot"> 
				<view class="tit green">库存售出</view>
				<view class="nums green">{{goodsItem.saleNum}}<text class="unit">{{goodsItem.goodsUnit}}</text></view>
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
	  iShow:{
		  type:Boolean,
		  default(){
			  return true
		  },
	  },
	  isDown:{
		  type:Boolean,
		  default(){
			  return true
		  },
	  }, 
	},  
	data() {
		return { 	  
			msg:'库存',
			showSet:true,
		}
	}, 
	methods:{ 		  
		HotSale(isHot){  
			this.$emit('hot-sell',isHot)
			this.$store.commit('set_hot_sale',isHot) 
		},
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
		border-bottom: 1px solid #f0f0f0;

		.urlImg-item {
			width: 160rpx;
			height: 160rpx; 
			border-radius: 6rpx;
		}


		.text-item { 
			flex: 1;
			padding-left: 20rpx;
			align-items: center;

			.title{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 6rpx 0;
			}
			.name {
				font-size: 30rpx;
			}
			.hotbtn{
				font-size: 24rpx;
				color: #49B75D;
				border: 1px solid #49B75D;
				width: 100rpx;
				height: 44rpx;
				border-radius: 22rpx; 
				text-align: center;
				line-height:44rpx;
			}
			.hotbtn-active{
				border: 1px solid #666;
				color:#666;
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
				font-size: 26rpx;
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
