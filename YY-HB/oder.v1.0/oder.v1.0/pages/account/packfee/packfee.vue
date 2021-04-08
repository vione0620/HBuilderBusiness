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
			this.packageFee = uni.getStorageSync('packageFee').toString()
			this.packageFee = parseFloat(this.packageFee/100).toFixed(2)
		},
		methods: {
			setPackageFee(){
				this.packageFee *= 100
				let vVlue = {"merchNo": this.merchNo,"packageFee": this.packageFee} //必传
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码
				this.$request.post('setPackageFee',{
					...vVlue,
					"sign":sSign
				},{
					token:true
				}).then((res)=>{ 
					console.log(res)
					this.packageFee = parseFloat(this.packageFee/100).toFixed(2)
					if(res.code===200){
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
			packfeeChange: function(e) {
				this.packageFee = e.target.value
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

