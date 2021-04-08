<template>
	<view>
		<template v-if="typeChange">
			<view class="input-wrap">
				<view class="input-group">
					<text class="input-text">姓名</text>
					<login-input type="text" v-model="addSta.salesName"></login-input>	
				</view>
				<view class="input-group">
					<text class="input-text">性别</text>
					<radio-group @change="radioChange">
						<label style="margin-right: 10rpx;" v-for="(item, index) in sex" :key="item.value">
							<radio :value="item.value" :checked="index === uSex" color="#46B85B"/>{{item.name}}
						</label>
					</radio-group>
				</view>
				<view class="input-group">
					<text class="input-text">手机号</text>
					<login-input type="number" clearable :maxSize="11" v-model="addSta.loginNo"/>
				</view>
				<view class="input-group">
					<text class="input-text">验证码</text>
					<input style="width: 50%;" class="prov-code" type="number" pattern="\d*" v-model="addSta.verCode" maxlength="6" />
					<view class="prov-btn" @tap="getVerifCode"
					:class="(this.addSta.loginNo.length < 11) ? 'prov-disabled' :'' ">
					{{codeTime > 0 ? codeTime + 's' : firstcode}}</view>
				</view>
				<btn-foot title="添加店员" @tap="addStaff()"></btn-foot>
			</view>
		</template>
		<template v-else>
			<view class="input-wrap">
				<view class="input-wrap">
					<view class="input-group">
						<text class="input-text">姓名</text>
						<view class="">{{removeSta.salesName}}</view>
					</view>
					<view class="input-group">
						<text class="input-text">性别</text>
						<view class="">{{removeSta.sex==1 ? '男' : '女'}}</view>
					</view>
					<view class="input-group">
						<text class="input-text">手机号</text>
						<view class="">{{removeSta.loginNo}}</view>
					</view>
					<btn-foot title="删除店员" @tap="removeStaff()"></btn-foot>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii,excludeBlankNewline} from '@/common/util/utils.js'
	
	import LoginInput from '@/components/basic/c-input.vue'
	import BtnFoot from '@/components/basic/btn-foot.vue' 	
	
	export default {
		components: {
			LoginInput,
			BtnFoot
		},
		data(){
			return{
				loginWhether:'',//登陆状态
				merchNo:'', //商户号
				typeChange: true,
				addSta: {
					salesName: '',
					loginNo: '',
					verCode: '',
				},
				removeSta: {},
				removeIndex: '',
				codeTime: '',
				firstcode:'获取验证码',
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
			}
		},
		onLoad(option) {
			this.removeIndex = option.index
			this.loginWhether = uni.getStorageSync('status')
			this.merchNo = uni.getStorageSync('user').merchNo
			switch(option.type){
				case 'add':
				this.typeChange = true;
				uni.setNavigationBarTitle({
					title: '添加店员'
				});
				break
				case 'remove':
				this.getSales()
				this.typeChange = false;
				uni.setNavigationBarTitle({
					title: '删除店员'
				})
				break
			}
		},
		methods: {
			radioChange(evt) { //单选框功能实现
				for (let i = 0; i < this.sex.length; i++) {
					if (this.sex[i].value === evt.target.value) {
						this.uSex = i;
						break;
					}
				}
			},
			getSales(){
				let vVlue = {"merchNo": this.merchNo} //必传
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码
				this.$request.post('getSales',{
					...vVlue,
					"sign":sSign
				},{
					token:true
				}).then((res)=>{ 
					if(res.code===200){
						this.removeSta = res.data[this.removeIndex]
						this.removeSta.loginNo = this.removeSta.loginNo.toString() 
					} else {
						uni.showToast({
							icon:'none',
							title: res.message,
							duration: 2000
						})
					}
				}).catch()
			},
			getVerifCode() {
				if(this.addSta.loginNo.length < 11){
					return
				}
				this.codeTime = 60
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
				let vVlue = {"merchNo": this.merchNo, 'phone': this.addSta.loginNo} //必传
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码  
				this.$request.post('getVerCodeA', {
					...vVlue,
					"sign": sSign
				},{
					token:true
				}).then(res=>{   
					console.log(res)
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
			addStaff(){
				let sex;
				if(this.uSex){
					sex = 2;
				} else {
					sex = 1;
				}
				if(this.addSta.loginNo.length < 11 || this.addSta.salesName.length < 1 || this.addSta.verCode.length <6){
					uni.showToast({
						icon:'none',
						title: '请将信息填写完整',
						duration: 2000
					})
					return
				}
				let vVlue = {"merchNo": this.merchNo, 'phone': this.addSta.loginNo, 'verCode': this.addSta.verCode, 'salesName': this.addSta.salesName,'sex': sex} //必传
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码
				this.$request.post('addSales',{
					...vVlue,
					"sign":sSign
				},{
					token:true
				}).then((res)=>{ 
					if(res.code===200){
						uni.showToast({
							icon:'success',
							title: res.message,
							duration: 2000
						})
						setTimeout(()=>{
							this.backUrl()
						},2000)
					} else {
						uni.showToast({
							icon:'none',
							title: res.message,
							duration: 2000
						})
					}
				}).catch()
			},
			removeStaff(){
				let vVlue = {"merchNo": this.merchNo, 'phone': this.removeSta.loginNo} //必传
				console.log(vVlue)
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码
				this.$request.post('clearSales',{
					...vVlue,
					"sign":sSign
				},{
					token:true
				}).then((res)=>{ 
					if(res.code===200){
						uni.showToast({
							icon:'success',
							title: res.message,
							duration: 2000
						})
						setTimeout(()=>{
							this.backUrl()
						},2000)
						
					} else {
						uni.showToast({
							icon:'none',
							title: res.message,
							duration: 2000
						})
						setTimeout(()=>{
							this.backUrl()
						},2000)
					}
				}).catch()
			},
			backUrl(){
				uni.redirectTo({
				    url: './staff'
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.input-wrap{
		width: 100vw;
		
		.input-group {
			position: relative;
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
			.prov-code {
				width: 60%;
				height: 100%;
			}
			.prov-btn {
				color: #46B85B;
			}	
			.prov-disabled {
				color: #8ed09b
			}

		}
	}
</style>
