<template>
	<view class="input-wrap">
		<view class="input-group">
			<text class="input-text">按订单收包装费：</text>
			<input style="width: 60%;" :disabled="loginType==2" v-model="packageFee" maxlength="5" type="number" @input="packfeeChange"></input>
			<text style="position: absolute; right: 200rpx;">元</text>
		</view>
		<btn-foot v-if="loginType==1" title="修改" @tap="setPackageFee()"></btn-foot>
	</view>
</template>

<script>
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii,excludeBlankNewline} from '@/common/util/utils.js'
	
	import LoginInput from '@/components/basic/c-input.vue'
	import BtnFoot from '@/components/basic/btn-foot.vue'
	
	export default{
		components: {
			LoginInput,
			BtnFoot
		},
		data(){
			return {
				loginWhether: '',
				merchNo: '',
				packageFee: '',
				loginType: '',
			}
		},
		onLoad(){
			this.loginWhether = uni.getStorageSync('status')
			this.merchNo = uni.getStorageSync('user').merchNo
			this.loginType = uni.getStorageSync('user').loginType
			this.packageFee = parseFloat(uni.getStorageSync('packageFee')/100).toFixed(2)
		},
		methods: {
			setPackageFee(){
				this.packageFee =(this.packageFee*100).toFixed(0)
				let vVlue = {"merchNo": this.merchNo,"packageFee": this.packageFee} //必传
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码
				this.$request.post('setPackageFee',{
					...vVlue,
					"sign":sSign
				},{
					token:true
				}).then((res)=>{ 
					this.$api.initPage(res.code,res.message)
					this.packageFee = parseFloat(this.packageFee/100).toFixed(2)
					if(res.code===200){
						uni.setStorageSync('packageFee',this.packageFee*100)
						uni.showToast({
							icon:'success',
							title: res.message,
							duration: 2000
						})
					} else {
						this.packageFee = parseFloat(uni.getStorageSync('packageFee')/100).toFixed(2)
						uni.showToast({
							icon:'none',
							title: res.message,
							duration: 2000
						})
					}
				}).catch()
			},
			packfeeChange: function(event) {
				this.packageFee = event.target.value
				//正则表达试 只能输入两位小数
				event.target.value = (event.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				//重新赋值给input
				this.$nextTick(() => {
					this.packageFee= event.target.value
				})
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
				color: #333333; 
				font-size: 30rpx; 
				display: block;
				padding: 16rpx 0; 
				line-height: 2.2;
				margin: 12rpx 0;
			}
					
			.prov-disabled {
				color: #8ed09b
			}
		}
	}
</style>

