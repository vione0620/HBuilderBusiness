<template>
	<view id="usable">		 
		<template v-if="isload">
			<default-page :load="true"></default-page>
		</template> 
		<template v-if="isnohave">
			<default-page :nohave="true"></default-page>
		</template>
		
		<template v-if="isready">
			<view class="header">
				<view class="left">当前可用<text class="txt">{{length}}</text>张</view>
				<view class="right" @tap="nonuse()">不使用优惠券</view>
			</view>
			 <view class="content">
				 <view class="wrap">
					<view class="validity" v-for="(group,index) in validity" @tap="check(index)">   
						<view class="checked iconstatus-ok iconfont" :class="tabindex == index ? 'green' : ''"></view> 
						<coupon-item :receive-data="group" @get-coupon="sendCoupon" :type="3"></coupon-item>
					</view>
				</view>
			</view> 
			<view class="footer">
				<view class="left"><text class="tit">用券</text><text class="txt">-{{number}}</text>元</view>
				<view class="right">
					<view class="btn" @tap="checed_back()">确定</view>
				</view>
			</view> 
		</template>
	</view>
</template>
<script>
	import { mapState, mapGetters} from 'vuex'
	import {b64Md5,hexMD5} from '@/network/md5.js'	
	import {getSortAscii} from '@/common/util/utils.js' 
	import CouponItem from '../../../components/basic/couponItem.vue'
	import DefaultPage from '@/components/basic/default-page.vue'
	export default{
		data(){
			return { 
				loginWhether:'',//登陆状态
				merchNo:'', //商户号
				isload:true,
				isnostore:false,
				isnohave:false,
				isready:false,
				validity:[],
				length:0,
				number:0,
				tabindex:Number,
				pType:'',
				pPage:'',
			}
		},
		computed:{ 
			...mapState(['getCartAmt','getCouponId']),
			...mapGetters(['totalPrice','prevOrderPrice'])     
		}, 
		components:{
			CouponItem,
			DefaultPage,
		},
		onLoad(option) {
			this.loginWhether = uni.getStorageSync('status') 
			this.merchNo = uni.getStorageSync('user').merchNo	
			this.pType = option.type 
			this.pPage = option.page
			setTimeout(()=>{
				this.getCouponUsable() 
			},0)
		},		
		onBackPress(options) { 
			if(this.getCouponId){    
				this.$store.dispatch('get_cart_amt',this.getCouponId.couponAmt)  
			}else{ 
				this.$store.dispatch('get_cart_amt','')
			}
		},
		methods:{
			getCouponUsable(){
				let vVlue = {"merchNo":this.merchNo,"orderAmt":this.pType} //必传  
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post('getCouponUsable',{
				  ...vVlue, 
				  "sign": sSign
				},{
					token:true
				}).then((res)=>{ 
					this.$api.initPage(res.code,res.message) 
					setTimeout(()=>{
						if(res.code == 200 && res.data.length){  
								this.isload = false
								this.isready = true		
								this.validity = res.data
								this.length = res.data.length
						}else{
							this.isload = false
							this.isnohave = true		
						}
					},300)	 
				}) 
				
			},			
			sendCoupon(e){ 
				this.number = parseFloat(e.couponAmt/100)
				
				this.$store.dispatch('get_coupon_id',e)
			},
			check(e){
				this.tabindex = e 
			},
			nonuse(){
				this.$store.dispatch('get_coupon_id','')
				this.$store.dispatch('get_cart_amt','')
				uni.navigateBack({
					delta:1,
					animationDuration:300, 
				})
			},
			checed_back(e){
				uni.navigateBack({
					delta:1,
					animationDuration:300, 
				})
			}
		},
	}
</script>
<style lang="scss" scoped> 
	#usable{
		width: 100vw;  
		box-sizing: border-box;
	}
	.header{
		padding: 20rpx 20rpx 0 20rpx;
		display: flex;
		justify-content: space-between;
		.left{
			.txt{
				padding: 0 8rpx;
				color: #46b959;
			}
			
		} 
	} 
	.content{
		width: 100%; 
		padding: 20rpx;
		.wrap{
			overflow: hidden;
			position: relative;
		}
	}
	.validity{ 
		position: relative;
		z-index: 1;
		.checked{
			z-index: 1;
			position: absolute;
			top: 0;
			right: 0;
			font-size: 38rpx; 
			color: #ffffff;
		}
		.green{
			color: #46b959;
		}
	}
	.footer{
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 20rpx;
		background-color: #FFFFFF;
		border-top: 1px solid #eeeeee;
		justify-content: flex-end;
		align-items: center;
		display: flex;
		.left{  
			padding-right: 20rpx;
			.txt{
				color: #f00;
				padding: 0 8rpx;
			}
			
		}
		.right{
			
			.btn{
				border-radius: 40rpx;
				padding: 12rpx 60rpx;
				color: #FFFFFF;
				background-color: #46b959;
			}
		}
	}
</style>