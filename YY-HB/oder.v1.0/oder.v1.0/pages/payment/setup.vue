<template>
	<view>  
		<template v-if="typeSetup"> 
			<view class="input-wrap">			
				<view class="input-group">
					<text class="input-text">设置密码</text>
					<view class="input-cont"> 
						<login-input password displayable type="password" v-model="set.newpwd" 
						placeholder="6位纯数字密码" :maxSize="6" placeholder-class="info"></login-input>
					</view>				
				</view>
				<view class="input-group">
					<text class="input-text">确认密码</text>
					<view class="input-cont"> 
						<login-input password displayable type="password" v-model="set.checkpwd" 
						placeholder="6位纯数字新密码" :maxSize="6" placeholder-class="info"></login-input>
					</view>
				</view>				
				<view class="input-group-hasbtn">
					<text class="input-text">验证码</text>
					<view class="input-cont">
						<input class="code-cont" type="number" v-model="set.code" placeholder="验证码" maxlength="6" placeholder-class="info" />
						<view class="input-btn" @tap="getVerCodeSP()">{{codeTime > 0 ? codeTime + 's' : firstcode}}</view>
					</view>
				</view>  
			</view> 
			<btn-foot title="设置密码" @tap="setPayPwd()"></btn-foot>
		</template>
		
		<template v-if="typeChange"> 
			<view class="input-wrap">			
				<view class="input-group">
					<text class="input-text">原密码</text>
					<view class="input-cont"> 
						<login-input password displayable type="password" v-model="change.oldpwd" 
						placeholder="6位纯数字原密码" :maxSize="6" placeholder-class="info"></login-input>
					</view>				
				</view>
				<view class="input-group">
					<text class="input-text">新密码</text>
					<view class="input-cont"> 
						<login-input password displayable type="password" v-model="change.newpwd" 
						placeholder="6位纯数字新密码" :maxSize="6" placeholder-class="info"></login-input>
					</view>				
				</view>
				<view class="input-group">
					<text class="input-text">确认密码</text>
					<view class="input-cont"> 
						<login-input password displayable type="password" v-model="change.checkpwd" 
						placeholder="重复新密码" :maxSize="6" placeholder-class="info"></login-input>
					</view>
				</view>
				
				<view class="input-group-hasbtn">
					<text class="input-text">验证码</text>
					<view class="input-cont">
						<input class="code-cont" type="number" v-model="change.code" 
						placeholder="验证码" maxlength="6" placeholder-class="info" />
						<view class="input-btn" @tap="getVerCodeCP()">{{codeTime > 0 ? codeTime + 's' : firstcode}}</view> 
					</view>
				</view> 
				
			</view>
			<btn-foot title="修改密码" @tap="changePayPwd()"></btn-foot>
		</template>
		
		<template v-if="typeForget"> 
			<view class="input-wrap">			
				<view class="input-group">
					<text class="input-text">身份证号</text>
					<view class="input-cont"> 
						<login-input type="number" v-model="forget.idNo" placeholder="身份证号码" :maxSize="18" placeholder-class="info"></login-input>
					</view>				
				</view> 
				<view class="input-group">
					<text class="input-text">新密码</text>
					<view class="input-cont"> 
						<login-input password displayable type="password" v-model="forget.newpwd" 
						placeholder="6位纯数字新密码" :maxSize="6" placeholder-class="info"></login-input>
					</view>				
				</view>
				<view class="input-group">
					<text class="input-text">确认密码</text>
					<view class="input-cont"> 
						<login-input password displayable type="password" v-model="forget.checkpwd" 
						placeholder="6位纯数字新密码" :maxSize="6" placeholder-class="info"></login-input>
					</view>
				</view>
				<view class="input-group-hasbtn">
					<text class="input-text">验证码</text>
					<view class="input-cont">
						<input class="code-cont" type="number" vercode v-model="forget.code" 
						placeholder="验证码" maxlength="6" placeholder-class="info" />
						<view class="input-btn" @tap="getVerCodeFP()">{{codeTime > 0 ? codeTime + 's' : firstcode}}</view>
					</view>
				</view> 
			</view>
			<btn-foot title="找回密码" @tap="forgetPayPwd()"></btn-foot>
		</template>
		
		
		
		
	</view>
</template>

