<template>
	<view class="authid"> 	
		<block v-for="(item,index) in listdata" :key="'4'+index">			
			<view class="group" @tap="gotoAuth(index)">
				<view class="left"> 
					<image class="img" :src="item.icon" mode="scaleToFill"></image>
					<view class="tit">{{item.title}}</view>
				</view>
				<view class="gotobtn" :class="item.status ? 'ok' : 'no'">{{item.status ? '解绑' : '立即绑定'}}</view>
			</view>  
		</block>  
	</view>
</template>

<script>
	
	import {b64Md5,hexMD5} from '@/network/md5.js'
	import {getSortAscii} from '@/common/util/utils.js'
	
	import UniListItem from '@/components/uni/uni-list-item.vue' 
	export default {
		components:{
			UniListItem, 
		}, 
		data() {
			return { 
				loginWhether:'',//登陆状态 
				merchNo:'', //商户号
				listdata:[
					{	
						"title":"支付宝",
						"icon":"../../../static/pay_alipay@2x.png",
						"status":1,
					},{
						"title":"微信",
						"icon":"../../../static/pay_weixin@2x.png",
						"status":1,
					},
				]
			}
		},
		onLoad(){ 
			this.loginWhether = uni.getStorageSync('status') 
			this.userStore = uni.getStorageSync('user')
			this.merchNo = uni.getStorageSync('user').merchNo	 
		},
		onShow() { 
			this.getAccountBind()
		},
		methods: {
			gotoAuth(index){ 
				let cindex = this.listdata[index].status
				switch (index) { 
					case 0:  
						if(cindex == 0){ 
							this.getProviderAli()
						}else if(cindex == 1){
							uni.showModal({
								title:'解除提示',
								content:'解除绑定,将无法提现到该账户',
								success: (res) => {
									if(res.confirm){
										uni.showLoading()
										this.unBindAccount(index,2) 
									}else if(res.cancel){ 
										return
									}
								}
							})
						}
					break;
					case 1:  
						if(cindex == 0){  
							this.getProviderWeixin()
						}else if(cindex == 1){
							uni.showModal({
								title:'解除提示',
								content:'解除绑定,将无法提现到该账户',
								success: (res) => {
									if(res.confirm){
										uni.showLoading()
										this.unBindAccount(index,1) 
									}else if(res.cancel){ 
										return
									}
								}
							})
						}
					break; 
				} 
			}, 
			unBindAccount(index,type){
				let vVlue = {"merchNo": this.merchNo,"bindType":`${type}`} //必传
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				//绑定账号
				this.$request.post('unBindAccount',{
					...vVlue, 
					"sign":sSign
				},{
					token:true
				}).then(res=>{  
					setTimeout(()=>{
						uni.hideLoading()
					},1000)
					this.$api.initPage(res.code,res.message)
					if(res.code == 200){
						this.listdata[index].status = false 
					}
					uni.showToast({
						icon:'none',
						title:res.message,
						duration: 2000
					})
				}).catch()
			},
			getAccountBind(){
				let vVlue = {"merchNo": this.merchNo} //必传   
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				//绑定账号
				this.$request.post('getAccountBind',{
					...vVlue, 
					"sign":sSign
				},{
					token:true
				}).then(res=>{
					this.$api.initPage(res.code,res.message) 
					this.listdata[0].status = res.data.aliBindState
					this.listdata[1].status = res.data.wxBindState 
				}).catch()
			},
			getProviderWeixin(){  
				
				uni.login({
					provider: 'weixin',
					success: (loginRes)=> { 
						let authResult = loginRes.authResult 
						let vVlue = {"merchNo": this.merchNo,"accessToken":authResult.access_token,"uid":authResult.openid,"unionid":authResult.unionid,} //必传
						let sSort = getSortAscii(vVlue) ///排序    
						let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase()  
						
						//绑定账号 
						this.$request.post('bindAccount',{
							...vVlue,
							"sign":sSign
						},{
							token:true
						}).then(res=>{ 
							this.$api.initPage(res.code,res.message)
							if(res.code == 200){									
								uni.showToast({
									icon:'none',
									title:`微信${res.message}`,
									duration: 2000
								})
								this.listdata[1].status = true 
							}else if(res.code == 400){
								uni.showToast({
									icon:'none',
									title:`微信${res.message}`,
									duration: 2000
								})
							}							
						}).catch() 
					},
					fail:(err)=>{ 
						uni.showToast({
							icon:'none',
							title:'失败' + {err},
							duration: 2000
						})
					},
				})
			}, 
			getProviderAli(){ 
				//参数
				let merchNo = hexMD5("merchNo=" + this.merchNo + "&key=" + this.loginWhether.md5key).toUpperCase() 
				let page = 'http://gwbusi.yiyichina.cn/v1/aliAuthCB?merchNo='+ this.merchNo + '&doSign=' + merchNo				
				let ali = 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2021001165693789&scope=auth_user&redirect_uri=' + page
				
				let encode = encodeURIComponent(ali) 
				let url = 'alipays://platformapi/startapp?appId=20000067&url=' + encode  
				
				//执行
				plus.runtime.openURL(url, (error)=>{ 
					this.listdata[0].status = false 
				}, "com.eg.android.AlipayGphone")
			},
			
		}
	}
</script>

<style lang="scss" scoped> 
	page{
		width: 100vw;
	}
	.authid{padding: 20rpx; width: 100%;}
	.group{
		background-color: #FFFFFF;
		border-radius: 6rpx;
		width: 100%;
		margin-bottom: 20rpx;
		padding: 24rpx; 
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		.left{
			display: flex;
			align-items: center;
			.tit{
				font-size: 32rpx;
				padding-left: 20rpx;
			}
			.img{
				width: 40rpx;
				height: 40rpx;
			}
		}
			
			
		.gotobtn{ 
			width: 140rpx;
			height: 50rpx;
			text-align: center;
			line-height: 1.8;
			border-radius: 30rpx; 
			font-size: 26rpx;
		}
		.no{			
			color: #FFB535;
			border: 1px solid #FFB535;
		}
		.ok{
			color: #999999;
			border: 1px solid #999999;
		}
		
	}	
	.group:active { 
		background-color: #F2F2F2;
		
		.no{
			color: #ff7733;
			border: 1px solid #ff7733;
		}
		.ok{
			color: #27261f;
			border: 1px solid #27261f;
			
		}
	}
</style>
