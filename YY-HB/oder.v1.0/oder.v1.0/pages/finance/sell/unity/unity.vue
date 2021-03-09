<template>
	<view>
	<template v-if="isload">
		<default-page :load="true"></default-page>
	</template> 
	<template v-if="isnohave">
		<default-page :nohave="true"></default-page>
	</template>
	
	<template v-if="isready">
	
		<view class="main-wrapper"> 
			<view v-for="(main,index) in userUnityList" :key="'4' + index">  
				<view class="date-title">{{main.time}}</view> 
				<view class="group" v-for="(group,index) in main.data" :key="'7'+index">  
					
					<view class="head">  
						<view class="tit">
							<text class="titIcon iconfont iconstauts-ing"></text> 	 
							<template v-if="group.deliverType !== 2">
								<template v-if="group.orderState == 0"><text class="titTxt">等待接单</text></template>
								<template v-if="group.orderState == 1"><text class="titTxt">订单取货中</text></template>
								<template v-if="group.orderState == 2"><text class="titTxt">订单配送中</text></template>
								<template v-if="group.orderState == 3"><text class="titTxt">订单已完成</text></template> 
							</template>
							<template v-if="group.deliverType == 2">
								<template v-if="group.orderState == 1"><text class="titTxt">订单取货中</text></template>
								<template v-if="group.orderState == 3"><text class="titTxt">订单已完成</text></template> 
							</template>							
						</view>
						<view class="time">{{group.orderTime}}</view>
						</view>
					
						<view class="main">
							<template v-if="group.deliverType !== 2">
								<view class="txt">
									<text>收货人：</text>
									<text>{{group.receiver}}</text>
								</view>
								<view class="txt">
									<text>收货地址：</text>
									<text>{{group.reachAddr}}</text>
								</view>
								<view class="txt">
									<text>送达时间：</text>
									<text>{{group.reachTime}}</text>
								</view>
							</template>
							<view class="txt green">
								<text>配送方式：</text>
								<template v-if="group.deliverType == 0">
									<text>接单中心</text>
								</template>
								<template v-if="group.deliverType == 1">
									<text>商家配送</text>
								</template>
								<template v-if="group.deliverType == 2">
									<text>用户自取</text>
								</template>
								<template v-if="group.deliverType == 3">
									<text>移移</text>
								</template> 
							</view>
						</view>	 
						<view class="foot-btn">
							<view class="price">{{parseFloat(group.realAmt/100).toFixed(2)}}<text class="ant">元</text></view> 
								
							<view class="btn" @click="navTo(group.orderSn)">查看更多</view>
						</view> 							 
				
				</view> 
				 
				
			</view>				 
			
		</view>
		
		<view class="lodingMore" v-if="!Nothing">{{loadmore}}</view>
	
	</template>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii, arrayExclude,} from '@/common/util/utils.js'
	
	import DefaultPage from '@/components/basic/default-page.vue'	
	export default {
		data() {
			return {
				loginWhether:'',//登陆状态 
				merchNo:'', //商户号 
				mainUserList:[], 
				pages:1,
				loadmore:'上拉加载更多',
				payState:'',
				Nothing:false,
				isload:true, 
				isnohave:false,
				isready:false,
			}
		},
		onLoad() { 		 
			this.loginWhether = uni.getStorageSync('status')  
			this.merchNo = uni.getStorageSync('user').merchNo		
			
			this.getUserOrder()
		}, 
		components:{
			DefaultPage
		}, 
		computed:{
			...mapState(['userUnityList'],)
		},
		methods: {
			getUserOrder(){
				if(this.merchNo=='35110000000000'){
					let testData = [{
						"data":[{
								"couponAmt": 0,
								"deliverType": 2,
								"discountAmt": "Object",
								"issuerType": 0,
								"orderNo": 3.5020320500000006e+17,
								"orderSn": "350203205000000071",
								"orderState": 1,
								"orderTime": "02:20",
								"reachAddr": "",
								"reachTime": "0000-00-00 00:00:00",
								"realAmt": 300,
								"recPhone": "",
								"receiver": "",
								"sex": "1"
							}
						],
						"time": "2021-03-05"
					},{
						"data": [{
								"couponAmt": 0,
								"deliverType": 2,
								"discountAmt": "Object",
								"issuerType": 0,
								"orderNo": 3.5020320400000006e+17,
								"orderSn": "350203204000000068",
								"orderState": 1,
								"orderTime": "02:42",
								"reachAddr": "",
								"reachTime": "0000-00-00 00:00:00",
								"realAmt": 300,
								"recPhone": "",
								"receiver": "",
								"sex": "1"
							},
							{
								"couponAmt": 0,
								"deliverType": 2,
								"discountAmt": "Object",
								"issuerType": 0,
								"orderNo": 3.5020320400000006e+17,
								"orderSn": "350203204000000065",
								"orderState": 1,
								"orderTime": "02:39",
								"reachAddr": "",
								"reachTime": "0000-00-00 00:00:00",
								"realAmt": 300,
								"recPhone": "",
								"receiver": "",
								"sex": "1"
							}
						],
						"time": "2021-03-04",
					}]
					
					this.isload = false
					this.isready = true 
					this.$store.dispatch('receive_user_unity_list',testData) 
					this.mainUserList = testData
					this.loadmore = '没有更多了'
					this.Nothing = false
					return
				}
				let vVlue = {"merchNo":this.merchNo,"orderType":1,"pageNum":'1',"pageLimt":"20",} //必传
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 
						 
				this.$request.post('getUserOrder',{
					...vVlue, 
					"sign": sSign,
				},{
					token:true
				}).then(res => { 
					this.$api.initPage(res.code,res.message) 
					if(res.code == 200){ 
						setTimeout(()=>{
							if(res.data.length){
								this.isload = false
								this.isready = true 
								this.$store.dispatch('receive_user_unity_list',res.data) 
								this.mainUserList = res.data								
							}else{
								this.isload = false
								this.isnohave = true	
								this.Nothing = true 
								this.loadmore = '没有更多了'
							} 		
							this.Nothing = false		
						},300) 
					} 		
				}).catch()  	
			},
			
			onReachBottom(){
				let initPages = this.pages+1
				let morePages = initPages++
				this.pages = morePages 
				
				let vVlue = {"merchNo":this.merchNo,"orderType":1,"pageNum":this.pages,"pageLimt":"20",} //必传 
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 
				
				if(this.loadmore == '上拉加载更多'){	
					uni.showLoading({
						title:'加载更多',
						mask:true
					})			
					this.$request.post('getUserOrder',{
						...vVlue, 
						"sign": sSign
					},{
						token:true
					}).then(res => {  
						this.$api.initPage(res.code,res.message)
						if(res.code == 200 ){					
							this.mainUserList = [...this.mainUserList,...res.data]
							if(res.data.length){ 
								//---------合并重复日期start
								let prev_load = this.userUnityList
								let end_load = this.mainUserList
								const one = prev_load[prev_load.length-1] 
								const mmm = end_load.findIndex((val,index)=>one.time === val.time)
								let two = []  							
								two = end_load[mmm+1].data 
								for(let item of two){ 
								   end_load[mmm].data.push(item)
								} 
								this.mainUserList.splice(mmm+1,1) 
								//---------合并重复日期end 
								
								this.$store.dispatch('receive_user_unity_list',this.mainUserList)
								setTimeout(()=>{											
									uni.hideLoading() 
									const totNums = res.data.reduce((preTotal,food,index,arry) => preTotal + food.data.length,0)
									const allNums = this.mainUserList.reduce((preTotal,food,index,arry) => preTotal + food.data.length,0) 
									this.loadmore = totNums.length < 20 ? '没有更多了' : '上拉加载更多' 
								},500)
							}else{							
								uni.hideLoading()
								this.pages--  
								this.loadmore = '没有更多了'
							}
						} 
					}).catch(err=>{ 		
						uni.hideLoading() 
						this.page--; 
					}) 
				}
			},
			navTo(orderSn) {
				uni.navigateTo({ 
					url:'./unity_detail?orderNo='+ orderSn					
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	
	.main-wrapper{
		width: 100vw;
		padding: 20rpx;
		
		.Nothing{
			height: 200rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #999999;
			font-size: 38rpx;
			padding: 80rpx; 
		}
		
		.date-title{
			padding: 0 10rpx 20rpx 10rpx;
		}
		
		.group{			
			padding: 0 32rpx;
			border-radius: 12rpx;
			background-color: #FFFFFF;
			margin-bottom: 32rpx;
			
			.head{
				border-bottom: 1rpx solid #d4d4d4;
				padding: 16rpx 0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				.tit{
					font-size: 30rpx;
					display: flex;
					align-items: center;
					
					.titIcon{
						font-size: 32rpx;
						color: #46B85B;
					}
					.titTxt{
						
					}
				}
				.time{
					font-size: 22rpx;
				}
				}
			
			.main{
				padding: 32rpx 0;
				font-size: 26rpx;
				.txt{ 
					padding: 8rpx;
				}
				.green{
					color: #46B85B;
				}
				
			}
			
		}
			.foot-btn{
				padding: 20rpx;
				border-top: 1px solid #d4d4d4;
				display: flex;
				justify-content: space-between;
				.price{
					font-size: 50rpx;
					.ant{
						font-size: 26rpx;
					}
				}
				.btn{
					background-color: #46B85B;
					color: #FFFFFF;
					width: 180rpx;
					height: 60rpx;
					text-align: center;
					line-height: 60rpx;
					border-radius: 12rpx;
					font-size: 26rpx;
				}				
			}
	}
		
	.lodingMore{
		text-align: center;
		color: #999999;
	}
</style>
