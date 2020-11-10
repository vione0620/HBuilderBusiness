<template>
	<view class="mallCart">
		<uni-popup ref="popup" type="bottom" :car="true">
			<view class="cartlist-wrap">
				<view class="carPop-title">
					<view class="txt">已选商品</view>
					<view class="clearbtn" @click="emptyCart()">清空</view>
				</view>
				<view class="bottom-car">
					<view class="group-wrap">
						<view class="carPop-list" v-for="(food,index) in cartGoods" :key="index">
							<view class="name">{{food.goodsName}} </view>
							<view class="nums">
								{{(food.goodsPrice * food.boxNums)| filprie()}} 
							</view>
							<get-btn-item :foods="food"></get-btn-item>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	

		<view class="mallFoot"> 
			<view class="cars-wrap">
				<view class="cars-btn" @click="showCarsList()">
					<image class="cars iconcar" src="../static/icon-car.png" mode=""></image>
					<template v-if="totalCount > 0">
						<view class="badge uni-badge">{{totalCount}}</view> 
					</template>
				</view>
				<view class="nums-wrap">
					<view class="prices">{{totalPrice | filprie()}}<text class="txt">元</text></view>
				</view>
			</view> 

			<view class="right-btn" hover-class="bg-hover" @click="goToPay">提交订单</view>

		</view>


	</view>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex'
	import UniPopup from '@/components/uni-popup.vue' 
	import GetBtnItem from './get-btn-item.vue'
	export default {
		components: {
			UniPopup, 
			GetBtnItem,
		},
		computed: {
			...mapState(['cartGoods']),
			...mapGetters(['totalCount', 'totalPrice'])
		},
		watch: {
			cartGoods: function (val) { 
			  if(!this.cartGoods.length){
				this.$refs.popup.close() 
			  }
			}, 
		},
		methods: {
			goToPay() {
				if (this.totalPrice <= 0) {
					uni.showToast({
						icon: 'none',
						title: '您还不能去付款哦',
						duration: 2000
					})
					return
				}
				setTimeout(()=>{
					uni.redirectTo({
						url: '../../pages/mall/prepay'
					})
				},100)
			},
			showCarsList() {
				if (this.cartGoods.length <= 0) {
					uni.showToast({
						icon: 'none',
						title: '您还未选购商品哦',
						duration: 2000
					})
					return
				}
				this.$refs.popup.open()
			}, 
			emptyCart() {
				this.$store.commit('clear_cart')
				this.$refs.popup.close()
			},
		},
		filters: {
			filprie(price) {
				return '￥' + parseFloat(price/100).toFixed(2)
				
			}
		},
	}
</script>

<style lang="scss" scoped>
	.mallCart {

		.cartlist-wrap { 
				border-bottom: 1px solid rgba(51,51,51,0.05);

			.carPop-title {
				padding: 12rpx 24rpx;
				background-color: #f2f2f2;
				box-shadow: 1px 0 2px rgba(0, 0, 0, .117647), 1px 0 2px rgba(0, 0, 0, .117647);
				display: flex;
				align-items: center;
				justify-items: center;
				justify-content: space-between;
				font-size: 26rpx;

				.clearbtn {
					color: #999;
				}
			}


			.bottom-car {

				.group-wrap {

					.title {
						padding: 8px 24rpx;
						background-color: #d4d4d4;
						font-size: 30rpx;
					}

					.carPop-list {
						padding: 24rpx;
						display: flex;
						align-items: center;
						font-size: 30rpx;

						.name {
							flex: 2;

							.red {
								color: #f00;
								font-size: 20rpx;
								vertical-align: text-top
							}
						}

						.nums {
							flex: 2;
						}

						.boxBtn {
							flex: 2;
							text-align: right;
						}

					}

				}

			}

		}



		.mallFoot {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			height: 88rpx;
			margin-bottom: 0;
			justify-content: space-between;
			align-items: center;
			background-color: #FFFFFF;
			box-shadow: 0 2px 6px rgba(0, 0, 0, .117647), 0 2px 4px rgba(0, 0, 0, .117647);
			padding-left: 20rpx;
			padding-right: 20rpx;

			.cars-wrap {
				display: flex;
				align-items: center;

				.cars-btn {
					position: relative;
					display: flex;
					align-items: center;

					.cars {
						width: 54rpx;
						height: 54rpx;
					}

					.badge {
						position: absolute;
						right: 0;
						top: 0;
					}
					
					
					.uni-badge {
						font-family: 'Helvetica Neue', Helvetica, sans-serif;
						box-sizing: border-box;
						font-size: 20rpx;
						line-height: 1;
						display: inline-block;
						padding: 3px 6px;
						color: #FFFFFF;
						border-radius: 100px;
						background-color: #FF0000
					}
				}

				.prices {
					font-size: 38rpx;
				}

				.txt {
					font-size: 24rpx;
				}

			}

			.right-btn {
				font-size: 28rpx; 
				padding: 10rpx 60rpx; 
				text-align: center;
				align-items: center;
				justify-content: center;
				color: #FFFFFF;
				background-color: #46B85B;
				border-radius: 34rpx;
			}
			.bg-hover{
				background-color: #04a722;
			}
		}

	}
</style>
