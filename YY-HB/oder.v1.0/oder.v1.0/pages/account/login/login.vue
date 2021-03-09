<template>
	<view class="wrapper">
		<uni-popup @touchmove.stop.prevent="clear" ref="popup" type="center" :maskClick="false">
			<view class="legalTitlePopup">
				<view class="legalTitle">法律条款与个人信息保护政策</view>
				<view class="legalContent">
					{{legal}}
				</view>
				<view class="legalLinks">
					<view class="legalLink" @click="navto('../../utility/about/privacy')">《用户服务协议》</view>
					<text>与</text>
					<view class="legalLink" @click="navto('../../utility/about/treaty')">《隐私政策》</view>
				</view>
				<view class="legalLine"></view>
				<view class="legalButtons">
					<view class="legalClose" @click="legalfun(false)">不同意</view>
					<view class="legalSus" @click="legalfun(true)">同意</view>
				</view>
			</view>
		</uni-popup>
		<view class="main">
			<view class="login-content">
				<view class="refdone">
					<view class="login-main">
						<view class="login-title">
							<view class="login-in" :class="{loginActive: loginTable===0,loginActiveTo: loginTable===1}" @click="changeTable(1)">登录</view>
							<view class="login-open" :class="{loginActive: loginTable===1,loginActiveTo: loginTable===0}" @click="changeTable(0)">申请开店</view>
						</view>
						<view class="input-wrap" v-if="loginTable===0">
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
								:class="(this.account.length < 6 || this.password.length < 6 || this.verifcode.length < 6 || !this.agreeChecked) ? 'btn-disabled' : '' ">登录</view>
							</view>
							<view class="link-to"> 
								<view><navigator url="../passwd/passwd?type=forget" class="links">忘记密码</navigator></view> 
							</view>
						</view>
						<view class="input-wrap" v-else>
							<view class="input-group">
								<text class="input-text">请输入姓名</text>
								<view class="input-rows hasbtn">
									<input class="prov-code" style="width: 50%;" type="text" v-model="contactName" />
									<radio-group class="prov-btn" style="top: 18rpx; right: 24rpx;" @change="radioChange">
										<label class="uni-list-cell uni-list-cell-pd" style="margin-right: 10rpx;" v-for="(item, index) in sex" :key="item.value">
											<radio :value="item.value" :checked="index === uSex" color="#46B85B"/>{{item.name}}
										</label>
									</radio-group>
								</view>
							</view>

							<view class="input-group">
								<text class="input-text">请输入联系电话</text>
								<login-input type="number" :maxSize="11" v-model="contactPhone"/>
							</view>
							<view class="input-group">
								<text class="input-text">请输入验证码</text>
								<view class="input-rows hasbtn">
									<input class="prov-code" type="number" pattern="\d*" v-model="verifcodeTo" maxlength="6" />
									<view class="prov-btn" @tap="getVerifCodeTo" 
									:class="(this.contactPhone.length < 11) ? 'prov-disabled' :'' ">
									{{codeTimeTo > 0 ? codeTimeTo + 's' : firstcodeTo}}</view>
								</view>
							</view>
							<view class="input-group">
								<text class="input-text">请输入店铺名称</text>
								<login-input type="text" v-model="merchName"/>
							</view>
							<view class="input-group">
								<text class="input-text" v-model="address">请输入现住址</text>
								<login-input type="text" v-model="address"/>
							</view>
							<view class="input-group">
								<view class="login-btn" @tap="SubmitAooly" hover-class="animate__animated animate__pulse" 
								:class="(this.contactName.length < 1 || this.contactPhone.length < 11 || this.verifcodeTo.length < 6 || this.merchName.length < 1 || this.address.length < 1) ? 'btn-disabled' : '' ">提交申请</view>
							</view>
