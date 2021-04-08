/* 
初始化函数封装
*/ 
export default {
	common:{ 
		data:{}
	},
	loginWhether:uni.getStorageSync('status'), 
	getUserDev(){
		const res = uni.getSystemInfoSync();  
		switch (res.platform){
			case 'android':
			this.userDevType = 1;
			break;
			case 'ios' :
			this.userDevType = 2;
			break;
		}
		/* #ifdef APP-PLUS */
		this.userCid = plus.push.getClientInfo().clientid  			
		/* #endif */
		uni.setStorageSync('user-system',{
			"cid":this.userCid,
			"platform":this.userDevType,
		}) 
			
	},
	initPage(code,msg){ 
		if(code === 400){
			uni.showToast({
				icon:'none',
				title:msg
			})
		}else if(code === 401){
			uni.showToast({
				icon:'none',
				title:msg
			})
		}else if(code === 402){
			// 用户冻结
			uni.showModal({
				title:'操作异常',
				content:'用户已被冻结！请本人联系我们！', 
				confirmText:'联系我们',
				success:(res)=>{
					if(res.confirm){ 
						uni.reLaunch({
							url:'/pages/account/login/login'
						})
					}else if(res.cancel){
						uni.makePhoneCall({
							phoneNumber: '123123123'
						});  
					}
				},
			})
		}else if(code === 403){ 
			uni.showToast({
				icon:'none',
				title:'请登录'
			})
			uni.reLaunch({
				url:'/pages/account/login/login'
			})
		}else if(code === 404){
			uni.showToast({
				icon:'none',
				title:'请求不存在'
			})
		}else if(code === 406){ 
			let type = uni.getStorageSync('user').loginType
			let tis = ''
			if(type == 1){
				tis = '修改密码'
			} else {
				tis = '重新登录'
			}
			uni.showModal({
				title:'登录提醒',
				content:'账号已在另一个设备登录了，如非本人操作，请及时修改密码！',
				cancelText: tis,
				confirmText:'本人操作',
				success:(res)=>{
					if(res.confirm){
						uni.reLaunch({
							url:'/pages/account/login/login'
						})
					}else if(res.cancel){
						
						if(type == 1){
							uni.reLaunch({
								url:'/pages/account/passwd/passwd?type=forget'
							})
						} else if (type == 2){
							uni.reLaunch({
								url:'/pages/account/login/login'
							})
						}
					}
				},
			})
		}else if(code === 500){
			uni.showToast({
				icon:'none',
				title:res.msg,
				duration:2000
			}) 
		}
	}, 	
	
	initSitePlace(){ 
		let lonnnng = ''
		let lattttt = '' 
		uni.getLocation({
			type:'gcj02',
			success: (res=> {			 
				let longNums = JSON.stringify(res.longitude)
				let latNums = JSON.stringify(res.latitude)
				
				let site1 = longNums.indexOf('.')
				let site2 = latNums.indexOf('.')
				let longSite = longNums.slice(0,site1) + longNums.slice(site1,site1+7)
				let latSite  = latNums.slice(0,site2) + latNums.slice(site2,site2+7)				
				
				uni.setStorageSync('sitePlace',{longSite:longSite,latSite:latSite}) 
			}), 
		})
		
	},
	 
}

