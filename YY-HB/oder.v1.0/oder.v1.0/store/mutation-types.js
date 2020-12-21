/*
使用常量替代 mutation 事件类型在各种 Flux 实现中是很常见的模式
mutations 和actions 之间进行交互的常量模块
*/
export const RECEIVE_MALL_GOODS = 'receive_mall_goods' //接收商家下单页面数据
export const RECEIVE_CART_GOODS = 'receive_cart_goods' //接收商家下单页面数据

export const ADD_FOOD_COUNT = 'add_food_count'  //购物车加
export const LESS_FOOD_COUNT = 'less_food_count' //购物车减
export const VALUE_FOOD_COUNT = 'value_food_count' //购物车输入
export const SET_HOT_SALE = 'set_hot_sale' //上热门
export const CLEAR_CART = 'clear_cart' //清空购物车 
export const GET_MOENY_QUOTA = 'get_moeny_quota' //提现额度

export const GOODS_TOP_SCROLL = 'goods_top_scroll'  //接收每个商品分类距顶部的距离
export const STOCK_TOP_SCROLL = 'stock_top_scroll'  //接收每个商品分类距顶部的距离
export const RECEIVE_STOCK_GOODS = 'receive_stock_goods' //接收库存页面数据
export const RECEIVE_ORDER_LIST = 'receive_order_list' //接收商家订单页面数据
export const RECEIVE_USER_UNITY_LIST = 'receive_user_unity_list' //接收买家个人用户订单页面数据
export const RECEIVE_GET_MONEY_RECORD = 'receive_get_money_record' //接收买家个人用户订单页面数据
export const RECEIVE_AGENT_LIST = 'receive_agent_list' //代放管理页面数据

export const RECEIVE_PREVIOUS_ORDER = 'receive_previous_order' //接收未支付订单数据
// export const RECEIVE_PREVIOUS_DETAIL = 'receive_previous_Detail' //接收未支付订单数据


export const GET_COUPON_ID = 'get_coupon_id' //优惠券GET_CART_AMT
export const GET_CART_AMT = 'get_cart_amt' //实付金额GET_CART_AMT
export const GET_UNUSUAL_AMT = 'get_unusual_amt' //已选券无需再减券的金额get_unusual_amt
// userUnityList

// export const BEFORGET_REPORT_CHART = 'beforget_report_chart' //点击获取当前日期报表数据显示在图表中
// export const CONFIRM_REPORT_CHART = 'confirm_report_chart' //根据选择日期获取报表数据显示在图表中




