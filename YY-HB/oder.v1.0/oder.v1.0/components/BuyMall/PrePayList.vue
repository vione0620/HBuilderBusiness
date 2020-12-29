<template>
	<view class="gopay-main">
		<view class="group-wrap"> 
			 <view class="gopay-group" v-for="(food,index) in cartGoods" :key="'4'+index"> 
				 <view class="name">{{food.goodsName}}  </view>
					<!-- <text class="red">{{(food.goodsNo === "YP0YWDJ0000014") ? '必选' : ''}}</text>
					 <text class="hots">{{(food.hotSale==='0' || food.hotSale === undefined) ? '' : '热门'}}</text> -->
				 
				 <view class="info">
					 <view class="price">{{parseFloat(food.merchPrice * food.boxNums * food.goodsQuantity /100).toFixed(2) / 1 }}元</view>
					 <view class="nums">{{food.goodsQuantity}}{{food.goodsUnit}} * {{food.boxNums}}</view>					 
				 </view>	 
			 </view>
		</view>   
		 <view class="group-wrap-tot">		 
			<view class="txt">合计：</view>
			<view class="price">{{parseFloat(totalPrice/100).toFixed(2) /1}} </view> 
			<view class="txt">元</view> 
		</view> 
	</view>
</template>

<script>
	import { mapState, mapGetters} from 'vuex'
	export default {
		props:{
			PrePayListData:Object
		},
		computed:{
			...mapState(['cartGoods']),
			...mapGetters(['totalPrice'])
		}, 
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped lang="scss">
	.gopay-main{
			
		background-color: #FFFFFF;
		border-radius: 8px;
		padding: 20rpx;
		 
			.gopay-group{
				padding: 20rpx;
				display: flex;
				justify-content: space-between;
				border-bottom: 1px dashed #d4d4d4;
				align-items: center;
				
				.name{
					flex: 1;
					font-size: 30rpx;
					.red{
						color: #f00;
						font-size: 22rpx;
						vertical-align: text-top;
					}
					.hots{
						font-size: 22rpx;
						color: #FF0000;
						vertical-align: text-top;
						padding-left: 8rpx;
					}
				}
				.unit{
					flex: 1;
					font-size: 30rpx;
					
				}
				.info{
					flex: 1;
					text-align: right; 
					
					.price{
						font-size: 30rpx;
					}
					.nums{
						font-size: 26rpx;
						color: #999;
					}
				}
				
				 
				
			}  
		
	 .group-wrap-tot{
		 padding: 20rpx;
		 display: flex;
		 justify-content: flex-end; 
		 align-items: center;
		.price{ 
			font-size: 50rpx; 
		}
		.txt{
			font-size: 26rpx; 
			padding-top: 8rpx;
		} 
	 }
	 
	}

</style>
