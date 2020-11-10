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
} 