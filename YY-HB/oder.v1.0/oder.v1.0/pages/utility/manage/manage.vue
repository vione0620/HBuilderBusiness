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
					<view class="area">{{item.cityName}}</view>
					<image :src="item.avatar + '?imageView2/1/w/160/h/160' ? item.avatar : '../../../static/noImg.png'" class="urlImg" mode="widthFix"></image>
					<view class="info">
						<view class="name">{{item.busiManager}}</view>
						<view class="txt">职位：{{item.workPosition}}</view>
						<view class="txt">区域：{{item.areaName}}</view>
						<view class="txt" 
						@tap="callNo(item.busiPhone)" 
						v-if="item.busiPhone">电话：<text class="iconfont icondianhua-copy color-green"></text>
						<text class="color-green txt_line">{{item.busiPhone}}</text>  </view>
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
				if(this.merchNo=='35110000000000'){
					let testDate = [{"cityName":"厦门市","areaName":"思明区","busiManager":"张旭","busiPhone":"13663719471","workPosition":"区域经理","avatar":"http://res.yiyichina.cn/avatar/86b6fc36-ca8d-43bc-b5fb-55a9d57626d3.jpg"}]
					this.isload = false
					this.isready = true
					this.workData = testDate
					return
				}
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
				background-color: #9CC670;
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
			.txt_line{
				text-decoration: underline;
			}
		}
		
	}

 
</style>
