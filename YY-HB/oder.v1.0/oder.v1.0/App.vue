<script>   	 
	export default {
		onLaunch: function() {
			console.log('App Launch') 	 
			 this.$nextTick(() => {     
				// 开启监听推送
				let getPush = []
				let clickPush = [] 
				const bgAudioMannager = uni.getBackgroundAudioManager()
				
				// #ifdef APP-PLUS
				
				plus.push.addEventListener('click', res => {   
					
					// clickPush.push(res.payload)
					// uni.setStorageSync('click_pushMsg',{clickPush})  
					
					let msg_payload = JSON.parse(res.payload)   
					let navto_notifytype = msg_payload.notifyType  
					let navto_action = msg_payload.extendParam.msg_action
					let navto_pushno = msg_payload.extendParam.msg_external_param 
					 
					if(navto_notifytype == 6 && navto_action == 0){
						// 跳转代收详情?pushNo=
						uni.navigateTo({
							url:'/pages/finance/agent/agent_detail?pushNo=' + navto_pushno,
						}) 
					}
					if(navto_notifytype == 4 && navto_action == 1){ 
						// 用户订单详情 ?pushNo=
						uni.navigateTo({
							url:'/pages/finance/sell/unity/unity_detail?pushNo=' + navto_pushno , 
						}) 
					}  
				});
				plus.push.addEventListener('receive', res => {  					
					let res_payload = res.payload 
					//缓存推送消息
					getPush.push(res_payload)					 
					uni.setStorageSync('receive_pushMsg',getPush)
				
					let platform = uni.getSystemInfoSync().platform
					if(platform == "android"){ 
						
						//定义Android创建消息内容
						let msg_payload = JSON.parse(res.payload)
						let create_title = msg_payload.title
						let create_content = msg_payload.content 	
						plus.push.createMessage(create_content,res.payload,{"title":create_title,"sound":"none"})  
						
						//创建语音播报
						let navto_notifytype = msg_payload.notifyType  
						let navto_action = msg_payload.extendParam.msg_action
						let navto_pushno = msg_payload.extendParam.msg_external_param 		
						
						//播报文件
						if(navto_notifytype == 6 && navto_action == 0){ 
							
							bgAudioMannager.src = 'static/direct_order.wav' 	
							if(bgAudioMannager.src === 'static/direct_order.wav'){							
								bgAudioMannager.play()
							}				  
						}
						if(navto_notifytype == 4 && navto_action == 1){ 
							
							bgAudioMannager.src = 'static/user_order.wav'
							if(bgAudioMannager.src === 'static/user_order.wav'){							
								bgAudioMannager.play()
							}
						}
						
						
					}else {
						
						//创建语音播报
						let navto_notifytype = res_payload.notifyType  
						let navto_action = res_payload.extendParam.msg_action
						let navto_pushno = res_payload.extendParam.msg_external_param 		
						
						plus.push.createMessage(res.payload.content,res.payload,{"title":res.payload.title,"sound":"none"})
						
						//播报文件
						if(navto_notifytype == 6 && navto_action == 0){ 
							
							bgAudioMannager.src = 'static/direct_order.wav' 	
							if(bgAudioMannager.src === 'static/direct_order.wav'){							
								bgAudioMannager.play()
							}				  
						}
						if(navto_notifytype == 4 && navto_action == 1){ 
							
							bgAudioMannager.src = 'static/user_order.wav'
							if(bgAudioMannager.src === 'static/user_order.wav'){							
								bgAudioMannager.play()
							}
						}
						
					}
					
					
				})
				
				// #endif
			})
			this.$api.getNetworkType() 
			 
			
		}, 
		onShow: function() {
			console.log('App Show') 
		},
		onHide: function() {
			console.log('App Hide') 
		},  
	}
</script>

<style>
	/*每个页面公共css */  
	   
	@import url("common/style/normalize.css");
	@import url("common/style/base.css");
	@import url("common/style/icon.css"); 
	
	page {
		min-height: 100%;
		display: flex;
		font-size: 16px;
		background-color: #F2F2F2; 
	}
	button.primary {
		background-color: #46B85B;
	}
</style>