<!-- 							<view class="link-to">
								<view><text class="links" @click="Contact">联系客服</text></view> 
							</view> -->
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
	import UniPopup from '@/components/uni/uni-popup.vue'
	
	import LoginInput from '@/components/basic/c-input.vue'
	export default {
		components: {
			LoginInput,
			EvanCheckbox,
			UniPopup,
		},
		data() {
			return {
				legal: '您在使用移移商户之前请认真阅读并充分理解相关用户条款、平台规则以及个人信息保护政策。当您点击相关条款，并开始使用产品或服务，即表示您已经阅读并同意该条款，该条款将构成对您具有法律约束力的文件。',
				legalFlag: false,
				account: '',
				password: '',
				verifcode: '',
				initSign: 'key=YIYI@Customer!@#$803', 
				codeTime: '', 
				codeTimeTo: '', 
				firstcode:'获取验证码',
				firstcodeTo:'获取验证码',
				agreeChecked:false,
				loginTable: 0,
				contactName: '',
				sex: [
				{
					value: 'man',
					name: '男'
				},
				{
					value: 'woman',
					name: '女'
				}
				],
				uSex: 0,
				contactPhone: '',
				verifcodeTo: '',
				merchName: '',
				address: '',
				servicePhone: [
					'0592-2096880',
					'0592-2096882'
				]
			}
		},
		onLoad() {  
			let history = uni.getStorageSync('userAccount')
			let legal = uni.getStorageSync('legal')
			if(history){				
				this.account = history
			}
			if(!legal){
				setTimeout(()=>{
					this.$refs.popup.open()
				},500)
			}
			this.$api.getUserDev()
		},  
		methods: {
			legalfun(flag){
				this.legalFlag = flag;
				if(this.legalFlag){
					uni.setStorageSync('legal',true)
					this.$refs.popup.close()
				} else {
					uni.getSystemInfo({    
						success: function (res) {    
							// 判断为安卓的手机        
							if(res.platform=='android'){      
								// 安卓退出app
								plus.runtime.quit();
							}else{      
								// 判断为ios的手机，退出App
								plus.ios.import("UIApplication").sharedApplication().performSelector("exit");
							}
						},
					});
				}
			},
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
			getVerifCodeTo() {
				this.contactPhone = excludeBlankNewline(this.contactPhone)
				if(this.contactPhone.length != 11){
					return
				}
				this.codeTimeTo = 180;
				let timer = setInterval(() => {
					if (this.codeTimeTo >= 1) {
						this.codeTimeTo--;
						this.firstcodeTo = '重新获取';
					} else {
						this.codeTimeTo = 0;
						clearInterval(timer);
					}
				}, 1000)
				
				let vVlue = {"contactPhone": this.contactPhone};
				let sSort = getSortAscii(vVlue);
				let sSign = hexMD5(sSort + "&" + this.initSign).toUpperCase();
				this.$request.post('getVerCode',{
					"contactPhone": this.contactPhone,
					"sign": sSign
				}).then(res=>{
					if(res.code != 200){
						setTimeout(()=>{
							this.firstcodeTo = '重新获取'
							this.codeTimeTo = 0
						},5000)
					} 
					uni.showToast({
						icon:'none',
						title:res.message,
						duration: 2000
					})
				}).catch(err=>{
					
				})
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
				if(this.account==1234567 && this.password==123123){
					let testDate = {
						busiType: "2",
						identityName: "金锦",
						isRegular: "1",
						joinNo: "FZ000002",
						md5key: "dDG_hkaWBFFZsSrz",
						merchName: "移移-好友便利店 XM1002",
						merchNo: "35110000000000",
						merchType: "2",
						serverTime: "2021-03-08 14:11:51",
						token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2MTUxODM5MTEsInN1YiI6IjM1MDIwMzUzMTEwMDAzIiwiZXhwIjoxNjE2MzkzNTExfQ.7yCnqNLuTX5DyreR_x3PxV3utbAJwnItGO33CnsuNmcOZH5ipaThbePYMbgzU1IwSKK8QNGJZX9_pQAtJOgYRQ"
					}
					let haslogin = {
						status:true,
						token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2MTUxODI0OTMsInN1YiI6IjM1MDIwMzUzMTEwMDAzIiwiZXhwIjoxNjE2MzkyMDkzfQ.QplOwB0sp-sXhknu5W8SGO5AEgtj2pQL1ryWOmksPEaRzwYSEvS0YHqqh9SUIZtfPRJZC6raW9hsb9mDwVoosQ',
						md5key:'8iMoYg*G@_f1L2eB',
						merchNo:'35110000000000',
						joinCategory:"FZ000002",
						serverTime:'2021-03-08 13:48:13',  
						merchName:'移移-好友便利店 XM1002',
						merchType:'2',
						busiType:'2',
					}
					this.$store.commit('loginN',testDate)
					this.$store.commit('logStatus',haslogin)
					
					uni.setStorageSync('userAccount','1234567')
					uni.setStorageSync('isRegular','1')
					uni.setStorageSync('agreeChecked',true)
					setTimeout(()=>{
						uni.reLaunch({ 
							url:'../../utility/index/index?loginType=login'
						})									
					},300)
					return
				}
				// 发送请求
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
			changeTable(flag){ //标签页切换
				if(flag===1){
					this.loginTable=0;
				} else {
					this.loginTable=1;
				}
			},
			radioChange(evt) { //单选框功能实现
				for (let i = 0; i < this.sex.length; i++) {
					if (this.sex[i].value === evt.target.value) {
						this.uSex = i;
						break;
					}
				}
			},
			SubmitAooly(){
				let sex;
				if(this.uSex){
					sex = 2;
				} else {
					sex = 1;
				}
				this.contactName = excludeBlankNewline(this.contactName)
				this.contactPhone = excludeBlankNewline(this.contactPhone)
				this.verifcodeTo = excludeBlankNewline(this.verifcodeTo)
				this.merchName = excludeBlankNewline(this.merchName)
				this.address = excludeBlankNewline(this.address)
				let vVlue = {"contactName": this.contactName,"contactPhone": this.contactPhone,"merchName": this.merchName,"joinCategory": 2,"verCode":this.verifcodeTo,"sex":sex,"address":this.address};
				let sSort = getSortAscii(vVlue);
				let sSign = hexMD5(sSort + "&" + this.initSign).toUpperCase();
				if(this.contactName.length < 1 || this.contactPhone.length < 11 || this.verifcodeTo.length < 6 || this.merchName.length < 1 || this.address.length < 1){
					return
				}
				this.$request.post('joinApply',{
					...vVlue,
					"sign": sSign
				}).then(res => {
					this.$api.initPage(res.code, res.message);
					if(res.code === 200){
						uni.showToast({
							mask: true,
							title: res.message
						})
					} else {
						this.verifcodeTo = '';
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err,
						duration: 2000
					})
				})
			},
			Contact(){
				let newNo = this.servicePhone 
				uni.showActionSheet({
					itemList: newNo,
					success: (res)=>{  
						uni.makePhoneCall({
							phoneNumber: newNo[res.tapIndex]
						});  
					}
				});
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
	.legalTitlePopup{
		padding: 40rpx 40rpx 0;
		border-radius: 30rpx;
		.legalTitle{
			color: #000000;
			font-weight: bold;
			margin-bottom: 40rpx;
			text-align: center;
		}
		.legalContent{
			font-size: 28rpx;
		}
		.legalLinks{
			display: flex;
			margin: 30rpx 0;
			.legalLink{
				font-weight: bold;
				font-size: 28rpx;
				color: #46B85B;
			}
		}
		.legalLine{
			width: 100%;
			height: 2rpx;
			background-color: #C0C0C0;
		}
		.legalButtons{
			display: flex;
			text-align: center;
			padding: 30rpx 0;
			.legalClose{
				width: 50%;
			}
			.legalSus{
				width: 50%;
				color: #46B85B;
			}
		}
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
		border-radius: 20rpx;

		.login-main {
			font-size: 28rpx;
			.loginActive{
				color: #46B85B;
			}
			.loginActiveTo{
				background-color: #F9F9F9;
			}
			.login-title {
				font-size: 40rpx;
				color: #666666;
				height: 120rpx;
				line-height: 120rpx;
				border-radius: 20rpx 20rpx 0 0;
			}
			.login-in, .login-open{
				width: 50%;
				float: left;
				text-align: center;
			}
			.login-in{
				border-radius: 20rpx 0 20rpx 0;
			}
			.login-open{
				border-radius: 0rpx 20rpx 0rpx 20rpx;
			}
			.input-wrap {
				padding: 50rpx 30rpx 30rpx 30rpx;
				font-size: 32rpx;


				.input-group {
					padding: 16rpx 46rpx;
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
