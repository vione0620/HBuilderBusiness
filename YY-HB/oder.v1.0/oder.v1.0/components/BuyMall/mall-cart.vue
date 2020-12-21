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
						<view class="carPop-list" v-for="(food,index) in cartGoods" :key="'4'+index">							
							<view class="name">{{food.goodsName}} 
							<text class="red">{{(food.goodsNo === "YP0YWDJ0000014") ? '必选' : ''}}</text>
							<text class="red">{{(food.hotSale==='0' || food.hotSale === undefined) ? '' : '热门'}}</text>
							</view> 
							<view class="nums">
								{{parseFloat(food.merchPrice * food.boxNums * food.goodsQuantity /100).toFixed(2)/1}}元
							</view>
							<get-btn-item :foods="food"></get-btn-item>  
						</view>
					</view> 
				</view>
			</view>
			
		</uni-popup>
		
		
		
		<view class="mallFoot">
			<view class="left">
				<view class="cars-wrap">
					<view class="cars-btn" @click="showCarsList">
						<text class="cars iconfont iconcar"></text> 
						<template v-if="totalCount > 0">							 
							<uni-badge class="badge" type="error" size="small" :text="totalCount"></uni-badge>
						</template>
					</view>
					<view class="nums-wrap">
						<view class="prices">{{parseFloat(totalPrice/100).toFixed(2)/1}}<text class="txt">元</text></view>							
						<view class="info">豆浆数量应不少于食品数量</view>
					</view>
				</view>
				
			</view>
					
			<view class="right-btn" @click="goToPay">提交订单</view>
				<view>		
					</view>
		</view>
		
		
	</view>
</template>

<script>
	import { mapState, mapGetters} from 'vuex'
	import UniPopup from '@/components/uni/uni-popup.vue'
	import GetBtnItem from '@/components/basic/cartbox/get-btn-item.vue' 
	import uniBadge from '@/components/uni/uni-badge.vue'
	export default{
		components:{
			UniPopup,	
			uniBadge,
			GetBtnItem,
		},
		props:{
			bottomCars:Object,
			hasFinalPay:Boolean,
		},
		computed:{
			...mapState(['cartGoods','previousOrder']),
			...mapGetters(['totalCount','totalPrice'])
		}, 
		data(){
			return{
				showPop:false,
			}
		},
		methods:{
			goToPay(){
				if(this.totalPrice <= 0){					
					uni.showToast({
						icon:'none',
						title:'您还不能去付款哦',
						duration: 2000
					})
					return
				}else{ 
					uni.redirectTo({
						url:`/pages/utility/mall/prepay?status=${this.hasFinalPay}`
					}) 				
					console.log(this.hasFinalPay)
						
				} 
			},
			showCarsList(){
				if(this.cartGoods.length <= 0){
					uni.showToast({
						icon:'none',
						title:'您还未选购商品哦',
						duration: 2000
					})
					return 
				} 
				this.$refs.popup.open()  
			},			
			updated() {
				this.reFresh = false  
				this.$nextTick(()=>{ 			  
					this.reFresh = true 
				})
			},
			emptyCart(){   
				this.$store.commit('clear_cart') 
				this.$refs.popup.close()
			}, 
		},		 
	}
</script>

<style lang="scss" scoped>
	.mallCart{
		
		.cartlist-wrap{ 
			box-shadow: 1px 0 2px rgba(0,0,0,.1), 1px 0 2px rgba(0,0,0,.1); 			 
			
			.carPop-title{ 
				padding: 24rpx; 
				background-color: #f2f2f2;
				box-shadow: 1px 0 2px rgba(0,0,0,.1), 1px 0 2px rgba(0,0,0,.1);
				display: flex;
				align-items: center;
				justify-items: center;
				justify-content: space-between; 
				font-size: 32rpx;
				.clearbtn{
					color: #999; 
				}
			}
			
			
			.bottom-car{
				
				.group-wrap{
					
					.title{
						padding: 8px 24rpx;
						background-color: #d4d4d4;
						font-size: 28rpx;
					}
					
					.carPop-list{
						padding: 24rpx;
						display: flex;
						align-items: center;
						
						.name{
							flex: 2;
							.red{
								color: #f00;
								font-size: 20rpx; 
								vertical-align:text-top
							}
						}
						.nums{
							flex: 2;
						}
						.boxBtn{
							flex: 2; 
							text-align: right;
							
						}
						
					} 
					
				}
			
			}
			
		}
		
		
		
		.mallFoot{
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			width: 100vw;
			height: 120rpx;
			margin-bottom: 0;
			justify-content: space-between;
			align-items: center;
			background-color: #FFFFFF;
			box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
			
			padding: 0 32rpx;
				
			.left{ 
				.cars-wrap{ 
						display: flex;
						align-items: center;
					
					.cars-btn{
						position: relative;						
						display: flex;
						align-items: center;
						
						.cars{
							font-size:80rpx;
						}
						
						.badge{
							position: absolute;
							right: 0;
							top: 0; 
						}
					}
					.nums-wrap{
							
						.prices{
							font-size: 44rpx;
							
							.txt{
								font-size:26rpx;
							}
						}
						
						
						.info{
							font-size:20rpx;
						}
					}					
					
				}
			}
			 			
			.right-btn{
				font-size: 32rpx;
				width: 250rpx;
				height: 68rpx; 
				line-height: 68rpx;
				text-align: center;
				align-items: center;
				justify-content: center;
				color: #FFFFFF;
				background-color: #46B85B;
				border-radius: 34rpx; 
			}
		}
		 
	}
	 
</style>
