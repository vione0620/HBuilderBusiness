<template>
	<view id="set-app">  
	<view class="set-main">
		<view class="group">   
			<uni-list-item title="店铺名称">
				<view slot="right">{{merchData.merchName}}</view></uni-list-item>
				<uni-list-item title="开始营业"> 
					<view slot="right" class="text-muted"> 
						<evan-switch v-model="open" :disabled="notAgain" :beforeChange="openStauts"
						activeColor="#46B85B" :size="22"></evan-switch>
				</view>
			</uni-list-item>
			<uni-list-item title="营业时间"> 
				<view slot="right" class="text-muted">					
						{{merchData.busiHoursStart}} - {{merchData.busiHoursEnd}} 
				</view>
			</uni-list-item> 
		</view>
		<view class="group"> 
			<uni-list-item title="修改密码"  @click="navTo('../passwd/passwd?type=change')"></uni-list-item>
			<uni-list-item title="关联账号"  @click="navTo('../authid/authid')"></uni-list-item>
			<uni-list-item title="银行卡管理"  @click="navTo('../../wallet/type/brand')"></uni-list-item>
			<uni-list-item title="支付管理"  @click="navTo('../../payment/payment')"></uni-list-item> 
		</view> 
		
		<view class="group"> 
			<!-- <uni-list-item title="关于移移" @click="navTo('../../utility/about/about')"></uni-list-item> -->
			<!-- <uni-list-item title="关于移移"></uni-list-item> -->
			<uni-list-item title="客服热线" @tap="onPhone">   
				<view slot="right" class="callText"><text class="iconfont icondianhua-copy"></text>立即联系</view>
			</uni-list-item>   
		</view>
		
	</view>	
		
		<view class="group logout" hover-class="animate__animated animate__pulse">
			<view @click="logout">退出登录</view>			
		</view>
	</view>
</template>

