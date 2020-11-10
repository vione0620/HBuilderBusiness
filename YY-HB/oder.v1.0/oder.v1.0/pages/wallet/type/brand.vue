<template>
	<view id="brandCard">
		<template v-if="isload">
			<default-page :load="true"></default-page>
		</template>  
		
		<template v-if="isready">
			<view class="group">
				<view class="brand-main">
					<view class="left"><view class="icon iconfont iconccb-band"></view></view>			
					<view class="center" v-for="(card,index) in brandcard" :key="'4'+index">
						<view class="tit">{{card.bankName}}</view>
						<view class="info">{{card.cardType == 1 ? '储蓄卡' : '信用卡'}}</view>
						<view class="number">{{card.cardNo}}</view>
					</view>
					<view class="right">
						<view class="icon iconfont iconccb-band"></view>
					</view>
				</view>   
			</view>
		</template>
		
	</view>
</template>

<script>
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii} from '@/common/util/utils.js'
	
	import BtnFoot from '@/components/basic/btn-foot.vue'
	import DefaultPage from '@/components/basic/default-page.vue'
	export default{
		data(){
			return {
				loginWhether:'',//登陆状态 
				merchNo:'', //商户号
				brandcard:[], // 银行卡数据		
				isload:true,  
				isready:false,		
			}
		},
		components:{
			BtnFoot,
			DefaultPage
		},
		onLoad() {			 
			this.loginWhether = uni.getStorageSync('status')  
			this.merchNo = uni.getStorageSync('user').merchNo					
			this.getMerchBankCard()
		},
		methods:{
			getMerchBankCard(){				
				let vVlue = {"merchNo": this.merchNo} //必传 
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码    
				
				this.$request.post('getMerchBankCard',{
					"merchNo":this.merchNo,  
					"sign":sSign
				},{
					token:true
				}).then(res=>{ 
					this.$api.initPage(res.code,res.message) 
					if(res.code === 200){ 						
						if(res.data.length){
							this.brandcard = res.data  
							this.isload = false
							this.isready = true
						} 
					}  
				}).catch(err=>{ 
					uni.showToast({
						icon:'none',
						title:err,
						duration:2000,
					})
				})
			},
			
		},
	}
</script>

<style scoped lang="scss">
#brandCard{
	padding: 20rpx;
	width: 100vw; 
		
	.group{
		margin-bottom: 20px;
	
		
		.brand-main{ 
			width: 100%;
			height: 240rpx;
			padding: 26rpx;
			border-radius: 8rpx;
			background-color: #004F9C; 
			display: flex;
			
			.left{
				width: 40rpx;
				height: 40rpx;
				background-color: #FFFFFF;
				border-radius: 50%; 
				
				.icon{
					font-size: 40rpx;
					color: #004F9C;
				}
				
			}
			.center{
				padding-left: 16rpx;
				color: #FFFFFF;
				
				.title{
					padding-top: 12rpx;
					font-size: 30rpx;
					padding-bottom: 20rpx;
				}
				.info{
					padding-top: 8px;
					font-size: 26rpx;
				}
				.number{
					padding-top: 40rpx;
					font-size: 40rpx;
					letter-spacing: 5rpx
				}
			}
			.right{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				
				.icon{
					font-size: 160rpx;
					color: #3372B0;
				}
			}
		}
	}
}
</style>
