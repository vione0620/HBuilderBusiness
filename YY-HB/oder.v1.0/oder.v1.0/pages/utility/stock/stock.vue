<template>
	<view> 
		
		<template v-if="isload">
			<default-page :load="true"></default-page>
		</template> 
		
		<view class="ourStock"> 
			<view class="record-wrap">
				<view class="txt">查看历史库存</view>
				<view class="txt" @tap="getToStore()">{{showOneDay}} <text class="iconfont iconright"></text></view>
			</view>
			
			<template v-if="isnostore"> 
				<default-page :nostore="true"></default-page>
			</template> 
			
			<template v-if="isready">
			<view class="mian-wrap"> 
				 
				<view class="navbar-left" :style="'height:'+ scrollH +'px;'"> 
					<scroll-view scroll-y :scroll-into-view="scrollInto" show-scrollbar="true" scroll-with-animation :scroll-top="left_scroll"
					class="navbar-main left_height">
						<block v-for="(items,index) in stockStock">
							<view class="navlist"
							:id=" 'navid'+ index" @click="changeTab(index)"
							:class="tabIndex === index ? 'navlist-avtice':''" >
								<view :class="items === '热门' ? 'color-red' : '' ">{{items}}</view>
							</view> 
						</block>
					</scroll-view>
					
				</view>
				
				<view class="detail-right"> 
					
					<scroll-view scroll-y :scroll-into-view="scrollInto" show-scrollbar="true" scroll-with-animation @scroll="myscroll"
					class="right-main" :style="'height:'+ scrollH +'px;'">
						<view class="swiper-item" v-for="(item,index) in stockFoods" :key="index">   
							<goods-group :goods="item" :category="stockStock[index]" :id="'gdsItem' + index"></goods-group> 
						</view> 
					</scroll-view>  
					
				</view>
		
			</view> 
			
			<view class="clearStock" v-if="showClear"><view class="clearBtn" @click="clearBtn()">清库存</view></view>
			
		</template>
		
		</view>
		 
		
		<uni-popup ref="isDaysOfMonth" type="bottom"> 
			<uni-calendar :endDate="showOneDay" :insert="true" :clearDate="false" @confirm="choseDay" />		
		 </uni-popup>
		
		
	</view>
</template>

