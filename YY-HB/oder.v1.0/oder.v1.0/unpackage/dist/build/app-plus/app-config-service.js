
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/utility/loading/loading","pages/utility/index/index","pages/account/login/login","pages/account/passwd/passwd","pages/wallet/report/report","pages/utility/mall/mall","pages/utility/mall/prepay","pages/utility/stock/stock","pages/utility/manage/manage","pages/finance/outlay/list","pages/finance/outlay/list_detail","pages/finance/agent/agent","pages/finance/agent/agent_detail","pages/wallet/entry/entry","pages/wallet/rebate/rebate","pages/finance/sell/unity/unity","pages/finance/sell/unity/unity_detail","pages/account/option/option","pages/utility/shop/sign","pages/utility/about/about","pages/utility/about/treaty","pages/utility/about/privacy","pages/wallet/moeny/moeny","pages/wallet/type/brand","pages/wallet/moeny/check","pages/wallet/moeny/result","pages/wallet/moeny/record","pages/utility/shop/code","pages/account/authid/authid","pages/payment/setup","pages/payment/payment","pages/utility/helper/helper","hybrid/html/e_contract/e_contract","pages/account/coupon/coupon","pages/account/coupon/usable"],"window":{"navigationBarTextStyle":"white","navigationBarTitleText":"商家版","navigationBarBackgroundColor":"#46B85B","backgroundColor":"#F2F2F2"},"nvueCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"oder.v1.0","compilerVersion":"2.8.3","entryPagePath":"pages/utility/loading/loading","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/utility/loading/loading","meta":{"isQuit":true},"window":{"titleNView":false}},{"path":"/pages/utility/index/index","meta":{},"window":{"navigationBarTitleText":"今日收款","enablePullDownRefresh":true,"titleNView":{"titleColor":"#FFFFFF","backgroundColor":"#46B85B","buttons":[{"color":"#FFFFFF","colorPressed":"#46e66c","float":"right","fontSize":"28px","fontSrc":"/static/iconfont.ttf","text":"","width":"70px"}],"autoBackButton":false}}},{"path":"/pages/account/login/login","meta":{},"window":{"titleNView":false}},{"path":"/pages/account/passwd/passwd","meta":{},"window":{"titleNView":false}},{"path":"/pages/wallet/report/report","meta":{},"window":{"navigationBarTitleText":"经营报表","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true,"backgroundColor":"#46B85B"}}},{"path":"/pages/utility/mall/mall","meta":{},"window":{"navigationBarTitleText":"商家下单","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true}}},{"path":"/pages/utility/mall/prepay","meta":{},"window":{"navigationBarTitleText":"提交订单","backgroundColor":"#F2F2F2","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true}}},{"path":"/pages/utility/stock/stock","meta":{},"window":{"navigationBarTitleText":"商家库存","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true,"backgroundColor":"#46B85B"}}},{"path":"/pages/utility/manage/manage","meta":{},"window":{"navigationBarTitleText":"服务商家","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true,"backgroundColor":"#46B85B"}}},{"path":"/pages/finance/outlay/list","meta":{},"window":{"titleNView":false}},{"path":"/pages/finance/outlay/list_detail","meta":{},"window":{"titleNView":false}},{"path":"/pages/finance/agent/agent","meta":{},"window":{"titleNView":false}},{"path":"/pages/finance/agent/agent_detail","meta":{},"window":{"navigationBarTitleText":"","titleNView":false}},{"path":"/pages/wallet/entry/entry","meta":{},"window":{"navigationBarTitleText":"收款记录","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true,"backgroundColor":"#46B85B"}}},{"path":"/pages/wallet/rebate/rebate","meta":{},"window":{"navigationBarTitleText":"订制红包","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true,"backgroundColor":"#46B85B"}}},{"path":"/pages/finance/sell/unity/unity","meta":{},"window":{"navigationBarTitleText":"买家订单","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true,"backgroundColor":"#46B85B"}}},{"path":"/pages/finance/sell/unity/unity_detail","meta":{},"window":{"titleNView":false}},{"path":"/pages/account/option/option","meta":{},"window":{"navigationBarTitleText":"设置","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true}}},{"path":"/pages/utility/shop/sign","meta":{},"window":{"navigationBarTitleText":"店铺图片","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true}}},{"path":"/pages/utility/about/about","meta":{},"window":{"navigationBarTitleText":"关于移移","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true,"backgroundColor":"#46B85B"}}},{"path":"/pages/utility/about/treaty","meta":{},"window":{"navigationBarTitleText":"服务协议","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true,"backgroundColor":"#46B85B"}}},{"path":"/pages/utility/about/privacy","meta":{},"window":{"navigationBarTitleText":"隐私政策","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true,"backgroundColor":"#46B85B"}}},{"path":"/pages/wallet/moeny/moeny","meta":{},"window":{"navigationBarTitleText":"提现账户","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true,"backgroundColor":"#46B85B"}}},{"path":"/pages/wallet/type/brand","meta":{},"window":{"navigationBarTitleText":"银行卡管理","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true,"backgroundColor":"#46B85B"}}},{"path":"/pages/wallet/moeny/check","meta":{},"window":{"navigationBarTitleText":"提现确认","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true,"backgroundColor":"#46B85B"}}},{"path":"/pages/wallet/moeny/result","meta":{},"window":{"navigationBarTitleText":"提现申请","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true,"backgroundColor":"#46B85B"}}},{"path":"/pages/wallet/moeny/record","meta":{},"window":{"navigationBarTitleText":"提现明细","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true,"backgroundColor":"#46B85B"}}},{"path":"/pages/utility/shop/code","meta":{},"window":{"navigationBarTitleText":"商家二维码","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true}}},{"path":"/pages/account/authid/authid","meta":{},"window":{"navigationBarTitleText":"关联账号","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true}}},{"path":"/pages/payment/setup","meta":{},"window":{"navigationBarTitleText":"支付密码","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true,"backgroundColor":"#46B85B"}}},{"path":"/pages/payment/payment","meta":{},"window":{"navigationBarTitleText":"支付管理","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true,"backgroundColor":"#46B85B"}}},{"path":"/pages/utility/helper/helper","meta":{},"window":{"navigationBarTitleText":"帮助中心","titleNView":{"titleColor":"#FFFFFF","autoBackButton":true,"backgroundColor":"#46B85B"}}},{"path":"/hybrid/html/e_contract/e_contract","meta":{},"window":{"navigationBarTitleText":"加盟协议","titleNView":{"titleColor":"#FFFFFF","autoBackButton":false,"backgroundColor":"#46B85B"}}},{"path":"/pages/account/coupon/coupon","meta":{},"window":{"navigationBarTitleText":"优惠券管理","enablePullDownRefresh":false}},{"path":"/pages/account/coupon/usable","meta":{},"window":{"navigationBarTitleText":"可用券","enablePullDownRefresh":false}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
