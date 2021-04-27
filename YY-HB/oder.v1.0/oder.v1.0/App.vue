<script>   	 
	import {hexMD5} from '@/network/md5.js'	
	import {getSortAscii,changeSpace,plusXing,compare} from '@/common/util/utils.js'
	import Bluetooth from '@/common/util/bluetooth.js'
	
	let bluetooth = new Bluetooth();
	export default {
		onLaunch: function() {
			console.log('App Launch') 	 
			this.$nextTick(() => {     
				// 开启监听推送
				let getPush = []
				let clickPush = [] 
				const bgAudioMannager = uni.getBackgroundAudioManager()
				
				// #ifdef APP-PLUS
				setTimeout(()=>{
					plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
						// console.log(widgetInfo)
						uni.request({
							url: 'http://versionbusi.yiyichina.cn/getVerBusi',
							success: (res) => {
								// console.log(res)
								let data = res.data.data;
								let is_update = data.is_update==1 ? false : true;
								let update_type = data.update_type==1 ? false : true;
								let downurl = data.downurl;
								let wgturl = data.wgturl;
								let str = data.content;
								str = str.split('，')
								let msg = ''
								str.forEach((item,index)=>{
									if(str.length!=index+1){
										msg += item + '\r\n'
									} else {
										msg += item
									}
								})
								if(compare(data.version,widgetInfo.version)){ //对比是否更新
									console.log('升级')
									uni.showModal({
										title: '更新 V' + data.version,
										content: msg,
										cancelText: '取消',
										confirmText: '立即更新',
										showCancel: is_update,
										success: (res) => {
											if(res.confirm){
												if(update_type){
													uni.showToast({
														icon: 'loading',
														title: '开始后台更新资源',
														position: 'bottom'
													})
													let downloadTask = uni.downloadFile({
														url: wgturl,
														success: (downloadResult) => {
															if (downloadResult.statusCode === 200) { 
																plus.runtime.install(downloadResult.tempFilePath,{
																	force: false
																},function(){
																	console.log('install success...');  
																	plus.runtime.restart();  
																},function(e){
																	console.error('install fail...');
																})
															} 
														}
													})
													// downloadTask.onProgressUpdate(res => {
													// 	console.log('下载进度' + res.progress);
													// 	console.log('已经下载的数据长度' + (parseFloat(res.totalBytesWritten/1024/1024).toFixed(2)) + 'MB');
													// 	console.log('预期需要下载的数据总长度' + (parseFloat(res.totalBytesExpectedToWrite/1024/1024).toFixed(2)) + 'MB');
													// })
												} else {
													//整包更新
													if(plus.os.name=='Android'){
														uni.showToast({
															icon: 'loading',
															title: '开始后台下载apk',
															position: 'bottom'
														})
														let downloadTask = uni.downloadFile({
															url: downurl,
															success: (downloadResult) => {
																if (downloadResult.statusCode === 200) { 
																	uni.saveFile({
																		tempFilePath: downloadResult.tempFilePath,
																		success: res => {
																			plus.runtime.install(res.savedFilePath,{
																				force: false
																			},function(){
																				console.log('install success...');  
																			},function(e){
																				console.error('install fail...');
																			})
																		}
																	})
																	
																} 
															}
														})
													} else {
														//ios
														plus.runtime.launchApplication({
															action: 'http://itunes.apple.com/us/app/id1527720616',
														})
													}
												}
											}
										}
									})
								}
							}
						})
					})
				},3000)
				plus.push.addEventListener('click', res => {   
					
					// clickPush.push(res.payload)
					// uni.setStorageSync('click_pushMsg',{clickPush})  
					
					let msg_payload = JSON.parse(res.payload)   
					let navto_notifytype = msg_payload.notifyType  
					let navto_action = msg_payload.extendParam.msg_action
					let navto_pushno = msg_payload.extendParam.msg_external_param 
					 
					if(navto_notifytype == 6 && navto_action == 0){
						// 跳转代收详情?pushNo=
						uni.navigateTo({
							url:'/pages/finance/agent/agent_detail?pushNo=' + navto_pushno,
						}) 
					}
					if(navto_notifytype == 4 && navto_action == 1){ 
						// 用户订单详情 ?pushNo=
						uni.navigateTo({
							url:'/pages/finance/sell/unity/unity_detail?pushNo=' + navto_pushno , 
						}) 
					}  
				});
				plus.push.addEventListener('receive', res => {  					
					let res_payload = res.payload 
					//缓存推送消息
					getPush.push(res_payload)					 
					uni.setStorageSync('receive_pushMsg',getPush)
				
					let platform = uni.getSystemInfoSync().platform
					if(platform == "android"){ 
						
						//定义Android创建消息内容
						let msg_payload = JSON.parse(res.payload)
						let create_title = msg_payload.title
						let create_content = msg_payload.content 	
						plus.push.createMessage(create_content,res.payload,{"title":create_title,"sound":"none"})  
						
						//创建语音播报
						let navto_notifytype = msg_payload.notifyType  
						let navto_action = msg_payload.extendParam.msg_action
						let navto_pushno = msg_payload.extendParam.msg_external_param 		
						
						//播报文件
						if(navto_notifytype == 6 && navto_action == 0){ 
							
							bgAudioMannager.src = 'static/direct_order.wav' 	
							if(bgAudioMannager.src === 'static/direct_order.wav'){							
								bgAudioMannager.play()
							}				  
						}
						if(navto_notifytype == 4 && navto_action == 1){ 
							
							bgAudioMannager.src = 'static/user_order.wav'
							if(bgAudioMannager.src === 'static/user_order.wav'){							
								bgAudioMannager.play()
							}
							this.getOrderDetail(navto_pushno)
							if(this.devices && this.blueStatus.status){
								setTimeout(()=>{
									this.senBleLabel()
								},1000)
							}
						}
					}else {
						
						//创建语音播报
						let navto_notifytype = res_payload.notifyType  
						let navto_action = res_payload.extendParam.msg_action
						let navto_pushno = res_payload.extendParam.msg_external_param 		
						
						plus.push.createMessage(res.payload.content,res.payload,{"title":res.payload.title,"sound":"none"})
						
						//播报文件
						if(navto_notifytype == 6 && navto_action == 0){ 
							
							bgAudioMannager.src = 'static/direct_order.wav' 	
							if(bgAudioMannager.src === 'static/direct_order.wav'){							
								bgAudioMannager.play()
							}				  
						}
						if(navto_notifytype == 4 && navto_action == 1){ 
							bgAudioMannager.src = 'static/user_order.wav'
							if(bgAudioMannager.src === 'static/user_order.wav'){							
								bgAudioMannager.play()
							}
							this.getOrderDetail(navto_pushno)
							if(this.devices && this.blueStatus.status){
								setTimeout(()=>{
									this.senBleLabel()
								},1000)
							}
						}
						
					}
				})
				// setTimeout(()=>{
				// 	let res={"title":"订单已送达","content":"您对本次购物是否满意","notifyType":"4","extendParam":{"msg_action":"1","msg_external_param":"350203316000000077"}}
				// 	let navto_notifytype = res.notifyType
				// 	let navto_action = res.extendParam.msg_action
				// 	let navto_pushno = res.extendParam.msg_external_param
				// 	plus.push.createMessage(res.content,res,{"title":res.title,"sound":"none"})
				// 	if(navto_notifytype == 6 && navto_action == 0){
						
				// 		bgAudioMannager.src = 'static/direct_order.wav' 	
				// 		if(bgAudioMannager.src === 'static/direct_order.wav'){							
				// 			bgAudioMannager.play()
				// 		}				  
				// 	}
				// 	if(navto_notifytype == 4 && navto_action == 1){ 
				// 		bgAudioMannager.src = 'static/user_order.wav'
				// 		if(bgAudioMannager.src === 'static/user_order.wav'){							
				// 			bgAudioMannager.play()
				// 		}
				// 		this.getOrderDetail(navto_pushno)
				// 		if(this.devices && this.blueStatus.status){
				// 			setTimeout(()=>{
				// 				this.senBleLabel()
				// 			},1000)
				// 		}
				// 	}
				// },10000)
				// #endif
			})
			this.blueInit()
			this.onBLEConnection()
			this.initDay() //初始化日期
			this.setVolume()
			// this.switchBluetooth()
		}, 
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		data(){
			return{
				loginWhether:'',//登陆状态
				merchNo:'', //商户号 
				blueStatus: {
					status: false,
					text: '未连接'
				},
				devices: [],
				orderList: {},
				orderNo: '',
			}
		},
		methods: {
			blueInit(){ //初始化内存中蓝牙信息
				this.$store.commit('blueStatus',this.blueStatus)
				let bd = uni.getStorageSync('blueDevices')
				if(bd){
					this.devices.push(bd)
				}
			},
			senBleLabel(){
				//票据模式
				let deviceId = this.devices[0].deviceId;
				let serviceId = this.devices[0].services[0].serviceId;
				let characteristicId = this.devices[0].services[0].characteristicId;
				// let Qrcode_res = getApp().globalData.image_data
				let merchName = uni.getStorageSync('user').merchName
				let orderNum = this.getDay()
				this.orderType()
				let orderInfo = this.orderList
				var command = this.$esc.jpPrinter.createNew()
				command.init()
				// command.setBitmap(Qrcode_res)
				
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
					console.log(res)
					this.$api.initPage(res.code,res.message)  
					if(res.code == 200){														
						this.orderList = res.data
					}
				}).catch() 
			},
			orderType(){
				// switch(this.orderList.payType){
				// 	case 1: this.$set(this.orderList,'patTypeText','微信');break
				// 	case 2: this.$set(this.orderList,'patTypeText','支付宝');break
				// }
				// switch(this.orderList.deliverType){
				// 	case 0: this.$set(this.orderList,'deliverTypeText','接单中心');break
				// 	case 1: this.$set(this.orderList,'deliverTypeText','商家');break
				// 	case 2: this.$set(this.orderList,'deliverTypeText','自取');break
				// 	case 3: this.$set(this.orderList,'deliverTypeText','移移');break
				// }
				// switch(this.orderList.helpState){
				// 	case 0: this.$set(this.orderList,'helpStateText','否');break
				// 	case 1: this.$set(this.orderList,'helpStateText','是');break
				// }
				// switch(this.orderList.sex){
				// 	case 1: this.$set(this.orderList,'sexText','先生');break
				// 	case 2: this.$set(this.orderList,'sexText','女士');break
				// }
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
					this.blueStatus = JSON.parse(JSON.stringify(this.blueStatus))
					uni.setStorageSync('blueStatus',this.blueStatus)
				})
			},
			initDay(){
				let oldDate = uni.getStorageSync('date')
				let date = new Date()  
				if(!oldDate){
					console.log('初始化日期')
					let order = {
						day: date.getDate(),
						orderNum: 0
					}
					uni.setStorageSync('date',order)
				}
			},
			getDay(){
				let oldDate = uni.getStorageSync('date')
				let date = new Date()
				if(date.getDate() == oldDate.day){
					console.log('日期相同，订单号+1')
					oldDate.orderNum += 1
					uni.setStorageSync('date',oldDate)
				} else {
					console.log('日期不相同，重置订单号')
					let order = {
						day: date.getDate(),
						orderNum: 1
					}
					uni.setStorageSync('date',order)
				}
				let newOrderNum = uni.getStorageSync('date').orderNum
				return newOrderNum
			},
			setVolume(){
				if(uni.getStorageSync('Volume')){
					plus.device.setVolume(1)
				}
			}
		},
		watch: {
			blueStatus: {
				handler(val){
					if(val.status && val.text==='已连接'){
						setTimeout(()=>{
							let bd = uni.getStorageSync('blueDevices')
							if(bd.services){
								this.devices.push(bd)
							}
						},2000)
					} else {
						this.devices = []
					}
				}
			}
		},
		globalData: {
			image_data: {},
			code_data: {}
		}
	}
</script>

<style>
	/*每个页面公共css */  
	   
	@import url("common/style/normalize.css");
	@import url("common/style/base.css");
	@import url("common/style/icon.css"); 
	
	page {
		min-height: 100%;
		display: flex;
		font-size: 16px;
		background-color: #F2F2F2; 
	}
	button.primary {
		background-color: #46B85B;
	}
	::-webkit-scrollbar {
		display: none;  
		width: 0 !important;  
		height: 0 !important;  
		-webkit-appearance: none;  
		background: transparent;  
	}
	uni-checkbox .uni-checkbox-input {
		border-radius: 50% !important;
		border-color: #DDDDDD !important;
		color: #ffffff !important;
	}
	
	uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		border: none !important;
		background: #5DB55F;
		border-color: #5DB55F;
	}
	
	uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked::before {
		width: 20rpx;
		height: 20rpx;
		line-height: 20rpx;
		text-align: center;
		font-size: 28rpx;
		color: #fff;
		background: transparent;
		transform: translate(-70%, -50%) scale(1);
		-webkit-transform: translate(-70%, -50%) scale(1);
	}
	.blueStyle{
		width: 100rpx;
		height: 160rpx;
		position: fixed;
		bottom: 0;
		background: #FEF7E5;
	}
</style>
