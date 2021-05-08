4<template>
	<view class="moeny-check"> 
		<view class="group"> 
			<view class="title">提现金额</view>
			<view class="contMain"> 
			<input class="nums" type="number" placeholder="0.00" v-model="getMoney"
			@blur="chooseAmt" @confirm="chooseAmt" />
			<text class="lab">元</text></view> 
		</view>
		
		<view class="group-type">			
			<radio-group @change="radioChange">
				<pop-up names="支付宝" iconImg="alipay">
					<view slot="radioPay"><radio :value="checktype[0]" color="#09BB07" /></view>
				</pop-up>
				<pop-up names="微信" iconImg="weixin">
					<view slot="radioPay"><radio :value="checktype[1]" color="#09BB07" /></view>
				</pop-up>
				<!-- <pop-up names="银行卡" iconImg="ccb">
					<view slot="radioPay"><radio :value="checktype[2]" color="#09BB07" /></view>
				</pop-up> -->
			</radio-group>
			
		</view>
		
		<btn-foot title="确认提现" @tap="verifyPassword()"></btn-foot>
		 
		 
		<uni-popup ref="isPreVerify" type="center" :maskClick="false">
			<view class="preVerify">
				<view class="title">请输入支付密码</view>
				<view class="main">  
					<input type="number" maxlength="6" class="in_put" 
					@input="checkPwd" v-model="passwd" focus="true" cursor-spacing="50" adjust-position="true"/>  
					<view class="substitute"> 
						<view class='dot-wrap'>
							<view class="dot">{{passwd[0]? '•' : ''}}</view>
							<view class="dot">{{passwd[1]? '•' : ''}}</view>
							<view class="dot">{{passwd[2]? '•' : ''}}</view>
							<view class="dot">{{passwd[3]? '•' : ''}}</view>
							<view class="dot">{{passwd[4]? '•' : ''}}</view>
							<view class="dot">{{passwd[5]? '•' : ''}}</view> 
						</view> 
					</view>
					
				</view>
				<view class="btn">
					<view class="item cancel" @tap="Ncancel()">取消</view>
					<view class="item confirm" @tap="Yconfirm()">确认</view>
				</view>
			</view>
		</uni-popup>
		
		
		<uni-popup ref="gotosetPwd" type="center" :maskClick="false">
			<view class="preVerify">
				<view class="title">请设置支付密码</view>
				<view class="main"> 
					<view class="info">为了账户安全，请设置支付密码</view>
				</view>
				<view class="btn">
					<view class="item cancel" @tap="setCencel()">取消</view>
					<view class="item confirm" @tap="setConfirm()">去设置</view>
				</view>
			</view>
		</uni-popup>
		
		
		<uni-popup ref="gotoauthid" type="center" :maskClick="false">
			<view class="preVerify">
				<view class="title">安全提醒</view>
				<view class="main"> 
					<view class="info">提现失败！请先关联提现账号</view>
				</view>
				<view class="btn">
					<view class="item cancel" @tap="setCencel()">取消</view>
					<view class="item confirm" @tap="authidConfirm()">确认</view>
				</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii,paymentPaswd} from '@/common/util/utils.js'
	
	import UniPopup from '@/components/uni/uni-popup.vue' 
	import PopUp from '@/components/BuyMall/rk-pop.vue'
	import BtnFoot from '@/components/basic/btn-foot.vue'
	export default{
		data(){
			return {
				loginWhether:'',//登陆状态 
				merchNo:'', //商户号 
				checktype:['alipay','weixin','ccb'],
				typeNo:'',
				value:[],
				passwd:[],
				dotpwd:[],  
				getMoney:'',
				postMoeny:'',  
			}
		},
		computed:{ 
			...mapState(['getMoneyQuota']), 
		},
		components:{
			BtnFoot,
			UniPopup,
			PopUp, 
		}, 
		onLoad(option) { 			 
			this.loginWhether = uni.getStorageSync('status') 
			this.userStore = uni.getStorageSync('user')
			this.merchNo = uni.getStorageSync('user').merchNo 
			if(option.money){
				this.getMoney = parseFloat(option.money/100).toFixed(2)
				this.postMoeny = this.getMoney
			}
		}, 
		methods:{  
			chooseAmt(e){  
				let value = e.target.value 
				if(value > 0 && value < 1){
					uni.showToast({
						icon:'none',
						title:'您可申请不小于1元的金额'
					})
					this.getMoney = ''					
				}else if(value >= 1){					
					this.getMoney = parseFloat(e.target.value).toFixed(2)
					this.postMoeny = e.target.value
				}else if(value == ''){
					this.postMoeny = ''
				}
			},			
			radioChange(e){
				this.chooseType = e.target.value 
				switch (this.chooseType){ 
					case 'alipay': 
					this.typeNo = 2
					break;
					case 'weixin':  
					this.typeNo = 1
					break;
					// case 'ccb': 
					// console.log('ccb',this.chooseType)
					// return uni.showToast({
					// 	icon:'none',
					// 	title:'当前不支持银行卡，敬请期待'
					// })
					// this.typeNo = 3
					// break;
				}
				
			}, 
			verifyPassword(){
				if(this.typeNo == ''){				
					uni.showToast({
						icon:'none',
						title:'请选择提现账户',
						duration: 2000
					})					
				}else if(this.postMoeny == ''){ 
					uni.showToast({
						icon:'none',
						title:'请输入提现金额',
						duration: 2000
					}) 
				}else if(this.postMoeny > this.getMoneyQuota/100){
					uni.showToast({
						icon:'none',
						title:'您当前账户余额不足',
						duration: 2000
					})
				}else{ 
					let fristTime = uni.getStorageSync('initPayPaswd')
					if(fristTime === 1){
						this.$refs.isPreVerify.open()
					}else if(fristTime === 0){
						this.$refs.gotosetPwd.open()
					} 
				}
			},  
			checkPwd(e){  
				this.value = e.target.value
				this.passwd = this.value
				this.dotpwd = this.value
			},
			Yconfirm(){ 
				if(this.passwd == '' || this.passwd.length < 6){ 
					return
				}else if(this.passwd.includes('.')){
					uni.showLoading()
					setTimeout(()=>{
						uni.hideLoading()
						uni.showToast({
							icon:'none',
							title:'请输入纯数字密码',
							duration: 2000
						})
						this.passwd = []
						this.dotpwd = []
						
					},500) 
				}else{
					let serial = paymentPaswd(this.passwd) 
					if(serial){
						uni.showLoading()
						setTimeout(()=>{ 
							uni.hideLoading()							
							this.accountBalanceCash()
						},500) 
					}else if(!serial){	
						uni.showLoading()
						setTimeout(()=>{ 
							uni.showToast({
								icon:'none',
								title:'密码太简单或连续数字',
								duration: 2000
							})
						},500)  	
						this.passwd = []
						this.dotpwd = []
					} 
				} 
			},
			setCencel(){				
				uni.navigateBack({
					delta: 1,
					animationType: 'pop-out',
					animationDuration: 200
				}); 
			},
			setConfirm(){				
				uni.redirectTo({
					url:'../../payment/setup?type=setup&page=check'
				})
			},
			authidConfirm(){
				uni.redirectTo({
					url:'../../account/authid/authid'
				}) 
			},
			Ncancel(){
				this.$refs.isPreVerify.close() 
				this.passwd = ''
				this.dotpwd = ''
				uni.navigateBack({
					delta: 1,
					animationType: 'pop-out',
					animationDuration: 200
				});
			},
			accountBalanceCash(){ 
				let moeny = this.postMoeny * 100
				let vVlue = {
					"merchNo": this.merchNo,
					"cashAmt":parseFloat(moeny).toFixed(0),
					"cashType":this.typeNo,
					"payPwd":this.passwd,
					} //必传
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码
				this.$request.post('accountBalanceCash',{
					...vVlue,
					"sign":sSign
				},{
					token:true
				}).then(res=>{ 
					uni.showLoading()
					this.$refs.isPreVerify.close() 
					
					setTimeout(()=>{		 
						this.passwd = []
						this.dotpwd = []
						uni.hideLoading()
						if(res.code === 200){  
							if(res.data.cashCode == 1){											
								uni.showToast({
									icon:'none',
									title:'提现成功',
									duration: 2000
								})
								uni.redirectTo({
									url:`./result?type=ok`
								}) 
							}else if(res.data.cashCode == 2){								
								uni.showToast({
									icon:'none',
									title:'提现失败',
									duration: 2000
								})
								uni.redirectTo({
									url:`./result?type=fail&msg=${res.message}`
								}) 								
							}else if(res.data.cashCode == 3){									
								uni.showToast({
									icon:'none',
									title:'处理中',
									duration: 2000
								})
								uni.redirectTo({
									url:`./result?type=fail&msg=${res.message}`
								}) 								
							}		
						}else{
							if(res.code === 412){
								uni.showToast({
									icon:'none',
									title:res.message,
									duration: 2000
								})	
								//没有关联账号 		 
								uni.navigateTo({
									url: '../../account/authid/authid',
									animationType: 'pop-in',
									animationDuration: 200
								})  
							}else if(res.code === 302){ 
								uni.showToast({
									icon:'none',
									title:res.message,
									duration: 2000
								})	
								//未设置密码 
								uni.navigateTo({
									url: '../../payment/setup?type=setup', 
									animationType: 'pop-in',
									animationDuration: 200
								}) 
							}else if(res.code === 400){								
								uni.showToast({
									icon:'none',
									title:res.message,
									duration: 2000
								})	
								uni.redirectTo({
									url:`./result?type=fail&msg=${res.message}`
								}) 
							}else if(res.code === 403){								
								uni.showToast({
									icon:'none',
									title:res.message,
									duration: 2000
								})	
							} else if(res.code === 404){ 									
								uni.showModal({
									title:'安全提醒',
									content:res.message,
									showCancel:false,
									success: (res) => {
										if(res.confirm){
											uni.navigateTo({
												url: '../../payment/setup?type=forget', 
												animationType: 'pop-in',
												animationDuration: 200
											}) 
										}
									}
								})	
							} 
						}
						
					},500)
					
				}).catch(err=>{
					console.log(err)
				})
			},
		},
		
	}
