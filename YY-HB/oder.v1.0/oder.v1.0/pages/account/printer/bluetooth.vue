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
		</view>
<!-- 		<view style='width:0px;height:0px;overflow:hidden;'>
			<canvas canvas-id="imgCanvas" style="width: 48px; height: 48px;"></canvas>
			<uni-qrcode cid="codeCanvas" :size="size" text="www.baidu.com" :makeOnLoad="true" backgroundColor="transparent"></uni-qrcode>
		</view> -->
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
	import {changeSpace,plusXing} from '@/common/util/utils.js'
	import Bluetooth from '@/common/util/bluetooth.js'
	import UniQrcode from '@/components/uni/uni-qrcode.vue'
	
	let bluetooth = new Bluetooth();
	
	export default {
		components: {
			UniListItem,
			EvanSwitch,
			UniQrcode
		},
		data() {
			return {
				devices: [],
				devicesId: '',
				blueStatus: {
					status: false,
					text: '未连接'
				},
				size: 240,
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
				bluetooth.switchBluetooth().then(res=>{
					this.blueStatus.status = bluetooth.blueStatus.status
					if(this.blueStatus.status){
						this.startSearchBTDev()
					}
				})
			},
			startSearchBTDev(){
				bluetooth.startSearchBTDev().then(res=>{
					this.devices = bluetooth.devices
				})
			},
			async createBLE(item){
				bluetooth.createBLE(item).then(res=>{
					this.blueStatus = bluetooth.blueStatus
					this.devices = bluetooth.devices
				})
				// let img_res = await this.get_Qrcode('img')
				// getApp().globalData.image_data = img_res;
				// let code_res = await this.get_Qrcode('code')
				// getApp().globalData.code_data = code_res;
			},
			senBleLabel(){
				if(this.blueStatus.text === '未连接'){
					uni.showToast({
						icon:'none',
						title:'请先连接蓝牙打印机'
					})
					return
				}
				// let img_res = getApp().globalData.image_data
				
				// let code_res = getApp().globalData.code_data
				
				//票据模式
				let deviceId = this.devices[0].deviceId;
				let serviceId = this.devices[0].services[0].serviceId;
				let characteristicId = this.devices[0].services[0].characteristicId;
				var command = this.$esc.jpPrinter.createNew()
				command.init()
				
				// command.setBitmap(img_res)

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
				command.setText(changeSpace('打包费',6,'1.00'))
				command.setPrint()
				
				command.setText(changeSpace('配送费',6,'2.00'))
				command.setPrint()
				// command.setText(this.changeSpace('帮代垃圾费用',12,orderInfo.helpFee)
				// command.setPrint()
				
				command.setText(changeSpace('红包/优惠券',11,'-2.00'))
				command.setPrint()
				
				// command.setText(this.changeSpace('折扣金额',8,orderInfo.discountAmt))
				// command.setPrint()
				
				command.setFontStyle(0)
				command.setText("--------------------------------");
				command.setPrint()
				
				command.setFontStyle(16)
				command.setText(changeSpace('订单金额',8,'13.00'))
				command.setPrint()
				
				command.setFontStyle(0)
				command.setText("--------------------------------");
				command.setPrint()
				
				command.setFontStyle(16)
				command.setText(changeSpace('实付金额',8,'10.00'))
				command.setPrint()
				
				command.setFontStyle(0)
				command.setText("--------------------------------");
				command.setPrint()
				
				command.setFontStyle(48)
				command.setText('厦门市思明区某某街道')
				command.setPrint()
				
				command.setText(plusXing('张三',1,0))
				command.setPrintAndFeedRow(1)
				
				command.setText(plusXing('15812345678',3,4))
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
				// command.setPrint()
				
				// command.setPrintAndFeedRow(1)
				// command.setBitmap(code_res)	
				
				command.setPrintAndFeedRow(6)
				bluetooth.senBlData(deviceId, serviceId, characteristicId,command.getData())
			},
			get_Qrcode(type) {
				return new Promise((resolve, reject) => {
					let canvas_id;
					let canvas_width;
					let canvas_height;
					if(type=='img'){
						console.log('img')
						canvas_id = 'imgCanvas'
						canvas_width = 48
						canvas_height = 48
						const ctx = uni.createCanvasContext('imgCanvas');
						ctx.drawImage('../../../static/printImg.png',0,0,48,48)
						ctx.draw()
					} else if (type=='code') {
						console.log('code')
						canvas_id = 'codeCanvas'
						canvas_width = this.size
						canvas_height = this.size
					}
					setTimeout(()=>{
						console.log('获取图片数据')
						uni.canvasGetImageData({
							canvasId: canvas_id,
							x: 0,
							y: 0,
							width: canvas_width,
							height: canvas_height,
							success(res) {
								resolve(res);
							},
							fail(err){
								console.log(err)
							}
						})
					},1000)
				});
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
