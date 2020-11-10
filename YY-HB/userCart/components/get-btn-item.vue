<template> 
	<view class="getBtn-item">  
		<template v-if="foods.boxNums"> 
			<view class="btns" @click="numsLess" @tap="countChange(false)">
				<image src="../static/icon-less-border.png" class="img" mode=""></image>
			</view>			 
			<view class="btn-nums">{{foods.boxNums}}</view> 
		</template>
		<view class="btns" @click="numsAdd" @tap="countChange(true)">
			<image src="../static/icon-add-bg.png" class="img" mode=""></image>
		</view>
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
				this.$store.commit('value_food_count',{valueNums,food:this.foods}) 
			},  
		}, 
	}
</script>

<style lang="scss" scoped> 
.getBtn-item {
	display: flex;
	align-items: center; 
	height: 50rpx;
	.btns { 
		width: 48rpx;
		height: 48rpx;	 
		
		.img{
			width: 48rpx;
			height: 48rpx;
		}
	} 
	.btn-nums {  
		padding: 0 8rpx;
		max-width: 80rpx;
		font-size: 32rpx;	 
		text-align: center;  
	}   
}
</style>
