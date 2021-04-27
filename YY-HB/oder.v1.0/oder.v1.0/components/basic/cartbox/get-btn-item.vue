<template> 
	<view class="getBtn-item">  
		<template v-if="foods.boxNums">
			<view class="iconfont iconless-border btn-less" @tap="countChange(false)"></view> 
			<input type="number" class="btn-nums" :value="foods.boxNums"  @confirm="moreNum" @blur="moreNum" /> 
		</template> 
		<view class="iconfont iconadd-bg" :class="this.storeM ? 'nogray' : 'btn-add'" @tap="countChange(true)"></view>
	</view>
</template>

<script> 
	export default { 
		data(){
			return {
				storeM:false,
				boxvalue:0,
			}
		},
		props: {
		  foods:Object,
		},
		mounted() {			
			this.addBtnFuc(this.foods.boxNums)
		},
		methods:{ 			
			countChange(isAdd){  
				if(isAdd){
					this.$store.commit('add_food_count',{isAdd,food:this.foods}) 
					this.addBtnFuc(this.foods.boxNums)
				}else{
					this.$store.commit('less_food_count',{isAdd,food:this.foods})	
					this.addBtnFuc(this.foods.boxNums)				
				} 
			},
			moreNum(e){  				
				let valueNums = parseFloat(e.target.value) 
				this.boxvalue = parseFloat(e.target.value)
				if(!valueNums){
					valueNums = 0
				}
				this.addBtnFuc(valueNums)
				this.$store.commit('value_food_count',{valueNums,food:this.foods}) 
			},
			addBtnFuc(valueNums){
				if(valueNums >= this.foods.storeNum/this.foods.goodsQuantity){
					this.storeM = true
				}else{
					this.storeM = false
				}
			},
		}, 
	}
</script>

<style lang="scss">
	
	.getBtn-item {
		display: flex;
		align-items: center;  
		
		.iconfont {
			font-size: 56rpx;
		}
	
		.btn-less {
			color: #46B85B;
		}
	
		.btn-nums {
			font-weight: 500;
			padding: 0 10rpx;
			max-width: 150rpx;
			text-align: center;  
		}
	
		.btn-add {
			color: #46B85B;
		}
	
		.nogray {
			color: #999;
		}
	  
	
	}
</style>
