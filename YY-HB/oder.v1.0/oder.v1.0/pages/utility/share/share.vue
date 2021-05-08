<template>
	<view>
<!-- 		<button type="default" @click="test1">测试</button>
		<button type="default" @click="test2">测2</button> -->
		<web-view src="http://busishare.yiyichina.cn/" @message="message"></web-view>
	</view>
</template>

<script>
	var currentWebview;
	//当前页面
	var wv;
	//webview
	export default {
		data(){
			return{
				weixin: {},
				token: '这是token'
			}
		},
		onLoad(){
			currentWebview = this.$scope.$getAppWebview();
			setTimeout(() => {
				wv = currentWebview.children()[0]
			}, 500);
		},
		methods: {
			message(e){
				console.log(e)
				if(e.detail.data[0].page == 'index' && !e.detail.data[0].checkFlag){
					uni.showToast({
						icon: 'none',
						title: '请同意授权条款'
					})
					return
				}
				if(e.detail.data[0].page == 'succes'){
					this.weixin = e.detail.data[0].share
					uni.share({
						...this.weixin,
						success: res=>{
							uni.showToast({
								icon: 'success',
								title: '分享成功'
							})
							console.log("success:" + JSON.stringify(res));
							alert(res);
						},
						fail: err=>{
							console.log("fail:" + JSON.stringify(err));
							alert(err)
						}
					})

					wv.evalJS(
						`islog("${this.token}")`
					)
				}
				
			},
			test1(){
				// #ifdef APP-PLUS
				plus.share.sendWithSystem({content:'分享内容',href:'https://www.dcloud.io/',pictures: "https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/d8590190-4f28-11eb-b680-7980c8a877b8.png"}, function(){
					console.log('分享成功');
				}, function(e){
					console.log('分享失败：'+JSON.stringify(e));
				});
				// #endif
				
				// uni.getProvider({
				// 	service: 'share',
				// 	success: res => {
				// 		if(res.provider.indexOf('weixin') != -1){
							
				// 		}
				//     }
				// });
				// uni.shareWithSystem({
				//   summary: '分享标题',
				//   href: 'https://uniapp.dcloud.io',
				//   success(res){
				//     // 分享完成，请注意此时不一定是成功分享
				// 	console.log(res)
				//   },
				//   fail(err){
				//     // 分享失败
				// 	console.log(err)
				//   }
				// })
			},
			test2(){
				uni.share({
					provider: 'weixin',
					scene: 'WXSceneSession',
					type: 0,
					title: '测试分享',
					summary: '这是摘要',
					href: "http://uniapp.dcloud.io/",
					imageUrl: "https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/d8590190-4f28-11eb-b680-7980c8a877b8.png",
					success: res=>{
						console.log("success:" + JSON.stringify(res));
					},
					fail: err=>{
						console.log("fail:" + JSON.stringify(err));
					}
				})
			}
		}
	}
</script>

<style>
</style>
