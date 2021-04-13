<template>
	<view class="wrap">
		<view class="group">
			<uni-list-item showSwitch title="蓝牙">
				<view slot="right" class="text-muted">
					<evan-switch v-model="blueStatus.status" :beforeChange="switchBluetooth" activeColor="#46B85B" :size="22"></evan-switch>
				</view>
			</uni-list-item>
		</view>
		<view v-if="blueStatus.status">
			<view class="tip">
				<view>搜索到的设备<text class="right_text" @click="startSearchBTDev">开始搜索</text></view>
			</view>
			<view class="group" :key="index" v-for="(item,index) in devices">
				<uni-list-item :title="item.name" :rightText="item.conText" @click="createBLE(item)"></uni-list-item>
			</view>
			<view style="width: 200rpx; background: #46B85B; color: white; border-radius: 8rpx;padding: 20rpx 0;text-align: center; margin: 10rpx auto; font-size: 26rpx;" @click="senBleLabel">
				测试蓝牙打印
			</view>
			<canvas width="65px" height="65px" canvas-id="logo"></canvas>
		</view>
	</view>
</template>

<script>
	// 1.uni.openBluetoothAdapter 初始化蓝牙模块
	// 2.uni.onBluetoothDeviceFound 监听寻找到新设备的事件
	// 3.uni.getBluetoothAdapterState 获取本机蓝牙适配器状态
	// 4.uni.stopBluetoothDevicesDiscovery 停止搜寻附近的蓝牙设备
	// 5.uni.createBLEConnection 初始化蓝牙连接
	// 6.uni.getBLEDeviceServices 获取蓝牙设备服务
	// 7.uni.getBLEDeviceCharacteristics 获取蓝牙设备某个服务中所有特征值(characteristic)
	// 8.uni.writeBLECharacteristicValue 向低功耗蓝牙设备特征值中写入二进制数据
	// 9.uni.startBluetoothDevicesDiscovery 开始搜寻附近的蓝牙设备
	import UniListItem from '@/components/uni/uni-list-item.vue'
	import EvanSwitch from '@/components/plugin-ui/evan-switch.vue'
	export default {
		components: {
			UniListItem,
			EvanSwitch
		},
		data() {
			return {
				devices: [],
				devicesId: '',
				currDev: null,
				connId: '',
				piaojuText:'',
				blueStatus: {
					status: false,
					text: '未连接'
				},
				isPrint: false
			}
		},
		onLoad() {
			let bs = uni.getStorageSync('blueStatus')
			let bd = uni.getStorageSync('blueDevices')
			if(bs.status && bd){
				this.blueStatus = bs
				this.devices.push(bd)
				this.devices = JSON.parse(JSON.stringify(this.devices))
			} else {
				this.blueStatus.status = false
				this.blueStatus.text = '未连接'
				
			}
		},
		methods: {
			switchBluetooth(){
				if(this.blueStatus.status === false){
					uni.openBluetoothAdapter({ //初始化蓝牙设备
						success: res => {
							console.log('初始化蓝牙设备')
							this.startSearchBTDev()
							this.blueStatus.status = true
						},
						fail: err => {
							this.blueStatus.status = false
							uni.showToast({
								icon:'none',
								title: '请打开手机蓝牙'
							})
						}
					})
				} else {
					console.log(this.devices)
					this.stopFindBule()
					this.closeBLE()
					uni.closeBluetoothAdapter({
						success: res => {
							this.blueStatus.status = false
							this.blueStatus.text = '未连接'
							this.devices = []
							this.$store.commit('blueClose')
							this.$store.commit('blueStatus',this.blueStatus)
							console.log('蓝牙已关闭')
							uni.hideLoading()
						},
						fail: err => {
							this.blueStatus.status = false
							uni.hideLoading()
							console.log(err)
						}
					})
				}
				
			},
			// 开始搜索蓝牙列表
			startSearchBTDev(){
				this.devices = []
				this.getBTAdapterState().then(res=>{
					let available = res.available // 蓝牙适配器是否可用
					let discovering = res.discovering // 是否处于搜索状态
					if(available) {
						 if (discovering) {
							this.stopFindBule()//停止搜寻设备
						}
						console.log("开始搜寻附近的蓝牙外围设备")
						this.startDisBTDev().then(res=>{
							this.onDevice()
							console.log('扫描成功', res)
						}).catch(err=>{
							console.log('扫描失败',err)
						})
					} else {
						console.log('本机蓝牙不可用')
					}
				})
			},
			startDisBTDev(){ //搜寻附近的蓝牙外围设备
				return new Promise((resolve,reject)=>{
					uni.startBluetoothDevicesDiscovery({
						services: ['18F0'],
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
				this.getBTAdapterState().then(res=>{
					console.log(res)
				})
				console.log("监听寻找到新设备的事件---------------")
				uni.onBluetoothDeviceFound(res => {
					let dev = res.devices[0]
					if(dev.name && dev.localName){
						let arr = this.devices.filter(item => item.deviceId ===dev.deviceId)
						if(!arr.length > 0){
							// 新设备
							this.devices.push(dev)
						}
					}
					this.devices.forEach((item,index) => {
						item.conText = '未连接'
						item.services = []
					})
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
			createBLE(item){
				if(item.conText === '已连接'){
					return
				}
				uni.showLoading({
					title: '正在连接该设备'
				})
				this.devices.forEach(item=>{
					item.conText = '未连接'
				})
				let deviceId = item.deviceId
				uni.createBLEConnection({
					deviceId: deviceId,
					success: res => {
						if(res.errMsg == "createBLEConnection:ok"){
							console.log("连接蓝牙-[" + item.name + "]--成功")
							this.devicesId = item.deviceId
							this.blueStatus.text = '已连接'
							this.$store.commit('blueStatus',this.blueStatus)
							setTimeout(()=>{
								this.getBLEServices(item) //获取蓝牙设备所有服务
							},1000)
						}
						//连接成功 关闭搜索
						this.stopFindBule()
					},
					fail: err => {
						uni.hideLoading()
						uni.showToast({
							icon: 'none',
							title: err
						})
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
				uni.getBLEDeviceServices({
					deviceId: deviceId,
					success: res => {
						let serviceId = ""
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
						res.services.forEach((item1,index) => {
							let serviceId = item1.uuid
							uni.getBLEDeviceCharacteristics({ //获取蓝牙设备某个服务中所有特征值
								deviceId: deviceId,
								serviceId: serviceId,
								success: res => {
									let re = JSON.parse(JSON.stringify(res))
									re.characteristics.forEach((item2,index) => { 
										if(item2.properties.write === true){
											let uuid = item2.uuid
											this.devices.forEach((item3,index) => {
												if(item3.deviceId === deviceId){
													item3.services.push({
														serviceId: serviceId,
														characteristicId: uuid
													})
													return
												}
											})
										}
										// this.devices = this.devices.filter((currentValue, index)=>{
										// 	return this.devices[index].deviceId === deviceId
										// })
										this.devices.forEach((item,index)=>{
											if(item.deviceId === deviceId){
												this.devices.splice(index,1)
												this.devices.splice(0,0,item)
												item.conText = '已连接'
												this.devices = JSON.parse(JSON.stringify(this.devices))
												this.$store.commit('blueDevices',item)
											}
										})
									})
								},
								fail: err => {
									console.log(err)
								}
							})
						})
						uni.hideLoading()
					},
					fail: err => {
						console.log('获取服务出错',err)
					}
				})
			},
			senBlData(deviceId, serviceId, characteristicId, uint8Array) {
				// console.log('************deviceId = [' + deviceId + ']  serviceId = [' + serviceId + '] characteristics=[' +characteristicId+ "]")
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
				// console.log(sendloop.length)
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
			senBleLabel(){
				if(this.blueStatus.text === '未连接'){
					uni.showToast({
						icon:'none',
						title:'请先连接蓝牙打印机'
					})
					return
				}
				//票据模式
				let deviceId = this.devices[0].deviceId;
				let serviceId = this.devices[0].services[0].serviceId;
				let characteristicId = this.devices[0].services[0].characteristicId;
				var command = this.$esc.jpPrinter.createNew()
				command.init()
				
				// command.setBitmap(imageInfo)
				// command.setImage(1,10)
				// command.setImage(1,10,1,0,255,96,28,3,28,96,255,0)
				// command.setPrint()
				command.setFontStyleHan(28)
				command.setSelectJustification(1)
				command.setText("移移生活")
				command.setPrint()
				
				command.setFontStyleHan(0)
				command.setSelectJustification(0)
				command.setText('测试店铺')
				command.setPrintAndFeedRow(1)
				
				command.setText("--------------------------------");
				command.setPrint()
				
				command.setText("下单时间："+"2021-03-31");
				command.setPrint()
				
				command.setText("------------商品明细------------");
				command.setPrint()
				
				command.setFontStyle(16)
				command.setSelectJustification(0)
				command.setText("西红柿炒鸡蛋")
				command.setPrint()
					
				command.setSelectJustification(2)
				command.setText("原价:"+'10.00')
				command.setPrintL()
				command.setText("  X"+'1'+'份'+"  "+ '9'+'元')
				command.setPrint()
				
				command.setFontStyle(0)
				command.setSelectJustification(0)
				command.setText("------------其它费用------------");
				command.setPrint()
				
				command.setFontStyle(16)
				command.setText(getApp().changeSpace('打包费',6,'1.00'))
				command.setPrint()
				
				command.setText(getApp().changeSpace('配送费',6,'2.00'))
				command.setPrint()
				// command.setText(this.changeSpace('帮代垃圾费用',12,orderInfo.helpFee)
				// command.setPrint()
				
				command.setText(getApp().changeSpace('红包/优惠券',11,'-2.00'))
				command.setPrint()
				
				// command.setText(this.changeSpace('折扣金额',8,orderInfo.discountAmt))
				// command.setPrint()
				
				command.setFontStyle(0)
				command.setText("--------------------------------");
				command.setPrint()
				
				command.setFontStyle(16)
				command.setText(getApp().changeSpace('订单金额',8,'13.00'))
				command.setPrint()
				
				command.setFontStyle(0)
				command.setText("--------------------------------");
				command.setPrint()
				
				command.setFontStyle(16)
				command.setText(getApp().changeSpace('实付金额',8,'10.00'))
				command.setPrint()
				
				command.setFontStyle(0)
				command.setText("--------------------------------");
				command.setPrint()
				
				command.setFontStyle(48)
				command.setText('厦门市思明区某某街道')
				command.setPrint()
				
				command.setText(getApp().plusXing('张三',1,0))
				command.setPrintAndFeedRow(1)
				
				command.setText(getApp().plusXing('15812345678',3,4))
				command.setPrint()
				
				command.setText('备注：不要香菜')
				command.setPrint()
				
				command.setFontStyle(0)
				command.setPrintAndFeedRow(1)
				command.setText("订单编号："+"12345678910");
				command.setPrint()
				
				command.setText("--------------------------------");
				command.setPrint()
				
				command.setSelectJustification(1)
				command.setText('商品如有问题请联系商家')
				command.setPrint()
				command.setText('12345678911')
				command.setPrint()
				
				command.setText('移移平台客服电话')
				command.setPrint()
				command.setText('0592-1234567，0592-1234568')
				command.setPrint()
				
				command.setText("--------------------------------");
				command.setPrintAndFeedRow(6)
				this.senBlData(deviceId, serviceId, characteristicId,command.getData())
			},
			grayPixle(pix) {
			    return pix[0] * 0.299 + pix[1] * 0.587 + pix[2] * 0.114;
			},
			overwriteImageData(data) {
			    let sendWidth = data.width,
			        sendHeight = data.height;
			    const threshold = data.threshold || 180;
			    let sendImageData = new ArrayBuffer((sendWidth * sendHeight) / 8);
			    sendImageData = new Uint8Array(sendImageData);
			    let pix = data.data;
			    const part = [];
			    let index = 0;
			    for (let i = 0; i < pix.length; i += 32) {
			        //横向每8个像素点组成一个字节（8位二进制数）。
			        for (let k = 0; k < 8; k++) {
			            const grayPixle1 = this.grayPixle(pix.slice(i + k * 4, i + k * 4 + (4 - 1)));
			            //阈值调整
			            if (grayPixle1 > threshold) {
			                //灰度值大于threshold位   白色 为第k位0不打印
			                part[k] = 0;
			            } else {
			                part[k] = 1;
			            }
			        }
			        let temp = 0;
			        for (let a = 0; a < part.length; a++) {
			            temp += part[a] * Math.pow(2, part.length - 1 - a);
			        }
			        //开始不明白以下算法什么意思，了解了字节才知道，一个字节是8位的二进制数，part这个数组存的0和1就是二进制的0和1，传输到打印的位图数据的一个字节是0-255之间的十进制数，以下是用权相加法转十进制数，理解了这个就用上面的for循环替代了
			        // const temp =
			        //     part[0] * 128 +
			        //     part[1] * 64 +
			        //     part[2] * 32 +
			        //     part[3] * 16 +
			        //     part[4] * 8 +
			        //     part[5] * 4 +
			        //     part[6] * 2 +
			        //     part[7] * 1;
			        sendImageData[index++] = temp;
			    }
			    return {
			        data: Array.from(sendImageData),
			        width: sendWidth / 8,
			        height: sendHeight,
			    };
			},
			getImageInfo(){
				return new Promise((resolve,reject)=>{
					const ctx = uni.createCanvasContext('logo',this)
					ctx.drawImage('../../../static/noImg.png',0,0,65,65)
					ctx.draw()
					setTimeout(()=>{
						uni.canvasGetImageData({
							canvasId: 'logo',
							x: 0,
							y: 0,
							width: 65,
							height: 65,
							success: res => {
								resolve(res)
							}
						})
					},500)
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	page {
			width: 100vw;
			
			.wrap{
				padding: 20rpx;
				width: 100%;
				.group{
					width: 100%;
					background-color: #FFFFFF;
					border-radius: 12rpx;
					margin-bottom: 20rpx;
				}
				.tip{
					font-size: 30rpx;
					padding: 0 20rpx 20rpx;
					color: #818181;
					.right_text{
						float: right;
						color: #46B75B;
					}
				}
			}
		}
</style>
