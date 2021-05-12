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
							<template v-if="group.applyRefundState == 0">
								<template v-if="group.orderExcept ==0">
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
								</template>
								<template v-if="group.orderExcept == 1">
									<text class="titTxt">订单异常</text>
								</template>
							</template>
							<template v-if="group.applyRefundState == 1">
								<text class="titTxt">退款订单</text>
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
							<view class="btn print" @click="printOrder(group.orderSn)">打印小票</view>
							<view class="btn" @click="navTo(group.orderSn)">查看更多</view>
						</view> 							 
				
				</view> 
				 
				
			</view>				 
			
		</view>
		
		<view class="lodingMore" v-if="!Nothing">{{loadmore}}</view>
		<view v-if="!this.blueStatus.status" class="BottomPrompt"  @click="navTob('../../../account/printer/printer')">
			<image src="../../../../static/warning.png" mode="aspectFit"></image>
			<text class="tis">打印机未连接</text>
			<image src="../../../../static/moretis.png" mode="aspectFit"></image>
		</view>
	</template>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii, arrayExclude,changeSpace,plusXing} from '@/common/util/utils.js'
	
	import DefaultPage from '@/components/basic/default-page.vue'	
	import Bluetooth from '@/common/util/bluetooth.js'
	
	let bluetooth = new Bluetooth();
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
				orderList: {},
				blueStatus: {
					status: false,
					text: '未连接'
				},
				devices: [],
			}
		},
		onLoad() { 		 
			this.loginWhether = uni.getStorageSync('status')  
			this.merchNo = uni.getStorageSync('user').merchNo		
			
			this.blueStatus = uni.getStorageSync('blueStatus')
			this.getUserOrder()
			this.onBLEConnection()
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
			printOrder(orderSn){
				this.blueStatus = uni.getStorageSync('blueStatus')
				let bd = uni.getStorageSync('blueDevices')
				if(bd){
					this.devices.push(bd)
				}
				this.getOrderDetail(orderSn).then(()=>{
					if(this.devices && this.blueStatus.status){
						this.senBleLabel()
					} else {
						uni.showToast({
							icon: 'none',
							title: '未连接蓝牙打印机'
						})
					}
				})
			},
			senBleLabel(){
				console.log(this.devices)
				//票据模式
				let deviceId = this.devices[0].deviceId;
				let serviceId = this.devices[0].services[0].serviceId;
				let characteristicId = this.devices[0].services[0].characteristicId;
				
				let merchName = uni.getStorageSync('user').merchName

				let orderNum = getApp().getDay()
				this.orderType()
				let orderInfo = this.orderList
				console.log(this.orderList)
				var command = this.$esc.jpPrinter.createNew()
				command.init()
				
				command.setFontStyle(48)
				command.setSelectJustification(0)
				command.setText('移移生活  #'+orderNum)
				command.setPrint()
				
				command.setFontStyle(0)
				command.setText(merchName)
				command.setPrintAndFeedRow(1)
				
				command.setText("--------------------------------");
				command.setPrint()
				
				command.setText("下单时间："+orderInfo.orderTime);
				command.setPrint()
				
				command.setText("------------商品明细------------");
				command.setPrint()
				
				command.setFontStyle(16)
				orderInfo.content.forEach((item,index) => {
					command.setSelectJustification(0)
					command.setText(item.goodsName)
					command.setPrint()
					
					command.setSelectJustification(2)
					if(item.promotePrice != 0){
						command.setText("原价:"+item.goodsPrice)
						command.setPrintL()
						command.setText("  X"+item.goodsNum+item.goodsUnit+"  "+ (parseFloat(item.goodsNum*item.promotePrice).toFixed(2))+'元')
					} else {
						command.setText("  X"+item.goodsNum+item.goodsUnit+"  "+ (parseFloat(item.goodsNum*item.goodsPrice).toFixed(2))+'元')	
					}
					command.setPrint()
				})
				
				command.setFontStyle(0)
				command.setSelectJustification(0)
				command.setText("------------其它费用------------");
				command.setPrint()
				
				command.setFontStyle(16)
				if(orderInfo.packageFee != 0){
					command.setText(changeSpace('打包费',6,orderInfo.packageFee))
					command.setPrint()
				}
				
				if(orderInfo.deliverFirm==1){
					command.setText(changeSpace('配送费(达达配送)',16,orderInfo.orderFee))
				} else if(orderInfo.deliverFirm==2) {
					command.setText(changeSpace('配送费(顺丰配送)',16,orderInfo.orderFee))
				} else if(orderInfo.deliverFirm==3) {
					command.setText(changeSpace('配送费(蜂鸟配送)',16,orderInfo.orderFee))
				}
				command.setPrint()
				
				if(orderInfo.couponAmt != 0){
					command.setText(changeSpace('红包/优惠券',11,("-"+orderInfo.couponAmt)))
					command.setPrint()
				}
				
				command.setFontStyle(0)
				command.setText("--------------------------------");
				command.setPrint()
				
				command.setFontStyle(16)
				command.setText(changeSpace('订单金额',8,orderInfo.orderAmt))
				command.setPrint()
				
				command.setFontStyle(0)
				command.setText("--------------------------------");
				command.setPrint()
				
				command.setFontStyle(16)
				command.setText(changeSpace('实付金额',8,orderInfo.realAmt))
				command.setPrint()
				
				command.setFontStyle(0)
				command.setText("--------------------------------");
				command.setPrint()
				
				command.setFontStyle(48)
				if(orderInfo.deliverType == 2){
					command.setText('到店自取')
				}else{
					command.setText(orderInfo.reachAddr)
				}
				command.setPrint()
				
				command.setText(plusXing(orderInfo.receiver,1,0))
				command.setPrintAndFeedRow(1)
				
				command.setText(plusXing(orderInfo.recPhone,3,4))
				command.setPrint()
				
				if(orderInfo.remark){
					command.setText('备注：'+orderInfo.remark)
					command.setPrint()
				}
				
				command.setFontStyle(0)
				command.setText("订单编号："+orderInfo.orderSn);
				command.setPrint()
			
				command.setText("--------------------------------");
				command.setPrint()
				
				command.setSelectJustification(1)
				command.setText('商品如有问题请联系商家')
				command.setPrint()
				command.setText(orderInfo.merchContactPhone)
				command.setPrint()
				
				command.setText('移移平台客服电话')
				command.setPrint()
				command.setText(orderInfo.serviceContactMobile)
				command.setPrint()
				
				command.setText("--------------------------------");
				command.setPrintAndFeedRow(2)
				
				command.setSelectJustification(1)
				command.setFontStyle(0)
				command.setText("*********");
				command.setPrintL()
				command.setFontStyle(48)
				command.setText('#'+orderNum+'完');
				command.setPrintL()
				command.setFontStyle(0)
				command.setText("*********");
				command.setPrint()
				command.setPrintAndFeedRow(6)
				
				bluetooth.senBlData(deviceId, serviceId, characteristicId,command.getData())
			},
			getOrderDetail(_orderNo){
				return new Promise((resolve,reject)=>{
					this.loginWhether = uni.getStorageSync('status')
					this.merchNo = uni.getStorageSync('user').merchNo
					this.orderNo = _orderNo
					let vVlue = ''
					vVlue = {"merchNo":this.merchNo,"orderNo":this.orderNo} //必传 
					let sSort = getSortAscii(vVlue) //排序
					let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 	
					this.$request.post('getUserOrderDetail',{
						...vVlue, 
						"sign": sSign
					},{
						token:true
					}).then(res => {
						this.$api.initPage(res.code,res.message)  
						if(res.code == 200){														
							this.orderList = res.data
							resolve()
						}
					}).catch() 
				})
				
			},
			orderType(){
				this.orderList.orderAmt = parseFloat(this.orderList.orderAmt/100).toFixed(2)
				this.orderList.couponAmt = parseFloat(this.orderList.couponAmt/100).toFixed(2)
				this.orderList.discountAmt = parseFloat(this.orderList.discountAmt/100).toFixed(2)
				this.orderList.realAmt = parseFloat(this.orderList.realAmt/100).toFixed(2)
				this.orderList.orderFee = parseFloat(this.orderList.orderFee/100).toFixed(2)
				this.orderList.helpFee = parseFloat(this.orderList.helpFee/100).toFixed(2)
				this.orderList.packageFee = parseFloat(this.orderList.packageFee/100).toFixed(2)
				this.orderList.content.forEach((item,index) => {
					item.goodsPrice = parseFloat(item.goodsPrice/100).toFixed(2)
					item.promotePrice = parseFloat(item.promotePrice/100).toFixed(2)
				})
			},
			onBLEConnection(){
				uni.onBLEConnectionStateChange(res => {
					if(res.connected){
						this.blueStatus.status = true;
						this.blueStatus.text = '已连接';
					} else {
						this.blueStatus.status = false;
						this.blueStatus.text = '未连接';
					}
					uni.setStorageSync('blueStatus',this.blueStatus)
				})
			},
			navTob(path){
				uni.navigateTo({
					url:path,
					animationType: 'pop-in',
					animationDuration: 200
				});
			}
		},
	}
</script>

<style lang="scss" scoped>
	.BottomPrompt{
		display: flex;
		justify-content: space-between;
		width: 100%;
		position: fixed;
		bottom: 0;
		background: #FEF7E5;
		padding: 30rpx 50rpx;
		image{
			width: 42rpx;
			height: 42rpx;
		}
		.tis{
			width: 82%;
			text-align: left;
			color: #FF6600;
			font-size: 28rpx;
			line-height: 42rpx;
		}
	}
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
				.print{
					margin-left: 80rpx;
					background-color: #FFFFFF;
					color: #46B85B;
					border: 1px solid #46B85B;
				}
			}
	}
		
	.lodingMore{
		text-align: center;
		color: #999999;
	}
</style>
