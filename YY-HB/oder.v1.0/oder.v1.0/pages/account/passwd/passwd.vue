<template>
	<view class="wrap">
		<!-- #ifdef APP-PLUS -->
		<uni-nav-bar :status-bar="true" left-icon="arrowleft" @clickLeft="back" :passwd="true" background-color="rgb(0 0 0 / 0%)"/> 
		<!-- #endif -->
	
		<view class="login-content">
			<view class="login-main">
				<template v-if="typeChange"><view class="login-title">修改密码</view></template>
				<template v-if="typeForget"><view class="login-title">忘记密码</view></template>
				<template v-if="typeForget">
					<view class="input-wrap">
						<view class="input-group">
							<text class="input-text">请输入身份证号</text>
							<login-input type="number" pattern="\d*" focus v-model="forget.idCard" :maxSize="18"></login-input>
						</view> 
						<view class="input-group">
							<text class="input-text">请输入登录账号</text>
							<login-input type="number" pattern="\d*" focus v-model="forget.loginNo" :maxSize="7"></login-input>
						</view>  
						<view class="input-group">
							<text class="input-text">请输入新密码</text>
							<login-input password displayable type="password" v-model="forget.pswNew"></login-input>
							<view class="tips">{{pswTips}}</view>
						</view>
						<view class="input-group">
							<text class="input-text">重新输入新密码</text>
							<login-input password displayable type="password" v-model="forget.pswOneMore"></login-input>
						</view>						
						<view class="input-group">
							<text class="input-text">忘记请输入验证码</text>
							<view class="input-rows hasbtn">
								<input class="prov-code" type="number" pattern="\d*" v-model="forget.verifcode" maxlength="6" />
								<view class="prov-btn" @tap="getVerifCodeForget()">{{codeTime > 0 ? codeTime + 's' : firstcode}}</view>
							</view> 
						</view>  
						<view class="input-group"> 
							<view class="login-btn" hover-class="animate__animated animate__pulse" @tap="pswForget()">找回密码</view>
						</view> 
					</view>
				</template>
				<template v-if="typeChange">
					<view class="input-wrap">
						
						<view class="input-group">
							<text class="input-text">请输入旧密码</text>
							<login-input password displayable type="password" v-model="change.pswOld"></login-input>
						</view>
						<view class="input-group">
							<text class="input-text">请输入新密码</text>
							<login-input password displayable type="password" v-model="change.pswNew"></login-input>
							<view class="tips">{{pswTips}}</view>
						</view>
						<view class="input-group">
							<text class="input-text">重新输入新密码</text>
							<login-input password displayable type="password" v-model="change.pswOneMore"></login-input>
						</view>
						<view class="input-group">
							<text class="input-text">修改请输入验证码</text> 
							<view class="input-rows hasbtn">
								<input class="prov-code" type="number" pattern="\d*" v-model="change.verifcode" maxlength="6" />
								<view class="prov-btn" @tap="getVerifCodeChange()">{{codeTime > 0 ? codeTime + 's' : firstcode}}</view>
							</view> 
						</view>  
						
						<view class="input-group"> 
							<view class="login-btn" hover-class="animate__animated animate__pulse" @tap="pswChange()">修改密码</view>
						</view>
					</view>					
				</template>  
			</view> 
		</view>
	</view>
</template>

