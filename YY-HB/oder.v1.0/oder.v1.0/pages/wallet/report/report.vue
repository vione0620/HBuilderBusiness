<template>
	<view id="report">	
		
		<template v-if="isload">
			<default-page :load="true"></default-page>
		</template>
		
		<template v-if="isready"> 
		
			<view class="report-header">
				<view class="timeTag">
					<view class="item" v-for="(item,index) in timeTag" :key="'4'+index"
					:class="tagActive == index ? 'item-active':''" @tap="timeTagClick(index)">{{item}}</view>
				</view>  
					
				<template v-if="tagActive === 0">
					<!-- 日报 2020年09月23日 -->
					<view class="checkDate" @tap="getToDayEntry()">{{showDay}}
						<view class="txt">昨日已结算</view></view>
				</template>
				<template v-if="tagActive === 1">
					<!-- 周报 2020年09月第02周 -->
					<view class="checkDate" @tap="getToWeekEntry()">{{showWeek}}
						<view class="txt">上周已结算{{`(${showWeekUntil})`}}</view>
					</view>
				</template>
				<template v-if="tagActive === 2">
					<!-- 月报 2020年09月 -->
					<view class="checkDate" @tap="getToMonthEntry()">{{showMonth}}
						<view class="txt">上月已结算</view></view>
				</template>
				
			</view>
		
			<view class="report-part">
				
				<view class="main">
					<view class="money">	
						<view class="txt">
							<view class="tit">实收金额</view>
							<view class="nums">
							{{parseFloat(reportPart.totalRecAmt / 100).toFixed(2)}}
							<text class="tit">&nbsp;元</text></view>
						</view>
					</view>
				</view>		
					
				<view class="totalized">
					<view class="group">
						<view class="txt"><view class="tit">总人数</view>
						<text class="nums">
						{{reportPart.payCustomerNum}}
						</text>&nbsp;人</view>
						<view class="txt"><view class="tit">总笔数</view>
						<text class="nums">
						{{reportPart.payOrderNum}}
						</text>&nbsp;笔</view>    
					</view> 
					<view class="group"> 
						<view class="txt"><view class="tit">非会员交易金额</view><text class="nums">
						{{parseFloat(reportPart.annoPayAmt / 100).toFixed(2)}}
						</text>&nbsp;元</view>
						<view class="txt"><view class="tit">非会员交易笔数</view><text class="nums">
						{{reportPart.annoOrderNum}}
						</text>&nbsp;笔</view>
					</view> 
					<view class="item">
						<view class="txt"><view class="tit">会员交易金额</view><text class="nums">
						{{parseFloat(reportPart.memberPayAmt / 100).toFixed(2)}}
						</text>&nbsp;元</view>
						<view class="txt"><view class="tit">会员交易笔数</view><text class="nums">
						{{reportPart.memberOrderNum}}
						</text>&nbsp;笔</view>
						<view class="txt"><view class="tit">会员优惠金额</view><text class="nums">
						{{parseFloat(reportPart.totalDiscountAmt / 100).toFixed(2)}}
						</text>&nbsp;元</view>
					</view>
				</view> 
				
			</view>
		
			<view class="showCharts" id="open-more" @tap="openMore()">{{showCharts ? '收起列表' : '打开列表'}} 
			<text class="iconfont" :class="showCharts ? 'iconup' : 'icondown'"></text>
			</view>
			<view class="report-charts" id="open-more" v-if="showCharts">
				
				<template v-if="tagActive === 0">
					<chart-daliys :chartTime="p_day"></chart-daliys>
				</template>
				<template v-if="tagActive === 1">
					<chart-weeks :chartTime="p_week"></chart-weeks>
				</template>
				<template v-if="tagActive === 2">
					<chart-months :chartTime="p_month"></chart-months>
				</template> 
			</view>
			
			<uni-popup ref="isDaysOfMonth" type="bottom"> 
				<uni-calendar :endDate="showDay" :insert="true" :clearDate="false" @confirm="choseDay" :yesterday="true" />		
			 </uni-popup>
			<uni-popup ref="isWeekOfYear" type="bottom">
				<rk-weekofyear @tap="changeWeek" :is_child_week="is_child_week"></rk-weekofyear>
			</uni-popup>		 
			
			<uni-popup ref="isMonthOfYear" type="bottom">
				<rk-monthofyear @tap="choseMonth"></rk-monthofyear>
			</uni-popup>
		
		</template>
	</view>