</script>

<style scoped lang="scss">  
	.moeny-check{ 
		width: 100%;
		padding: 20rpx;
		border-radius: 8rpx;
		
		
		.group{
			background-color: #FFFFFF;
			padding: 40rpx;
			margin-bottom: 20rpx;
			text-align: left;
			
			.title{
				font-size: 30rpx; 
				
				// width: 100%; 
				// text-align: center;
			}
			.contMain{
				padding: 20rpx 0;
				display: flex;
				align-items: center;
				.nums{
					font-size: 80rpx;					
				}
				.lab{
					font-size: 40rpx;
				}
			}
			.info{
				border-top: 1px solid #d4d4d4;
				padding-top: 20rpx;
				color: #4EBC62; font-size:24rpx
			}
		}
		
		
		.group-type{
			background-color: #FFFFFF;
			border-radius: 8rpx;
			padding: 30rpx 40rpx;
		}
		
		.preVerify{
			padding: 80rpx 40rpx 40rpx 40rpx; 
			width: 100%; 
			border-radius: 12rpx;
			
			.title{
				font-size: 32rpx;  
				color: #333333;
				font-weight: bolder;
				text-align: center; 
			} 
			
			.main{
				text-align: center;
				display: flex;
				justify-content: center; 
				position: relative;
				width: 482rpx;
				text-align: center;
				padding-top: 40rpx;
				
				.info{
					padding: 8px 0;
					text-align: left;
				}
				
				.substitute{
					
					.dot-wrap{
						display: flex; 
						.dot{						
							width: 68rpx;
							height: 68rpx;  
							line-height: 2;
							margin: 0 4rpx;
							font-size: 40rpx;
							font-weight: bolder;  
							border-bottom: 1px solid #D4D4D4; 
						} 
						
					} 
						
				}
				.in_put{
					position: absolute;
					left: 26rpx; 
					top: 20rpx;
					width: 0; 
					height: 68rpx;
					line-height: 2;
					text-align: left;  
					opacity: 0;
					letter-spacing:50rpx;
					width: 456rpx;
				}
			} 
			
			.btn{
				display: flex;
				margin-top: 40rpx; 
				justify-content: center;
				.item{					
					text-align: center;
					line-height: 68rpx;
					width: 200rpx;
					height: 68rpx;
					border-radius: 6rpx;
					margin: 0 20rpx;
				}
				.cancel{ 
					border: 1px solid #999999;
				}
				.confirm{ 
					background-color: #46B85B;
					border:1px solid #46B85B;
					color: #FFFFFF;
				} 
			}
		
		
		}
		
		
		
	}
	  
	
</style>