<script> 
	import {mapState} from 'vuex'
	import {b64Md5,hexMD5,} from '@/network/md5.js'	
	import {getSortAscii, arrayExclude,handleDate,} from '@/common/util/utils.js'
	
	import UniPopup from '@/components/uni/uni-popup.vue'
	import UniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	
	import GoodsGroup from '@/components/basic/ourstock/goods-group.vue'
	import DefaultPage from '@/components/basic/default-page.vue'		
	export default {
		data() {
			return { 
				loginWhether:'',//登陆状态 
				merchNo:'', //商户号
				tabIndex:0,  
				scrollH:600,
				scrollInto:"",  //左侧索引 
				left_scroll:0,  //左侧滑动值
				ourStock:true, 
				isload:true,
				isnostore:false, 
				isready:false,				 
				showOneDay:'',
				haveStore:false,
				showClear:true,
				istoday:'',
			}
		},
		computed:{
			...mapState(['stockStock','stockFoods','stockTopScroll'])
		},
		onLoad() { 
			this.loginWhether = uni.getStorageSync('status')  
			this.merchNo = uni.getStorageSync('user').merchNo	
			this.showOneDay = handleDate() 
			
			this.istoday = handleDate()
			
			uni.getSystemInfo({
				success:res=>{
					this.scrollH = res.windowHeight - 90
				}
			}) 
			this.getMerchDayStore('getMerchDayStore',handleDate(),1)
		},
		components:{ 
			GoodsGroup,
			DefaultPage, 
			UniPopup,
			UniCalendar,
		},  
		methods: {
			getToStore() {
				this.$refs.isDaysOfMonth.open() 
			},
			//日报读取
			choseDay(e) {			   
				if(this.istoday != e.fulldate){
					this.showClear = false
				}else{
					this.showClear = true
				}
				
				//读取数据
				this.showOneDay = e.fulldate  			
				
				this.getMerchDayStore('getMerchDayStore',e.fulldate,1)
				this.$refs.isDaysOfMonth.close()
			},
			 // 切换选项
			changeTab(index){
			 	if (this.tabIndex === index) {
			 		return
			 	} 
			 	this.tabIndex = index
			 	// 滚动到指定元素
			 	this.scrollInto = 'gdsItem' + index  
			}, 
			getMerchDayStore(post,time,type){
				let vVlue = {"merchNo":this.merchNo,"merchType":type,"busiDate":time} //必传 
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码 	  
				
				this.$request.post(post,{
					...vVlue, 
					"sign": sSign,
				},{
					token:true
				}).then(res => {	 
					this.$api.initPage(res.code,res.message)  
					if(res.code == 200){
						if(res.data.busiState != 1){
							this.showClear = false
						} 
						let resDataStore = res.data.store
						setTimeout(()=>{  
							if(resDataStore.length){ 
								this.isload = false
								this.isnostore = false  
								this.isready = true
								
								let result = resDataStore  		
								let nKeys = []
								let nValue = []
								for(let i in result){
								  let keys = Object.keys(result[i])
								  let val = Object.values(result[i])
								  nKeys = [...nKeys,...keys]
								  nValue = [...nValue,...val]
								}
								 
								this.$store.commit('receive_stock_goods',{
									sort:nKeys,
									goods:nValue,
								})  
								
							}else{ 
								this.isload = false
								this.isready = false	 
								this.isnostore = true  
							}
						},300)
						 
					} 									
				}).catch() 
			}, 
			myscroll(e) {  
				let scroll_top = e.detail.scrollTop 
				let active_index = this.stockTopScroll.findIndex((value, index, arr) => {
					return scroll_top >= value && scroll_top < arr[index + 1]
				}); 
				this.tabIndex = active_index   
			},
			
			clearBtn(){
				uni.showModal({
					title:'是否清库存',
					content:'清除库存将同时关闭店铺',										
					success: (res)=>{
						if (res.confirm) {
							console.log('用户点击确定'); 
							let vVlue = {"merchNo": this.merchNo} //必传
							let sSort = getSortAscii(vVlue) ///排序 
							let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码    
							this.$request.post('clearStore',{
								...vVlue,
								"sign": sSign
							},{
								token:true
							}).then((res)=>{ 
								uni.showToast({
									icon:'none',
									title:res.message,
									duration: 2000
								})
							}).catch() 
						}
					}
				})
			},
					
		},
	}
</script>

<style lang="scss" scoped>
	.ourStock{
		width: 100vw; 
		padding: 20rpx;
	 
	.color-red{
		color: #FF0000;
	}
	
	.mian-wrap{ 
		position: relative; 
		display: flex; 
		width: 100%;  
		justify-content: space-between;  
			
		.navbar-left{ 
			width: 23vw;  
			height:inherit;
			
			.navbar-main{
				width: 100%;
				height: inherit;
				.navlist{
					padding: 26rpx 10rpx;
					text-align: center;
					align-items: center;
					border-radius: 12rpx;
				}
				.navlist-avtice{
					color: #49B75D;
					background-color: #FFFFFF;
				}
			}
			
		}
		.detail-right{   
			width: 70vw;  
			background-color: #FFFFFF; 
			padding: 20rpx; 
			border-radius: 12rpx; 
		}
		
		
		}  
	}  
	
	.record-wrap{
		background-color: #FFFFFF;
		padding: 28rpx 20rpx;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
	}
	
	.clearStock{
		padding: 0; 
		position: fixed;
		bottom: 20rpx;
		left: 20rpx;
		right: 20rpx;
		
		.clearBtn{
			padding: 32rpx;
			border-radius: 6rpx;
			color: #FFFFFF;
			text-align: center;
			background-color: #46B85B;
		}
	}
	
</style>