<script>
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii,paymentPaswd} from '@/common/util/utils.js'
	import LoginInput from '@/components/basic/c-input.vue'
	
	import BtnFoot from '@/components/basic/btn-foot.vue' 	
	export default { 
		components:{
			LoginInput,
			BtnFoot, 
		},
		data() {
			return {
				loginWhether:'',//登陆状态 
				merchNo:'', //商户号
				typeChange:false,
				typeForget:false,
				typeSetup:false,
				codeTime:'',
				firstcode:'获取验证码',
				set:{ //设置新密码
					newpwd:'',
					checkpwd:'',
					code:'',
				},
				change:{ //修改旧密码
					oldpwd:'',
					newpwd:'',
					checkpwd:'',
					code:'',
				},
				forget:{
					idNo:'', 
					code:'',
					newpwd:'',
					checkpwd:'',
				}, 
				islock:'',
				fristime:'',
			}
		}, 
		onLoad(option) { 
			switch (option.type){
				case 'change':
				this.typeChange = true; 
				uni.setNavigationBarTitle({
					title: '修改支付密码'
				})
				break;
				case 'forget':
				this.typeForget = true; 
				uni.setNavigationBarTitle({
					title: '忘记支付密码'
				})
				break;
				case 'setup':
				this.typeSetup = true; 
				uni.setNavigationBarTitle({
					title: '设置支付密码'
				})
				break;
			}  
			if(option.state) {
				this.islock = option.state 
			}
			this.loginWhether = uni.getStorageSync('status')  
			this.merchNo = uni.getStorageSync('user').merchNo		
			this.fristime = option.page 
				
		}, 
		methods: {					 
			matchFormat(type,param){  
				let getoutAbc = new RegExp("^[0-9]*$") 
				if(type == 'set'){ 
					if(!param.payPwd || !param.payPwd2 || param.payPwd.length < 6 || param.payPwd2.length < 6){ 
						uni.showToast({
							icon:'none',
							title:'至少6位数字',
							duration:2000
						})
						return false
					}else if(!paymentPaswd(param.payPwd) || !paymentPaswd(param.payPwd2)){ 
						uni.showToast({
							icon:'none',
							title:'连续数字或密码太简单',
							duration:2000
						})
						return false
					}else if(param.payPwd != param.payPwd2){ 
						uni.showToast({
							icon:'none',
							title:'密码不一致',
							duration:2000
						})
						return false 
					}else if(!getoutAbc.test(param.payPwd) || !getoutAbc.test(param.payPwd2)) { 
						uni.showToast({
							icon:'none',
							title:'请输入纯数字',
							duration:2000
						})
						return false
					}  
					return true	
				}else if(type == 'change'){
					if(!param.oldPayPwd || !param.newPayPwd || !param.newPayPwd2 || param.oldPayPwd.length < 6 || param.newPayPwd.length < 6 || param.newPayPwd2.length < 6){ 
						uni.showToast({
							icon:'none',
							title:'至少6位数字',
							duration:2000
						})
						return false
					}else if(!paymentPaswd(param.oldPayPwd) || !paymentPaswd(param.newPayPwd) || !paymentPaswd(param.newPayPwd2)){ 
						uni.showToast({
							icon:'none',
							title:'连续数字或密码太简单',
							duration:2000
						})
						return false
					}else if(param.newPayPwd != param.newPayPwd2){ 
						uni.showToast({
							icon:'none',
							title:'密码不一致',
							duration:2000
						})
						return false 
					}else if(param.oldPayPwd == param.newPayPwd){ 
						uni.showToast({
							icon:'none',
							title:'新旧密码一致',
							duration:2000
						})
						return false  
					}else if(!getoutAbc.test(param.oldPayPwd) || !getoutAbc.test(param.newPayPwd) || !getoutAbc.test(param.newPayPwd2)){ 
						uni.showToast({
							icon:'none',
							title:'请输入纯数字',
							duration:2000
						})
						return false
					} 
					return true	
				}else if(type == 'forget'){
					if(!param.identCard || !param.newPayPwd || !param.newPayPwd2 || param.newPayPwd.length < 6 || param.newPayPwd2.length < 6){
						uni.showToast({
							icon:'none',
							title:'至少6位数字',
							duration:2000
						})
						return false 
					}else if(!paymentPaswd(param.newPayPwd) || !paymentPaswd(param.newPayPwd2)){ 
						uni.showToast({
							icon:'none',
							title:'连续数字或密码太简单',
							duration:2000
						})
						return false
					}else if(param.newPayPwd != param.newPayPwd2){ 
						uni.showToast({
							icon:'none',
							title:'密码不一致',
							duration:2000
						})
						return false 
					}else if(!getoutAbc.test(param.newPayPwd) || !getoutAbc.test(param.newPayPwd2)) { 
						uni.showToast({
							icon:'none',
							title:'请输入纯数字',
							duration:2000
						})
						return false
					} 
					return true	  
				}
			},
			getVerCodeSP(){ 
				let isright = this.matchFormat('set',{
					"payPwd":this.set.newpwd,	
					"payPwd2":this.set.checkpwd,				
				}) 
				if(isright){
					this.getCodeNo('getVerCodeSP')					
				}
			},				
			getVerCodeCP(){
				let isright = this.matchFormat('change',{
					"oldPayPwd":this.change.oldpwd,
					"newPayPwd":this.change.newpwd,
					"newPayPwd2":this.change.checkpwd,	
				}) 
				if(isright){
					this.getCodeNo('getVerCodeCP')
				}
			},				
			getVerCodeFP(){
				let isright = this.matchFormat('forget',{
					"identCard":this.forget.idNo,
					"newPayPwd":this.forget.newpwd,
					"newPayPwd2":this.forget.checkpwd,
				}) 
				if(this.forget.idNo.length === 15 || this.forget.idNo.length === 18){					
					if(isright){
						this.getCodeNo('getVerCodeFP')
					}
				}else{
					uni.showToast({
						icon:'none',
						title:'请核对身份证号码',
						duration:2000
					})
				}
			},
			getCodeNo(post){
				let vVlue = {"merchNo": this.merchNo} //必传
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码     
				
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
					this.$request.post(post,{
						...vVlue,
						"sign":sSign
					},{
						token:true
					}).then(res=>{  	
						uni.showToast({
							icon:'none',
							title:res.message,
							duration: 2000
						})
					}).catch() 					
				}
			},
			setPayPwd(){ 
				if(this.set.code.length != 6){
					uni.showToast({
						icon:'none',
						title:'验证码有误'
					})
					return 
				}
				this.getDataCommon('setPayPwd','set',{
						"merchNo": this.merchNo, 
						"verCode":this.set.code,
						"payPwd":this.set.newpwd,
						"payPwd2":this.set.checkpwd,
						})
			},
			changePayPwd(){ 
				if(this.change.code.length != 6){
					uni.showToast({
						icon:'none',
						title:'验证码有误'
					})
					return 
				}
				this.getDataCommon('changePayPwd','change',{
						"merchNo": this.merchNo, 
						"verCode":this.change.code,
						"oldPayPwd":this.change.oldpwd,
						"newPayPwd":this.change.newpwd,
						"newPayPwd2":this.change.checkpwd,
						})
			},
			forgetPayPwd(){ 
				if(this.forget.code.length != 6){
					uni.showToast({
						icon:'none',
						title:'验证码有误'
					})
					return 
				}
				this.getDataCommon('forgetPayPwd','forget',{
						"merchNo": this.merchNo, 
						"verCode":this.forget.code,
						"identCard":this.forget.idNo,
						"newPayPwd":this.forget.newpwd,
						"newPayPwd2":this.forget.checkpwd,
						}) 
			},
			getDataCommon(post,type,param){ 
				let vVlue = param
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码      
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
						if(type == 'set'){			 
							uni.setStorageSync('initPayPaswd',1)	
							if(this.fristime == 'prev'){
								uni.navigateBack({
									delta:1,
									animationType: 'pop-out',
									animationDuration: 200
								})
							}else{
								setTimeout(()=>{ 									
									uni.redirectTo({ 
										url:'../wallet/moeny/check?seted=true'
									})
								},1000) 								 
							}
						}else if(type == 'forget'){		
							setTimeout(()=>{ 
								uni.navigateBack({
									delta: 1,
									animationType: 'pop-out',
									animationDuration: 200
								})
							},1000) 	
						} 
					}
				}).catch()	
				
			} 
			
		}
	}
