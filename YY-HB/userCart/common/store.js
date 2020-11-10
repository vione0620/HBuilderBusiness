import Vue from 'vue'
import Vuex from 'vuex' 

Vue.use(Vuex)

const RECEIVE_MALL_GOODS = 'receive_mall_goods' //下单数据
const RECEIVE_CART_GOODS = 'receive_cart_goods' //购物车数据
const ADD_FOOD_COUNT = 'add_food_count'  //购物车加
const LESS_FOOD_COUNT = 'less_food_count' //购物车减 
const CLEAR_CART = 'clear_cart' //清空购物车
const GOODS_TOP_SCROLL = 'goods_top_scroll'  //距顶部的距离

const store = new Vuex.Store({
    state: {
		mallSrot:[], //分类
		mallFoods:[], //商品
		cartGoods:[], //加购 
		hotsale:[], //热卖
		sameFoods:[], //相同
		goodsTopScroll:'', //距顶部的距离
    },
	mutations:{		
		//页面
		[RECEIVE_MALL_GOODS](state,goods){ 
			state.mallSrot = goods.sort
			state.mallFoods = goods.goods  
			
			// 联动相同商品 
			let sameArry = []
			const mfoods = [].concat.apply([],state.mallFoods) 		
			mfoods.filter(same => {
				if(same.hotSale === "1"){
					sameArry.push(same)
				}
			}); 
			state.sameFoods = sameArry
			
		},
		//购物车
		[RECEIVE_CART_GOODS](state,goods){ 
			state.cartGoods = goods
		},
		
		// 加
		[ADD_FOOD_COUNT](state,isfood){
			let _this = isfood.food 
			
			if(!_this.boxNums){
				Vue.set(_this,'boxNums',1)   
				
				for(let i in state.sameFoods){
					let cccart = state.sameFoods[i] 
					if(_this.goodsNo === cccart.goodsNo){
						Vue.set(cccart,'boxNums',1)   
						cccart.boxNums = _this.boxNums
					} 
				}
				
				state.cartGoods.push(_this)  
			}else{
				if(_this.boxNums >= _this.storeNum){
					return uni.showToast({
						icon:'none',
						title:'不能再多啦^_^!'
					})
				}else{					
					_this.boxNums++ 
					
					for(let i in state.sameFoods){
						let cccart = state.sameFoods[i] 
						if(_this.goodsNo === cccart.goodsNo){ 
							cccart.boxNums = _this.boxNums
						} 
					}
					
				}
			}
			  
			for(let i in state.sameFoods){
				let cccart = state.sameFoods[i] 
				if(_this.goodsNo === cccart.goodsNo){
					cccart.boxNums = _this.boxNums
				} 
			} 
		},
		//减
		[LESS_FOOD_COUNT](state,isfood){
			let _this = isfood.food
			if(_this.boxNums > 0){
				_this.boxNums--
				
				for(let i in state.sameFoods){
					let cccart = state.sameFoods[i] 
					if(_this.goodsNo === cccart.goodsNo){ 
						cccart.boxNums = _this.boxNums
					} 
				}
				
			}
			if(_this.boxNums === 0){
				state.cartGoods.splice(state.cartGoods.indexOf(_this),1)
								
				for(let i in state.sameFoods){
					let cccart = state.sameFoods[i] 
					if(_this.goodsNo === cccart.goodsNo){ 
						cccart.boxNums = _this.boxNums 
					} 
				}
				
			} 
		}, 
		
		//空
		[CLEAR_CART](state){
			state.cartGoods.forEach(food=>food.boxNums = 0)
			state.sameFoods.forEach(food=>food.boxNums = 0)
			state.cartGoods = []
		},
		
		//距顶部
		[GOODS_TOP_SCROLL](state,scroll){
			state.goodsTopScroll = scroll  
		},
		
	},
	actions:{		
		//空
		[CLEAR_CART]({commit}){
			commit('clear_cart')
		},
		[RECEIVE_MALL_GOODS]({commit},goods){  
			commit('receive_mall_goods',goods)
		}
	},
	getters:{		
		totalCount(state){
			return state.cartGoods.reduce((preTotal,food) => preTotal + food.boxNums,0)
		},
		totalPrice(state){
			return state.cartGoods.reduce((preTotal,food) => preTotal + food.boxNums * food.goodsPrice,0)
		},
	},
})


export default store