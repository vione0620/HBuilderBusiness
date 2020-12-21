/*
3.异步逻辑都应该封装到 action 里面。
Action 提交的是 mutation，而不是直接变更状态。
Action 可以包含任意异步操作
*/
import {  
	CLEAR_CART,
	GET_MOENY_QUOTA,
	RECEIVE_ORDER_LIST,
	RECEIVE_USER_UNITY_LIST,
	RECEIVE_GET_MONEY_RECORD,
	RECEIVE_AGENT_LIST,
	
	RECEIVE_PREVIOUS_ORDER,
	// RECEIVE_PREVIOUS_DETAIL,
	GET_COUPON_ID,
	GET_CART_AMT,
	GET_UNUSUAL_AMT,
} from './mutation-types'
import request from '../network/requrest.js'

export default { 
	//清空购物车  
	[CLEAR_CART]({commit}){
		commit('clear_cart')
	},
	//提现额度
	[GET_MOENY_QUOTA]({commit},quota){ 
		commit('get_moeny_quota',quota)
	}, 
	//商家订单
	[RECEIVE_ORDER_LIST]({commit},order){
		commit('receive_order_list',order)
	},
	//用户购买订单
	[RECEIVE_USER_UNITY_LIST]({commit},unity){
		commit('receive_user_unity_list',unity)
	},
	//提现记录
	[RECEIVE_GET_MONEY_RECORD]({commit},unity){
		commit('receive_get_money_record',unity)
	},
	//代放管理
	[RECEIVE_AGENT_LIST]({commit},order){
		commit('receive_agent_list',order)
	},
	//未支付订单
	[RECEIVE_PREVIOUS_ORDER]({commit},unpaid){
		commit('receive_previous_order',unpaid)
	},
	//未支付详情
	// [RECEIVE_PREVIOUS_DETAIL]({commit},unpaiddetail){
	// 	commit('receive_previous_detail',unpaiddetail)
	// }, 
	//优惠券
	[GET_COUPON_ID]({commit},couponid){ 
		commit('get_coupon_id',couponid)
	}, 
	//实付金额getCartAmt
	[GET_CART_AMT]({commit},cartAmt){ 
		console.log(cartAmt)
		commit('get_cart_amt',cartAmt)
	}, 
	//实付金额GET_UNUSUAL_AMT
	[GET_UNUSUAL_AMT]({commit},unusualAmt){ 
		console.log(unusualAmt)
		commit('get_unusual_amt',unusualAmt)
	}, 
} 