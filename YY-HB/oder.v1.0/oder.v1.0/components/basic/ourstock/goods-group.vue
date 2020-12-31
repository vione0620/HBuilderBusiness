<template>   
	<view class="stock-group">  
		<view class="title stock-title">{{category}}</view>
		<block v-for="(child,index) in goods" :key="'4'+index">  
			<view class="item-wrap"> 
				<goods-stock :goods-item="child" :goods-index="index" @hot-sell="SetHotSell" @i-show="iShow" @is-down="isDown"
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
		  iShow:{
			  type:Boolean,
			  default(){
				  return true
			  },
		  },
		  isDown:{
			  type:Boolean,
			  default(){
				  return false
			  },
		  },
		},
		mounted() {
			this._gdsScrollY() 
		}, 
		methods:{   				  
			SetHotSell(isHot){
				// console.log(isHot)
				this.$emit('set-hot-sell',isHot)
				// this.$store.commit('set_hot_sale',isHot) 
			},
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

<style lang="scss" scoped>

 .stock-group{
	 
	 padding: 20rpx 0; 
	 background-color: #FFFFFF; 
	 border-radius: 12rpx;
	 
	 
	 .title{
		 font-size: 36rpx;  
		 // padding: 20rpx 0; 
	 } 
	 
 }
</style>
