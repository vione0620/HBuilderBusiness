<template> 
	<view id="dailys">   
		<view class="chart-group">
			<view class="title">收入分析</view>
			<view class="subtitle">比上一日 <view class="case">{{minusNums}}
			<view :class="isMinus ? 'green' : 'red'" v-if="!isFair">{{` ${parseFloat(getIncomeData.incomeChange / 100).toFixed(2)} 元`}}</view></view> 
				<view class="black" v-if="isFair">无变化</view> 			
			</view>
			<view class="analysis"> 
				<view class="" v-if="isnohave">没有数据哦</view>
				<view class="" v-else="!isnohave">
					<income-nums :option="incomeNums" style="height: 180px;"></income-nums> 
				</view>
			</view>
		</view>
		<view class="chart-group">
			<view class="title cincome">收入趋势</view>
			<view class="subtitle" v-if="!isnoNum">当日收入最高的时间是 <view class="case">{{getAccessData.busiMoney}}</view></view>
			<view class="cincomeTrend">
				<view class="" v-if="isnohave">没有数据哦</view>
				<view class="" v-else="!isnohave">
					<income-trend :option="incomeTrend" style="height: 180px;"></income-trend>
				</view>
			</view> 
		</view>
		<view class="chart-group">
			<view class="title customer">顾客总数量</view>
			<view class="subtitle">当日到点人数比上一日
				<view class="case">{{minusNums}} <view :class="isMinus ? 'green' : 'red'">{{` ${getIncomeData.customerChange} 人`}}</view></view> 
				<view class="black" v-if="isFair">无变化</view> 			
			</view>
			<view class="accessNums"> 			
				<view class="" v-if="isnohave">没有数据哦</view>
				<view class="" v-else="!isnohave">
					<access-nums :option="accessNums" style="height: 180px;"></access-nums>  
				</view>
			</view> 
		</view>
		<view class="chart-group">
			<view class="access">到店趋势</view>
			<view class="subtitle" v-if="!isnoNum">当日收入最高的时间是 <view class="case">{{getAccessData.busiHour}}</view></view> 
			<view class="accessTrend"> 
			
				<view class="" v-if="isnohave">没有数据哦</view>
				<view class="" v-else="!isnohave">
					<access-trend :option="accessTrend" style="height: 180px;"></access-trend>
				</view>
			</view>
		</view>  
	</view>  
</template>

