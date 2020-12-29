<template>
	<view class="pay_checked" style="">
		<view class="title">合计：{{parseFloat((this.actualPay) /100).toFixed(2)}}元</view>
		<view class="get_coupon">
			<view class="group">
				<view class="left">满减券/优惠</view>
				<view class="right" @tap="navtoGetCoupon()">
					<template v-if="this.couponid">
						<view class="txt">{{this.couponid}}</view> 
					</template>
					<template v-else>
						<view>使用优惠券</view>
					</template> 
				</view>
			</view>
		</view>
		<view class="totalNum"> 
			<view class="left">待支付总计：</view> 
			<view class="right"> {{parseFloat(this.totalPrice/100).toFixed(2)}}元</view>
		</view> 
		<view class="totalNum" v-if="this.couponData">
			<view class="left">实际应支付：</view> 
			<view class="right"> {{parseFloat((this.actualPay) /100).toFixed(2)}}元</view>
		</view> 
		
		<view v-if="disablepay" class="oncredit">您选择了先铺货再付款</view>
		
		
	</view>
</template>

<script>
	import {mapState, mapGetters} from 'vuex'
	import PopUp from '@/components/BuyMall/rk-pop.vue'	
	export default {
		props:{
			PayNowData:Object,
		},
		computed:{
			...mapState(['cartGoods']),
			...mapGetters(['totalPrice'])
		}, 
		components:{
			PopUp,
		},
		data() {
			return {
				disablepay:this.PayNowData.disablepay,
				couponid:this.PayNowData.couponid,
				actualPay:this.PayNowData.actualPay,
				couponData:this.PayNowData.couponData,
				
				checktype:this.PayNowData.checktype ,
			};
		}, 
	}
</script>

<style lang="scss">

</style>