</script>

<style scoped lang="scss">
	.input-wrap {
		width: 100vw;
		
		.input-group { 
			display: flex;
			margin: 40rpx;
			border-bottom: 1px solid #D4D4D4;
			align-items: center;  
			
			.input-text { 
				width: 160rpx;
				color: #333333; 
				font-size: 30rpx; 
				display: block;
				padding: 16rpx 0; 
				line-height: 2.2;
				margin: 12rpx 0;
			} 
			.info{
				color: #808080;
			}
			.input-cont{ 
				font-size: 30rpx;
				
			}
		}
		
		
		.input-group-hasbtn{ 
			display: flex;
			margin: 40rpx;
			border-bottom: 1px solid #D4D4D4; 
			align-items: center; 
			.input-text{ 
				width: 160rpx;
				color: #333333;  
				padding: 16rpx 0; 
				line-height: 2.2;
				margin: 12rpx 0;
				font-size: 30rpx; 
			}
			
			.input-cont{ 
				margin: 12rpx auto;
				padding: 12rpx 0;
				height: 88rpx;
				display: flex;
				font-size: 30rpx;
				justify-content: space-between;
				align-items: center; 
				.code-cont{
					flex:1;
					margin-left: 40rpx;
				}
				.input-btn{ 
					color: #09BB07; 
					font-size: 30rpx; 
				}
			}
		}
		
		
	}

</style>
