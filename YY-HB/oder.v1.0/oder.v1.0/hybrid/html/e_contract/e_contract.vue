<template>
	<view id="e_contract"><!-- :style="{height:getheight + 'px'}" -->
		<scroll-view :scroll-top="scrollTop" :style="{height:getheight + 'px'}"
			class="unpaid-list" scroll-y="true" @scrolltolower="listScroll">
			<h1 class="h1">顶有鸣早餐加盟协议</h1>
			<h2 class="h2">({{joinNo}})</h2>
			<view class="content">
				<view class="part">
					根据《中华人民共和国合同法》等国家有关法律法规之规定，经授权方及加盟商双方协商同意，本着互利互惠、合作共赢的原则，作为顶有鸣（福建）健康科技有限公司（以下简称顶有鸣）之加盟商，代理销售顶有鸣产品之相关业务。具体约定如下：
				</view>
				<view class="title">一、协议期限</view>
				<ol>
					<li>1.	加盟期限一般为5年，加盟协议自从勾选同意时生效。协议到期自动续签。</li> 
				</ol>
				<view class="title">二、加盟商资质要求</view>
				<ol>
					<li>1.	合法独立的公司或者个人，并能提供如身份证、营业执照副本、食品经营许可证等相关证明文件，经审查合格签定加盟协议后即成为顶有鸣加盟商；</li>
					<li>2.	应具备良好的、丰富的客户资源和销售网络，有能力在短期内将顶有鸣产品进行推广销售，有良好的资信能力和商业信誉；</li>
					<li>3.	愿意专心经营顶有鸣产品，并对产品、对市场充满信心，不得在合作期间销售其他品牌同类产品；</li>
					<li>4.	能够诚实经营并接受顶有鸣的经营指导，保持与顶有鸣战略决策的一致性； </li>
					<li>5.	全面赞同顶有鸣各项制度，并能积极参加顶有鸣为各加盟商所举办的各种活动；</li>
					<li>6.	三个指定付款账户明细；</li>
					<li>7.	加盟商需详尽真实填写商户信息详情；</li>
					<li>8.	提供门店4张照片：建筑物主体照片、门店正面含店招、收银区全景照片、店内全景照片。</li>
				</ol>
				<view class="title">三、乙方权利和义务</view>
				<ol>
					<li>1.	销售顶有鸣旗下产品；使甪顶有鸣商标进行顶有鸣旗下产品相关的经营活动；使用顶有鸣商誉开展广告宣传、市场推广活动；乙方应积极宣顶有鸣企业形象，把顶有鸣产品迅速推向市场；</li>
					<li>2.	接受顶有鸣经营计划的指导，严格按照产品经营指导进行产品售卖，不得出售过期、变质产品；配备必备的销售、售后人员并负责对上述人员定期进行业务培训；</li>
					<li>3.	乙方应积极宣顶有鸣企业形象，把顶有鸣产品迅速推向市场；</li>
					<li>4.	市场运作过程中，各加盟商在接到市场投诉时，应及时做好记录，并报顶有鸣相关部门妥善处理；</li>
					<li>5.	乙方只能在加盟协议约定区域内开展代理产品各种合法销售活动，严禁未经顶有鸣书面认可在其他区域内从事各种形式的销售活动；如乙方有恶意跨区域销售行为，顶有鸣视其情节轻重有权取消乙方的授权资格；</li>
					<li>6.	旗下所有产品执行市场统一零售价。 乙方须严格按照顶有鸣规定的零售价格进行销售，不得私自降价或抬高价格销售，不得随意调价扰乱市场价格秩序；</li>
					<li>7.	乙方需要将用于陈列顶有鸣产品的蒸柜摆放于便利店（征求运营建议）的位置，并提供冷冻柜用于储存顶有鸣产品；</li>
					<li>8.	乙方通过线下销售测试并达到甲方评定人员审核通过后必须无条件配合甲方推行线上APP运行；</li>
					<li>9.	乙方需妥善保管好甲方提供的用于销售的设施设备，包含单不仅限于蒸箱、广告张贴、横幅等，在使用过程中所造成的人为损坏乙方需承担替换或者维修的相应费用，若双方终止合作时需完好归还甲方。</li> 
				</ol>
				<view class="title">四、甲方权利和义务 </view>
				<ol>
					<li>1.	顶有鸣会根据市场情况调整统一零售价或统一促销价，顶有鸣将根据市场情况不定期经常全国性促销活动并对单店提供针对性的行销方案及企划品设计。乙方结算折扣以实际成交价为准；</li>
					<li>2.	针对新进加盟商，顶有鸣做出相应活动力度支持；</li>
					<li>3.	根据市场动态研发、更新产品，确保顶有鸣产品的市场竞争力，并保证顶有鸣旗下所有产品的食品安全；</li>
					<li>4.	顶有鸣提供经营计划的指导，对销售、售后人员等定期进行业务培训；</li>
					<li>5.	顶有鸣负责建立与加盟商之间的沟通与联系渠道，不定期地向乙方提供宣传资料、信息、政策、培训以及解决方案与管理制度等方面的支持；</li>
					<li>6.	顶有鸣对加盟商进行APP操作、销售话术、产品构成进行系统化培训；</li>
					<li>7.	市场运作过程中，处理各加盟商在接到关于顶有鸣所提供商品的市场投诉。</li>
					<li>8.	为了让乙方更快熟悉顶有鸣产品及运营模式，共同将顶有鸣早餐产品迅速在乙方经营场所周边拓展，甲方配合乙方于上线之日起的日常经营辅导。</li>
					<li>9.	甲方先行提供加热设备以便于乙方日常经营 ，待乙方持续售卖满三个月后再按加热设备的采购成本收取费用，设备归乙方所有；</li> 
					<li>10.	甲方负责所提供设备的维护及替换，以保障乙方是正常销售。</li>
				</ol>
				<view class="title">五、保 密</view>
				<ol>
					<li>1.	顶有鸣实行"同业禁止"的原则，未经顶有鸣同意，乙方不得多头代理销售相类似的产品，更不得将有关销售代理的任何内容泄露给任何第三方，严守双方交易过程获悉的所有商业秘密；</li>
					<li>2.	无论加盟终止与否，加盟商均不得泄露顶有鸣的任何商业秘密，一经发现，顶有鸣将严肃处理。造成损失的，顶有鸣将依法追究其法律责任。</li> 
				</ol>
				<view class="title">六、交易结算</view>
				<ol>
					<li>1.	货款：货款包含线上线下销售的所有进货商品的款项；</li>
					<li>2.	线上款项：合伙人拥有线上结算账户，系统后台将自动从线上订单支付款项中扣除对应进货成本，实时结算； </li>
					<li>3.	结算方式：进入常规合作期加盟商需在下单的同时支付相应款项；</li>
					<li>4.	付款方式：线上销售阶段乙方通过甲方提供的企业支付宝账号按期用预留付款账户向甲方支付相应货款。</li> 
				</ol>
				<view class="title">七、协议的变更和终止</view>
				<ol>
					<li>1.	有下列情况之一的一方可终止本协议：</li>
					<li>
						<ol>
							<li>1)	乙方部分或全部丧失民事行为能力，不能正常完成其代理工作，顶有鸣有权终止本协议；</li>
							<li>2)	出现不可抗力，致使本协议无法继续履行的，双方均有权终止本协议；</li>
							<li>3)	如加盟商出现商品结构调整及相应商业变化致使协议无法履行，需提前1个月书面通知；</li> 
						</ol>
					</li>
					<li>2.	本协议终止，加盟商应及时与顶有鸣指定人员办理交接手续，加盟商应退回相关的销售工具、产品资料等并同时停止使用顶有鸣所有商标进行任何商业行为；</li>
					<li>3.	协议终止后加盟商不得再以顶有鸣代理人名义从事任何有关活动，否则因此造成的后果由加盟商自行承担，若因此而给顶有鸣造成的损失，顶有鸣有权要求加盟商予以赔偿。</li> 
				</ol>
				<view class="title">八、争议处理</view>
				<ol>
					<li>在协议履行过程中，如双方发生争议，应友好协商解决。双方不能达成一致时，可向当地人民法院提出诉讼。</li> 
				</ol>
				<view class="title">九、附 则</view>
				<ol>
					<li>本协议一式贰份，甲乙双方各执一份。本协议自双方签字或盖章之日起生效。未尽事宜，双方另行协商并签订补充协议。本协议如需备案，相关费用按照政府规定缴纳，政府无规定的各半分担。</li> 
				</ol> 
				<h2 class="h2_part">授权方（甲方）：<view class="txt">顶有鸣（福建）健康科技有限公司</view> </h2>
				<h2 class="h2_part">加盟商（乙方）：<view class="txt">{{mearchName}}（{{joinNo}}）</view></h2>
				<ol>
					<li></li> 
				</ol>
			</view>
			
			
		</scroll-view>
		
		<view class="checked-wrap">
			<view class="btn-cont"> 
				<evan-checkbox v-model="agreeChecked" shape="square"
				 :iconSize="18" primaryColor="#09BB07" :checkRight="true">我已阅读并同意</evan-checkbox> 
			</view>
			<view class="checkOnCredit">
				<view class="checkBtn" @tap="checkBargain(false)">取消</view>
				<view class="checkBtn yes" @tap="checkBargain(true)">同意</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {b64Md5,hexMD5} from '@/network/md5.js'	
	import {getSortAscii} from '@/common/util/utils.js'	 
	import EvanCheckbox from '../../../components/plugin-ui/evan-checkbox.vue'
	export default {
		components:{ 
			EvanCheckbox,
		},
		data() {
			return {
				loginWhether:'',//登陆状态
				userStore:'', //用户信息
				merchNo:'', //商户号
				getheight:0,
				scrollTop:0,
				agreeChecked:false,
				joinNo:'',
				mearchName:'',
			};
		},  
		onLoad() { 
			this.loginWhether = uni.getStorageSync('status') 
			this.userStore = uni.getStorageSync('user')
			this.merchNo = uni.getStorageSync('user').merchNo 
			this.joinNo = uni.getStorageSync('user').joinNo  
			this.mearchName = uni.getStorageSync('user').identityName  
			uni.getSystemInfo({
			    success: (res) =>{   
					let height =  res.screenHeight - 134
					this.getheight = height 
			    }
			});
			
		},
		methods:{
			
			back() { 
				uni.reLaunch({
					url:'../../../pages/utility/index/index'
				})
			},
			listScroll(w){ 
				this.agreeChecked = true
			},
			checkBargain(param){
				if(param === true){ 
					if(this.agreeChecked){
						this.isRegular() //是否新用户
						// uni.setStorageSync('agreeChecked',false) 
						uni.showLoading({
							mask:true,
							title:'恭喜你成为正式商家！'
						})
						setTimeout(()=>{
							uni.navigateBack({
								delta:1,
								animationDuration:200,
								animationType:'pop-out'
							})
						},2000)
					}
				}else if(param === false){ 
					// uni.setStorageSync('agreeChecked',true)
					uni.navigateBack({
						delta:1
					})
				}
			},			
			isRegular(){		
				let vVlue = {
					"merchNo": this.merchNo, 
				}
				let sSort = getSortAscii(vVlue)    
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() 
				this.$request.post('isRegular', {	
					...vVlue,
					"sign": sSign
				},{
					token:true
				}).then(res=>{ 
						uni.setStorageSync('agreeChecked',false) 
				}).catch()  
			}, 
		},
	}