</template>

<script>
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii,handleDate,foramtHanzi} from '@/common/util/utils.js'	
	import {handleDays,handleWeekDays,handleYear,handleWeek,handleMonth,m_month_week,} from '@/network/daliy.js'
	
	import UniPopup from '@/components/uni/uni-popup.vue'
	import UniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	
	import DefaultPage from '@/components/basic/default-page.vue'	
	
	import RkWeekofyear from '@/components/rk-datetime/rk-weekofyear.vue'
	import RkMonthofyear from '@/components/rk-datetime/rk-month.vue'	
	import ChartDaliys from '@/components/rk-datetime/chart-daliys.vue'
	import ChartWeeks from '@/components/rk-datetime/chart-weeks.vue'
	import ChartMonths from '@/components/rk-datetime/chart-months.vue'		
	export default {
		data() {
			return {
				//初始化组件
				timeTag:['日报','周报','月报'],
				tagActive:0,	
				showDay:'',//日报
				p_day:'',
				showWeek:'',//周报
				p_week:'',
				is_child_week:'',//父传子第几周
				showWeekUntil:'',//显示周间
				showMonth:'',//月报
				p_month:'',
				//初始化展示
				loginWhether:'',//登陆状态
				merchNo:'', //商户号 
				//文字展示部分
				reportPart:[],
				//图表展示
				showCharts:false, 
				isload:true,
				isready:false, 				
			}
		},
		components:{
			DefaultPage,
			UniPopup,
			UniCalendar,
			RkWeekofyear,
			RkMonthofyear,
			ChartDaliys,
			ChartWeeks,
			ChartMonths,
		},
		onLoad() {			 
			this.loginWhether = uni.getStorageSync('status')  
			this.merchNo = uni.getStorageSync('user').merchNo
			this.initDate()
			//日报
			this.getBusiDay(this.p_day,'getBusiDay','busiDay')	
						// console.log(this.p_day,'p_dayp_dayp_dayp_day')		 
		},
		methods:{
			openMore(){
				this.showCharts = !this.showCharts 				
				
				let totheTop = 0
				const query = uni.createSelectorQuery().in(this);				
				query.select('#open-more').boundingClientRect(data => { 
				  totheTop = data.top
				}).exec(); 
				
				if(this.showCharts){ 
					 this.$nextTick(()=> {
						uni.pageScrollTo({
							scrollTop: totheTop,   
						});
					 });
				}
			}, 
			timeTagClick(index){
				this.tagActive = index; 			
				switch (index){
					case 0:    
						this.getBusiDay(this.p_day,'getBusiDay','busiDay') 
						console.log(this.p_day,'p_dayp_dayp_dayp_day')
						break;
					case 1:   
						this.getBusiDay(this.p_week,'getBusiWeek','busiWeek')
						console.log(this.p_week,'dfhjafhjhfjadhflashfdl')
						break;
					case 2:   
						this.getBusiDay(this.p_month,'getBusiMonth','busiMonth')	
						console.log(this.p_month,'p_monthp_monthp_monthp_monthp_month')				
						break;
				} 
			},
			//日报选择
			getToDayEntry() {
				this.$refs.isDaysOfMonth.open() 
			},
			//日报读取
			choseDay(e) {			 
				let d = `${e.fulldate} 日`
				let y = d.replace('-',` 年 `)  
				let end = y.replace('-',` 月 `) 
				this.showDay = end    
				this.p_day = e.fulldate
				this.getBusiDay(this.p_day,'getBusiDay','busiDay')
				this.$refs.isDaysOfMonth.close()
			},
			//apiapiapiapi--------apiapiapiapi
			getBusiDay(time,post,parms){ 
				let vVlue = {}
				if(parms === 'busiDay'){
					vVlue = {"merchNo":this.merchNo,"busiDay":time,} //必传					
				}else if(parms === 'busiWeek'){
					vVlue = {"merchNo":this.merchNo,"busiWeek":time,} //必传					
				}else if(parms === 'busiMonth'){
					vVlue = {"merchNo":this.merchNo,"busiMonth":time,} //必传					
				} 
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post(post,{
					...vVlue,
					"sign":sSign,
				},{token:true}).then(res=>{  
					// console.log(res)
					this.$api.initPage(res.code,res.message)
					if(res.code === 200){  
						this.staticIncome(res.data)		 
					} 
				}).catch()
				
			},
			staticIncome(resData){
				setTimeout(()=>{ 
					if(!resData){  
						let initRes = { 
							merchNo: '',
							busiDate: handleDays(),
							totalRecAmt: 0,
							totalDiscountAmt: 0,
							payOrderNum: 0,
							payCustomerNum: 0,
							memberPayAmt:0,
							annoPayAmt:0,
							memberOrderNum: 0,
							annoOrderNum:0
						} 
						this.reportPart = initRes 
					}else{ 
						this.reportPart = resData	
					}  		
					this.isload = false
					this.isready = true	 			
				},200)
			},
			//周报选择  
			getToWeekEntry(){
				this.$refs.isWeekOfYear.open()						
			},
			//周报读取
			changeWeek(week){ 
				
				let c_week = `${week.year} 年 ${week.month} 月 第${foramtHanzi(week.week_index)}周`
				this.p_week = `${week.year}${week.month}${Number(week.week_index)}`
				this.showWeek = c_week
				this.showWeekUntil = week.until 
				this.getBusiDay(this.p_week,'getBusiWeek','busiWeek') 
				console.log(this.p_week)
				console.log(c_week)
				setTimeout(()=>{
					this.$refs.isWeekOfYear.close()
				},100)
			}, 
			//月报选择
			getToMonthEntry(){
				this.$refs.isMonthOfYear.open()
			},
			//月报读取
			choseMonth(month){ 
				let c_month = `${month.year} 年 ${month.month} 月`
				this.p_month = `${month.year}${month.month}`
				this.showMonth = c_month 
				if((handleMonth() -1) < (+month.month) && month.year === handleYear()){ 
					return
				}				
				this.getBusiDay(this.p_month,'getBusiMonth','busiMonth')				
				this.$refs.isMonthOfYear.close()
			},
			
			initDate(){
				let year = handleYear()
				let days = handleDays()
				let w_days = handleWeekDays() //周的时候按正常时间算
				let week = handleWeek()
				let month = handleMonth()   
				//日报 
				let d = `${days} 日`
				let y = d.replace('-',` 年 `)  
				let end = y.replace('-',` 月 `)  
				this.showDay = end  
				this.p_day = days 
				//周报				
				let w_y = week.slice(0,4)
				let w_w = this.parseNumber(month)
				
				//本月中的第几周
				let allweek = m_month_week(year) 
				let find_true = ''
				//0.0输入的查询日 	
				let secrch_day = w_days.slice(days.length - 2)
				let secrch_month = w_days.slice(5,7) 	
				 
				//1.本月没有退回上月查询 
				let prev_month = allweek[month - 2]  //一年中的月
				let prev_interval = prev_month.nums_unit  
				//2.先来到本月查询
				let nonce_month = allweek[month - 1]  //一年中的月
				let nonce_interval = nonce_month.nums_unit  
				
				let nonce_month_istrue = nonce_interval.findIndex((item,item_index)=>{
					let item_start_month = item.slice(0,2)
					let item_start = item.slice(3,5)
					let item_end = item.slice(item.length-2)  
					if(+item_end > +item_start){ 
						return +secrch_day >= +item_start && +secrch_day <= +item_end  
					}else if(+item_end < +item_start){ 
						find_true = {
							index:item_index,
							unit:item
						} 
						return find_true
					}
				})    
				//2.2 找到值
				if(nonce_month_istrue === 0){ 
					//2.2.1在本月中找到值 
					find_true = {
						index:prev_month.nums_val,
						unit:prev_interval[prev_interval.length -1]
					}  
					let w_o_m = find_true.index.toString()
					this.showWeek = `${w_y} 年 ${w_w -1} 月 第${foramtHanzi(w_o_m)}周`   
					this.p_week = `${w_y}${this.parseNumber(w_w -1)}${w_o_m}`  
					this.showWeekUntil = find_true.unit 
					this.is_child_week = {
						month:w_w -1,
						week: this.p_week.slice(this.p_week.length-1)
					}
				}else if(nonce_month_istrue === -1){  
					find_true = {
						index:prev_month.nums_val -1,
						unit:prev_interval[prev_interval.length -2]
					} 
					let w_o_m = find_true.index.toString()
					this.showWeek = `${w_y} 年 ${w_w -1} 月 第${foramtHanzi(w_o_m)}周`   
					this.p_week = `${w_y}${this.parseNumber(w_w -1)}${w_o_m}`  
					this.showWeekUntil = find_true.unit		 
					this.is_child_week = {
						month:w_w -1,
						week: this.p_week.slice(this.p_week.length-1)
					}
				}else if(nonce_month_istrue < nonce_month.nums_val && nonce_month_istrue > 0){ 
					find_true = { 
						index:nonce_month_istrue,
						unit:nonce_interval[nonce_month_istrue -1] 
					}  
					let w_o_m = find_true.index.toString()
					this.showWeek = `${w_y} 年 ${w_w} 月 第${foramtHanzi(w_o_m)}周`   
					this.p_week = `${w_y}${w_w}${w_o_m}`  
					this.showWeekUntil = find_true.unit
				
					this.is_child_week = {
						month:w_w,
						week:find_true.index 
					} 
					
				} 
				// 年报
				this.showMonth = `${year} 年 ${this.parseNumber(w_w - 1)} 月` 
				this.p_month = `${year}${this.parseNumber(month - 1)}` 
			},
			parseNumber(num) {
				return num < 10 ? "0" + num : num;
			},
			
		},
	}
	
	
	
