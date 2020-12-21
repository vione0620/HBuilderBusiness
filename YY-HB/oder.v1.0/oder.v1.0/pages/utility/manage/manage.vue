<template>
	<view class="manageWrap">
		
		<template v-if="isload">
			<default-page :load="true"></default-page>
		</template> 
		<template v-if="isnohave">
			<default-page :nohave="true"></default-page>
		</template>
		
		<template v-if="isready">
			<block v-for="(item,index) in workData" :key="'4'+index">
				<view class="group">
					<view class="area">{{item.areaName}}</view>
					<image :src="item.avatar + '?imageView2/1/w/160/h/160' ? item.avatar : '../../../static/noImg.png'" class="urlImg" mode="widthFix"></image>
					<view class="info">
						<view class="name">姓名：{{item.busiManager}}</view>
						<view class="txt">职务：{{item.workPosition}}</view>
						<view class="txt" @tap="callNo(item.busiPhone)" v-if="item.busiPhone">联系电话：<text class="color-green">{{item.busiPhone}}</text></view>
					</view>
				</view> 
			</block>
		</template>
		
	
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii} from '@/common/util/utils.js'
	
	import DefaultPage from '@/components/basic/default-page.vue'
	export default {
		data() {
			return {
				workData:'',
				loginWhether:'',//登陆状态 
				merchNo:'', //商户号
				isload:true, 
				isnohave:false,
				isready:false,
			}
		},
		components:{
			DefaultPage
		},
		onLoad() {			 
			this.loginWhether = uni.getStorageSync('status') 			
			this.merchNo = uni.getStorageSync('user').merchNo					
			this.getOperManger()
		},
		methods: {
			getOperManger(){
				let vVlue = {"merchNo": this.merchNo} //必传   
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   			
				
				this.$request.post('getOperManger',{
					...vVlue,
					"sign":sSign
				},{
					token:true
				}).then(res=>{ 
					this.$api.initPage(res.code,res.message)					
					if(res.code == 200){
						setTimeout(()=>{
							this.isload = false
							this.isready = true
							this.workData = res.data
							if(res.data.length == 0){
							 	this.isload = false
							 	this.isnohave = true
							}
						},300)
					} 
				}).catch() 
			}, 
			callNo(phone){
				uni.makePhoneCall({
					phoneNumber: phone
				}); 
			},
		}
	}
</script>

<style scoped lang="scss">
	.manageWrap{
		width: 100%;
		
		.color-green{
			color: #46B85B;
		}
		
		.group{ 
			margin: 20rpx;
			padding: 20rpx;
			background-color: #FFFFFF;
			border-radius: 12rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			position: relative;
			
			.area{
				position: absolute;
				right: 0;
				top: 0;
				height: 60rpx;
				min-width: 200rpx; 
				color: #FFFFFF;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #46B85B;
				border-adius: 12rpx;
				font-size: 32rpx;
				padding: 0 10rpx 6rpx 30rpx; 
				border-bottom-left-radius:60rpx;
				border-top-right-radius: 12rpx;
			}
			.urlImg{
				width: 200rpx;
				height: 200rpx; 
				
			}
			
			.info{
				flex: 1;
				padding-left: 20rpx;
				.name{
					font-size: 38rpx;
					color: #333333;
					padding-bottom: 30rpx;
				}
				.txt{
					font-size: 32rpx;
					color: #666666;
					padding-bottom: 20rpx;
				}
			}
		}
		
	}

 
</style>
