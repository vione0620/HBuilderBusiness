/*
包含多个基于state的getter计算属性的对象
*/

export default {
	
	totalCount(state){ 
		return state.cartGoods.reduce((preTotal,food) => preTotal + food.boxNums,0)
	},
	totalPrice(state){ 
		return state.cartGoods.reduce((preTotal,food) => preTotal + food.boxNums * food.merchPrice,0)
	},
	 
}