<template>
	<view class="wrapper">

		<view class="main">
			<view class="login-content">
				<view class="refdone">

					<view class="login-main">
						<view class="login-title">登录</view>
						<view class="input-wrap">
							<view class="input-group">
								<text class="input-text">请输入登录账号</text>
								<login-input type="number" pattern="\d*" clearable v-model="account" :maxSize="7"></login-input>
							</view>
							<view class="input-group">
								<text class="input-text">请输入账号密码</text>
								<login-input password displayable type="password" v-model="password"></login-input>
							</view>
							<view class="input-group">
								<text class="input-text">请输入验证码</text>
								<view class="input-rows hasbtn">
									<input class="prov-code" type="number" pattern="\d*" v-model="verifcode" maxlength="6" />
									<view class="prov-btn" @tap="getVerifCode" 
									:class="(this.account.length < 6 || this.password.length < 6 ) ? 'prov-disabled' :'' ">
									{{codeTime > 0 ? codeTime + 's' : firstcode}}</view>
								</view>
							</view> 
							<view class="footer">								
								<evan-checkbox  :iconSize="12" primaryColor="#46B85B" v-model="agreeChecked"><text style="font-size: 12px;">我同意</text></evan-checkbox> 	
								<view class="links" @click="navto('../../utility/about/privacy')">《用户服务协议》</view>
								<view class="links" @click="navto('../../utility/about/treaty')">《隐私政策》</view>
							</view>
							<view class="input-group">
								<view class="login-btn" @tap="bindLogin" hover-class="animate__animated animate__pulse" 
								:class="(this.account.length < 6 || this.password.length < 6 || this.verifcode.length < 6) ? 'btn-disabled' : '' ">登录</view>
							</view> 
							<view class="link-to"> 
								<view><navigator url="../passwd/passwd?type=forget" class="links">忘记密码</navigator></view> 
							</view>
						</view>
					</view>
					
				</view>

			</view>

		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import {b64Md5,hexMD5} from '@/network/md5.js'	
	import {getSortAscii,excludeBlankNewline} from '@/common/util/utils.js'
	import EvanCheckbox from '@/components/plugin-ui/evan-checkbox.vue'
	
	import LoginInput from '@/components/basic/c-input.vue'
	export default {
		components: {
			LoginInput,
			EvanCheckbox,
		},
		data() {
			return { 
				account: '',
				password: '',
				verifcode: '',
				initSign: 'key=YIYI@Customer!@#$803', 
				codeTime: '', 
				firstcode:'获取验证码',
				agreeChecked:false,
			}
		},
		onLoad() {  
			let history = uni.getStorageSync('userAccount')
			if(history){				
				this.account = history
			}
			this.$api.getUserDev() 
		},  
		methods: {  
			navto(url){
				uni.navigateTo({
					url:url,
					animationType: 'pop-in',
					animationDuration: 200,
				})
			},
			getVerifCode() { 
				this.account = excludeBlankNewline(this.account)
				this.password = excludeBlankNewline(this.password)
				this.verifcode = excludeBlankNewline(this.verifcode)
				if (this.codeTime > 0 || this.password === '' || this.account.length < 7) { 
					return
				} 
				this.codeTime = 180
				let timer = setInterval(() => {
					if (this.codeTime >= 1) {
						this.codeTime--
						this.firstcode = '重新获取'
					} else {
						this.codeTime = 0
						clearInterval(timer)
					}
				}, 1000) 

				///获取验证码 
				let vVlue = {"loginNo": this.account} //必传
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&" + this.initSign).toUpperCase() //转码  
				this.$request.post('getVerCodeL', {
					"loginNo": this.account,
					"sign": sSign
				}).then(res=>{   
					if(res.code != 200){
						setTimeout(()=>{
							this.firstcode = '重新获取'
							this.codeTime = 0
						},5000)
					} 
					uni.showToast({
						icon:'none',
						title:res.message,
						duration: 2000
					})
				}).catch() 
			},
			bindLogin() {
				this.account = excludeBlankNewline(this.account)
				this.password = excludeBlankNewline(this.password)
				this.verifcode = excludeBlankNewline(this.verifcode)
				let vVlue = {"loginNo": this.account,"passwd": this.password,"verCode": this.verifcode} //必传 
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&" + this.initSign).toUpperCase() //转码    
				if(this.account.length < 7 || this.password.length < 6 || this.verifcode.length < 6 || !this.agreeChecked){ 
					return
				} 
				
				//发送请求 
				this.$request.post('login', {
					"loginNo": this.account,
					"passwd": this.password,
					"verCode": this.verifcode,
					"sign": sSign
				}).then(res => { 
					uni.showLoading({
						mask:true
					})
					uni.showToast({
						icon: 'none',
						title:res.message,
						duration: 2000
					})
					if (res.code === 200) {  
						this.$store.commit('loginN',res.data)  
						let haslogin = {
							status:true,
							token:res.data.token,
							md5key:res.data.md5key,
							merchNo:res.data.merchNo,
							joinCategory:res.data.joinCategory,
							serverTime:res.data.serverTime,  
							merchName:res.data.merchName,
							merchType:res.data.merchType,
							busiType:res.data.busiType,
						}
						this.$store.commit('logStatus',haslogin)
						uni.setStorageSync('userAccount',this.account)
						uni.setStorageSync('isRegular',res.data.isRegular)  
						if(res.data.isRegular == 1){
							uni.setStorageSync('agreeChecked',false) 
						}else if(res.data.isRegular == 0){
							uni.setStorageSync('agreeChecked',true) 	 
						}
						setTimeout(()=>{
							uni.hideLoading()
							uni.reLaunch({ 
								url:'../../utility/index/index?loginType=login'
							})									
						},300)		 	
					}else{						
						this.password = ''
						this.verifcode = ''
					}
				}).catch() 

			},  
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #FFFFFF;
		width: 100vw;
		height: 100vh;
	}
	
	.footer{
		padding: 20rpx;
		display: flex; 
		justify-content: left; 
		font-size: 24rpx; 
		.links{
			color: #46B85B;
			margin-top: 12rpx;
		}
	}

	.main { 
		width: 100vw;
		height: inherit;
		background: url(../../../static/login-bg.png);
		background-size: contain;
		background-repeat: no-repeat;
		padding-top: 240rpx;
	}

	.login-content {

		width: 86%;
		height: 86%;
		margin: 40rpx auto;
		background-color: #FFFFFF;
		box-shadow: 0 0 20rpx 10rpx rgba(0, 0, 0, .05);
		border-radius: 16rpx;

		.login-main {
			padding: 30rpx;
			font-size: 28rpx;

			.login-title {
				font-size: 56rpx;
				color: #333333;
			}

			.input-wrap {
				padding: 80rpx 30rpx 30rpx 30rpx;
				font-size: 32rpx;


				.input-group {
					padding: 16rpx;
					width: 100%;

					.input-text {
						color: #999999;
						font-size: 28rpx;
						padding-left: 8rpx;
						padding-bottom: 16rpx;
						display: block;
					}

					.input-rows {
						margin: 20rpx auto;
						padding: 12rpx 36rpx;
						height: 80rpx;
						width: 100%; 
						vertical-align: middle;
						border-radius: 40rpx;
						background-color: #F2F2F2;
					}

					.login-btn {
						height: 80rpx;
						line-height: 80rpx;
						border-radius: 40rpx;
						text-align: center;
						background: #46B85B;
						color: #FFFFFF;
					}

					.uni-button:after {
						border: 0
					}

					.btn-disabled {
						background-color: #8ed09b;
					}
				}

				.link-to {
					display: flex;
					width: 100%;
					padding: 24rpx 20rpx 24rpx 20rpx;


					.links {
						flex: 1;
						color: #46B85B;
						text-align: right;
						font-size: 24rpx;
						text-decoration: underline;
					}

					.links:first-child {
						text-align: left;
					}
				
				}



				.hasbtn{
					position: relative;
					width: 100%; 

					.prov-code {
						width: 60%;
						height: 100%;
					}

					.prov-btn {
						position: absolute;
						right: 36rpx;
						top: 24rpx;
						font-size: 28rpx;
						color: #46B85B;
					}

					.prov-disabled {
						color: #8ed09b
					}
				}


			}

		}


	}
</style>
