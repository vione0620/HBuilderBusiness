<template> 
	<view class="getBtn-item">  
		<template v-if="foods.boxNums">
			<view class="iconfont iconless-border btn-less" @tap="countChange(false)"></view> 
			<input type="number" class="btn-nums" :value="foods.boxNums"  @confirm="moreNum" @blur="moreNum" /> 
		</template>
		<view class="iconfont iconadd-bg btn-add" @tap="countChange(true)"></view>
	</view>
</template>

<script> 
	export default { 
		props: {
		  foods:Object,
		}, 
		methods:{ 			
			countChange(isAdd){  
				if(isAdd){
					this.$store.commit('add_food_count',{isAdd,food:this.foods})
				}else{
					this.$store.commit('less_food_count',{isAdd,food:this.foods})					
				} 
			},
			moreNum(e){  				
				let valueNums = parseFloat(e.target.value) 
				if(!valueNums){
					valueNums = 0
				} 
				this.$store.commit('value_food_count',{valueNums,food:this.foods}) 
			},  
		}, 
	}
</script>

<style lang="scss">
	
	.getBtn-item {
		display: flex;
		align-items: center;  
		
		.iconfont {
			font-size: 40rpx;
		}
	
		.btn-less {
			color: #46B85B;
		}
	
		.btn-nums {
			font-weight: 500;
			padding: 0 16rpx;
			max-width: 80rpx;
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
