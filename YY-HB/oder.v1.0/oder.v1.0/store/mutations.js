/*
2.提交 mutation 是更改状态的唯一方法，并且这个过程是同步的。
*/
import { 
	RECEIVE_MALL_GOODS,
	RECEIVE_CART_GOODS,
	
	ADD_FOOD_COUNT,
	LESS_FOOD_COUNT,
	VALUE_FOOD_COUNT,
	SET_HOT_SALE,
	CLEAR_CART, 
	GET_MOENY_QUOTA,
	
	GOODS_TOP_SCROLL,
	STOCK_TOP_SCROLL,
	RECEIVE_STOCK_GOODS,
	RECEIVE_ORDER_LIST,
	RECEIVE_UNPAY_ORDER_LIST,
	RECEIVE_USER_UNITY_LIST,
	RECEIVE_GET_MONEY_RECORD,
	RECEIVE_AGENT_LIST,
	
	RECEIVE_PREVIOUS_ORDER,
	// RECEIVE_PREVIOUS_DETAIL,
	GET_COUPON_ID,
	GET_CART_AMT,
	GET_UNUSUAL_AMT,
} from './mutation-types'

export default { 
	//接收商家下单页面数据
	[RECEIVE_MALL_GOODS](state,goods){  
		//商品分类排序 end
		
		const breakfastGoods = goods.breakfastGoods 
		//需要追加必买项的类目
		// state.addDrink =  Object.values(goods.mustBuyGoods) 
		// console.log(state.addDrink)
		//必买项的商品编号
		// state.mustBuy = Object.keys(goods.mustBuyGoods)	? '[]' : Object.keys(goods.mustBuyGoods)
		// console.log(state.mustBuy)
		//购买限制量
		state.limitNum = goods.limitNum
		state.limitAmt = goods.limitAmt
		state.canCredit = goods.canCredit
		
		state.mallSrot = Object.keys(breakfastGoods)
		state.mallFoods = Object.values(breakfastGoods)
		 
		// 分别必加项
		// const mfoods = [].concat.apply([],state.mallFoods) 		 
		// const mustDinks = mfoods.filter(dink => dink.goodsNo == state.mustBuy)
				
		// state.mustBuyItem = state.addDrink ? '[]' : mustDinks 
		// console.log(state.mustBuyItem)
	},
	//接收购物车数据
	[RECEIVE_CART_GOODS](state,goods){ 
		state.cartGoods = goods 
	},
	
	// //购物车加
	[ADD_FOOD_COUNT](state,isfood){
		let _this = isfood.food 
		// console.log(_this.storeNum,isfood)
		// let must_buy_item = state.mustBuyItem
		// let additem = state.addDrink[0]   	
		
		if(!_this.boxNums){ //第一次增加
			Vue.set(_this,'boxNums',1)   
			state.cartGoods.push(_this) 
		}else{
			if(state.limitNum === 0){ 
				_this.boxNums++
			}else{ 
				// if(_this.goodsNo === must_buy_item[0].goodsNo){	
				// 		_this.boxNums++					
				// }else{					
					if(_this.boxNums === state.limitNum){
						return uni.showToast({
							icon:'none',
							title:`当前单品限制${state.limitNum}份`
						})
					}else if(_this.boxNums+1 > _this.storeNum){ //当前库存量storeNum
						return uni.showToast({
							icon:'none',
							title:`当前单品今日仅剩${_this.storeNum}份`
						})
					}else{					
						_this.boxNums++
					}
				// }
			} 
		}  
		// if(_this.categoryNo === additem[0] || _this.categoryNo === additem[1]){ 		 
		// 	// if(!must_buy_item[0].boxNums){ 
		// 	// 	Vue.set(must_buy_item[0],'boxNums',1) 
		// 	// 	state.cartGoods.push(must_buy_item[0])
		// 	// }else{
		// 		let ismust = []
		// 		for(let i in state.cartGoods){
		// 			let cccart = state.cartGoods[i]
		// 			// if(cccart.categoryNo === additem[0] || cccart.categoryNo === additem[1]){
		// 			// 	ismust.push(cccart)
		// 			// }
		// 		} 
		// 		const mustTotNums = ismust.reduce((preTotal,food) => preTotal + food.boxNums,0)   						 
		// 		state.mustAddItemNums = mustTotNums > 0 ? mustTotNums : 0 			
		// 		// must_buy_item[0].boxNums++		 
		// 	// }
			
		// }  
		
	},
	// //购物车减
	[LESS_FOOD_COUNT](state,isfood){
		let _this = isfood.food
		 
		// let must_buy_item = state.mustBuyItem 
		// let additem = state.addDrink[0]
		
		if(_this.boxNums > 0){ //为0禁操作 			
			
			let ismust = []
			for(let i in state.cartGoods){
				let cccart = state.cartGoods[i]
				// if(cccart.categoryNo === additem[0] || cccart.categoryNo === additem[1]){
				// 	ismust.push(cccart)
				// }
			} 			
			const mustTotNums = ismust.reduce((preTotal,food) => preTotal + food.boxNums,0)    
			state.mustAddItemNums = mustTotNums > 0 ? mustTotNums : 0  
			
			// if(_this.goodsNo === must_buy_item[0].goodsNo){//必选项操作		
			// 	if(state.mustAddItemNums > 0){
			// 		if(_this.boxNums <= state.mustAddItemNums){
			// 			let short = state.mustAddItemNums - must_buy_item[0].boxNums  
			// 			if(short > 0){ 
			// 				must_buy_item[0].boxNums += short 					
			// 			} 
			// 			uni.showToast({
			// 				icon:'none',
			// 				title:`该商品不能少于${state.mustAddItemNums}份`,
			// 			})  
			// 			return
			// 		}
			// 	}else{
			// 		_this.boxNums--	
			// 	}
			// 	if(_this.boxNums === 0){ //移除自己
			// 		state.cartGoods.splice(state.cartGoods.indexOf(_this),1)
			// 	}
			// }else{			
				_this.boxNums--			
				// if(_this.categoryNo === additem[0] || _this.categoryNo === additem[1]){ 				
				// 	must_buy_item[0].boxNums--				
				// }
				if(_this.boxNums === 0){ //移除自己
					state.cartGoods.splice(state.cartGoods.indexOf(_this),1)
				}
				// if(must_buy_item[0].boxNums == 0){ //必选为0			
				// 	state.cartGoods.splice(state.cartGoods.indexOf(must_buy_item[0]),1) 
				// }
			// }
			
			
		}
	},
	// //购物车输入
	[VALUE_FOOD_COUNT](state,isfood){
		let _this = isfood.food
		let _value = isfood.valueNums		 
		
		
		// let must_buy_item = state.mustBuyItem 
		// let additem = state.addDrink[0] 
		
		// if(_this.goodsNo === must_buy_item[0].goodsNo){//必选项输入			 
		// 	_this.boxNums = _value  
		// 	if(_value < state.mustAddItemNums){ //<需加项的总和提示错误 
		// 		_this.boxNums = state.mustAddItemNums  
		// 		uni.showToast({
		// 			icon:'none',
		// 			title:`该商品不能少于${state.mustAddItemNums}份`,
		// 		}) 
		// 	}
		// }else{	//非必选项输入
			
			if(state.limitNum === 0){  //无限制
					_this.boxNums = _value  
							
					if(_value === 0){ //输入0 自行移除
						state.cartGoods.splice(state.cartGoods.indexOf(_this),1) 
					}else if(_value+1 >= _this.storeNum){ //当前库存量storeNum
						_this.boxNums = +_this.storeNum //赋予最大库存值storeNum
						return uni.showToast({
							icon:'none',
							title:`当前单品今日仅剩${_this.storeNum}份`
						})
					} 
					//需加项...  
					// if(_this.categoryNo === additem[0] || _this.categoryNo === additem[1]){   //购物车中，必加总数
					
					// 	must_buy_item[0].boxNums += _this.boxNums - 1
					// 	// 购物车需加项总和 
					// 	let ismust = []
					// 	for(let i in state.cartGoods){
					// 		let cccart = state.cartGoods[i]
					// 		if(cccart.categoryNo === additem[0] || cccart.categoryNo === additem[1]){
					// 			ismust.push(cccart)
					// 		}
					// 	} 
					// 	const mustTotNums = ismust.reduce((preTotal,food) => preTotal + food.boxNums,0)						
					// 	state.mustAddItemNums = mustTotNums > 0 ? mustTotNums : 0
					// 	must_buy_item[0].boxNums = state.mustAddItemNums 
					// }				 
					// if(must_buy_item[0].boxNums === 0){ //必加为0自行移除
					// 	state.cartGoods.splice(state.cartGoods.indexOf(must_buy_item[0]),1)					
					// }  
				
				}else{  //有限制 
					if(_value > state.limitNum){ //>限制项=为限制数量
						_this.boxNums = state.limitNum 
						//需加必选...追加当前数量
						// if(_this.categoryNo === additem[0] || _this.categoryNo === additem[1]){ 
						// 	must_buy_item[0].boxNums += _this.boxNums - 1
						// }	
						uni.showToast({
							icon:'none',
							title:`当前单品限制${state.limitNum}份`
						})
						
					}else if(_value+1 > _this.storeNum){ //当前库存量 storeNum
						_this.boxNums = +_this.storeNum  //赋予最大库存值storeNum
						return uni.showToast({
							icon:'none',
							title:`当前单品今日仅剩${_this.storeNum}份`
						})
					}else{ //>限制量=当前输入量
					
						_this.boxNums = _value					
						// if(_this.categoryNo === additem[0] || _this.categoryNo === additem[1]){   
						// 	must_buy_item[0].boxNums += _this.boxNums - 1
						// }					
						if(_value === 0){ //输入为0
							state.cartGoods.splice(state.cartGoods.indexOf(_this),1) 
						}
						
					}   
					// // 必加项=需加项
					// if(_this.categoryNo === additem[0] || _this.categoryNo === additem[1]){   //购物车中，必加总数
					
					// 	let ismust = []
					// 	for(let i in state.cartGoods){
					// 		let cccart = state.cartGoods[i]
					// 		if(cccart.categoryNo === additem[0] || cccart.categoryNo === additem[1]){
					// 			ismust.push(cccart)
					// 		}
					// 	} 
					// 	const mustTotNums = ismust.reduce((preTotal,food) => preTotal + food.boxNums,0)    
					// 	state.mustAddItemNums = mustTotNums > 0 ? mustTotNums : 0
					// 	must_buy_item[0].boxNums = state.mustAddItemNums 
						
					// 	if(must_buy_item[0].boxNums === 0){ //必加为0				 
					// 		state.cartGoods.splice(state.cartGoods.indexOf(must_buy_item[0]),1)
					// 	} 
					// }		
					 
				}
		
		// } 
		
	},
	//上热门
	[SET_HOT_SALE](state,isfood){ 
		if(!isfood.hotSale){
			Vue.set(isfood,'hotSale','1')    
		}else if(isfood.hotSale === '1'){
			isfood.hotSale = '0'			
		}else{
			isfood.hotSale = '1'
		}  
	},
	//清空
	[CLEAR_CART](state){
		//清空foods中的boxNums
		state.cartGoods.forEach(food=>food.boxNums = 0)
		//移除购物车中所有项
		state.cartGoods = []
	},
	
	
	//提现额度
	[GET_MOENY_QUOTA](state,quota){
		state.getMoneyQuota = quota 
	},
	  
	//接收每个商品分类距顶部的距离
	[GOODS_TOP_SCROLL](state,scroll){
		state.goodsTopScroll = scroll 
	},
	
	//接收库存商品分类距顶部的距离
	[STOCK_TOP_SCROLL](state,scroll){
		state.stockTopScroll = scroll 
	}, 	 
	//接收庫存頁面的数据
	[RECEIVE_STOCK_GOODS](state,stock){  
		// console.log('stockstockstockstock',stock)
		state.stockStock = stock.sort
		state.stockFoods = stock.goods
		// console.log(stock.sort[0])
		// state.hotStock = stock.goods[0]
		// console.log(stock.goods[0])
	},
	//接收商家订单列表数据
	[RECEIVE_ORDER_LIST](state,order){
		// console.log(order)
		state.userOrderList = order
	},
	//商家未结算订单列表数据
	[RECEIVE_UNPAY_ORDER_LIST](state,order){
		state.userUnPayList = order
		// console.log(order)
	},
	
	//接收用户购买订单列表数据
	[RECEIVE_USER_UNITY_LIST](state,unity){
		state.userUnityList = unity 
	},
	
	//接收用户提现记录
	[RECEIVE_GET_MONEY_RECORD](state,record){
		state.getMoneyRecord = record 
	},
	
	//接收代放管理的数据
	[RECEIVE_AGENT_LIST](state,agent){
		state.getAgentList = agent
	},
	
	//接收未支付订单数据
	[RECEIVE_PREVIOUS_ORDER](state,unpaid){
		// console.log('未支付weizhifudingdan',unpaid)
		state.previousOrder = unpaid
	},
	
	//接收上一笔未支付订单详情	
	// [RECEIVE_PREVIOUS_DETAIL](state,unpaiddetail){
	// 	console.log('未支付weizhifudingdan详情',unpaiddetail)
	// 	state.previousOrderDetail = unpaiddetail 
	// },
	
	//优惠券id
	[GET_COUPON_ID](state,couponid){
		state.getCouponId = couponid
	},
	//实付金额GET_CART_AMT
	[GET_CART_AMT](state,cartAmt){
		state.getCartAmt = cartAmt 
	},
	//已选券无需再减券的金额GET_UNUSUAL_AMT
	[GET_UNUSUAL_AMT](state,unusualAmt){
		console.log(unusualAmt)
		state.getUnusualAmt = unusualAmt.amt
		state.getUnusualNo = unusualAmt.no
	},
	
	
	// 登录
	loginN(state,user){ 
		uni.setStorageSync('user', user);  
	},
	//登录状态
	logStatus(state,haslogin){  
		state.loginStatus = true
		state.haslogin = haslogin
		uni.setStorageSync('status',haslogin) 
	},
	// 退出登录
	logout(state){
		uni.removeStorageSync('user');  
		uni.removeStorageSync('status')  
	}, 
	// 蓝牙状态
	blueStatus(state,blue){
		uni.setStorageSync('blueStatus',blue)
	},
	// 蓝牙设备信息
	blueDevices(state,blue){
		uni.setStorageSync('blueDevices',blue)
	},
	blueClose(state){
		uni.removeStorageSync('blueStatus')
		uni.removeStorageSync('blueDevices')
	}
}