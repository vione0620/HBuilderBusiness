import $config from './config.js'  
import { b64Md5,hexMD5 } from './md5.js'
import {getSortAscii} from '../common/util/utils.js'

export default { 
	common:{
		header:{
			"content-type":"application/json",  
		},
		method:'GET', 
	},
	request(options = {}){ 
		options.url = $config.baseUrl + options.url
		options.method = options.method || this.common.method
		options.header = options.header || this.common.header
		
		let tokkken = uni.getStorageSync('status') 
		//权限验证 token  
		if(options.token){ 
			options.header.token = tokkken.token  
		}  
		return new Promise((resolve,reject) => {
			uni.request({
				...options,
				success: (result) => {
					//失败
					if(result.statusCode !== 200){
						uni.showToast({
							title:result.data.msg || '失败',
							icon:'none',
							duration: 2000
						})
						return reject(result.data)
					}
					//成功
					resolve(result.data)
				},
				fail: (errs) => {
					
				}
			})
		})
	},
	
	post(url,data = {},options = {}){
		options.url = url
		options.data = data
		
		let _loginNo = uni.getStorageSync('user').loginNo
		if(!options.data.loginNo){
			options.data.loginNo = _loginNo
		}
		delete options.data.sign
		
		let list
		if(url == 'changeMerchGoods'){
			list = options.data.goodsList
			delete options.data.goodsList
		}
		let refreshKey = uni.getStorageSync('status').md5key
		let vVlue = options.data
		let sSort = getSortAscii(vVlue)
		let sSign
		
		if(url == 'login' || url == 'salesLogin' || url == 'getVerCodeL' || url == 'getVerCode' || url == 'joinApply' || url == 'getVerCodeS' || url == 'getVerCodeF' || url == 'forgetPwd'){
			sSign = hexMD5(sSort + "&key=YIYI@Customer!@#$803").toUpperCase()   
		} else {
			sSign = hexMD5(sSort + "&key=" + refreshKey).toUpperCase()  
		}
		options.data.sign = sSign
		
		if(url == 'changeMerchGoods'){
			options.data.goodsList = list
		}
		
		options.method = 'POST' 
		return this.request(options)
	},
	postAlone(url,data = {},options = {}){
		options.url = url
		options.data = data
		
		let _loginNo = uni.getStorageSync('user').loginNo
		if(!options.data.loginNo){
			options.data.loginNo = _loginNo
		}
		delete options.data.sign
		
		let list
		if(url == 'changeMerchGoods'){
			list = options.data.goodsList
			delete options.data.goodsList
		}
		let refreshKey = uni.getStorageSync('status').md5key
		let vVlue = options.data
		let sSort = getSortAscii(vVlue)
		let sSign
		
		if(url == 'login' || url == 'salesLogin' || url == 'getVerCodeL' || url == 'getVerCode' || url == 'joinApply' || url == 'getVerCodeS' || url == 'getVerCodeF' || url == 'forgetPwd'){
			sSign = hexMD5(sSort + "&key=YIYI@Customer!@#$803").toUpperCase()   
		} else {
			sSign = hexMD5(sSort + "&key=" + refreshKey).toUpperCase()  
		}
		options.data.sign = sSign
		
		if(url == 'changeMerchGoods'){
			options.data.goodsList = list
		}
		
		options.method = 'POST' 
		return this.requestAlone(options)
	},
	requestAlone(options = {}){
		options.url = options.url
		options.method = options.method || this.common.method
		options.header = options.header || this.common.header
		
		let tokkken = uni.getStorageSync('status') 
		//权限验证 token  
		if(options.token){ 
			options.header.token = tokkken.token 
			// debugger
			if(!options.header.token){
			    return uni.showToast({
					title: '过期token,请重新登录',
					icon: 'none',
					duration: 2000
				});  
			}
		} 
		return new Promise((resolve,reject) => {
			uni.request({
				...options,
				success: (result) => {
					//失败
					if(result.statusCode !== 200){
						uni.showToast({
							title:result.data.msg || '失败',
							icon:'none',
							duration: 2000
						})
						return reject(result.data)
					}
					//成功
					resolve(result.data)
				},
				fail: (errs) => {
					
				}
			})
		})
	},
}