<script>		
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {
		getSortAscii, arrayExclude,handleDate,foramtWeek,foramtMonth,foramtMonthNums,
	} from '@/common/util/utils.js'
	
	import {
		INCOMENUMS,INCOMETREND,ACCESSNUMS,ACCESSTREND
	} from '../echarts/options.js'
	 
	import IncomeNums from '@/components/echarts/income-nums.vue'
	import IncomeTrend from '@/components/echarts/income-trend.vue'
	import AccessNums from '@/components/echarts/access-nums.vue'
	import AccessTrend from '@/components/echarts/access-trend.vue'
	
	export default {
		data() {
			return {  
				showDate:'',    
				isnohave:false,
				showCharts:false,
				isMinus:false,
				isnoNum:false,
				getIncomeData:{
					customerChange: 0,
					incomeChange: 0
				},
				getAccessData:{					
					visitorNum: 0,
					busiHour: '', 
				},  
				incomeNums:{},
				incomeTrend:{}, 
				accessNums:{},
				accessTrend:{}, 
			}
		},
		props:{
			chartTime:[String]
		},
		components:{ 
			IncomeNums, 
			IncomeTrend,
			AccessNums,
			AccessTrend,
		},
		created() {			
			this.loginWhether = uni.getStorageSync('status')  
			this.merchNo = uni.getStorageSync('user').merchNo	
			  
			//图表渲染    
			this.incomeNums = INCOMENUMS
			this.incomeTrend = INCOMETREND
			this.accessNums = ACCESSNUMS
			this.accessTrend = ACCESSTREND
			  
			this.getIncomeAnalysisDay(this.chartTime)
			this.getIncomeTrendDay(this.chartTime)			 
		}, 
		computed:{ 
			minusNums:function(){
				let nums = this.getIncomeData.incomeChange 
				if(nums > 0){
					this.isMinus = false
					this.isFair = false
					return ` 增长 `
				}else if(nums < 0){
					this.isMinus = true
					this.isFair = false
					return ` 下降 `
				}else if(nums === 0){
					this.isFair = true
					return ` 持平 `
				}
			},
		},		
		watch:{			
			chartTime:function(val){				
				this.getIncomeAnalysisDay(this.chartTime)
				this.getIncomeTrendDay(this.chartTime)
			}
		},
		methods: {   
			//日营收分析（营收和顾客数）
			getIncomeAnalysisDay(showDate){
				let vVlue = {"merchNo":this.merchNo,"busiDay":showDate} //必传
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 
				
				this.$request.post('getIncomeAnalysisDay',{
					...vVlue,
					"sign":sSign,
				},{token:true}).then(res=>{ 
					
					if(res.code){
						// this.$api.initPage(res.code,res.message)
						if(res.code == 200){
							setTimeout(()=>{ 
								if(res.data.income == null || res.data.income == ''){			
									INCOMENUMS.xAxis[0].data = [0,0,0]
									INCOMENUMS.series[0].data = [0,0,0]
									ACCESSNUMS.xAxis[0].data = [0,0,0]
									ACCESSNUMS.series[0].data = [0,0,0]  
								}else{ 
									this.getIncomeData = {
										customerChange:res.data.customerChange,
										incomeChange:res.data.incomeChange
									}					 
									if(res.data.income.length){
										let bardata = []
										let bartime = [] 
										let barperson = []
										 let resdata = res.data.income
										 for(let i in resdata){
											let money = resdata[i].totalRecAmt / 100 
											let time = resdata[i].busiDate,
												w = time.slice(0,2),
												m = time.slice(3);
											
											let timer = `${w}月${m}日`
											let person = resdata[i].payCustomerNum
											bardata.push(money)
											bartime.push(timer) 								
											barperson.push(person) 								
										 } 	   
										INCOMENUMS.xAxis[0].data = bartime
										INCOMENUMS.series[0].data = bardata
										ACCESSNUMS.xAxis[0].data = bartime
										ACCESSNUMS.series[0].data = barperson  										
										  
											
									}
								}
								
							},500)
						}
					}
				}).catch()	
			},	
			//日营收趋势（营收和访客数）
			getIncomeTrendDay(showDate){
				let vVlue = {"merchNo":this.merchNo,"busiDay":showDate} //必传
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 
				
				this.$request.post('getIncomeTrendDay',{
					...vVlue,
					"sign":sSign,
				},{token:true}).then(res=>{ 
					
					if(res.code){
						this.$api.initPage(res.code,res.message)
						if(res.code == 200){
							setTimeout(()=>{ 
								if(res.data == null || res.data == ''){			
									INCOMETREND.xAxis[0].data = [0,0,0]
									INCOMETREND.series[0].data = [0,0,0]
									ACCESSTREND.xAxis[0].data = [0,0,0]
									ACCESSTREND.series[0].data = [0,0,0] 	
									
									this.getAccessData.busiHour = ''
									this.getAccessData.busiMoney = ''
									this.isnoNum = true 
									
								}else{ 
									this.getAccessData = {
										customerChange:res.data.customerChange,
										incomeChange:res.data.incomeChange
									}					 
									if(res.data){
										let bardata = []
										let bartime = [] 
										let barperson = []
										 let resdata = res.data
										 for(let i in resdata){
											let money = resdata[i].totalRecAmt / 100
											let time = resdata[i].busiHour + '点'
											let person = resdata[i].visitorNum
											bardata.push(money)
											bartime.push(time) 								
											barperson.push(person) 								
										 } 	  
										INCOMETREND.xAxis[0].data = bartime
										INCOMETREND.series[0].data = bardata
										ACCESSTREND.xAxis[0].data = bartime
										ACCESSTREND.series[0].data = barperson    
										
										// //收入最高的那小时是 
										let gmoeny_sort = bardata.sort() 
										let good_money = gmoeny_sort.slice(gmoeny_sort.length - 1)
										let good_time_index = bardata.findIndex((time,index)=>{ 
											if(time == good_money){
												return index
											}
										})
										this.getAccessData.busiMoney = bartime[good_time_index]
										
										//到店人数最多的那小时是
										let gperson_sort = barperson.sort()
										let good_person = gperson_sort.slice(gmoeny_sort.length - 1)					
										let good_person_index = barperson.findIndex((time,index)=>{ 
											if(time == good_person){
												return index
											}
										})
										this.getAccessData.busiHour = bartime[good_person_index] 
									}
								}
								
							},500)
						}
					}
				}).catch()	
			},	 
			
		}
	}
</script>

 


<style scoped lang="scss"> 
	 
	.echarts { 
		width: 100%;
		height: 300rpx;
	}
	
	.chart-group{
		padding: 40rpx;
		background-color: #FFFFFF;
		margin-bottom: 20rpx;
		
		.title{ 
			color: #333333;
			padding-bottom: 20rpx;
		}
		.subtitle{
			color: #999999;
			font-size: 26rpx;
			display: flex;
			.case{
				display: flex;
				.red{
					color: #f00;
				}
				.green{
					color: #46B85C;
				}
				
				.black{
					color: #333;
				}
			}
		}
	}  
	 
</style>
