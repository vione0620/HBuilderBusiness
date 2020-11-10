<template>   
	<view class="goods-group">  
		<block v-for="(goodsItem,index) in goods"> 	
			 <view class="goods-group-item">
				<image :src="goodsItem.goodsPic ? gimg + goodsItem.goodsPic + '?imageView2/2/w/160/h/160' : '../../static/noImg.png' " 
				mode="" class="urlImg-item"></image>
				<view class="text-item"> 
					<view class="title">{{goodsItem.goodsName}}</view> 
					<view class="etalon">{{goodsItem.goodsWeight}} 克</view> 
					<view class="etalon">库存：{{goodsItem.storeNum}}</view> 
					<view class="etalon">销量：{{goodsItem.saleNum}} </view>  
					<view class="boot">
						<view class="price">{{goodsItem.goodsPrice | filprie()}}<text class="text">元</text></view> 
						<template v-if="goodsItem.storeNum > 0"> 							
							<get-btn-item :goods-img="gimg" :foods="goodsItem"></get-btn-item> 
						</template>
						<template v-else="goodsItem.storeNum == 0">
							<view class="nosale">售罄</view>
						</template> 
					</view> 
				</view>		
			 </view>
		</block>		
	</view>   
</template>

<script>
	import GetBtnItem from './get-btn-item.vue'
	import {mapState} from 'vuex'
	export default {
		components:{
			GetBtnItem,
		}, 
		computed:{
			...mapState(['mallSrot'])
		},		
		mounted() { 
			this._gdsScrollY() 
		},
		props: {
		  goods: {
			type: Array,
			default() {
			  return []
			}
		  }, 
		  gimg: {
			type: String,
			default() {
			  return []
			}
		  }, 
		}, 
		methods:{			
			_gdsScrollY(){  
				let _this = this; 
				let selectorQuery = uni.createSelectorQuery(); 
				selectorQuery.selectAll('.goods-group').boundingClientRect((rects)=> {
					_this.right_height = rects.map((item) => item.top - 41);   
					this.$store.commit('goods_top_scroll',_this.right_height) 
				}).exec();  
			},  
		},
		filters:{
		  filprie(price){
		    return parseFloat(price/100).toFixed(2)
		  }
		},
	}
</script>

<style lang="scss"> 
.goods-group{
	.goods-group-item {
		display: flex;
		padding-bottom: 20rpx;
		width: 100%; 
	
		.urlImg-item {
			width: 200rpx;
			height: 200rpx; 
			border-radius: 6rpx;
		}	 
		.text-item { 
			flex: 1;
			padding-left: 20rpx;
	
			.title{
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 30rpx;
				padding-bottom: 8rpx;
			}  
			.etalon {
				font-size: 20rpx;
				color: #999;
			}	 
			.boot {
				display: flex;
				justify-content: space-between;
				align-items: center;	
				padding-top: 6rpx; 
				.price {
					color: #FF0000; 
					width: 50%;
					font-size: 32rpx;	 
					.text {
						font-size: 20rpx;
					}
				}
				.nosale{
					font-size: 22rpx;
					color:#999999;
					margin-right: 8rpx;
				} 
			} 
		}
	} 
}
 
</style>
