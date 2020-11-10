<template>   
	<view class="stock-group">  
		<view class="title stock-title">{{category}}</view>
		<block v-for="(child,index) in goods" :key="'4'+index"> 
			<view class="item-wrap"> 
				<goods-stock :goods-item="child" :goods-index="index"
				></goods-stock> 
			</view>
		</block>
	</view>   
</template>

<script>
	import GoodsStock from './goods-stock.vue'  
	export default {
		components:{
			GoodsStock, 
		},  
		props: {
		  goods: {
			type: [Array,Object],
			default() {
				return { 
					right_height: [], //右侧每个内容的高度集合 
				}
			}
		  },
		  category:[String],
		},
		mounted() {
			this._gdsScrollY() 
		}, 
		methods:{   			
			_gdsScrollY(){  
				let selectorQuery = uni.createSelectorQuery(); 
				selectorQuery.selectAll('.stock-group').boundingClientRect((rects)=> {
					this.right_height = rects.map((item) => item.top - 260) 
					this.$store.commit('stock_top_scroll',this.right_height) 
				}).exec();   
			},   
		}
	}
</script>

<style lang="scss">

 .goodslist-group{
	 
	 padding: 20rpx; 
	 background-color: #FFFFFF;
	 margin-bottom: 20rpx; 
	 border-radius: 12rpx;
	 
	 
	 .title{
		 font-size: 36rpx; 
		 padding-bottom: 20rpx;
		 
	 }  
	 
 }
</style>
