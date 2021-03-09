<template>
	<view>
		
		<template v-if="isload">
			<default-page :load="true"></default-page>
		</template> 
		
		<template v-if="isready">
			<view id="shopScan">
				<view class="main">
					<view class="title">{{userStore.merchName}}{{busiType}}{{join}}</view>
					<view class="content"> 
						<view class="code-wrap" style="background-color: #FFFFFF; padding: 20rpx 0;">  
							<!-- <template v-if="this.qcodeImg">
								<image :src="qcodeImg" mode="" style="width: 400rpx; height: 400rpx;"></image>
							</template>
							<template v-else>  --> 
								<!-- <view class="canvas-h ide"> -->
									<uni-qrcode @makeComplete="makeComplete"
									 :text="codeText" cid="cavs" :makeOnLoad="true" :logo="merchPic"/> 
								<!-- </view>  -->
							<!-- </template> -->
						</view>
						<view class="txt">扫描店铺二维码下单</view> 
					</view>
				</view>
				<view class="downImg">
					<view class="getDownBtn" @tap="getShopCodeImg()">保存二维码</view>
				</view>
				
			</view>
		
		</template>
		
	</view>
</template>

<script>
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii} from '@/common/util/utils.js'	
	import uQRCode from '@/common/util/uqrcode.js'
	
	import DefaultPage from '@/components/basic/default-page.vue'	
	import UniQrcode from '@/components/uni/uni-qrcode.vue' 
	export default {
		data() {
			return {
				loginWhether:'',//登陆状态
				userStore:'', //用户信息
				merchNo:'', //商户号1
				merchCode:'', 
				codeText:'',
				merchName:'', 
				qcodeImg:'', 
				isload:true, 
				isready:false,
				join:'',
				merchPic:'',
				account:'',//商户号2
			}
		},
		components:{
			DefaultPage, 
			UniQrcode,
		},
		onLoad() { 
			this.loginWhether = uni.getStorageSync('status') 
			this.userStore = uni.getStorageSync('user')
			this.merchNo = uni.getStorageSync('user').merchNo	 
			
			this.join = '-'+ this.userStore.joinNo  
			this.getScanCode()
			this.getShopImg()
			// this.qcodeImg = uni.getStorageSync('makeimg')    
		},
		computed:{
			busiType:function(){ 
				let ps = this.userStore.busiType
				let shopType = ''
				switch (ps){
					case '1' :
					shopType = '-早餐车'
					break;
					case '2' :
					shopType = '-早餐店'
					break;
					case '3' :
					shopType = '-生鲜'
					break;
				}
				return shopType
			},
		},
		methods: { 
			getScanCode(){
				if(this.merchNo=='35110000000000'){
					let testDate = "https://gworder.yiyichina.cn/scan?m=35020353110003"
					this.codeText = testDate
					this.isload = false
					this.isready = true	
					return
				}
				let vVlue = {"merchNo": this.merchNo} //必传 
				let sSort = getSortAscii(vVlue) ///排序    
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase()   
				
				this.$request.post('getMerchCode', {
					...vVlue,
					"sign": sSign
				},{
					token:true
				}).then(res => {
					this.$api.initPage(res.code,res.message) 
					if (res.code == 200) { 					
						this.codeText = res.data.merchCode  
						setTimeout(()=>{
							this.isload = false
							this.isready = true	 
						},300)
						 
					}
				}).catch() 
			},
			getShopImg(){
				if(this.merchNo=='35110000000000'){
					let testDate = "http://res.yiyichina.cn/merch/3a2b8166-ef06-4ab2-985c-e215ddf7c524.jpg"
					this.merchPic = testDate
					return
				}
				let vVlue = {"merchNo": this.merchNo} //必传 
				let sSort = getSortAscii(vVlue) ///排序    
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase()   
				
				this.$request.post('getMerchDetail', {
					...vVlue,
					"sign": sSign
				},{
					token:true
				}).then(res => { 
					this.$api.initPage(res.code,res.message) 
					if (res.code === 200) { 		 
						this.merchPic = res.data.merchPic 
					}
				}).catch() 
				
			},
			makeComplete(e){  
				this.qcodeImg = e  
			},
			getShopCodeImg(){  
				if(this.qcodeImg){ 
					plus.gallery.save(this.qcodeImg, (success)=>{ 
						uni.showToast({
							icon:'none',
							title:'保存成功'
						})
					},(err)=>{
						console.log(err)
					}) 
				}
			},
		}
	}
</script>

<style lang="scss">
	#shopScan{
		padding: 160rpx 80rpx 80rpx 80rpx;
		width: 100vw;
		.main{
			 
			box-shadow: 0 0 20rpx 10rpx rgba(0, 0, 0, .05);
			border-radius: 6px;
			width: 80vw;
			
			.title{
				background-color: #49B75D;
				
				box-shadow: 0 0 20rpx 10rpx rgba(0, 0, 0, .05);
				color: #FFFFFF;
				padding: 40rpx;
				border-radius: 6px 6px 0 0;
				align-items: center;
				justify-content: center;
				font-size: 32rpx;
			}
			
			.content{ 
				position: relative;				
				padding: 80rpx;  
				.code-wrap{ 
					display: flex;
					justify-content: center; 
					// background-color: #F2F2F2;
					width: 100%; 
					height: 440rpx;
					
					.canvas-hide {
						/* 1 */
						position: fixed;
						right: 100vw;
						bottom: 100vh;
						/* 2 */
						z-index: -9999;
						/* 3 */
						opacity: 0;
					}
				}
				
				.txt{
					width: 100%;
					padding-top: 40rpx;
					text-align: center; 
					font-size: 36rpx;
					color: #777; 
				}
		
				.afresh{
					width: 100%; 
					padding-top: 40rpx;
					text-align: center; 
					font-size: 30rpx;
					color: #49B75D; 					
					.iconfont{
						font-size: 30rpx;
						font-weight: bolder;
						margin-right: 8rpx;
					}
				}
			}
		}
		.downImg{
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 80rpx 0 40rpx 0;
			.getDownBtn{
				padding: 20rpx 80rpx;
				font-size: 32rpx;
				background-color: #49B75D;
				border-radius: 8rpx;
				color: #FFFFFF;
			}
		} 
	}
</style>
