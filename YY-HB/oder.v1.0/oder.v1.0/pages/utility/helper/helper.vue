<template>
	<view id="helper">
		<view class="main">
			<uni-collapse :accordion="true"> 
				<uni-collapse-item title="余额提现" :show-animation="true">
					<view class="content"> 
							<view class="tit">余额</view>
							<view class="txt">可用余额为可提现金额。</view>
							<view class="txt">不可用余额为当日未结算金额。</view>
							<view class="tit">提现</view>
							<view class="txt">1.必须需绑定支付宝钱包或微信钱包，预计两小时到账。
								<text class="links" @tap="navTo('../../account/authid/authid')">去绑定</text>  
							</view>
							<view class="txt">2.用户首次提现需设置支付密码</view>
							<view class="txt">要求：不能连续、不能重复的纯数字6位密码。</view> 
							<view class="txt">3.支付密码管理。
								<text class="links" @tap="navTo('../../payment/payment')">点击进入</text>
							</view>  
					</view>
				</uni-collapse-item>
				<uni-collapse-item title="订购销售" :show-animation="true">
					<view class="content">
						<view class="txt">今日出售商品需提前一天预定。</view> 
						<view class="txt">订购次日商品需先关闭营业。</view>
						<view class="tit">下单</view>
						<view class="txt">1.商户下单为固定时间如（9:20-11:20）</view>
						<view class="txt">4.点击将商品设置为本店的热门分类。</view>
						<view class="tit">确认收货</view>
						<view class="txt">1.请确保自己准确无误收货，即可查看当日库存。</view>
						<view class="txt">2.如未收到商品请及时联系<text class="links" @tap="navTo('../manage/manage')"> 区域经理</text></view>  
						<view class="tit">营业</view>
						<view class="txt">1.首先确认收货，才可开启营业</view>
						<view class="txt">2.每日允许开店一次，不可重复开店</view>
						<view class="txt">3.关闭营业的同时将清除店铺商品库存</view>
						<view class="txt">4.当日营业时间截止系统将自动关店并清除库存</view>
						<view class="tit">卫生</view>
						<view class="txt">1.我们将保证源头、生产、运输且在保质期内商品的安全卫生、可食用性。请您在收到商品时认真确认检查，如果疑问立即联系我们销毁或进行更换。</view>
						<view class="txt">2.如果因商家存储不当，导致食品变质，后果应由商家负责。</view>
						<view class="txt">3.请不要出售过期或即将变质的食品，以免造成食物中毒等事故发生，或引发不必要的麻烦。</view> 
						<view class="links"></view>
					</view>
				</uni-collapse-item> 
				<uni-collapse-item title="经营报表" :show-animation="true">
					<view class="content">
						<view class="tit">可视化收益支出一览无余</view> 
						<view class="txt">营业数据展示包括：收入统计、访客统计、收入趋势、访客趋势。可对比查看最近三日、三周、三个月的数据分析。</view>
						<view class="txt"><text class="bold">昨日：</text>日报以日为单位实施分析结算。</view> 
						<view class="txt"><text class="bold">上周：</text>周报以周为单位实施分析结算。</view> 
						<view class="txt"><text class="bold">上月：</text>月报以月为单位实施分析结算。</view> 
						<view class="txt">默认显示上一个结算周期的数据，如有当日、当周、当月的是数据不完整，无需担心，请耐心等待系统结算。</view>
					</view>
				</uni-collapse-item>
				<uni-collapse-item title="订制管理" :show-animation="true">
					<view class="content">
						<view class="txt">定制管理是针对顾客DIY订制早餐的服务，平台将订制产品暂放商家店铺，提供顾客到店取餐，且代收商家可获得分利。</view>
						<view class="tit">订制管理</view>
						<view class="txt">DIY早餐将在每早晨配送商家订单时，一同送达，商家需确认收货</view>
						<view class="tit">订制红包</view>
						<view class="txt">流程:到店取餐 > 顾客确认 > 商家扫描取餐码 > 完成订单 > 结算分润</view> 
					</view>
				</uni-collapse-item>
				
			</uni-collapse>
			
		</view>
	</view>
</template>

<script>
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse/uni-collapse-item.vue'
	
	export default {
		components: { 
			uniCollapse,
			uniCollapseItem, 
		},
		data() {
			return {
				
				
			}
		},
		methods: {
			navTo(url){
				uni.navigateTo({
					url:url
				})
			},
			
		}
	}
</script>

<style lang="scss" scoped>  
	#helper{
		width: 100vw;
	}
	.main{ 
		margin: 20rpx;
	}
	.content{
		padding: 20rpx 40rpx 40rpx 40rpx;
		font-size: 28rpx;
		line-height: 1.8;
		
		.tit{
			font-weight: bold;
			padding-top: 20rpx;
			padding-bottom: 12rpx;
		}
		.txt{
			
		}
		.links{
			color: #007AFF;
		}
		.bold{
			font-weight: bold;
		}
	}
</style>
