class Bluetooth{
	constructor() {
		this.blueStatus = {
			status: false,
			text: '未连接'
		},
		this.devices = {},
		this.devicesId = ''
	}
	switchBluetooth(){
		return new Promise((resolve, reject) => {
			if(this.blueStatus.status === false){
				uni.openBluetoothAdapter({ //初始化蓝牙设备
					success: res => {
						console.log('初始化蓝牙设备')
						this.blueStatus.status = true
						resolve(res)
					},
					fail: err => {
						this.blueStatus.status = false
						uni.showToast({
							icon:'none',
							title: '请打开手机蓝牙'
						})
						reject(err)
					}
				})
			} else {
				this.stopFindBule()
				this.closeBLE()
				uni.closeBluetoothAdapter({
					success: res => {
						this.blueStatus.status = false
						this.blueStatus.text = '未连接'
						this.devices = []
						uni.setStorageSync('blueStatus',this.blueStatus)
						console.log('蓝牙已关闭')
						uni.hideLoading()
						resolve(res)
					},
					fail: err => {
						this.blueStatus.status = false
						uni.hideLoading()
						console.log(err)
						reject(err)
					}
				})
			}
		})
	}
	// 开始搜索蓝牙列表
	startSearchBTDev(){
		return new Promise((resolve,reject)=>{
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
						resolve(res)
						console.log('扫描成功', res)
					}).catch(err=>{
						reject(err)
						console.log('扫描失败',err)
					})
				} else {
					console.log('本机蓝牙不可用')
				}
			})
		})
	}
	startDisBTDev(){ //搜寻附近的蓝牙外围设备
		return new Promise((resolve,reject)=>{
			uni.startBluetoothDevicesDiscovery({
				// services: ['18F0'],
				success: res=>{
					resolve(res)
				},
				fail: (err)=>{
					reject(err)
				}
			})
		})
	}
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
	}
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
	}
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
	}
	//初始化蓝牙连接
	createBLE(item){
		return new Promise((resolve,reject)=>{
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
						uni.setStorageSync('blueStatus',this.blueStatus)
						setTimeout(()=>{
							this.getBLEServices(item).then(res => {
								resolve(res)
							}) //获取蓝牙设备所有服务
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
					reject(err)
				}
			})
		})
	}
	closeBLE(){
		if(this.devicesId){
			uni.closeBLEConnection({
				deviceId: this.devicesId,
				success: res => {
					console.log('断开蓝牙连接',res)
				}
			})
		}
	}
	//获取蓝牙设备所有服务
	getBLEServices(item){
		return new Promise((resolve,reject)=>{
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
											uni.setStorageSync('blueDevices',item)
										}
									})
									resolve(this.devices)
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
		})
	}
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
	}
}

export default Bluetooth;