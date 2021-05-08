<template>
	<view class="wrap" style="overflow: hidden;">
		<uni-nav-bar :status-bar="true" :fixed="true" title="商品管理">
			<uni-icons slot="left" type="arrowleft" :size="isize" :color="icolor" @click="back"></uni-icons>
			<uni-icons slot="left" type="closeempty" size="38" :color="icolor" @click="close" style="margin-left: 70rpx;"></uni-icons>
			<uni-icons slot="right" type="search" :size="isize" :color="icolor" @click="search" style="margin-right: 29rpx;"></uni-icons>
			<uni-icons slot="right" type="more-filled" :size="isize" :color="icolor" @click="more"></uni-icons>
		</uni-nav-bar>
		<template>
			<view class="tab_box">
				<scroll-view class="scroll-tab-box" scroll-x="true" @scroll="scroll" :show-scrollbar="false">
					<block v-for="(tabItem,index) in tabs" :key="index">
						<view class="item" :class="{ active: tabIndex === index }" @tap="changeTab(index)">{{tabItem.tabName}}<text :class="{ item_num: tabIndex != index }">{{tabItem.num}}</text></view>
					</block>
				</scroll-view>
			</view>
			<view class="class_list">
				<view class="nav_left">
					<scroll-view class="scroll-class-box" scroll-y="true" @scroll="scroll" :show-scrollbar="false">
						<block v-for="(categorysItem,index) in categorys" :key="index">
							<view class="item" :class="{ active: tabCurrentIndex === index }" @tap="tabClick(index,categorysItem.classNo)">{{categorysItem.className}}</view>
						</block>
					</scroll-view>
				</view>
				<view class="goods-box">
					<view class="goods-info">
						<image class="goods-info-img" src="../../../static/noImg.png"></image>
						<view class="goods-info-items">
							<view class="goods-item-title">纯牛奶24X250ML</view>
							<view class="goods-item-stock">
								<text style="margin-right: 24rpx;">库存 100</text>
								<text>月售 100</text>
							</view>
							<view class="goods-item-price">￥22</view>
						</view>
					</view>
					<view class="goods-mode-btns">
						<view class="goods-mode-btn">价格</view>
						<view class="goods-mode-btn">库存</view>
						<view class="goods-mode-btn">下架</view>
						<view class="goods-mode-btn">编辑</view>
					</view>
				</view>
			</view>
		</template>
		<view class="nav-bottom">
			
		</view>
	</view>
</template>

<script>
	import UniNavBar from '@/components/uni/uni-nav-bar.vue'
	import UniIcons from '@/components/uni/uni-icons.vue'
	export default{
		components: {
			UniNavBar,
			UniIcons
		},
		data(){
			return{
				icolor: '#666666',
				isize: 26,
				old: {
					scrollTop: 0
				},
				tabIndex: 0, //顶部标签下标
				onSale: 0, //当前标签页面（全部或仓库...）
				tabCurrentIndex: 0, //大类选中标记
				smallTabCurrentIndex: 0,
				classNo: '', //大类编号
				tabs: [ //分类列表
					{
						tabName: '全部商品',
						num: 12
					},
					{
						tabName: '在售',
						num: 5
					},
					{
						tabName: '仓库',
						num: 7
					},
					{
						tabName: '已售罄',
						num: 0
					}
				],
				categorys: [
					{
						classNo: '001',
						className: '全部商品'
					},
					{
						classNo: '002',
						className: '当季热销'
					},
					{
						classNo: '003',
						className: '烘焙糕点'
					},
					{
						classNo: '004',
						className: '饮品酒水'
					},
					{
						classNo: '005',
						className: '休闲零食'
					},
					{
						classNo: '006',
						className: '乳品面包 '
					},
					{
						classNo: '007',
						className: '速食卤味'
					},
					{
						classNo: '008',
						className: '火锅专区'
					},
					{
						classNo: '009',
						className: '粮油调味'
					},
					{
						classNo: '010',
						className: '美容洗护'
					},
					{
						classNo: '011',
						className: '纸品家清'
					},
					{
						classNo: '012',
						className: '宠物生活 '
					},
					{
						classNo: '013',
						className: '母婴最爱'
					},
					{
						classNo: '014',
						className: '哇哇哇哇'
					},
					{
						classNo: '015',
						className: '呃呃呃呃 '
					},
				],
			}
		},
		methods:{
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			back() {
				uni.navigateBack({
					url: '../../utility/index/index'
				})
			},
			close(){
				uni.showToast({
					title: '点击了关闭'
				})
			},
			search(){
				uni.showToast({
					title: '点击了搜索'
				})
			},
			more(){
				uni.showToast({
					title: '点击了更多'
				})
			},
			changeTab(index){ //打标签点击
				this.tabIndex = index;
			},
			tabClick(index,classNo){
				this.tabCurrentIndex = index
				this.classNo = classNo
				console.log(this.classNo)
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 100vw;
		font-size: 26rpx;
		color: #333333;
	}
	.tab_box{
		width: 100vw;
		position: fixed;
		top: 168rpx;
		left: 0;
		z-index: 99;
		-webkit-overflow-scrolling: touch;   /*这句是为了滑动更顺畅*/
		background-color: #FFFFFF;
		padding: 15rpx 0;
		box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
		.scroll-tab-box{
			white-space: nowrap;
			.item {
				font-size: 28rpx;
				display: inline-block;
				padding: 15rpx 30rpx;
				position: relative;
				.item_num{
					color: #999999;
				}
			}
			.active {
				color: #4FB562;
				// font-weight: bold;
			}
			.active::before {
				content: '';
				position: absolute;
				width: 60rpx;
				height: 6rpx;
				background: #5DB55F;
				left: 50%;
				margin-left: -30rpx;
				bottom: 0;
			}
		}
	}
	.class_list{
		padding-top: 88rpx;
		display: flex;
		.nav_left{
			width: 160rpx;
			background-color: #FFFFFF;
		}
		.scroll-class-box{
			white-space: nowrap;
			height: 77vh;
			.item{
				text-align: center;
				padding: 36rpx 0;
				box-sizing: border-box;
				border-bottom: 1px solid #EEEEEE;
			}
			.active {
				color: #4FB562;
			}
		}
	}
	.goods-box{
		padding: 24rpx;
		flex-grow: 1; // flex布局下占据剩余宽度
		.goods-info{
			display: flex;
			.goods-info-img{
				width: 118rpx;
				height: 118rpx;
				border-radius: 10rpx;
			}
			.goods-info-items{
				margin-left: 15rpx;
				.goods-item-title{
					font-weight: bold;
					margin-bottom: 18rpx;
				}
				.goods-item-stock{
					font-size: 24rpx;
					color: #999999;
					margin-bottom: 18rpx;
				}
				.goods-item-price{
					color: #FF4C30;
				}
			}
		}
		.goods-mode-btns{
			display: flex;
			justify-content: space-between;
			margin-top: 20rpx;
			.goods-mode-btn{
				background-color: #FFFFFF;
				padding: 16rpx 36rpx;
				border-radius: 10rpx;
			}
		}
	}
</style>
