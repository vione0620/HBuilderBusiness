<template>
	<view>	 
		<view class="header">
			<view class="item item_left" @tap="prevYear()">上一年</view>
			<view class="item item_cont">{{rkYear}}年</view>			
			<view class="item item_right" :class="rkYear === current_year ? 'disabled-color' : ''" @tap="nextYear()">下一年</view>
		</view> 
		<view class="main-wrap">
			<view class="group" v-for="(group,index) in yearWeek" :key="'4'+index"> 
				<view class="title" :class="rkYear === current_year && (is_child_week.month -1) === index ? 'title-active' : '' "
				 :id="`anchor${index+1}`">{{`——&nbsp;${rkYear}年${group.nums_key}月&nbsp;——`}}</view> 
				<view class="cont-group">   
					<view class="cont-group-list" hover-class="chooseHover"
					:class="rkYear === current_year && ((is_child_week.week -1) === index) &&  myscroll=== (+group.nums_key) ? 'chooseHover week-active' : ''"
					v-for="(week,index) in group.nums_val" 
					@click="chooesWeeks({month:group.nums_key,day:group.nums_unit[index],week_index:index})" :key="'4'+index">   
							<!-- 本年度的这个月 -->
							<view :class="(myscroll) < (+group.nums_key) && rkYear === current_year ? 'disabled-color' : ''">
								<!-- 本月的这个周 -->
								<view :class="rkYear === current_year && (myscroll) === (+group.nums_key) && is_child_week.week-1 < index ? 'disabled-color' : ''">
									<view class="tit">第{{hanziNums[index]}}周</view>
									<view class="txt">{{group.nums_unit[index]}}</view>
								</view>
							</view> 
					</view>
				</view>	 
			</view> 
		</view>   
	</view>
</template>

<script> 
	import {weekGetDate,rkhandleYearWeek} from '../../common/util/weekRange.js' 
	import {foramtMonthNums} from '@/common/util/utils.js'
	import {
		handleYear,handleWeek,handleMonth,handleWeeksInYear,m_month_week,handleWeeksInterval,
	} from '@/network/daliy.js'  
	export default {
		data() {
			return {
				yearWeek:'',
				weeksInterval:'',
				rkYear:'',
				current_year:'',
				myscroll:'',
				hanziNums:[],
			}
		}, 
		created() {
			this.rkYear = handleYear()
			this.current_year = handleYear()
			this.m_month_week(this.rkYear)
			this.w_week_interval(this.rkYear)
			this.anchor_m() 
		}, 
		props: {
		  is_child_week:Object, 
		}, 
		methods:{ 
			anchor_m(){
				let current_month = handleMonth() 
				this.myscroll = current_month 
			}, 
			m_month_week(rkYear){
				//一年中每个月多少周列表渲染 
				this.yearWeek = m_month_week(rkYear)
				let ally = m_month_week(rkYear)
				let hanzi = []
				let week = ally.forEach((res)=>{ 
					let nums = foramtMonthNums(res.nums_key) 
					this.hanziNums.push(nums)
				})    
			},
			w_week_interval(rkYear){
				//一年中所有区间周的数据
				this.weeksInterval = handleWeeksInterval(rkYear)	 
			},
			chooesWeeks(month){  
				if(this.myscroll === (+month.month) && month.week_index > this.is_child_week.week-1){ 
					return
				}
				let isweek = month.day
				let isweek_index = this.weeksInterval.findIndex((value, index, arr) => { 
					if(isweek === value) 					
					return (index + 1) * 1
				});
				let year = this.rkYear
				let weeks = this.parseNumber(isweek_index + 1)  
				this.$emit('click',{
					year:this.rkYear,
					week:weeks,
					month:month.month,
					index:isweek_index + 1,
					week_index:this.parseNumber(month.week_index+1),
					until:this.weeksInterval[isweek_index]
				})   
			},
			prevYear(){
				this.rkYear-- 
				let iswait = setTimeout(() => {					
					this.w_week_interval(this.rkYear)
					this.m_month_week(this.rkYear) 		
				},200) 
			},
			nextYear(){ 
				if(this.rkYear === handleYear()){
					return
				}
				this.rkYear++ 
				setTimeout(()=>{					
					this.w_week_interval(this.rkYear) 		
					this.m_month_week(this.rkYear) 		
				},200) 
			},
			//个位数补零
			parseNumber(num) {
				return num < 10 ? "0" + num : num;
			},			
			
			
		},
	}
</script>

<style scoped lang="scss">
	.header{
		display: flex;
		width: 100vw;
		padding: 40rpx;
		background-color: #FFFFFF;  
		position: fixed;
		left: 0;
		top: 0;
		right: 0; 
		z-index: 99999999999999999999999999999;
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
	
	.disabled-color{
		color: #999;
	}
	.title-active{
		color: #46B85C !important;
		font-weight: bolder;
	} 
	
	.week-active{ 
		color: #46B85C !important; 
	}
			
	.main-wrap{ 
		padding-top: 160rpx;
		width: 100vw;
		.group{
			
			.title{
				font-size: 26rpx; 
				text-align: center;  
				color: #999;
				padding: 20rpx;
			}
			
			.cont-group{
				text-align: center; 
				flex-flow: row wrap;
				align-content: flex-start;				
				display: flex;
				padding: 40rpx 0;
				
				.cont-group-list{  
					flex: 0 0 25%; 
					border-radius: 8rpx; 
					padding: 32rpx 0;
					.tit{
						font-size:32rpx; 
						padding-bottom: 12rpx;
					}
					.txt{ 
						font-size: 20rpx; 
					} 
					
				}
				.chooseHover{
					background-color: #F2F2F2;
				}
				
				
			}
		
		}
	}
		 
</style>
