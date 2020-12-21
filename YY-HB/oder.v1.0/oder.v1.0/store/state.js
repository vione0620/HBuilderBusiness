/*
1.应用层级的状态应该集中到单个 store 对象中。
*/

export default { 
	mallSrot:[], //商店的分类
	mallFoods:[], //商店的商品
	cartGoods:[], //加购的商品
	mustBuy:'',	//必买项编号
	mustBuyItem:{},// 把必加项分别出来
	limitNum:[], //购买限制量
	limitAmt:0, //购买金额设置
	addDrink:{}, //get追加必的编号
	mustSortTot:[] ,//需要追加豆浆的类目
	mustAddItemNums:0, //必买类目的总数等于必买项的总数
	getMoneyQuota:[],//提现金额
	getMoneyRecord:[],//用户提现记录
	
	goodsTopScroll:'', //接收每个商品分类距顶部的距离 
	stockTopScroll:'',//接收库存分类距顶部的距离 
	stockFoods:[], //庫存分類
	stockStock:[],//庫存商品
	userOrderList:[],//商家订单列表
	userUnityList:[],//买家订单列表
	getAgentList:[],//代放管理
	
	previousOrder:[],//未支付订单
	// previousOrderDetail:[],//RECEIVE_PREVIOUS_DETAIL
	getCouponId:'', //优惠券id
	getCartAmt:'', //实付金额
	getUnusualAmt:'',//已选券无需再减券的金额
	getUnusualNo:'',//已选券无需再减券的券号
}