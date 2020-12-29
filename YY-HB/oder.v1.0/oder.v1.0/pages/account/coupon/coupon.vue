<template>
	<view>
		<template v-if="isload">
			<default-page :load="true"></default-page>
		</template> 
		
		<template v-if="isready">
			<view id="coupon">
				<view id="header">  
					<view class="tag_group">
						<view v-for="(items,index) in couponTag"> 						
							<view class="title" :class="tabIndex === index ? 'active':''" @tap="changeTab(index)">{{items}}</view> 
						</view>
					</view> 
				</view>
				<view id="content"> 
					<swiper :style="'height:'+ scrollH +'px;'" :current="this.tabIndex" @change="linktabindex">
						<swiper-item>
							<scroll-view scroll-y :style="'height:'+ scrollH +'px;'">
								<template v-if="this.validity.length > 0">
									<view class="validity" v-for="(group,index) in validity">
										<coupon-item :receive-data="group" @get-coupon="sendCoupon" :type="1"></coupon-item>
									</view> 
								</template>
								<template v-else>
									<view class="nothing">
										<image src="@/static/default_null@1x.png" class="img" mode="scaleToFill"></image>
										<view class="txt">暂无记录</view>
									</view>
								</template> 
							
							</scroll-view>
						</swiper-item>
						
						<swiper-item>
							<scroll-view scroll-y :style="'height:'+ scrollH +'px;'"> 
								<template v-if="this.normalUsed.length > 0">
									<view class="normalUsed" v-for="(group,index) in normalUsed">  
										<coupon-item :receive-data="group" @get-coupon="sendCoupon" :type="2"></coupon-item>
									</view>  
								
								</template>
								<template v-else>
									<view class="nothing">
										<image src="@/static/default_null@1x.png" class="img" mode="scaleToFill"></image>
										<view class="txt">暂无记录</view>
									</view>
								</template>
							</scroll-view>
						</swiper-item>
						
						<swiper-item>
							<scroll-view scroll-y :style="'height:'+ scrollH +'px;'"> 
								<template v-if="this.exprires.length > 0"> 
									<view class="exprires" v-for="(group,index) in exprires"> 
										<coupon-item :receive-data="group" @get-coupon="sendCoupon" :type="0"></coupon-item>
									</view>   
								</template>
								<template v-else>
									<view class="nothing">
										<image src="@/static/default_null@1x.png" class="img" mode="scaleToFill"></image>
										<view class="txt">暂无记录</view>
									</view>
								</template>
							</scroll-view>
						</swiper-item> 
						
					</swiper>
					
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
	
	export default { 
		data() {
			return {
				loginWhether:'',//登陆状态
				merchNo:'', //商户号
				isload:true, 
				isready:false, 
				tabIndex:0,
				scrollH:0,
				scrollInto:"",  //左侧索引 
				couponTag:['未使用','已使用','已过期'],
				validity:[],
				normalUsed:[],
				exprires:[]
			}
		}, 
		components:{
			CouponItem,
		},
		onLoad() {
			this.loginWhether = uni.getStorageSync('status') 
			this.merchNo = uni.getStorageSync('user').merchNo		
			uni.getSystemInfo({
				success:res=>{
					this.scrollH = res.windowHeight
				}
			}) 
			this.getMerchCoupon()
		},
		methods: {
			linktabindex(e){ 
				this.tabIndex = e.detail.current
			},
			changeTab(index){ 
			 	if (this.tabIndex === index) {
			 		return
			 	} 
			 	this.tabIndex = index 
			}, 
			scroll(e){
				console.log(e)
			},
			getMerchCoupon(){ 
				
				let vVlue = {"merchNo":this.merchNo} //必传 
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				
				this.$request.post('getMerchCoupon',{
				  ...vVlue, 
				  "sign": sSign
				},{
					token:true
				}).then((res)=>{ 
					this.$api.initPage(res.code,res.message) 
					
					if(res.code == 200){      
						setTimeout(()=>{
							this.isload = false
							this.isready = true
							let handleCoupon = res.data 
							
							let c_one = handleCoupon.filter(coupon => {
								let today = new Date().getTime()
								let end =  new Date(coupon.expireTime)
								return coupon.useState == 0 && end > today 
							})  
							
							let c_two = handleCoupon.filter(coupon => coupon.useState == 1) 
							let c_three = handleCoupon.filter(coupon => { 
								let today = new Date().getTime()
								let end =  new Date(coupon.expireTime) 
								return end < today
							})  
							 
							this.validity = c_one
							this.normalUsed = c_two
							this.exprires = c_three 
						},300)	  
					}
					
					
				}) 
				
			},
			sendCoupon(e){
				console.log('getCoupon',e)
			},
		}
	}
</script>

<style scoped lang="scss">  
	#coupon{
		width: 100vw;
	}
	#header{
		.tag_group{
			
			padding: 40rpx 20rpx 20rpx 20rpx;		
			display: flex;
			justify-content: space-around;
			.title{
				color: #999; 
			} 
			.active{
				color: #333;
				font-weight: bold;
			}
		}
	}
	#content{
		padding: 20rpx;
		width: 100vw; 
		
	}
	
	.nothing{
		text-align: center;
		padding-top: 100rpx;
		.img{
			width: 512rpx;
			height: 332rpx; 
		}
		
		.txt{
			padding: 100rpx 20rpx;
			text-align: center;
			color: #999999;
		}
		
	}

</style>
