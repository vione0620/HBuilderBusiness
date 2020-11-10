<template>
	<view>
		<template v-if="isload">
			<default-page :load="true"></default-page>
		</template>
		
		<template v-if="isready"> 
	
	<view class="ourEntry">
		<view class="main-wrapper">
			<view class="title">
				<view class="days">{{showOneDay}}</view>
				<view class="checkDays" @click="getToDayEntry">选择日期</view> 
			</view>
			<template v-if="Nothing"> 
				<view class="count">
					<view class="tit">今日收入</view>
					<view class="totol">0<text class="ant">元</text></view>
				</view>
			</template>
			<template v-if="!Nothing">
				<view v-for="(group,index) in entryList" :key="'4'+index">
					<view class="count">
						<view class="tit">今日收入</view>
						<view class="totol">{{parseFloat(group.recAmt/100).toFixed(2)}}<text class="ant">元</text></view>
					</view>
					<view class="entry-list">
						<block v-for="(userItem,index) in userlist">
							<view class="group">  
								<view class="">{{userItem.createTime.slice(10)}}</view>
								<view class="price">{{parseFloat(userItem.profitAmt/100).toFixed(2)}}元</view>
							</view> 
						</block> 
					</view>
				</view>
			</template>
		</view>
					
		
		<view class="lodingMore">{{loadmore}}</view>
		
		<uni-popup ref="isDaysOfMonth" type="bottom"> 
			<uni-calendar :endDate="showOneDay" :insert="true" :clearDate="false" @confirm="choseDay" />		
		 </uni-popup>
	</view>
	
	
	</template>
	
	
	</view>

</template>

<script>
	import {b64Md5,hexMD5} from '@/network/md5.js'	
	import {getSortAscii,handleDate,} from '@/common/util/utils.js' 
	
	import UniPopup from '@/components/uni/uni-popup.vue'
	import UniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	import DefaultPage from '@/components/basic/default-page.vue'	
	export default {
		components:{
			UniPopup,
			UniCalendar,
			DefaultPage, 
		},
		data() {
			return { 
				entryList:[],
				entryContList:[],
				// busiDate:'',
				pages:1,
				userlist:[],
				loadmore:'上拉加载更多', 
				loginWhether:'',//登陆状态 
				merchNo:'', //商户号
				showOneDay:'',
				Nothing:true,
				isload:true,
				isready:false,
			}
		},
		onLoad() { 
			this.loginWhether = uni.getStorageSync('status')  
			this.merchNo = uni.getStorageSync('user').merchNo		 
			this.showOneDay = handleDate()
			
			this.getProfitRecord('getProfitRecord',this.showOneDay,this.pages)
		}, 
		methods: { 
			getToDayEntry(){  
				this.$refs.isDaysOfMonth.open() 
			},
			choseDay(e) { 				 
				this.showOneDay = e.fulldate 
				this.getProfitRecord('getProfitRecord',e.fulldate,this.pages)
				this.$refs.isDaysOfMonth.close() 
			},
			getProfitRecord(post,time,pages){
				// let timeday = handleDate()
				let vVlue = {"merchNo":this.merchNo,"pageNum":pages,"txnDate":time,"pageLimt":'20',} //必传 
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 		  
				this.$request.post(post,{
					...vVlue,
					"sign": sSign
				},{
					token:true
				}).then(res => {
					this.$api.initPage(res.code,res.message)					
					let resData = res.data			
							
					if(res.code === 200){ 						
						
						setTimeout(()=>{
							this.isload = false
							this.isready = true
							
							if(resData.length){
								this.Nothing = false
								this.entryList = resData							
								this.userlist = resData[0].txn
								this.loadmore  = resData[0].txn.length < 20 ? '没有更多了' : '上拉加载更多'
							}else{
								this.Nothing = true 
								this.loadmore  = '没有更多了'	
							}  	 		 
						},300) 
					} 								
				}).catch() 
			},
			
			onReachBottom(){ 
				let initPages = this.pages+1
				let morePages = initPages++
				this.pages = morePages 				 	 
				let vVlue = {"merchNo":this.merchNo,"pageNum":this.pages,"txnDate":this.showOneDay,"pageLimt":'20',} //必传  
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 	 
				
				if(this.loadmore == '上拉加载更多'){		
					uni.showLoading({
						title:'加载更多',
						mask:true
					})			
					this.$request.post('getProfitRecord',{
						...vVlue, 
						"sign": sSign, 
					},{
						token:true
					}).then(res => {  
						this.$api.initPage(res.code,res.message)
						if(res.code === 200){   
							setTimeout(()=>{	
								uni.hideLoading()
								if(res.data.length){			 
										let resData = res.data[0].txn 
										this.userlist = [...this.userlist,...resData]
										this.loadmore  = resData.length < 20 ? '没有更多了' : '上拉加载更多'			  
								}else{		  
									this.pages-- 
									this.loadmore = '没有更多了'
									return
								}	 
							},500)	
						}
					}).catch(err=>{ 
						uni.hideLoading()
						this.pages--
					})   
				}
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	.ourEntry{
		padding: 20rpx;
		width: 100vw;
		.main-wrapper{
			background-color: #FFFFFF;
			padding: 40rpx 40rpx 0 40rpx;
			border-radius: 12rpx; 
			
			.title{
				
				display: flex;
				justify-content: space-between;
				.days{
					font-size: 32rpx;
					color: #333333;
				}
				
				.checkDays{
					color: #46B85B;
				}
			}
			.count{
				padding: 32rpx 0;
				.tit{
					font-size: 38rpx;
					color: #999999;
					padding-bottom: 20rpx;
				}
				.totol{ 
					font-size: 50rpx;
					.ant{
						font-size: 26rpx;
					}
				}
			}
			
			.entry-list{
				
				.group{
					padding: 32rpx 0;
					border-top: 1px dashed #D4D4D4;
					display: flex;
					justify-content: space-between;
					.userInfo{
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.img{
							width: 60rpx;
							height: 60rpx;
							border-radius: 50%;
						}
						.name{
							font-size: 32rpx;
							padding: 0 16rpx;
						}
						.new{
							font-size: 26rpx;
							color: #FF0000;
							border:1px solid #FF0000;
							width: 100rpx;
							height: 44rpx;
							border-radius: 22rpx;
							text-align: center;
							line-height: 44rpx;
						}
					}
					.price{
						font-size: 30rpx;
					}
				}
			}
		
		
		.Nothing{
			height: 200rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #999999;
			font-size: 38rpx;
			padding: 80rpx; 
		}
		
		
		}
		
		.lodingMore{
			padding: 40rpx;
			text-align: center;
			color: #999999;
		}
		
	}
	
	 
	
	
</style>