<script> 
	import {mapState} from 'vuex'
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii} from '@/common/util/utils.js'
	
	import UniListItem from '@/components/uni/uni-list-item.vue'
	import EvanSwitch from '@/components/plugin-ui/evan-switch.vue'	
	export default {
		components:{
			UniListItem,
			EvanSwitch,
		}, 
		data() {
			return { 
				index: 0, 
				merchData:{
					merchName: "",
					deliverState: 0,
					busiState: 0,
					busiHoursStart: "",
					busiHoursEnd: "",
					merchPic: "",
					serviceContactMobile: ""
				},
				open: false, //营业 
				longitude:'',
				latitude:'',
				siteReady:false, 
				notAgain:false,
				loginWhether:'',//登陆状态 
				merchNo:'', //商户号				
			}
		}, 
		onLoad() { 
			this.loginWhether = uni.getStorageSync('status')  
			this.merchNo = uni.getStorageSync('user').merchNo		
			
			this.getMerchDetail() 
			// this.getOpenPlace() 
			this.initsietPlace()//一次获取坐标 
		},
		methods: { 		
			pinckerTime(e) { 
				this.index = e.target.value	
			}, 
			navTo(path){
				uni.navigateTo({
					url: path, 
				})
			},
			initsietPlace(){				
				let sitePlace = uni.getStorageSync('sitePlace')
				if(sitePlace){
					this.siteReady = true		
					this.longSite = sitePlace.longSite
					this.latSite = sitePlace.latSite  			
				}else{
					this.siteReady = false
					let failplace = {
						longSite:'',
						latSite:'',
						siteReady:true
					} 					
				}
			},
			getOpenPlace(){ //获取经营坐标
				uni.getLocation({
					type:'gcj02',
					success: (res=> {			 
						let longNums = JSON.stringify(res.longitude)
						let latNums = JSON.stringify(res.latitude)
						
						let site1 = longNums.indexOf('.')
						let site2 = latNums.indexOf('.')
						let longSite = longNums.slice(0,site1) + longNums.slice(site1,site1+7)
						let latSite  = latNums.slice(0,site2) + latNums.slice(site2,site2+7)
						  
						this.siteReady = true
						this.longSite = longSite
						this.latSite = latSite  
					}),
					fail:(fail=>{
						this.siteReady = false
						let failplace = {
							longSite:'',
							latSite:'',
							siteReady:true
						}
						uni.showToast({
							icon:'none',
							title:'获取定位失败，请稍后重试', 
						})
					})
				})  
			},
			openStauts(){
				let openStatus = this.merchData.busiState  
				return new Promise((resolve, reject) => {
					if(openStatus === 0){ 
						uni.showModal({
							title:'开启营业',
							content:'祝您生意兴隆', 
							success:(res)=>{  
								if(res.confirm){ 	 
									if(this.siteReady){
										resolve()  
										this.isOnSale('openBusi') 										
									}else{
										this.getOpenPlace()
										uni.showModal({ 
											title:'获取定位提醒',
											content:'为确保买家找到您，我们将获取您开店的位置信息。',
											success: (res)=>{ 
												if(res.confirm){
													this.getOpenPlace()
													uni.showLoading({
														title: '获取位置信息'
													})
													setTimeout(()=>{
														uni.hideLoading()
													}, 2000) 
												}
											}, 
										}) 
										reject()
									}  
								}else if(res.cancel){
									return
								} 
							}
						}) 
					}else if(openStatus === 1){					
						uni.showModal({
							title:'关闭营业提醒',
							content:'您辛苦啦！关闭营业将同时清空店铺库存，因此当天不可重复开店',
							success: (res) => {
								if(res.confirm){
									resolve()  			
									this.isOnSale('closeBusi') 
									this.notAgain = true
								}else if(res.cancel){  
									return
								}
							}
						})
					} 
				})
				
			},
			
			isOnSale(post){
				let vVlue = ''
				if(post === 'openBusi'){
					vVlue = {"merchNo": this.merchNo,"longitude":this.longSite,"latitude":this.latSite,} //必传 					
				}else if(post === 'closeBusi'){
					vVlue = {"merchNo": this.merchNo} //必传					
				}				
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post(post,{
					...vVlue,  
					"sign": sSign
				},{
					token:true
				}).then(res=>{  
					uni.showToast({
						icon:'none',
						title:res.message,
						duration: 2000
					})  
					if(res.code === 200){ 
						if(post === 'openBusi'){
							this.open = true 
						}else{
							this.open = false							
						}
					}else{
						this.open = false
					}	 
				}).catch((err)=>{
					uni.showToast({
						icon:'none',
						title:err,
					    duration: 2000 
					})
				})
			}, 
			onPhone(){	   
				let no = this.merchData.serviceContactMobile 
				let arr = JSON.parse(no)
				let newNo = [].concat.apply([], arr) 
				uni.showActionSheet({
					itemList: newNo,
					success: (res)=>{ 
						uni.makePhoneCall({
							phoneNumber: newNo[res.tapIndex]
						})
					}
				})
			}, 
			dealStatus(){				
				let openStatus = this.merchData.busiState 
				let busiState = this.merchData.deliverState 
				
				if(openStatus === 0){
					this.open = false 
				}else if(openStatus === 1){
					this.open = true 
				} 
			},
			logout(){
				uni.showModal({ 
				    content: '是否要退出登录？',
				    success: (res=>{
				        if (res.confirm) {  							
							let url = this.$config.logoutUrl
							this.$request.postAlone(url,{ 
								token:true
							}).catch((err)=>{
								uni.showToast({
									icon:'none',
									title:err,
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
								url:'../login/login'
							}) 
							
				        } 
				    })
				})
			}, 
			getMerchDetail(){
				let vVlue = {"merchNo": this.merchNo} //必传   
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post('getMerchDetail',{
					...vVlue,
					"sign":sSign
				},{
					token:true
				}).then(res=>{  
					this.$api.initPage(res.code,res.message) 
					if(res.code === 200){
						this.merchData = res.data
						this.dealStatus()
					}
				}).catch((err)=>{
					uni.showToast({
						icon:'none',
						title:err,
					    duration: 2000 
					})
				}) 
			},
		}
	}
</script>

<style lang="scss">
#set-app{
	width: 100%;
	padding: 20rpx;
	.group{ 
		border-radius: 8rpx; 
		background-color: #FFFFFF;
		position: relative; 
		margin-bottom: 20rpx;
		.userpic{
			font-weight: 550;
			color: #bbb;
		}
		.picImg{
			border-radius: 50%;
			width: 80rpx;
			height: 80rpx;
		}
		.text-muted{
			color: #999999;
			text-align: right;
			justify-content: center;
		}
		 .callText{ 
			color: #46B85B;
			display: flex;
			align-items: center;
			border-radius:30rpx;
			font-size: 28rpx;
			padding:8rpx 16rpx;
			background-color: #F1F1F1; 
			.iconfont{
				font-size: 40rpx;
			}
		 }
	}
	.logout{
		padding: 32rpx 0;
		text-align: center;
		position: fixed;
		bottom: 0;
		left: 20rpx;
		right: 20rpx;
	}
}
</style>