</script>

<style lang="scss">
page{ 
	width: 100vw;
	margin: 0;
	padding: 0;
}
#e_contract{
	width: 100vw; 
}
.unpaid-list{
	padding: 0 20rpx;
	.h1{
		font-size: 40rpx;
		font-weight: normal;
		text-align: center;
	}
	.h2{
		font-size: 32rpx;
		font-weight: normal;
		text-align: center;
	}
	.title{
		font-weight: bold;
		padding: 40rpx 0;
	}
	.part{
		text-indent: 48rpx;
		padding: 20rpx;
		line-height: 1.8;
	}
	ol>li{ 
		line-height: 1.8;
		text-indent: 48rpx;
		padding-bottom: 20rpx;
	}
	.h2_part{ 
		font-size: 32rpx; 
		text-align: left;
		padding: 20rpx 0;
		.txt{
			// text-align: right;
			padding-top: 20rpx;
			text-indent: 48rpx;
		}
	}
}
.checked-wrap{
	height: 220rpx;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100vw;
	background-color: #FFFFFF;
	border-top: 1px solid #EEEEEE;
	.btn-cont{
		padding: 30rpx 40rpx;
	}
	.checkOnCredit{ 
		display: flex;
		padding: 32rpx 0; 
		border-top: 1px solid #EEEEEE;
		.checkBtn{
			flex: 1;
			text-align: center; 
			&:first-child{
				border-right: 1px solid #EEEEEE;
			}
		} 
		.yes{
			color: #09BB07;
			
		}
		.no{
			color: #f00;
		}
	}
}
		 
</style>
