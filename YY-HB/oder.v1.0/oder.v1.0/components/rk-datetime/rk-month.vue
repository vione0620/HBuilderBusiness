<template>
	<view id="month">		
		<view class="header">
			<view class="item item_left" @tap="prevYear()">上一年</view>
			<view class="item item_cont">{{rkYear}}年</view>			
			<view class="item item_right" :class="rkYear === current_year ? 'disabled-color' : ''" @tap="nextYear()">下一年</view>
		</view> 
		<view class="year-group">  
			<view class="item" hover-class="chooseHover" :class="rkYear === current_year && current_month === index ? 'green' : '' "
			@click="chooesMonth(index)" v-for="(item,index) in month" :key="'4'+index">
				<view :class="rkYear === current_year && current_month < index ? 'disabled-color' : ''">
					<view class="">{{item}}</view>
				</view> 
			</view>
		</view>
	</view>
</template>

<script> 
	import {handleYear,handleMonth,} from '@/network/daliy.js' 	
	export default{
		data(){
			return {
				year:'2020',
				month:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
				rkYear:'',
				current_year:'',
				current_month:'',
			}
		},
		created() {
			this.rkYear = handleYear()
			this.current_year = handleYear()
			this.anchor_m()
		},
		methods:{
			anchor_m(){
				let current_month = handleMonth()  
				this.current_month = current_month - 2 
			}, 
			chooesMonth(index){ 
				if(this.rkYear === this.current_year && index > this.current_month ){ 
					return 
				}
				let month = this.parseNumber(index + 1)
				this.$emit('click',{year:this.rkYear,month:month})
			},
			prevYear(){
				this.rkYear--  
			},
			nextYear(){ 
				if(this.rkYear === handleYear()){
					return
				}
				this.rkYear++  
			},
			//个位数补零
			parseNumber(num) {
				return num < 10 ? "0" + num : num;
			}	
		},
	}
</script>

<style lang="scss">
	
	.disabled-color{
		color: #999;
	}
	.green{
		color: #46B85C !important; 
	}
	.header{
		display: flex;
		width: 100vw;
		padding: 40rpx;
		background-color: #FFFFFF;   
		box-shadow: 1px 0 2px rgba(0,0,0,.1), 1px 0 2px rgba(0,0,0,.1);
		
		.item{
			flex: 1;
			font-size: 40rpx;
		}
		.item_left{ 
			text-align: left;
		}
		.item_cont{ 
			text-align: center;
		}
		.item_right{ 
			text-align: right;
		}
		
	}
	.year-group{ 		 
		display: flex;
		flex-wrap: wrap; 
		padding: 40px 20rpx;
		
		.item{
			box-sizing: border-box;
			flex: 0 0 25%; 
			text-align: center;
			padding: 20px 0;
			margin-bottom: 28rpx; 
			border-radius: 8rpx; 
		}
		
		.chooseHover{
			background-color: #F2F2F2;
		}
		
	}
</style>
