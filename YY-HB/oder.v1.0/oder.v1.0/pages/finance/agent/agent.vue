<template> 
	<view class="wrap">  
	 <uni-nav-bar :status-bar="true" :fixed="true" left-icon="arrowleft" @clickLeft="back()" title="订制管理" color="#ffffff" background-color="RGBA(70, 184, 91, 1)" />
 
 
	<template v-if="isload">
		<default-page :load="true"></default-page>
	</template>
	<template v-if="isnohave">
		<default-page :nohave="true"></default-page>
	</template>
	
	<template v-if="isready"> 
 
	<view id="oderList"> 
		<view v-if="!Nothing">
		<block v-for="(orderItem,index) in orderList" :key="'4' + index">
			<view class="group">
				<view class="head">
					<view class="tit">  
						<text class="titIcon iconfont iconstauts-ing"></text> 
						<!-- {{orderItem}} -->
						<template v-if="orderItem.orderState == 0"><view class="titTxt">等待配送</view></template>
						<template v-if="orderItem.orderState == 1"><text class="titTxt">商户确认</text></template>
						<template v-if="orderItem.orderState == 2"><text class="titTxt">用户确认</text></template>  
					</view>
					<view class="time">{{orderItem.orderTime}}</view>
				</view>
				<view class="content" @tap="navTo(index)">					
					<view class="itemBlock"> 
						<view class="" v-for="(itemList,index) in orderItem.content.slice(0,3)" :key="'4' + index">
							<view class="sigleItem">
								<view class="name">{{itemList.goodsName}}</view>
								<view class="unit">{{itemList.goodsNum + itemList.goodsUnit}}</view>
							</view>
						</view> 
					</view> 
					<template v-if="orderItem.content.length > 3">
						<view class="more">						
							<view class="">...</view>
							<view class="gotobtn" @tap="navTo(index)">查看其余{{orderItem.content.length-3}}件</view>
						</view>
					</template>
					 
				</view>
				
				<view class="footbtn">
					<view class="left-footbtn">   
						<template v-if="orderItem.orderState === 0">			
							<view class="checkOk isright" @tap="rightBtn(index)">确认收货</view> 
						</template>  
						<template v-else>
							<view class="checkOk isfeed">订单完成</view>
						</template>
					</view> 
				</view>
				
			</view>
		</block>
		</view>
		<view class="lodingMore" v-if="!Nothing" @tap="testbottom()">{{loadmore}}</view>
		
		
		
		
		</view>
		
	
	</template>
		
		
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii, arrayExclude,handleDate,handleYesterday,} from '@/common/util/utils.js'
	
	import UniPopup from '@/components/uni/uni-popup.vue'
	import UniNavBar from '@/components/uni/uni-nav-bar.vue'
	
	import BtnFoot from '@/components/basic/btn-foot.vue'
	import PopUp from '@/components/basic/rk-pop.vue'
	import DefaultPage from '@/components/basic/default-page.vue'
	
	
	export default {
		data() {
			return {
				loginWhether:'',//登陆状态 
				merchNo:'', //商户号
				orderList:[],
				orderContList:[], 
				pages:1,
				loadmore:'上拉加载更多',
				btnIndex:'',
				totalPrice:'', 
				Nothing:false,
				// navtoDetail:'',
				navtoIndex:'', 
				isload:true,
				isnohave:false,
				isready:false, 
			}
		},
		onLoad() { 			 
			this.loginWhether = uni.getStorageSync('status')  
			this.merchNo = uni.getStorageSync('user').merchNo		  
			this.getDirectOrder() 
			
		},
		computed:{
			...mapState(['getAgentList'],)
		},
		components:{ 
			UniPopup,
			UniNavBar,
			PopUp,
			BtnFoot,
			DefaultPage
		},  
		onReachBottom(){ 
			let initPages = this.pages+1
			let morePages = initPages++
			this.pages = morePages 
			
			uni.showLoading({
				title: '加载中'
			}) 
			let vVlue = {"merchNo":this.merchNo,"pageNum":morePages,"pageLimt":'20',} //必传 
			let sSort = getSortAscii(vVlue) ///排序
			let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 
			 
			this.$request.post('getDirectOrder',{
				...vVlue, 
				"sign": sSign
			},{
				token:true
			}).then(res => { 
				this.$api.initPage(res.code,res.message)
				 
				if(res.code == 200){ 
					// this.$store.dispatch('receive_agent_list',res.data)
					setTimeout(()=>{											
						uni.hideLoading()			 
						if(res.data.length){ 
							this.orderList = [...this.orderList,...res.data]  				
							this.$store.dispatch('receive_agent_list',this.orderList)			
							for(let order of res.data){ 
								let ooo = []
								ooo.push(JSON.parse(order.orderContent))
								this.orderContList = [...this.orderContList,...ooo] 
							}
						}else{
							this.pages-- 
							this.loadmore  = res.data.length < 20 ? '没有更多了' : '上拉加载更多';
						} 	
						
					},500)	  
				}
			}).catch(err=>{  
				this.page--; 
			})
			 
		},
		methods: { 
			back() { 
				uni.navigateBack({ 
					url: '../../utility/index/index'
				})
			},		
			rightBtn(index){ 		   
				let oderInfo = this.getAgentList
				let vVlue = {"merchNo":this.merchNo,"orderNo":oderInfo[index].orderSn} //必传 
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 	 				
				uni.showModal({
					title: '确认收货',
					content: '请确认您已准确无误收到货',
					success: (res)=>{
						if (res.confirm) {						
							this.$request.post('directConfirm',{
								...vVlue,
								"sign": sSign
							},{
								token:true
							}).then(res => {  
								if(res.code === 200){ 					 
									this.orderList[index].orderState = 2 
								}									
								uni.showToast({
									icon:'none',
									title:res.message,
									duration: 2000
								})						
							}).catch()  	
					 }
				 }, 
			 })
				
			}, 
			getDirectOrder(){   
				let vVlue = {"merchNo":this.merchNo,"pageNum":'1',"pageLimt":'20',} //必传 
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 		  
				this.$request.post('getDirectOrder',{
					...vVlue, 
					"sign": sSign
				},{
					token:true
				}).then(res => { 
					this.$api.initPage(res.code,res.message) 
					if(res.code === 200){
						let resData = res.data	 
						setTimeout(()=>{								
							this.isload = false
							this.isready = true 
							this.orderList = resData
							this.$store.dispatch('receive_agent_list',resData)   
						},300)	
					}
				}).catch()				
			}, 
			
			navTo(index) {  
				let navtoItemIndex = this.orderList[index].orderSn 
				this.navtoIndex = index  
				 
				uni.navigateTo({
					url: './agent_detail?orderSn=' + navtoItemIndex + '&cindex='+ index,    
				}); 
			},
		},
	}