</script>

<style lang="scss">
	#report{
		width: 100vw;
		
		.report-header {
			background-color: #FFFFFF;
			padding: 20rpx; 
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.timeTag {
			
				display: flex;
				background-color: #f2f2f2;
				padding: 16rpx;
				height: 60rpx;
				align-items: center;
				border-radius: 8rpx;
			
				.item {
					border-left: 1px solid #d2d2d2;
					color: #333333;
					font-size: 30rpx;
					padding: 0 20rpx;
					flex: 1;
				}
			
				.item-active {
					color: #46B85B;
				}
			
				.item:first-child {
					border-left: 0;
				}
			}
			
			.checkDate{
				text-align: right;
				font-size: 30rpx;
				.txt{
					font-size: 22rpx; 
				}
			}
		}
		
		
		.report-part{
			
			
			
			.main {
				background-color: #FFFFFF; 
				margin-bottom: 20rpx;
				
				.money {
					padding: 40rpx 0;
					display: flex;
					justify-content: center;
					align-items: center;
				
					.txt {
						text-align: center;
				
						.tit {
							font-size: 30rpx;
							color: #666666;
							padding-bottom: 20rpx;
						}
				
						.nums {
							font-size: 80rpx;
						}
				
					}
				}
			}
			
			
			.totalized {
				
				background-color: #FFFFFF;
				padding: 40rpx 0;
				width: 100%;
				
				.group {
					width: 100%;
					display: flex;
					margin-bottom: 40rpx;
				
					.txt {
						flex: 1;
						text-align: center;
						font-size: 30rpx;
						margin-bottom: 6px;
				
						.tit {
							color: #666666;
							padding-bottom: 40rpx;
						}
				
						.nums {
							color: #333333;
							font-size: 30rpx;
							font-weight: 700;
						}
					}
				
					.txt:first-child {
						border-right: 1px solid #d4d4d4;
					}
				}
				
				.item {
					width: 100%;
					display: flex;
					font-size: 30rpx;
				
					.txt {
						flex: 3;
						text-align: center;
						color: #666666;
						border-right: 1px solid #d4d4d4;
				
						.tit {
							color: #666666;
							padding-bottom: 40rpx;
						}
				
						.nums {
							color: #333333;
							font-size: 30rpx;
							font-weight: 700;
						}
					}
				
					.txt:last-child {
						border: 0;
					}
				
				}
			}
		}
		
		
		
		.showCharts {
			margin-top: 20rpx;
			width: 100%;
			background-color: #FFFFFF;
			padding: 20rpx;
			text-align: center;
			font-size: 30rpx;
			border-bottom: 1px solid #f8f8f8;
		}
		
		
		
	}
	
</style> 