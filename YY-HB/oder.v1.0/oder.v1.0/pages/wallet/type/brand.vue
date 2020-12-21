<template>
	<view id="brandCard">
		<template v-if="isload">
			<default-page :load="true"></default-page>
		</template>		  
	  <template v-if="isnohave">
		<default-page :nohave="true"></default-page>
	  </template>
		
		<template v-if="isready">
			<view class="group" v-for="(card,index) in brandcard">
				<view class="brand-main"
				 :class="card.bankType == '1' ? 'bg-blue' : '' || card.bankType == '2' ? 'bg-green' : '' || card.bankType == '3' ? 'bg-red' : '' || card.bankType == '4' ? 'bg-red' : '' || card.bankType == '5' ? 'bg-green' : '' || card.bankType == '6' ? 'bg-blue' : '' || card.bankType == '7' ? 'bg-red' : '' || card.bankType == '8' ? 'bg-yellow' : '' || card.bankType == '9' ? 'bg-blue' : '' || card.bankType == '10' ? 'bg-blue' : '' || card.bankType == '11' ? 'bg-purple' : '' || card.bankType == '12' ? 'bg-red' : '' || card.bankType == '13' ? 'bg-red' : ''">
					<view class="left"> 
						<view class="icon" 
				 :class="card.bankType == '1' ? 'iconfont iconccb-band color-blue' : '' || card.bankType == '2' ? 'bank-ny' : '' || card.bankType == '3' ? 'bank-gs' : '' || card.bankType == '4' ? 'bank-zg' : '' || card.bankType == '5' ? 'bank-yz' : '' || card.bankType == '6' ? 'bank-xy' : '' || card.bankType == '7' ? 'bank-zs' : '' || card.bankType == '8' ? 'bank-pa' : '' || card.bankType == '9' ? 'bank-jt' : '' || card.bankType == '10' ? 'bank-pf' : '' || card.bankType == '11' ? 'bank-gd' : '' || card.bankType == '12' ? 'bank-zx' : '' || card.bankType == '13' ? 'bank-bj' : ''"></view>
					</view>			
					<view class="center">
						<view class="tit">{{card.bankName}}</view>
						<view class="info">{{card.cardType == 1 ? '储蓄卡' : '信用卡'}}</view>
						<view class="number">{{card.cardNo}}</view>
					</view>
					<view class="right"> 
						<view class="icon" 
				 :class="card.bankType == '1' ? 'iconfont iconccb-band' : '' || card.bankType == '2' ? 'bank-ny sign' : '' || card.bankType == '3' ? 'bank-gs sign' : '' || card.bankType == '4' ? 'bank-zg sign' : '' || card.bankType == '5' ? 'bank-yz sign' : '' || card.bankType == '6' ? 'bank-xy sign' : '' || card.bankType == '7' ? 'bank-zs sign' : '' || card.bankType == '8' ? 'bank-pa sign' : '' || card.bankType == '9' ? 'bank-jt sign' : '' || card.bankType == '10' ? 'bank-pf sign' : '' || card.bankType == '11' ? 'bank-gd sign' : '' || card.bankType == '12' ? 'bank-zx sign' : '' || card.bankType == '13' ? 'bank-bj sign' : ''"></view>
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
				isnohave:false,
				bgcolorBlue:false,
				bgcolorRed:false,
				bgcolorYellow:false,
				bgcolorPurple:false,
				bgcolorGreen:false,
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
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码     }

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
						}else{
							this.isload = false
							this.isnohave = true 
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
		margin-bottom: 20rpx;
	
		.bg-red{			
			background: linear-gradient(60deg, #ff5464, #ff7568)
		}
	
		.bg-blue{			
			background: linear-gradient(60deg, #3a69c3, #3a8bcd)
		}
		.bg-green{			
			background: linear-gradient(60deg, #028fad, #00b9a7)
		}
		.bg-yellow{			
			background: linear-gradient(60deg, #f6a83c, #fd8b42)
		}
		.bg-purple{
			background: linear-gradient(60deg, #773a8b, #b362cd)			
		}
		.color-blue{
			color: #3a69c3;
		}
		
		.bank-ny{
			background:url(../../../static/bank/ny.png) no-repeat; 
		}
		.bank-gs{
			background:url(../../../static/bank/gs.png) no-repeat; 
		}
		.bank-zg{
			background:url(../../../static/bank/zg.png) no-repeat; 
		}
		.bank-yz{
			background:url(../../../static/bank/yz.png) no-repeat; 
		}
		.bank-xy{
			background:url(../../../static/bank/xy.png) no-repeat; 
		}
		.bank-zs{
			background:url(../../../static/bank/zs.png) no-repeat; 
		}
		.bank-pa{
			background:url(../../../static/bank/pa.png) no-repeat; 
		}
		.bank-jt{
			background:url(../../../static/bank/jt.png) no-repeat; 
		}
		.bank-pf{
			background:url(../../../static/bank/pf.png) no-repeat; 
		}
		.bank-gd{
			background:url(../../../static/bank/gd.png) no-repeat; 
		}
		.bank-zx{
			background:url(../../../static/bank/zx.png) no-repeat; 
		}
		.bank-bj{
			background:url(../../../static/bank/bj.png) no-repeat; 
		}
		.brand-main{ 
			width: 100%;
			height: 240rpx;
			padding: 26rpx;
			border-radius: 8rpx;
			display: flex;
			
			.left{
				width: 40rpx;
				height: 40rpx;
				background-color: #FFFFFF;
				border-radius: 50%; 
				
				.icon{
					border-radius: 50%;
					background-position: center;
					background-size: 80%;
					width: 40rpx;
					height: 40rpx;
					font-size: 40rpx;
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
					color: #3a69c3;
					opacity: .7;
				}
				.sign{
					opacity: .2;
					width: 160rpx;
					height: 160rpx;
					background-size: 100%;
				}
			}
		}
	}
}
</style>
