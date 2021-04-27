<template>
	<view id="set-app">
		<view class="set-main">
			<view class="group">
				<uni-list-item showSwitch title="店铺名称">
					<view slot="right">{{merchData.merchName}}</view>
				</uni-list-item>
				<uni-list-item showSwitch title="开始营业">
					<view slot="right" class="text-muted">
						<evan-switch v-model="open" :disabled="notAgain" :beforeChange="openStauts" activeColor="#46B85B" :size="22"></evan-switch>
					</view>

				</uni-list-item>
				<uni-list-item showSwitch title="营业时间" showArrow>
					<view slot="right" class="text-muted picker-box">
						<picker mode="time" :value="merchData.busiHoursStart"  @change="bindTimeChange">
							<view class="uni-input">{{merchData.busiHoursStart}}</view>
						</picker>
						<span style="display: inline-block;padding: 0 10rpx;font-size: 24rpx;">至</span>
						<picker mode="time" :value="merchData.busiHoursEnd"  @change="bindEndTimeChange">
							<view class="uni-input">{{merchData.busiHoursEnd}}</view>
						</picker>
					</view>
				</uni-list-item>
				<view v-if="this.busiType<=2">
					<uni-list-item showSwitch title="开启早餐营业">
						<view slot="right" class="text-muted">
							<evan-switch v-model="isBreakFast" :beforeChange="openFast" activeColor="#46B85B" :size="22"></evan-switch>
						</view>
					</uni-list-item>
					<uni-list-item showSwitch title="早餐营业时间" showArrow>
						<view slot="right" class="text-muted picker-box">
							<picker mode="time" :value="merchData.breakfastStart" @change="fastTimeChange">
								<view class="uni-input">{{merchData.breakfastStart}}</view>
							</picker>
							<span style="display: inline-block;padding: 0 10rpx;font-size: 24rpx;">至</span>
							<picker mode="time" :value="merchData.breakfastEnd"  @change="fastEndTimeChange">
								<view class="uni-input">{{merchData.breakfastEnd}}</view>
							</picker>
						</view>
					</uni-list-item>
				</view>
				<uni-list-item showSwitch title="自动营业">
					<view slot="right" class="text-muted">
						<evan-switch v-model="isOpenAutoBusi" :beforeChange="openStore" activeColor="#46B85B" :size="22"></evan-switch>
					</view>
				</uni-list-item>
				<uni-list-item showSwitch title="播报声音默认最大">
					<view slot="right" class="text-muted">
						<evan-switch v-model="issetVolume" :beforeChange="setVolume" activeColor="#46B85B" :size="22"></evan-switch>
					</view>
				</uni-list-item>
			</view>
			<view class="group">
				<uni-list-item title="打印机设置" @click="navTo('../printer/printer')"></uni-list-item>
			</view>
			<view class="group">
				<uni-list-item title="设置包装费" @click="navTo('../packfee/packfee')"></uni-list-item>
			</view>
			<view class="group">
				<uni-list-item title="优惠券管理" @click="navTo('../coupon/coupon')"></uni-list-item>
			</view>
			<view v-if="loginType==1" class="group">
				<uni-list-item title="修改密码" @click="navTo('../passwd/passwd?type=change')"></uni-list-item>
				<uni-list-item title="关联账号" @click="navTo('../authid/authid')"></uni-list-item>
				<uni-list-item title="银行卡管理" @click="navTo('../../wallet/type/brand')"></uni-list-item>
				<uni-list-item title="支付管理" @click="navTo('../../payment/payment')"></uni-list-item>
				<uni-list-item title="店员管理" @click="navTo('../staff/staff')"></uni-list-item>
			</view>

			<view class="group">
				<uni-list-item title="关于移移" @click="navTo('../../utility/about/about')"></uni-list-item>
				<uni-list-item title="客服热线" @tap="onPhone">
					<view slot="right" class="callText"><text class="iconfont icondianhua-copy"></text>立即联系</view>
				</uni-list-item>
			</view>
			<view class="group logout" hover-class="animate__animated animate__pulse">
				<uni-list-item title="退出登录" :showArrow="false" @click="logout"></uni-list-item>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		b64Md5,
		hexMD5
	} from '@/network/md5.js'
	import {
		getSortAscii
	} from '@/common/util/utils.js'

	import UniListItem from '@/components/uni/uni-list-item.vue'
	import EvanSwitch from '@/components/plugin-ui/evan-switch.vue'
	export default {
		components: {
			UniListItem,
			EvanSwitch,
		},
		data() {
			return {
				index: 0,
				merchData: {
					merchName: "",
					deliverState: 0,
					busiState: 0,
					busiHoursStart: "",
					busiHoursEnd: "",
					merchPic: "",
					serviceContactMobile: "",
					busiAutoOpen:'',//自动营业
					breakfastStart: '',
					breakfastEnd: ''
				},
				open: false, //营业 
				isBreakFast: false,
				longitude: '',
				latitude: '',
				siteReady: false,
				notAgain: false,
				loginWhether: '', //登陆状态 
				merchNo: '', //商户号	
				isOpenAutoBusi: false,//开启自动营业
				startTime: '08:00',
				endTime:'23:59',
				loginType: 1,
				busiType: 0,
				issetVolume: false,
			}
		},
		onLoad() {
			this.loginWhether = uni.getStorageSync('status')
			this.merchNo = uni.getStorageSync('user').merchNo
			this.loginType = uni.getStorageSync('user').loginType
			this.busiType = uni.getStorageSync('user').busiType
			this.issetVolume = uni.getStorageSync('Volume')
			this.getMerchDetail()
			// this.getOpenPlace() 
			this.initsietPlace() //一次获取坐标 
		},
		methods: {
			pinckerTime(e) {
				this.index = e.target.value
			},
			navTo(path) {
				uni.navigateTo({
					url: path,
				})
			},
			initsietPlace() {
				let sitePlace = uni.getStorageSync('sitePlace')
				if (sitePlace) {
					this.siteReady = true
					this.longSite = sitePlace.longSite
					this.latSite = sitePlace.latSite
				} else {
					this.siteReady = false
					let failplace = {
						longSite: '',
						latSite: '',
						siteReady: true
					}
				}
			},
			getOpenPlace() { //获取经营坐标
				uni.getLocation({
					type: 'gcj02',
					success: (res => {
						let longNums = JSON.stringify(res.longitude)
						let latNums = JSON.stringify(res.latitude)

						let site1 = longNums.indexOf('.')
						let site2 = latNums.indexOf('.')
						let longSite = longNums.slice(0, site1) + longNums.slice(site1, site1 + 7)
						let latSite = latNums.slice(0, site2) + latNums.slice(site2, site2 + 7)

						this.siteReady = true
						this.longSite = longSite
						this.latSite = latSite
					}),
					fail: (fail => {
						this.siteReady = false
						let failplace = {
							longSite: '',
							latSite: '',
							siteReady: true
						}
						uni.showToast({
							icon: 'none',
							title: '获取定位失败，请稍后重试',
						})
					})
				})
			},
			openStauts() {
				let openStatus = this.merchData.busiState
				return new Promise((resolve, reject) => {
					if (openStatus === 0) {
						// uni.showModal({
						// 	title: '开启营业',
						// 	content: '祝您生意兴隆',
						// 	success: (res) => {
						// 		if (res.confirm) {
									// if (this.siteReady) {
										// resolve()
										this.isOnSale('openBusi');
									// } else {
								// 		this.getOpenPlace()
								// 		uni.showModal({
								// 			title: '获取定位提醒',
								// 			content: '为确保买家找到您，我们将获取您开店的位置信息。',
								// 			success: (res) => {
								// 				if (res.confirm) {
								// 					this.getOpenPlace()
								// 					uni.showLoading({
								// 						title: '获取位置信息'
								// 					})
								// 					setTimeout(() => {
								// 						uni.hideLoading()
								// 					}, 2000)
								// 				}
								// 			},
								// 		})
										// reject()
									// }
								// } else if (res.cancel) {
								// 	return
								// }
						// 	}
						// })
					} else if (openStatus === 1) {
						// uni.showModal({
						// 	title: '关闭营业提醒',
						// 	content: '您辛苦啦！关店将阻止用户下单！',
						// 	success: (res) => {
						// 		if (res.confirm) {
									// resolve()
									this.isOnSale('closeBusi');
									// this.notAgain = true;
						// 		} else if (res.cancel) {
						// 			return
						// 		}
						// 	}
						// })
					}
				})

			},

			isOnSale(post) {
				if(this.merchNo=='35110000000000'){
					uni.showToast({
						icon: 'none',
						title: '开启成功',
						duration: 2000
					})
					if (post === 'openBusi') {
						this.open = true
						this.merchData.busiState = 1
					} else {
						this.open = false
						this.merchData.busiState = 0
					}
					return
				}
				let vVlue = ''
				if (post === 'openBusi') {
					vVlue = {
						"merchNo": this.merchNo,
						// "longitude": this.longitude,
						// "latitude": this.latitude,
					} //必传 					
				} else if (post === 'closeBusi') {
					vVlue = {
						"merchNo": this.merchNo
					} //必传					
				}
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post(post, {
					...vVlue,
					"sign": sSign
				}, {
					token: true
				}).then(res => {
					uni.showLoading({
						title: '请稍后',
						mask: true
					})
					if (res.code === 200) {
						setTimeout(()=>{
							this.getMerchDetail()
							uni.hideLoading()
							uni.showToast({
								icon: 'none',
								title: res.message,
								duration: 2000
							})
						},2000)
					} else {
						uni.hideLoading()
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 2000
						})
					}
				}).catch((err) => {
					uni.showToast({
						icon: 'none',
						title: err,
						duration: 2000
					})
				})
			},
			onPhone() {
				let no = this.merchData.serviceContactMobile
				let arr = JSON.parse(no)
				let newNo = [].concat.apply([], arr)
				uni.showActionSheet({
					itemList: newNo,
					success: (res) => {
						uni.makePhoneCall({
							phoneNumber: newNo[res.tapIndex]
						})
					}
				})
			},
			dealStatus() {
				let openStatus = this.merchData.busiState
				let busiState = this.merchData.deliverState
                let busiAutoOpen=this.merchData.busiAutoOpen
				let breakfastState = this.merchData.breakfastState
				if (openStatus === 0) {
					this.open = false
				} else if (openStatus === 1) {
					this.open = true
				}
				if(busiAutoOpen===1){
					this.isOpenAutoBusi=true
				}else if(busiAutoOpen===0){
					this.isOpenAutoBusi=false
				} 
				if(breakfastState===1){
					this.isBreakFast=true
				} else if (breakfastState===0){
					this.isBreakFast=false
				}
			},
			logout() {
				uni.showModal({
					content: '是否要退出登录？',
					success: (res => {
						if (res.confirm) {
							let url = this.$config.logoutUrl
							this.$request.postAlone(url, {
								token: true
							}).catch((err) => {
								uni.showToast({
									icon: 'none',
									title: err,
									duration: 2000
								})
							})

							uni.showToast({
								icon: 'none',
								title: '退出成功',
								duration: 2000
							})
							this.$store.commit('logout')
							uni.reLaunch({
								url: '../login/login'
							})

						}
					})
				})
			},
			getMerchDetail() {
				if(this.merchNo=='35110000000000'){
					let testDate = {"merchName":"移移-好友便利店 XM1002","deliverState":0,"busiState":1,"busiAutoOpen":1,"busiHoursStart":"05:15","busiHoursEnd":"23:30","merchPic":"http://res.yiyichina.cn/merch/3a2b8166-ef06-4ab2-985c-e215ddf7c524.jpg","serviceContactMobile":["0592-2096880","0592-2096882"]}
					this.merchData = testDate
					this.dealStatus()
					return
				}
				let vVlue = {
					"merchNo": this.merchNo
				} //必传   
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post('getMerchDetail', {
					...vVlue,
					"sign": sSign
				}, {
					token: true
				}).then(res => {
					this.$api.initPage(res.code, res.message)
					if (res.code === 200) {
						this.merchData = res.data
						uni.setStorageSync('packageFee',res.data.packageFee)
						this.dealStatus()
					}
				}).catch((err) => {
					uni.showToast({
						icon: 'none',
						title: err,
						duration: 2000
					})
				})
			},
			//开启自动营业
			openStore() {
				let busiSwitch;
				if(this.merchData.busiAutoOpen===0){
					busiSwitch=1
				}
				else if(this.merchData.busiAutoOpen===1){
					busiSwitch=0
				}
				if(this.merchNo=='35110000000000'){
					if(this.isOpenAutoBusi){
						this.isOpenAutoBusi=false
					}else {
						this.isOpenAutoBusi=true
					}
					return
				}
				let vVlue = {
					"merchNo": this.merchNo,
					"busiSwitch": busiSwitch
				} //必传   
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post('setBuisSwitch', {
					...vVlue,
					"sign": sSign,
					
				}, {
					token: true
				}).then(res => {
					this.$api.initPage(res.code, res.message)
					if (res.code === 200) {
						this.getMerchDetail();
					}
				}).catch((err) => {
					uni.showToast({
						icon: 'none',
						title: err,
						duration: 2000
					})
				})
			},
			bindTimeChange: function(e) {
				this.merchData.busiHoursStart = e.target.value;
				if(!this.merchData.busiHoursEnd){
					uni.showToast({
						icon: 'none',
						title: '请设置营业结束时间'
					})
					return
				}
				let vVlue = {
					"merchNo": this.merchNo,
					"openTime": this.merchData.busiHoursStart,
					"closeTime":this.merchData.busiHoursEnd,
				} //必传   
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post('setBuisTime', {
					...vVlue,
					"sign": sSign,
					
				}, {
					token: true
				}).then(res => {
					this.$api.initPage(res.code, res.message)
					if (res.code === 200) {
						setTimeout(()=>{
							this.getMerchDetail();
						},500)
					}
				}).catch((err) => {
					uni.showToast({
						icon: 'none',
						title: err,
						duration: 2000
					})
				})
			},
			bindEndTimeChange: function(e) {
				this.merchData.busiHoursEnd = e.target.value;
				if(!this.merchData.busiHoursStart){
					uni.showToast({
						icon: 'none',
						title: '请设置营业开始时间'
					})
					return
				}
				let vVlue = {
					"merchNo": this.merchNo,
					"openTime": this.merchData.busiHoursStart,
					"closeTime":this.merchData.busiHoursEnd,
				} //必传   
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post('setBuisTime', {
					...vVlue,
					"sign": sSign,
					
				}, {
					token: true
				}).then(res => {
					this.$api.initPage(res.code, res.message)
					if (res.code === 200) {
						setTimeout(()=>{
							this.getMerchDetail();
						},500)
					}
				}).catch((err) => {
					uni.showToast({
						icon: 'none',
						title: err,
						duration: 2000
					})
				})
			},
			fastTimeChange: function(e) {
				this.merchData.breakfastStart = e.target.value;
				if(!this.merchData.breakfastEnd){
					uni.showToast({
						icon: 'none',
						title: '请设置早餐结束时间'
					})
					return
				}
				let vVlue = {
					"merchNo": this.merchNo,
					"openTime": this.merchData.breakfastStart,
					"closeTime":this.merchData.breakfastEnd,
				} //必传   
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post('setBreakfastTime', {
					...vVlue,
					"sign": sSign,
					
				}, {
					token: true
				}).then(res => {
					this.$api.initPage(res.code, res.message)
					if (res.code === 200) {
						setTimeout(()=>{
							this.getMerchDetail();
						},500)
					}
				}).catch((err) => {
					uni.showToast({
						icon: 'none',
						title: err,
						duration: 2000
					})
				})
				
			},
			fastEndTimeChange: function(e) {
				this.merchData.breakfastEnd = e.target.value;
				if(!this.merchData.breakfastStart){
					uni.showToast({
						icon: 'none',
						title: '请设置早餐开始时间'
					})
					return
				}
				let vVlue = {
					"merchNo": this.merchNo,
					"openTime": this.merchData.breakfastStart,
					"closeTime":this.merchData.breakfastEnd,
				} //必传   
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post('setBreakfastTime', {
					...vVlue,
					"sign": sSign,
					
				}, {
					token: true
				}).then(res => {
					this.$api.initPage(res.code, res.message)
					if (res.code === 200) {
						setTimeout(()=>{
							this.getMerchDetail();
						},500)
					}
				}).catch((err) => {
					uni.showToast({
						icon: 'none',
						title: err,
						duration: 2000
					})
				})
			},
			openFast() {
				let url
				if(this.merchData.breakfastState === 0){
					url = 'openBreakfast'
				} else if (this.merchData.breakfastState === 1){
					url = 'closeBreakfast'
				}
				let vVlue = {
					"merchNo": this.merchNo
				} //必传 
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post(url, {
					...vVlue,
					"sign": sSign,
					
				}, {
					token: true
				}).then(res => {
					this.$api.initPage(res.code, res.message)
					uni.showLoading({
						title: '请稍后',
						mask: true
					})
					if (res.code === 200) {
						setTimeout(()=>{
							this.getMerchDetail()
							uni.hideLoading()
							uni.showToast({
								icon: 'none',
								title: res.message,
								duration: 2000
							})
						},2000)
					} else {
						uni.hideLoading()
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 2000
						})
					}
				}).catch((err) => {
					uni.showToast({
						icon: 'none',
						title: err,
						duration: 2000
					})
				})
			},
			setVolume(){
				this.issetVolume = !this.issetVolume
				if(this.issetVolume){
					plus.device.setVolume(1)
					uni.setStorageSync('Volume',true)
				} else {
					uni.removeStorageSync('Volume')
				}
			},
		}
	}
</script>

<style lang="scss">
	#set-app {
		width: 100%;
		padding: 20rpx;

		.group {
			border-radius: 8rpx;
			background-color: #FFFFFF;
			position: relative;
			margin-bottom: 20rpx;

			.userpic {
				font-weight: 550;
				color: #bbb;
			}

			.picImg {
				border-radius: 50%;
				width: 80rpx;
				height: 80rpx;
			}

			.text-muted {
				color: #999999;
				text-align: right;
				justify-content: center;
			}

			.callText {
				color: #46B85B;
				display: flex;
				align-items: center;
				border-radius: 30rpx;
				font-size: 28rpx;
				padding: 8rpx 16rpx;
				background-color: #F1F1F1;

				.iconfont {
					font-size: 40rpx;
				}
			}
			.picker-box uni-picker{
				display: inline-block;
				background: #f4f4f4;
				padding: 8rpx 20rpx 4rpx;
			}
		}

		.logout {
			text-align: center;
		}
	}
</style>