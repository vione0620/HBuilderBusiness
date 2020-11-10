<template>
	<view id="oderIndex"> 
	<template v-if="iswelcome">
		<welcome></welcome>
	</template>
	
	<template v-if="isload">
		<default-page :load="true"></default-page>
	</template>
	
	<template v-if="isready">  
		<view id="mian">
			<view class="total">{{parseFloat(recAmt/100).toFixed(2)}}<text class="txt">元</text></view>
			<view class="getMoney">
				<navigator class="btn" url="../../wallet/moeny/moeny">提现</navigator> 
			</view>

			<view class="count">
				<view class="item">
					<text class="txt">今日付款数</text>
					<view class="txt">{{payOrderNum}}</view>
				</view>
				|
				<view class="item">
					<text class="txt">今日访客量</text>
					<view class="txt">{{visitorNum}}</view>
				</view>
			</view>

			<view class="tools">
				<view class="item" @tap="openScanCode">
					<view class="icon iconfont iconscan"></view>
					<text class="txt">取货码</text>
				</view>
				<view class="item" @tap="orderScanCode">
					<view class="icon iconfont iconercode"></view>
					<text class="txt">商家码</text>
				</view>
				<view class="item" @tap="openUserList">
					<view class="icon iconfont iconorderlist"></view>
					<text class="txt">用户订单</text>
				</view> 
			</view>

		</view>
 

		<view id="entry-list">
			<block v-for="(item,index) in gotolist" :key="'4'+ index">
				<view class="item" @tap="navTo(item.urls)">
					<view class="icon" :class="item.icon"></view>
					<view class="txt">{{item.text}}</view>
				</view>
			</block>
			<block v-for="(item,index) in serVer" :key="'7'+ index">
				<view class="item" :phone="item.phone" @tap="openSever(index)">
					<view class="icon" :class="item.icon"></view>
					<view class="txt">{{item.text}}</view> 
				</view>
			</block>

		</view>

		<view class="unlinkto">
			<!-- <view class="text">违约申述</view> --> 
			<view class="text" @tap="navTo('../helper/helper')">帮助中心</view>
		</view>
  

	</template>

	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	import {b64Md5,hexMD5,} from '@/network/md5.js'
	import {getSortAscii} from '@/common/util/utils.js'

	import UniNavBar from '@/components/uni/uni-nav-bar.vue'
	import UniBadge from '@/components/uni/uni-badge.vue' 
	import DefaultPage from '@/components/basic/default-page.vue'
	import Welcome from '@/components/basic/welcome.vue'
	
	const gotolist = [{
			"icon": 'iconfont iconorder-report',
			"text": "经营报表",
			"urls": "../../wallet/report/report"
		},
		{
			"icon": 'iconfont iconorder-home',
			"text": "商家下单",
			"urls": "../mall/mall"
		},
		{
			"icon": 'iconfont iconoder-stock',
			"text": "商家库存",
			"urls": "../../utility/stock/stock"
		},
		{
			"icon": 'iconfont iconmanage',
			"text": "运营管理",
			"urls": "../../utility/manage/manage"
		},
		{
			"icon": 'iconfont iconoder-entry',
			"text": "商家订单",
			"urls": "../../finance/outlay/list"
		},
		{
			"icon": 'iconfont iconoder-entry-history',
			"text": "收款记录",
			"urls": "../../wallet/entry/entry"
		},
		{
			"icon": 'iconfont icon-agency',
			"text": "订制管理",
			"urls": "../../finance/agent/agent"
		},
		{
			"icon": 'iconfont icon-money',
			"text": "订制红包",
			"urls": "../../wallet/rebate/rebate"
		},  
	]
	const serVer = [{
			"icon": 'iconfont iconcontact',
			"text": "客服",
			"phone": " "
		}, 
	]



	export default {
		components: {
			UniBadge, 
			DefaultPage,
			Welcome,
			UniNavBar,
		},
		data() {
			return { 
				gotolist,
				serVer, 
				payOrderNum: '0',
				visitorNum: '0',
				recAmt: '0', 
				loginWhether:'',//登陆状态
				userStore:'', //用户信息
				merchNo:'', //商户号
				getScan:'',//扫码 
				isload:false,
				isnohave:false,
				isready:false, 
				iswelcome:true,//欢迎页
				refreshed:'',
				fromlogin:false,
			}
		}, 
		onLoad(option) {   
			this.loadExecution() 
			this.loginWhether = uni.getStorageSync('status') 
			this.userStore = uni.getStorageSync('user')
			this.merchNo = uni.getStorageSync('user').merchNo		
			
			let login_type = option.loginType 
			if(!this.iswelcome){ 			
				if(login_type === 'login'){ 
					this.fromLogin() 
				}else{ 
					this.initUser() 
				}
			} 
		}, 
		onNavigationBarButtonTap(tap){
			if(tap.index === 0){
				uni.navigateTo({
					url:'../../account/option/option',
					animationType: 'pop-in',
					animationDuration: 200
				})
			}
		}, 
		methods: {  
			loadExecution(){ 
				try { 
					const value = uni.getStorageSync('launchFlag') 
					if (value) { 
						this.iswelcome = false 
					} else { 
						this.iswelcome = true
					}
				} catch(e) { 
					uni.setStorage({ 
						key: 'launchFlag', 
						data: true, 
						success:()=> {
							// console.log('error时存储launchFlag')
						} 
					})
					this.iswelcome = true
				}
				return 
			}, 
			fromLogin(){				  
				this.getDayBusiStat('getDayBusiStat',this.loginWhether.md5key) 
				this.getServiceMobile('getServiceMobile',this.loginWhether.md5key)  
				this.$api.getUserDev()
				this.getUploadDev()
				this.ownPaypwd('ownPaypwd',this.loginWhether.md5key)
				this.fromlogin = true
			}, 
			initUser() {  
				let vVlue = {"merchNo": this.merchNo} //必传
				let sSort = getSortAscii(vVlue) ///排序   		
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase()	
				
				this.$request.post('refresh',{
					...vVlue, 
					"sign": sSign,
					},{
						token: true
					}).then((res) => {
						
						if (res.code === 200) {
							let haslogin = {
								status:true,
								token:res.data.token,
								md5key:res.data.md5key,
								merchNo:this.merchNo,
								joinCategory:this.userStore.joinCategory,
								serverTime:this.userStore.serverTime,
							}
							uni.setStorageSync('status',haslogin)  
							this.fromlogin = false 
							this.refreshed = res.data.md5key 
							
							this.getDayBusiStat('getDayBusiStat',this.refreshed) 
							this.getServiceMobile('getServiceMobile',this.refreshed) 
							
						}else if(res.code === 500){
							uni.showToast({ 
								icon:'none',
								title:res.message + '请稍后重试',
								duration: 2000
							})
						}else{ 
							uni.reLaunch({
								url:'../../account/login/login'
							}) 
						}
					}).catch((err)=>{ 
						uni.reLaunch({
							url:'../../account/login/login'
						}) 
					}) 
			},
			getServiceMobile(post,key){
				let vVlue = {"merchNo": this.merchNo} //必传
				let sSort = getSortAscii(vVlue) ///排序   		
				let sSign = hexMD5(sSort + "&key=" + key).toUpperCase()	
				this.$request.post('getServiceMobile', {
					...vVlue,
					"sign": sSign
				},{
					token:true
				}).then((res) => {   
					if (res.code === 200) { 		
						let newNo = JSON.parse(res.data.serviceMobile)  									
						this.serVer[0].phone = [].concat.apply([], newNo) 
					}
				}).catch()  
			},
			getDayBusiStat(post,key){
				let vVlue = {"merchNo": this.merchNo} //必传
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + key).toUpperCase() 			
				this.$request.post('getDayBusiStat', {
					...vVlue,
					"sign": sSign
				},{
					token:true
				}).then((res) => { 	
					this.$api.initPage(res.code,res.message)  
					if(res.code === 200){	
						let resData = res.data
						setTimeout(()=>{	
							this.isload = false
							this.isready = true	
							
							this.payOrderNum = resData.payOrderNum
							this.visitorNum = resData.visitorNum
							this.recAmt = resData.recAmt
						},300)
					}
				}).catch()
			},
			ownPaypwd(post,key){ 
				let vVlue = {"merchNo": this.merchNo} //必传
				let sSort = getSortAscii(vVlue) ///排序   		
				let sSign = hexMD5(sSort + "&key=" + key).toUpperCase()	 
				this.$request.post('ownPaypwd', {
					...vVlue,
					"sign": sSign
				},{
					token:true
				}).then((res) => {  
					if (res.code === 200) { 
						uni.setStorageSync('initPayPaswd',res.data.own) 
					}
				}).catch() 
			},
			getUploadDev(){ 
				let userSystem = uni.getStorageSync('user-system') 
				
				if(userSystem.cid === '' || userSystem.platform === ''){
					return
				}
				let vVlue = {
					"merchNo": this.merchNo,
					"devType":userSystem.platform,
					"cid":userSystem.cid,
				} //必传 
				let sSort = getSortAscii(vVlue) ///排序    
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() 
				
				if(userSystem.platform || userSystem.cid){				
					this.$request.post('uploadDev', {	
						...vVlue,
						"sign": sSign
					},{
						token:true
					}).catch() 
				
				}
			}, 
			navTo(path) { 
				uni.navigateTo({ 
					url:path,
					animationType: 'pop-in',
					animationDuration: 200
				});
			},			
			openSever(index) { 
				let newNo = this.serVer[index].phone 
				uni.showActionSheet({
					itemList: newNo,
					success: (res)=>{  
						uni.makePhoneCall({
							phoneNumber: newNo[res.tapIndex]
						});  
					}
				});  
			},
			openScanCode() {
				uni.scanCode({
					onlyFromCamera: true,
					success: (res)=>{  
						console.log(res)
						let allright = res.result.indexOf('osign') 
						if(res.scanType === "QR_CODE"){
							let scan = JSON.parse(res.result)  
							if(allright){									
								this.$request.postAlone(scan.main,{ 
									"merchNo": this.merchNo,
									"orderNo":scan.orderNo,
									"userNo": scan.userNo,
									"osign":scan.osign, 
								},{
									token:true
								}).then(res => {   
									uni.showToast({
										icon:'none',
										title:res.message,
										duration: 2000
									})
								}).catch()
							}else{
								uni.showToast({
									icon:'none',
									title:'请核对取货码',
									duration:2000
								})
							}
						}else{ 
							uni.showToast({
								icon:'none',
								title:'二维码扫描不完整',
								duration: 2000
							}) 
						}
					},
					fail:(err)=>{
						console.log(err)
					}

				});
			},
			orderScanCode() {
				uni.navigateTo({
					url: '../shop/code',
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			openUserList() { 
				uni.navigateTo({
					url: '../../finance/sell/unity/unity',
					animationType: 'pop-in',
					animationDuration: 200
				}); 
			},		  
			onPullDownRefresh(){
				let platform = uni.getSystemInfoSync().platform
				if(platform == "android"){ 
					uni.startPullDownRefresh()										
				}				
				if(this.fromlogin){
					this.getDayBusiStat('getDayBusiStat',this.loginWhether.md5key) 	
				}else{
					if(this.refreshed){
						this.getDayBusiStat('getDayBusiStat',this.refreshed) 							
					}else{
						setTimeout(()=>{								
							this.getDayBusiStat('getDayBusiStat',this.refreshed) 	
						},100)
					}
				}
				setTimeout(function () {
					uni.stopPullDownRefresh()
				}, 1000)
			},
		}
	}
</script>

<style lang="scss">
	#oderIndex {
		#mian {
			width: 100%;
			height: 330rpx;
			background-color: #46B85B;
			position: relative;
			margin-bottom: 90rpx;
		}

		.total {
			font-size: 60rpx;
			text-align: center;
			color: #FFFFFF;

			.txt {
				font-size: 20rpx;
				padding-left: 8rpx;
			}

		}

		.getMoney {
			text-align: center;
			padding: 16rpx 0 10rpx 0;

			.btn {
				display: inline-flex;
				font-size: 30rpx;
				color: #FFFFFF;
				border: 1px solid #FFFFFF;
				padding: 6rpx 80rpx;
				border-radius: $uni-border-radius-lg;
				line-height: 1.8;
			}
		}



		.count {
			display: flex;
			color: #FFFFFF;
			padding: 20rpx 0 0 0;
			font-size: 26rpx;
			line-height: 1;

			.item {
				flex: 1;
				display: flex;
				align-items: center;
				padding-left: 20rpx;

				.txt {
					justify-content: space-between;
					flex: 1;
					text-align: center;
					font-weight: bolder;
				}

				.txt:first-child {
					width: 70%;
					font-weight: normal;
				}

			}

		}


		.tools {
			display: flex;
			position: absolute;
			background-color: #FFFFFF;
			width: 84%;
			left: 8%;
			right: 8%;
			bottom: -18%;
			box-shadow: 0 3px 4px #e1e5e9;
			border-radius: 12rpx;
			padding: 20rpx 12rpx;

			.item {
				flex: 1;
				text-align: center;
				justify-content: center;
			}

			.icon {
				font-size: 80rpx;
				color: #46B85B;
				line-height: 1;
				position: relative;

				.newsBadge {
					position: absolute;
					top: 0;
					right: 0;
					width: 0;
					height: 0;

					.badge {
						position: absolute;
						right: 44rpx;
						top: -8rpx;
						color: #FF0000;
					}
				}

			}

			.txt {
				font-size: $uni-font-size-sm;
				color: #333333;
			}
		}

		#entry-list {
			border-radius: 12rpx;
			box-shadow: 0px 0px 2px #CCCCCC;
			width: 90%;
			margin: 0 auto;
			height: auto;
			display: flex;
			flex-wrap: wrap;
			padding-top: 30rpx;
			background-color: #FFFFFF;
			padding: 40rpx;

			.item {
				width: 33.33333333333%;
				text-align: center;
				padding-bottom: 30rpx;
				padding-top: 20rpx;

				.icon {
					color: #46B85B;
					border-radius: 50%;
					border: 1px solid #9E9E9E;
					width: 100rpx;
					height: 100rpx;
					font-size: 60rpx;
					line-height: 1.6;
					margin: 0 auto;
				}

				.txt {
					color: #333333;
					font-size: 30rpx;
					padding-top: 22rpx;
				}
			}

		}

		.unlinkto {
			padding: 20rpx;
			text-align: center;
			font-size: 26rpx;
			display: flex;
			justify-content: center;
			.text {
				padding: 12rpx;
				color: #295FEB;
			}
		}
	}
</style>
