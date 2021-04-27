<template>   
	<view class="goodslist-group"> 
		<view class="title">{{goods[0].categoryName}}</view>
		<block v-for="(goodsItem,index) in goods" :key="'4'+index">
			<view class="item-wrap">  
				<view class="goods-group-item">
					<image :src="goodsItem.goodsPic ?  goodsItem.goodsPic + '?imageView2/1/w/160/h/160' : '../../../static/noImg.png' " 
					lazy-load="true" mode="aspectFill" class="urlImg-item"></image> 
					<view class="text-item"> 
						<view class="title">
							<view class="name">{{goodsItem.goodsName}}</view>  
							<!-- <view class="hotbtn" @tap="HotSale(goodsItem)"  
							:class="(goodsItem.hotSale==='0' || goodsItem.hotSale === undefined) ? '' : 'hotbtn-active'" >
							{{(goodsItem.hotSale==='0' || goodsItem.hotSale === undefined) ? '上热门' : '热门'}}</view> -->
						</view> 
						<template v-if="goodsItem.onSale == 0">
							<view class="etalon">重量：{{goodsItem.goodsWeight}} 克</view> 
							<view class="etalon">规格：{{goodsItem.goodsQuantity}} {{goodsItem.goodsUnit}}</view> 
							<view class="etalon">库存：{{goodsItem.storeNum/goodsItem.goodsQuantity}}</view> 
							<view class="boot">
								<view class="price">{{parseFloat((goodsItem.merchPrice * goodsItem.goodsQuantity)/100).toFixed(2)/1}}<text style="font-size: 20rpx;">元</text></view>  
								
								<template v-if="goodsItem.storeNum > 0">
									<get-btn-item :foods="goodsItem"></get-btn-item> 
								</template>
								<template v-else>
									<view class="etalon">已售罄</view>
								</template>
							</view> 
						</template>
						<template v-if="goodsItem.onSale != 0">
							<view class="infotxt">敬请期待</view>
						</template>
					</view>
				</view> 
			</view>
		</block>
		
	</view>   
</template>

<script>
import GetBtnItem from './get-btn-item.vue' 
export default {	
	data() {
		return { 
			right_height: [], //右侧每个内容的高度集合 
		}
	},
	components:{
		GetBtnItem,
	}, 
	props: {
	  goods: Array, 
	}, 
	mounted() { 
		this._gdsScrollY() 
	},
	methods:{
		// HotSale(isHot){			 
		// 	this.$store.commit('set_hot_sale',isHot) 
		// },
		_gdsScrollY(){  
			let selectorQuery = uni.createSelectorQuery(); 
			selectorQuery.selectAll('.goodslist-group').boundingClientRect((rects)=> {
				this.right_height = rects.map((item) => item.top - 58);   
				this.$store.commit('goods_top_scroll',this.right_height) 
			}).exec();  
		},   
	}
}
</script>

<style lang="scss">
.infotxt{
	color: #FF0000;
	font-size: 26rpx;
}


 .goodslist-group{
	 
	 padding: 20rpx; 
	 background-color: #FFFFFF;
	 margin-bottom: 20rpx; 
	 border-radius: 12rpx;
	 
	 
	 .title{
		 font-size: 36rpx; 
		 padding-bottom: 20rpx;
		 
	 }  
	 
	 
	.goods-group-item {
		display: flex;
		padding: 20rpx 0;
		width: 100%; 
	
		.urlImg-item {
			width: 180rpx;
			height: 180rpx; 
			border-radius: 6rpx; 
			box-shadow:1px 1px 3px rgba(0,0,0,.05);
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
				font-size: 32rpx;
			}
			// .hotbtn{
			// 	font-size: 24rpx;
			// 	border: 1px solid #666;
			// 	color:#666;
			// 	width: 100rpx;
			// 	height: 44rpx;
			// 	border-radius: 22rpx; 
			// 	text-align: center;
			// 	line-height:44rpx;
			// }
			// .hotbtn-active{
			// 	color: #FF0000;
			// 	border: 1px solid #FF0000;
			// } 
			.etalon {
				font-size: 20rpx;
				color: #999;
				padding-bottom: 8rpx;
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
	
		}
	}
	 
	 
 }
</style>
