<template>
	<view class="moneny-wrap"> 
	
		<template v-if="isload">
			<default-page :load="true"></default-page>
		</template>
		
		<template v-if="isready"> 
	
			<view class="main">
				<view class="group"> 
					<view class="title">我的余额</view>
					<view class="contMain">{{walletData.remainAmt / 100}}<text class="lab">元</text></view>				
				</view>
				<view class="group-flex2">
					<view class="item border-right">
						<view class="title">今日收入</view>
						<view class="contMain">{{walletData.frozenAmt / 100}}<text class="lab">元</text></view>
					</view>
					<view class="item">
						<view class="title">待结算余额</view>
						<view class="contMain">{{walletData.settingAmt / 100}}<text class="lab">元</text></view>
					</view>				
				</view>	
			</view>
					
			<view class="foot-btn">
				<view class="">
					<view class="btn" @tap="getMoenyBtn()">提现</view>
					<view class="links-item">
						<!-- <view class="item" @tap="navto('./getMoneyTime')">提现管理</view> -->
						<view class="item" @tap="navto('./record')">提现明细</view>
					</view> 
					
				</view>
			</view>
		
		
		</template>
	
	</view>
</template>

<script> 
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii} from '@/common/util/utils.js'
	
	import DefaultPage from '@/components/basic/default-page.vue'	
	export default {
		data() {
			return { 
				loginWhether:'',//登陆状态 
				merchNo:'', //商户号
				walletData:'',// 基础数据
				isload:true,
				isready:false,
			  }
		},
		components:{ 
			DefaultPage, 
		},
		onLoad(){ 
			this.loginWhether = uni.getStorageSync('status')  
			this.merchNo = uni.getStorageSync('user').merchNo		
			
			this.getMerchWallet()
		},
		methods: {
			getMerchWallet(){ 
				if(this.merchNo=='35110000000000'){
					let testDate = {"remainAmt":4550,"frozenAmt":2550,"settingAmt": 2000}
					setTimeout(()=>{
						this.walletData = testDate
						this.$store.dispatch('get_moeny_quota',testDate.remainAmt)
						this.isload = false
						this.isready = true
					},500)
					return
				}
				let vVlue = {"merchNo": this.merchNo} //必传
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码    
				this.$request.post('getMerchWallet',{
					"merchNo":this.merchNo,  
					"sign":sSign
				},{
					token:true
				}).then(res=>{  
					this.$api.initPage(res.code,res.message)
					if(res.code === 200){
						setTimeout(()=>{
							this.walletData = res.data 
							this.$store.dispatch('get_moeny_quota',res.data.remainAmt)
							this.isload = false
							this.isready = true
						},500)						
					}				
				}) 
			},
			getMoenyBtn(){
				if(this.walletData.remainAmt == 0){
					uni.showToast({
						icon:'none',
						title:'您当前没有可用余额',
						duration: 2000
					})
				}else{
					uni.navigateTo({
						url:'./check?money=' + this.walletData.remainAmt
					})
				}
				
			},
			navto(urls){
				uni.navigateTo({
					url:urls
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.moneny-wrap{
		width: 100%; 
		position: relative;
		.main{
			margin: 20rpx;
			background-color: #FFFFFF;
			border-radius: 12rpx;
			color: #333333;			
			text-align: center;
			
			.group{				padding: 20px 0;
				.title{
					font-size: 30rpx;
				}
				.contMain{
					font-size: 80rpx;
					padding: 20rpx 0;
					
					.lab{
						font-size: 30rpx;
					}
				}
			}
			
			.group-flex2{
				display: flex; 
				justify-content: center;
				padding: 30rpx 0;
				
				.border-right{
					border-right: 1px solid #d4d4d4;
				}
				.item{
					flex: 2;
					
					.title{
						font-size: 30rpx;
						padding-bottom: 20rpx;
					}
					.contMain{
						font-size: 36rpx;
						
						.lab{
							font-size: 28rpx;
						}
					}
					
				}
				
			}
		}
	 
	 
	 .foot-btn{
		display: flex;
		justify-content: center;
		position: absolute; 
		bottom: 50rpx;
		width: 100vw;
		display: flex;
		justify-content: center;
		
		.btn{
			background-color: #46B85B;
			width: 360rpx;
			height: 88rpx;
			border-radius: 8rpx;
			color: #FFFFFF;
			font-size: 32rpx;
			text-align: center;
			line-height: 2.7;
		}
		
		.links-item{
			margin-top: 20rpx;
			display: flex;
			justify-content: center;
			.item{
				padding: 20rpx;
			}
		}
		 
	 } 

	}
</style>
