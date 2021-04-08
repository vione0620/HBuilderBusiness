<template>
	<view style="width: 100%;">
		<view v-if="salesList.length===0" class="isNull">
			您还没有添加店员
		</view>
		<view v-else class="wrap">
			<view class="group">
				<view v-for="(item,index) in salesList" :key="index">
					<uni-list-item :title="item.salesName" @click="navTo('./emendation?type=remove',index)"></uni-list-item>
				</view>
			</view>
		</view>
		<btn-foot title="添加店员" @tap="navTo('./emendation?type=add')"></btn-foot>
	</view>
</template>

<script>
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii,excludeBlankNewline} from '@/common/util/utils.js'
	
	import UniListItem from '@/components/uni/uni-list-item.vue'
	import BtnFoot from '@/components/basic/btn-foot.vue'
	
	export default {
		components: {
			UniListItem,
			BtnFoot
		},
		data(){
			return{
				loginWhether:'',//登陆状态
				merchNo:'', //商户号
				salesList: [],
			}
		},
		onLoad(){
			this.loginWhether = uni.getStorageSync('status')
			this.merchNo = uni.getStorageSync('user').merchNo
			this.getSales()
		},
		onShow(){
			this.getSales()
		},
		methods: {
			getSales(){
				let vVlue = {"merchNo": this.merchNo} //必传
				let sSort = getSortAscii(vVlue) ///排序
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码
				this.$request.post('getSales',{
					...vVlue,
					"sign":sSign
				},{
					token:true
				}).then((res)=>{ 
					if(res.code===200){
						this.salesList = res.data
					} else {
						uni.showToast({
							icon:'none',
							title: res.message,
							duration: 2000
						})
					}
				}).catch()
			},
			navTo(urls,index){
				uni.navigateTo({
					url:urls + '&index=' + index
				})
			}, 
		}
	}
</script>

<style scoped lang="scss">
	page {
		width: 100vw;
		
		.wrap{
			padding: 20rpx;
			width: 100%;
			.group{
				width: 100%;
				background-color: #FFFFFF;
				border-radius: 12rpx;
			}
		}
		.isNull{
			width: 100%;
			position: absolute;
			top: 40%;
			text-align: center;
		}
	}
</style>
