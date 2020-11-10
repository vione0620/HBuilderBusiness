<template>
	<view class="">
	<template v-if="isload">
		<default-page :load="true"></default-page>
	</template>
	<template v-if="isnohave">
		<default-page :nohave="true"></default-page>
	</template>
	
	<template v-if="isready">
  
		<view class="group" v-for="(group,index) in getMoneyRecord" :key="'4'+index">
			<view class="title">{{group.time}}</view>
			<view class="item-wrap">
				<view class="items" v-for="(item,index) in group.data" :key="'7'+index">
					<view class="left">
						<view class="header" v-if="item.cashType == 1">
							<text class="cont">提现到微信</text>							
							<view class="tips tips-green" v-if="item.cashState === 1">成功</view>
							<view class="tips tips-red" v-if="item.cashState === 2">失败</view>
							<view class="tips tips-green" v-if="item.cashState === 3">处理中</view>
						</view>
						<view class="header" v-if="item.cashType == 2">
							<view class="cont">提现到支付宝</view>
							<view class="tips tips-green" v-if="item.cashState === 1">成功</view>
							<view class="tips tips-red" v-if="item.cashState === 2">失败</view>
							<view class="tips tips-green" v-if="item.cashState === 3">处理中</view>
						</view>
						<view class="header" v-if="item.cashType == 3">
							<text class="cont">提现到银行卡</text>							
							<view class="tips tips-green" v-if="item.cashState === 1">成功</view>
							<view class="tips tips-red" v-if="item.cashState === 2">失败</view>
							<view class="tips tips-green" v-if="item.cashState === 3">处理中</view>
						</view> 
						<view class="time">{{item.cashDate}} {{item.cashTime}}</view>
						<view class="info" v-if="item.remark">原因：{{item.remark}}</view>
					</view>
					<view class="right">{{parseFloat(item.cashAmt/100).toFixed(2)}} <text class="lab">元</text></view>
				</view>
			</view>			
		</view>
		
		<view class="lodingMore">{{loadmore}}</view>
	</template>
		
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii} from '@/common/util/utils.js'
	
	import DefaultPage from '@/components/basic/default-page.vue'
	export default{
		data(){
			return {
				loginWhether:'',//登陆状态 
				merchNo:'', //商户号
				pages:1,
				isload:true,
				isnohave:false,
				isready:false, 
				loadMoneyRecord:[],//加载
				loadmore:'上拉加载更多',  
			}
		},
		components:{
			DefaultPage
		},
		computed:{
			...mapState(['getMoneyRecord'],)
		},
		onLoad(){ 			
			this.loginWhether = uni.getStorageSync('status') 
			this.merchNo = uni.getStorageSync('user').merchNo		
			
			this.getMerchCash()			 
		},
		methods:{
			getMerchCash(){ 
				let vVlue = {"merchNo":this.merchNo,"pageNum":'1',"pageLimt":'20',} //必传
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码    
				this.$request.post('getMerchCash',{
					...vVlue,
					"sign":sSign
				},{
					token:true
				}).then(res=>{ 
					if(res.code===200){ 
						setTimeout(()=>{ 
							if(res.data.length){
								this.isload = false  
								this.isready = true
								this.loadMoneyRecord = res.data
								this.$store.dispatch('receive_get_money_record',this.loadMoneyRecord)
							}else{
								this.isload = false
								this.isnohave = true  
							} 
						},300) 
					} 
				})  
			},
			onReachBottom(){
				let initPages = this.pages+1
				let morePages = initPages++
				this.pages = morePages 				 	  
				
				let vVlue = {"merchNo":this.merchNo,"pageNum":this.pages,"pageLimt":'20',} //必传
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 	   
				if(this.loadmore == '上拉加载更多'){		
					uni.showLoading({
						title:'加载更多',
						mask:true
					})			
					this.$request.post('getMerchCash',{
						...vVlue, 
						"sign": sSign, 
					},{
						token:true
					}).then(res => {   
						this.$api.initPage(res.code,res.message) 
						if(res.code === 200 && res.data.length){ 
							this.loadMoneyRecord = [...this.loadMoneyRecord,...res.data] 
							//---------合并重复日期start
							let prev_load = this.getMoneyRecord
							let end_load = this.loadMoneyRecord
							const one = prev_load[prev_load.length-1]  
							const mmm = end_load.findIndex((val,index)=>one.time === val.time) 
							let two = []  							
							two = end_load[mmm+1].data 
							for(let item of two){ 
							   end_load[mmm].data.push(item)
							} 
							this.loadMoneyRecord.splice(mmm+1,1)  
							//---------合并重复日期end 
							
							this.$store.dispatch('receive_get_money_record',this.loadMoneyRecord) 
							setTimeout(()=>{	 
								uni.hideLoading()  
								const totNums = res.data.reduce((preTotal,food,index,arry) => preTotal + food.data.length,0)
								const allNums = this.loadMoneyRecord.reduce((preTotal,food,index,arry) => preTotal + food.data.length,0) 
								this.loadmore = totNums.length < 20 ? '没有更多了' : '上拉加载更多' 
							},500)	
						}else{
							setTimeout(()=>{
								uni.hideLoading()  
								this.loadmore = '没有更多了' 
							},500)
							
						}
					}).catch(err=>{ 
						uni.hideLoading()
						this.pages--
						this.loadmore = '没有更多了'  
					})   
				}
				
			}, 
		
		}, 
	}
</script>

<style scoped lang="scss">
	page{
		width: 100vw;
	.red{
		color: #FF0000;
	}
	.group{
		width: 100vw;
		padding: 20rpx;
		
		.title{
			font-size: 30rpx;
			color: #777777;			
			padding-bottom: 16rpx;
		}
		.item-wrap{
			width: 100%;
			.items{
				border-radius: 8rpx;
				padding: 40rpx;
				display: flex;
				justify-content: space-between;
				align-items: flex-start; 
				margin-bottom: 20rpx;
				background-color: #FFFFFF;
				
				.left{
					.header{
						display: flex; 
						align-items: flex-start;
						
						.cont{
							font-size: 36rpx;
							color: #333333; 							
						}
						.tips{
							margin-left: 8rpx;
							font-size: 22rpx;
							vertical-align: center; 
							padding: 4rpx;
							border-radius: 6rpx;							
						}
						.tips-red{
							border: 1px solid #FF0000;
							color: #FF0000;
						}
						.tips-green{
							border: 1px solid #46B85C;
							color: #46B85C;
						}
					}
					.time{
						color: #999999;
						font-size: 22rpx;
					}
					.info{
						padding-top: 14rpx;
						color: #FF0000;
					}
				
				}
				
				.right{
					font-size: 36rpx;
				}
				
			}
			&last-child{
				border-bottom: 0;
			}
			
			
		}
		
	}
				
	.lodingMore{
		padding: 20rpx;
		text-align: center;
		color: #999999;
	}
	
	}
</style>