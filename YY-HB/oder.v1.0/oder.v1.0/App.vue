<script>   	 
	import {b64Md5,hexMD5} from '@/network/md5.js'	
	import {getSortAscii, arrayExclude,} from '@/common/util/utils.js'
	export default {
		onLaunch: function() {
			console.log('App Launch') 	 
			 this.$nextTick(() => {     
				// 开启监听推送
				let getPush = []
				let clickPush = [] 
				const bgAudioMannager = uni.getBackgroundAudioManager()
				
				// #ifdef APP-PLUS
				// plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
				// 	console.log(plus.runtime.appid)
				// 	console.log(widgetInfo)
				// 	uni.downloadFile({
				// 		url: 'http://res.yiyichina.cn/Busi1.5.5.apk',
				// 		success: (downloadResult) => {
				// 			if (downloadResult.statusCode === 200) { 
				// 				plus.runtime.install(downloadResult.tempFilePath,{
				// 					force: false
				// 				},function(){
				// 					console.log('install success...');  
				// 					plus.runtime.restart();  
				// 				},function(e){
				// 					console.error('install fail...');
				// 				})
				// 			}
				// 		}
				// 	})
				// })
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
									this.senBleLabel2()
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
									this.senBleLabel2()
								},1000)
							}
						}
						
					}
				})
				// setTimeout(()=>{
				// 	let res={"title":"订单已送达","content":"您对本次购物是否满意","notifyType":"4","extendParam":{"msg_action":"1","msg_external_param":"350203208000001219"}}
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
				// 				this.senBleLabel2()
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
			switchBluetooth(){
				uni.openBluetoothAdapter({ //初始化蓝牙设备
					success: res => {
						this.startSearchBTDev()
					},
					fail: err => {
						console.log('请打开手机蓝牙')
					}
				})
			},
			// 开始搜索蓝牙列表
			startSearchBTDev(){
				this.getBTAdapterState().then(res=>{
					let available = res.available // 蓝牙适配器是否可用
					let discovering = res.discovering // 是否处于搜索状态
					console.log(res)
					if(available) {
						// if (discovering) {
							// this.stopFindBule()//停止搜寻设备
						// }
						// console.log("开始搜寻附近的蓝牙外围设备")
						// this.startDisBTDev().then(res=>{
						// 	// this.onDevice()
						// 	console.log('扫描成功', res)
						// }).catch(err=>{
						// 	console.log('扫描失败',err)
						// })
						if(this.devices && !this.blueStatus.status){
							console.log('准备连接')
							this.createBLE()
						}
					} else {
						console.log('本机蓝牙不可用')
					}
				})
			},
			startDisBTDev(){ //搜寻附近的蓝牙外围设备
				return new Promise((resolve,reject)=>{
					uni.startBluetoothDevicesDiscovery({
						success: res=>{
							resolve(res)
						},
						fail: (err)=>{
							reject(err)
						}
					})
				})
			},
			getBTAdapterState (){ //获取本机蓝牙适配器状态
				return new Promise((resolve,reject)=>{
					uni.getBluetoothAdapterState({ 
						success: (res)=>{
							resolve(res)
						},
						fail: (err)=>{
							reject(err)
						}
					})
				})
			},
			onDevice(){
				console.log("监听寻找到新设备的事件---------------")
				uni.onBluetoothDeviceFound(res => {
					let dev = res.devices[0]
					if(dev.name && dev.localName){
						let arr = this.devices.filter(item => item.deviceId ===dev.deviceId)
						if(arr.length > 0){
							// 存在相同设备，要进行RSSI（信号强度）更新
							let n = this.devices.indexOf(arr[0])
							// 转换信号
							let rssi = Math.floor(max(0, dev.RSSI + 100) / 10)
							if(rssi <= 0){
								// 无信号删除
								this.devices.splice(n,1)
							} else {
								// 有信号更新
								this.devices[n].RSSI = rssi
							}
						}
					}
				})
			},
			stopFindBule(){
				console.log("停止搜寻附近的蓝牙外围设备---------------")
				uni.stopBluetoothDevicesDiscovery({
					success: res => {
						console.log(res)
					},
					fail: err => {
						console.log(err)
					}
				})
			},
			//初始化蓝牙连接
			createBLE(){
				let item
				if(this.devices){
					item = this.devices[0]
				}
				let deviceId = item.deviceId
				uni.createBLEConnection({
					deviceId: deviceId,
					success: res => {
						if(res.errMsg == "createBLEConnection:ok"){
							console.log("连接蓝牙-[" + item.name + "]--成功")
							this.devicesId = item.deviceId
							this.blueStatus.text = '已连接'
							this.blueStatus.status = true
							this.$store.commit('blueStatus',this.blueStatus)
						}
						//连接成功 关闭搜索
						// this.stopFindBule()
					},
					fail: err => {
						console.log(err)
					}
				})
			
			},
			closeBLE(){
				if(this.devicesId){
					uni.closeBLEConnection({
						deviceId: this.devicesId,
						success: res => {
							console.log('断开蓝牙连接',res)
						}
					})
				}
			},
			//获取蓝牙设备所有服务
			getBLEServices(item){
				let deviceId = item.deviceId
				console.log(this.devices)
				uni.getBLEDeviceServices({
					deviceId: deviceId,
					success: res => {
						if(res.services.length === 0){
							//有的低版本设备连接会出错，但是重新连接就可以链接上，所以在这里先断开连接再重新连接该设备
							uni.closeBLEConnection({
								deviceId: deviceId,
								success: res => {
									console.log('断开与设备的连接', res)
									setTimeout(()=>{
										this.createBLE(item)
									},1000)
								}
								
							})
							return
						}
					},
					fail: err => {
						console.log('获取服务出错',err)
					}
				})
			},
			senBlData(deviceId, serviceId, characteristicId, uint8Array) {
				let uint8Buf = Array.from(uint8Array);
				function split_array(datas,size){
					var result = {};
					var j = 0
					for (var i = 0; i < datas.length; i += size) {
						result[j] = datas.slice(i, i + size)
						j++
					}
					console.log(result)
					return result
				}
				let sendloop = split_array(uint8Buf, 20);
				function realWriteData(sendloop, i) {
					let data = sendloop[i]
					if(typeof(data) == "undefined"){
						return
					}
					console.log("第【" + i + "】次写数据"+data)
					let buffer = new ArrayBuffer(data.length)
					let dataView = new DataView(buffer)
					for (let j = 0; j < data.length; j++) {
						dataView.setUint8(j, data[j]);
					}
					uni.writeBLECharacteristicValue({
						deviceId,
						serviceId,
						characteristicId,
						value: buffer,
						success(res) {
							realWriteData(sendloop, i + 1);
						}
					})
				}
				let i = 0;
				realWriteData(sendloop, i);
			},
			senBleLabel2(){
				//票据模式
				let deviceId = this.devices[0].deviceId;
				let serviceId = this.devices[0].services[0].serviceId;
				let characteristicId = this.devices[0].services[0].characteristicId;
				let merchName = uni.getStorageSync('user').merchName
				let orderNum = this.getDay()
				this.orderType()
				let orderInfo = this.orderList
				var command = this.$esc.jpPrinter.createNew()
				command.init()
				command.setFontStyle(48)
				command.setSelectJustification(0)
				command.setText('移移生活  #'+orderNum)
				command.setPrint()
				
				command.setFontStyle(0)
				command.setSelectJustification(0)
				command.setText(merchName)
				command.setPrintAndFeedRow(1)
				
				// command.setFontStyle(28)
				// command.setSelectJustification(1)
				// command.setText("—"+orderInfo.patTypeText+"—")
				// command.setPrintAndFeedRow(1)
				
				// command.setFontStyle(0)
				// command.setSelectJustification(0)
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
					command.setText(this.changeSpace('打包费',6,orderInfo.packageFee))
					command.setPrint()
				}
				
				if(orderInfo.deliverFirm==1){
					command.setText(this.changeSpace('配送费(达达配送)',16,orderInfo.orderFee))
				} else if(orderInfo.deliverFirm==2) {
					command.setText(this.changeSpace('配送费(顺丰配送)',16,orderInfo.orderFee))
				} else if(orderInfo.deliverFirm==3) {
					command.setText(this.changeSpace('配送费(蜂鸟配送)',16,orderInfo.orderFee))
				}
				command.setPrint()
				
				if(orderInfo.couponAmt != 0){
					command.setText(this.changeSpace('红包/优惠券',11,("-"+orderInfo.couponAmt)))
					command.setPrint()
				}
				
				command.setFontStyle(0)
				command.setText("--------------------------------");
				command.setPrint()
				
				command.setFontStyle(16)
				command.setText(this.changeSpace('订单金额',8,orderInfo.orderAmt))
				command.setPrint()
				
				command.setFontStyle(0)
				command.setText("--------------------------------");
				command.setPrint()
				
				command.setFontStyle(16)
				command.setText(this.changeSpace('实付金额',8,orderInfo.realAmt))
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
				
				command.setText(this.plusXing(orderInfo.receiver,1,0))
				command.setPrintAndFeedRow(1)
				
				command.setText(this.plusXing(orderInfo.recPhone,3,4))
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
				command.setText("--------");
				command.setPrintL()
				command.setFontStyle(48)
				command.setText('#'+orderNum+'完');
				command.setPrintL()
				command.setFontStyle(0)
				command.setText("--------");
				command.setPrint()
				command.setPrintAndFeedRow(6)
				
				this.senBlData(deviceId, serviceId, characteristicId,command.getData())
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
					this.$api.initPage(res.code,res.message)  
					if(res.code == 200){														
						this.orderList = res.data
					}
				}).catch() 
			},
			orderType(){
				switch(this.orderList.payType){
					case 1: this.$set(this.orderList,'patTypeText','微信');break
					case 2: this.$set(this.orderList,'patTypeText','支付宝');break
				}
				switch(this.orderList.deliverType){
					case 0: this.$set(this.orderList,'deliverTypeText','接单中心');break
					case 1: this.$set(this.orderList,'deliverTypeText','商家');break
					case 2: this.$set(this.orderList,'deliverTypeText','自取');break
					case 3: this.$set(this.orderList,'deliverTypeText','移移');break
				}
				switch(this.orderList.helpState){
					case 0: this.$set(this.orderList,'helpStateText','否');break
					case 1: this.$set(this.orderList,'helpStateText','是');break
				}
				switch(this.orderList.sex){
					case 1: this.$set(this.orderList,'sexText','先生');break
					case 2: this.$set(this.orderList,'sexText','女士');break
				}
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
			changeSpace(str,s,n){
				let len = this.getStrBytes(n)
				for(let i=1;i<=32-s-len;i++){
					str += ' '
				}
				str += n
				return str
			},
			plusXing(str,frontLen,endLen) { 
				let len = str.length-frontLen-endLen;
				let xing = '';
				for (let i=0;i<len;i++) {
					xing+='*';
				}
				return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
			},
			getStrBytes(str) {
			     if (str == null || str === undefined) return 0;
			     if (typeof str != "string") {
			         return 0;
			     }
			     var total = 0, charCode, i, len;
			     for (i = 0, len = str.length; i < len; i++) {
			         charCode = str.charCodeAt(i);
			         if (charCode <= 0x007f) {
			             total += 1;//字符代码在000000 – 00007F之间的，用一个字节编码
			         } else if (charCode <= 0x07ff) {
			             total += 2;//000080 – 0007FF之间的字符用两个字节
			         } else if (charCode <= 0xffff) {
			             total += 3;//000800 – 00D7FF 和 00E000 – 00FFFF之间的用三个字节，注: Unicode在范围 D800-DFFF 中不存在任何字符
			         } else {
			             total += 4;//010000 – 10FFFF之间的用4个字节
			         }
			     }
			     return total;
			},
			onBLEConnection(){
				uni.onBLEConnectionStateChange(res => {
					this.blueStatus = uni.getStorageSync('blueStatus')
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
		font-size: 18rpx;
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