</script>

<style lang="scss">
	page{
		width: 100vw;
	}
	#oderList{
		padding: 32rpx;
		width: 100%;
		
		.Nothing{
			height: 200rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #999999;
			font-size: 38rpx;
			padding: 80rpx; 
		}
		
		.group{
			padding: 0 32rpx;
			border-radius: 12rpx;
			background-color: #FFFFFF;
			margin-bottom: 32rpx;
			
			.head{
				border-bottom: 1rpx dashed #d4d4d4;
				padding: 16rpx 0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				.tit{
					font-size: 30rpx;
					display: flex;
					align-items: center;
					
					.titIcon{
						font-size: 40rpx;
						color: #46B85B;
					}
					// .iconstauts-ing{color: #0062CC;}
					// .iconstauts-err{color: #FF0000;}
					// .iconstauts-ok{color: #46B85B;}
					.titTxt{
						
					}
				}
				.time{
					font-size: 22rpx;
				}
			}
			
			.content{
				padding: 32rpx 0;
				
				.itemBlock{
					width: 100%; 
					
					.sigleItem{
						display: flex;
						padding: 8rpx 0;
						justify-content: space-between;
						
						
						.name{
							font-size: 26rpx;
						}
						.unit{
							font-size: 20rpx;
							color: #999999;
						}
					}
					
				}
				.gotobtn{
					color: #46B85B;
					font-size: 26rpx;
				}		
			}
			
			.footbtn{
				border-top: 1rpx dashed #d4d4d4;
				display: flex;
				justify-content: space-between;
				padding: 20rpx 0; 
				
				.checkOk{ 
					color: #fff;
					font-size: 30rpx;
					text-align: center; 
					width: 180rpx;
					height: 60rpx; 
					line-height: 60rpx;
					border-radius: 6rpx;
				}
				.isno{
					background-color: #0062CC;
				}
				.iswrong{
					background-color: #DF5000;
				}
				
				.isright{ 
					background-color: #46b85b;
				}
				.isfeed{
					color: #999999;
					border:1px solid #D4D4D4;
					background-color: #FFFFFF;
				}
				.iscannot{
					color: #999999;
					border:1px solid #D4D4D4;
					background-color: #D4D4D4;
				}
				
				.isovertime{
					color: #FF0000;
					border:1px solid #FF0000;
					background-color: #FFFFFF;
				}
				
				.left-footbtn{
					
				}
				.right-moeny{
					text-align: right;
					font-size: 50rpx;
					
					.txt{
						font-size: 24rpx;
					}
				}
				
			}
			
						
		}
		
		.lodingMore{
			text-align: center;
			color: #999999;
		}
		
		
		
		
		
		.pay_checked{
			padding: 40rpx;
			position: relative; padding-bottom: 160rpx;
			
			.title{
				text-align: center;
			}
			.totalNum{
				font-size: 80rpx;
				padding: 40rpx;
				text-align: center;
				border-bottom: 1px dashed #f2f2f2;
			}
			.topayBtn{
				position: absolute; bottom: 0; left: 0; right: 0;
			}
			.prepyPop{
				padding: 32rpx 0;
				display: flex; 
				align-items: center;
				width: 100%;
				
				.img{
					width: 48rpx;
					height: 48rpx;
				} 
				.txtbtn{
					padding-left: 32rpx;
				}
				
			}
			
				
		}
		

	}
 


</style>
