<template>
	<view class="gopay-main">
		<view class="group-wrap"> 
			 <view class="gopay-group" v-for="(food,index) in cartGoods" :key="'4'+index"> 
				 <view class="name">{{food.goodsName}} 
					 <text class="red">{{(food.goodsNo === "YP0YWDJ0000014") ? '必选' : ''}}</text>
					 <text class="hots">{{(food.hotSale==='0' || food.hotSale === undefined) ? '' : '热门'}}</text>
				 </view> 
				 <view class="info">
					 <view class="price">{{parseFloat(food.merchPrice * food.boxNums * food.goodsQuantity /100).toFixed(2) + '元'}}</view>
					 <view class="nums">{{food.goodsQuantity}}{{food.goodsUnit}} * {{food.boxNums}}</view>					 
				 </view>	 
			 </view>
		</view>  
		 <view class="group-wrap-tot">		 
			<view class="txt">合计：</view>
			<view class="price">{{parseFloat(totalPrice/100).toFixed(2)}} </view> 
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

<style>

</style>