<script>
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii,paymentPaswd} from '@/common/util/utils.js' 
	import LoginInput from '@/components/basic/c-input.vue'
	import UniNavBar from '@/components/uni/uni-nav-bar.vue'
	export default {
		components:{
			LoginInput,
			UniNavBar,			
		},
		data() {
			return {
				loginWhether:'',//登陆状态 
				merchNo:'', //商户号 
				change:{
					pswOld:'',
					pswNew:'',
					pswOneMore:'',
					verifcode: '',
				},
				forget:{
					idCard:'',
					loginNo:'',
					pswNew:'',
					pswOneMore:'',
					verifcode: '',
				},
				codeTime:'',
				initSign: 'key=YIYI@Customer!@#$803',
				pswTips:'密码至少1个大写字母，1个小写字母和1个数字',
				typeChange:false,
				typeForget:false,
				firstcode:'获取验证码', 
			}
		}, 
		onLoad(option) { 
			switch (option.type){
				case 'change':
				this.typeChange = true;
				this.typeForget = false;
				break;
				case 'forget':
				this.typeForget = true;
				this.typeChange = false;
				break;
			} 
			
			this.loginWhether = uni.getStorageSync('status')  
			this.merchNo = uni.getStorageSync('user').merchNo	
		}, 
		methods: {			
			back() {
				uni.navigateBack({
					delta: 1
				})
			},			
			getCodeNo(post,type){		
				let vVlue = ''
				let sSort = ''
				let sSign = ''
				if(type == 'change'){
					vVlue = {"merchNo": this.merchNo} //必传
					sSort = getSortAscii(vVlue) ///排序  
					sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码					
				}else if(type == 'forget'){
					vVlue = {"loginNo": this.forget.loginNo,"identCard":this.forget.idCard} //必传 
					sSort = getSortAscii(vVlue) ///排序  
					sSign = hexMD5(sSort + "&" + this.initSign).toUpperCase() //转码
				} 
				
				if(this.codeTime < 1){
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
				}
				this.$request.post(post,{
					...vVlue,
					"sign":sSign
				},{
					token:true
				}).then((res)=>{ 
					uni.showToast({
						icon:'none',
						title: res.message,
						duration: 2000
					})
				}).catch()
			}, 
			getVerifCodeChange(){
				let isright = this.matchFormat('change',{ 
					"oldPwd":this.change.pswOld,
					"newPwd":this.change.pswNew,	
					"newPwd2":this.change.pswOneMore,		 	
				}) 
				if(isright){		 
					this.getCodeNo('getVerCodeC','change')
				}
			},
			getVerifCodeForget(){
				let isright = this.matchFormat('forget',{
					"identCard":this.forget.idCard,	
					"loginNo":this.forget.loginNo,	 
					"newPwd":this.forget.pswNew,	
					"newPwd2":this.forget.pswOneMore,				
				})  
				if(this.forget.idCard.length === 15 || this.forget.idCard.length === 18){	
					if(isright){	 			 
						this.getCodeNo('getVerCodeF','forget')
					}
				}else{				
					uni.showToast({
						icon:'none',
						title:'请核对身份证号码',
						duration:2000
					})
				}
			},
			getDataCommon(post,type,param){ 
				
				let vVlue = param
				let sSign = ''
				let sSort = getSortAscii(vVlue) ///排序 
				if(type == 'forget'){ 
					sSign = hexMD5(sSort + "&" + this.initSign).toUpperCase() //转码     
				}else if(type == 'change'){
					sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码  					
				}   
				
				this.$request.post(post,{
					...vVlue,
					"sign":sSign
				},{
					token:true
				}).then(res=>{  
					uni.showToast({
						icon:'none',
						title: res.message,
						duration: 2000
					})
					if(res.code == 200){
						setTimeout(()=>{
							uni.reLaunch({
								url:'../login/login'
							})
						},300)	
						this.$store.commit('logout') 
						this.$store.commit('logStatus',false)
					}
					
				}).catch()	
				
			},
			pswForget(){
				if(this.forget.verifcode.length != 6){
					uni.showToast({
						icon:'none',
						title:'输入有误',
						duration:2000
					})
					return 
				} 
				this.getDataCommon('forgetPwd','forget',{	
					"identCard":this.forget.idCard,		
					"loginNo":this.forget.loginNo,	
					"verCode":this.forget.verifcode,	
					"newPwd":this.forget.pswNew,
					"newPwd2":this.forget.pswOneMore,
				})
			},
			pswChange(){	
				if(this.change.verifcode.length != 6){
					uni.showToast({
						icon:'none',
						title:'输入有误',
						duration:2000
					})
					return 
				}			 
				this.getDataCommon('changePwd','change',{ 
					"merchNo":this.merchNo,		 
					"verCode":this.change.verifcode,		 
					"oldPwd":this.change.pswOld,
					"newPwd":this.change.pswNew,
					"newPwd2":this.change.pswOneMore,
				})
			},
			matchFormat(type,param){
				if(type == 'forget'){
					if(!param.identCard || !param.loginNo || !param.newPwd || !param.newPwd2 || param.loginNo.length < 7 || param.newPwd.length < 6 || param.newPwd2.length < 6){ 
						uni.showToast({
							icon:'none',
							title:'输入有误',
							duration:2000
						})
						return false
					}else if(param.identCard.length < 15 || param.identCard.length > 18){ 
						uni.showToast({
							icon:'none',
							title:'请核对身份证号码',
							duration:2000
						})
						return false 
					}else if(param.newPwd !== param.newPwd2){
						uni.showToast({
							icon:'none',
							title:'新旧密码不一致',
							duration:2000
						})
						return false
					}
					return true	 
				}else if(type == 'change'){
					console.log(param)
					if(!param.oldPwd || !param.newPwd || !param.newPwd2 || param.oldPwd.length < 6 || param.newPwd.length < 6 || param.newPwd2.length < 6){ 
						uni.showToast({
							icon:'none',
							title:'输入有误',
							duration:2000
						})
						return false
					}else if(param.newPwd !== param.newPwd2){
						uni.showToast({
							icon:'none',
							title:'新旧密码不一致',
							duration:2000
						})
						return false
					}
					return true	
				}
			}, 
		}
	}
</script>

<style lang="scss">
	
	page{
		background-color: #FFFFFF;
		background:url(@/static/login-bg.png);
		background-size: contain;
		background-repeat: no-repeat; 
	} 
	.wrap{
		width: 100vw;
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
					.uni-button:after{
						border:0
					}
					.btn-disabled{ background-color: #8ed09b;}
					
					.tips{font-size: 22rpx; color:#FF3333;padding: 8rpx;}
					
				}

				.link-to {
					display: flex;
					width: 100%;
					padding: 0 20rpx 24rpx 20rpx;


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

