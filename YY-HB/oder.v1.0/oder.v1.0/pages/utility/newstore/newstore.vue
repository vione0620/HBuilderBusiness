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
				<view class="goods-right">
					<scroll-view class="scroll-goods-box" scroll-y="true" @scroll="scroll" :show-scrollbar="false">
						<view class="goods-box" v-for="(goodItem,index) in goodList" :key="index">
							<view class="goods-info">
								<image class="goods-info-img" src="../../../static/noImg.png"></image>
								<view class="goods-info-items">
									<view class="goods-item-title">{{goodItem.goodName}}</view>
									<view class="goods-item-stock">
										<text style="margin-right: 24rpx;">库存 {{goodItem.goodStore}}</text>
										<text>月售 {{goodItem.goodSale}}</text>
									</view>
									<view class="goods-item-price">￥{{goodItem.goodPrice}}</view>
								</view>
							</view>
							<view class="goods-mode-btns">
								<view class="goods-mode-btn" @click="modPrice(goodItem)">价格</view>
								<view class="goods-mode-btn" @click="modStock(goodItem)">库存</view>
								<view class="goods-mode-btn" @click="modOffshelf(goodItem)">下架</view>
								<view class="goods-mode-btn" @click="modEdit(goodItem)">编辑</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<view class="nav-bottom">
				<view v-for="(item,index) in tabPage" :key="index" class="nav-item" @click="navTo(item.path,item.navto)">
					<image class="nav-icon" :src="item.icon"></image>
					<view class="nav-text">{{item.text}}</view>
				</view>
			</view>
			<!-- 价格弹窗 -->
			<uni-popup ref="price" type="center" :maskClick="false">
				<view class="popup_edit_price">
					<view class="edit_title">调整商品价格</view>
					<view class="edit_item">
						<view class="edit_lable">现&emsp;价</view>
						<input class="edit_input" type="number" v-model="goodInfo.goodPrice"/>
						<text class="edit_unit">元</text>
					</view>
					<view class="edit_item" style="margin-bottom: 76rpx;">
						<view class="edit_lable">促销价</view>
						<input class="edit_input" type="number" v-model="goodInfo.goodPrice"/>
						<text class="edit_unit">元</text>
					</view>
					<btn-combo @cancel="closeModel" @confirm="closeModel"></btn-combo>
				</view>
			</uni-popup>
			<!-- 库存弹窗 -->
			<uni-popup ref="stock" type="center" :maskClick="false">
				<view class="popup_edit_price">
					<view class="edit_title">调整商品库存</view>
					<view class="edit_item">
						<view class="edit_lable">库&emsp;存</view>
						<view class="edit_btn">清零</view>
						<input class="edit_input" type="number" v-model="goodInfo.goodStore" style="width: 150rpx;"/>
						<text class="edit_unit">袋</text>
					</view>
					<view class="edit_item" style="margin-bottom: 76rpx;">
						<view class="edit_lable">自动补足</view>
						<input class="edit_input" type="number" />
						<evan-switch v-model="addAuto" :beforeChange="addAutofun" activeColor="#46B85B" :size="22"></evan-switch>
					</view>
					<btn-combo @cancel="closeModel" @confirm="closeModel"></btn-combo>
				</view>
			</uni-popup>
			<!-- 下架弹窗 -->
			<tips-model :tips="`是否要下架 ${goodInfo.goodName}`" :open="open" @confirm="closeModel" @cancel="open=false"></tips-model>
			<!-- <bottom-menu title="请选择录入方式" :open="menuOpen" :classList="classList" @click="meneClick" @cancel="menuOpen=false" ></bottom-menu> -->
			<!-- 编辑弹窗 -->
			<uni-popup ref="info" type="bottom" :maskClick="false">
				<view class="info_box">
					<view class="info_top">
						<view class="title">编辑商品</view>
						<view class="icon">
							<uni-icons type="trash" :size="22" color="#999999"></uni-icons>
							<text class="icon_text">删除</text>
						</view>
					</view>
					<view class="info_items">
						<info-list-item title="商品名称" v-model="goodInfo.goodName" @changeInput="changeInput"></info-list-item>
						<info-list-item title="商品类目" value="休闲零食>蛋糕糕点>麻薯" type="class"></info-list-item>
						<info-list-item title="现价" v-model="goodInfo.goodPrice" type="price"></info-list-item>
						<info-list-item :must="false" v-model="goodInfo.goodPrice" title="折扣价" value="27.9" type="price"></info-list-item>
						<info-list-item title="库存" v-model="goodInfo.goodStore" unit="件" type="stock"></info-list-item>
						<info-list-item title="上下架状态" :value="true" type="status" @changeSwitch="changeSwitch"></info-list-item>
						<view class="buttons">
							<btn-cancel type="cancel" color="#333333" @click="closeModel"></btn-cancel>
							<btn-cancel type="confirm"></btn-cancel>
						</view>
					</view>
				</view>
			</uni-popup>
		</template>
	</view>
</template>

<script>
	const tabPage = [
		{
			text: '管理分类',
			icon: '../../../static/storemanage.png',
			path: '',
			navto: ''
		},
		{
			text: '商品排序',
			icon: '../../../static/storetaxis.png',
			path: '',
			navto: ''
		},
		{
			text: '批量管理',
			icon: '../../../static/storebatch.png',
			path: '',
			navto: 'batch'
		},
		{
			text: '发布商品',
			icon: '../../../static/storeadd.png',
			path: '',
			navto: ''
		},
	]
	import UniNavBar from '@/components/uni/uni-nav-bar.vue'
	import UniIcons from '@/components/uni/uni-icons.vue'
	import UniPopup from '@/components/uni/uni-popup.vue'
	import BtnCombo from '@/components/store/btn-combo.vue'
	import TipsModel from '@/components/store/tips-model.vue'
	import EvanSwitch from '@/components/plugin-ui/evan-switch.vue'
	import BottomMenu from '@/components/store/bottom-menu.vue'
	import InfoListItem from '@/components/store/info-list-item.vue'
	import BtnCancel from '@/components/store/btn_cancel.vue'
	export default{
		components: {
			UniNavBar,
			UniIcons,
			UniPopup,
			BtnCombo,
			TipsModel,
			EvanSwitch,
			BottomMenu,
			InfoListItem,
			BtnCancel
		},
		data(){
			return{
				tabPage,
				icolor: '#666666',
				isize: 26,
				old: {
					scrollTop: 0
				},
				open: false,
				addAuto: false,
				tabIndex: 0, //顶部标签下标
				onSale: 0, //当前标签页面（全部或仓库...）
				tabCurrentIndex: 0, //大类选中标记
				smallTabCurrentIndex: 0,
				classNo: '', //大类编号
				goodInfo: {},
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
				goodList: [
					{
						goodName: '纯牛奶24X250ML',
						goodStore: '53',
						goodSale: '22',
						goodPrice: '60.50'
					},
					{
						goodName: '蒙牛纯甄12X200ML',
						goodStore: '23',
						goodSale: '55',
						goodPrice: '70.80'
					},
					{
						goodName: '特仑苏16X235ML',
						goodStore: '66',
						goodSale: '21',
						goodPrice: '75.40'
					},
					{
						goodName: '纯牛奶24X250ML',
						goodStore: '53',
						goodSale: '22',
						goodPrice: '60.50'
					},
					{
						goodName: '蒙牛纯甄12X200ML',
						goodStore: '23',
						goodSale: '55',
						goodPrice: '70.80'
					},
					{
						goodName: '特仑苏16X235ML',
						goodStore: '66',
						goodSale: '21',
						goodPrice: '75.40'
					},
					{
						goodName: '纯牛奶24X250ML',
						goodStore: '53',
						goodSale: '22',
						goodPrice: '60.50'
					},
					{
						goodName: '蒙牛纯甄12X200ML',
						goodStore: '23',
						goodSale: '55',
						goodPrice: '70.80'
					},
					{
						goodName: '特仑苏16X235ML',
						goodStore: '66',
						goodSale: '21',
						goodPrice: '75.40'
					},
					{
						goodName: '纯牛奶24X250ML',
						goodStore: '53',
						goodSale: '22',
						goodPrice: '60.50'
					},
					{
						goodName: '蒙牛纯甄12X200ML',
						goodStore: '23',
						goodSale: '55',
						goodPrice: '70.80'
					},
					{
						goodName: '特仑苏16X235ML',
						goodStore: '66',
						goodSale: '21',
						goodPrice: '75.40'
					},
					{
						goodName: '纯牛奶24X250ML',
						goodStore: '53',
						goodSale: '22',
						goodPrice: '60.50'
					},
					{
						goodName: '蒙牛纯甄12X200ML',
						goodStore: '23',
						goodSale: '55',
						goodPrice: '70.80'
					},
					{
						goodName: '特仑苏16X235ML',
						goodStore: '66',
						goodSale: '21',
						goodPrice: '75.40'
					}
				],
				classList: [
					{
						Stair: '编辑名称',
						Second: ''
					},
					{
						Stair: '添加二级分类',
						Second: ''
					},
					{
						Stair: '设为二级分类',
						Second: '类下已有二级分类，无法设置'
					},
					{
						Stair: '删除',
						Second: ''
					}
				]
			}
		},
		onLoad(){

		},
		methods:{
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			changeTab(index){ //顶部标签点击
				this.tabIndex = index;
			},
			tabClick(index,classNo){ //左侧标签点击
				this.tabCurrentIndex = index
				this.classNo = classNo
				console.log(this.classNo)
			},
			navTo(url,navto){
				if(navto){

				} else {
					// uni.navigateTo({
					// 	url:url,
					// 	animationType: 'pop-in',
					// 	animationDuration: 200
					// });
				}
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
			modPrice(item){
				this.goodInfo = item
				this.$refs.price.open()
			},
			modStock(item){
				this.goodInfo = item
				this.$refs.stock.open()
			},
			modOffshelf(item){
				this.goodInfo = item
				this.open = true
			},
			modEdit(item){
				this.goodInfo = item
				this.$refs.info.open()
			},
			addAutofun(){ // 自动补足按钮
				this.addAuto = !this.addAuto
			},
			closeModel(){ // 关闭所有弹窗
				this.$refs.price.close()
				this.$refs.stock.close()
				this.$refs.info.close()
				this.open = false
			},
			meneClick(index){
				console.log(index)
			},
			changeInput(val){
				console.log(val)
			},
			changeSwitch(isSwitch){
				console.log(isSwitch)
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
		height: 6vh;
		position: fixed;
		top: 168rpx;
		left: 0;
		z-index: 99;
		-webkit-overflow-scrolling: touch;   /*这句是为了滑动更顺畅*/
		background-color: #FFFFFF;
		padding: 15rpx 0;
		display: flex;
		align-items: center;
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
		padding-top: 6vh;
		display: flex;
		.nav_left{
			width: 160rpx;
			.scroll-class-box{
				white-space: nowrap;
				height: 76vh;
				background-color: #FFFFFF;
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
		.goods-right{
			padding: 0 24rpx;
			flex-grow: 1; // flex布局下占据剩余宽度
			.scroll-goods-box{
				white-space: nowrap;
				height: 76vh;
			}
			.goods-box{
				padding-bottom: 24rpx;
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
						padding: 16rpx 38rpx;
						border-radius: 10rpx;
					}
				}
			}
			.goods-box:nth-child(1){
				padding-top: 24rpx;
			}
			.goods-box:nth-last-child(1){
				padding-bottom: 48rpx;
			}
		}
	}
	.nav-bottom{
		width: 100vw;
		height: 8vh;
		display: flex;
		justify-content: space-around;
		padding: 20rpx 0;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99;
		background-color: #FFFFFF;
		.nav-item{
			.nav-icon{
				display: block;
				width: 30rpx;
				height: 30rpx;
				margin: 0 auto;
			}
			.nav-text{
				margin-top: 11rpx;
			}
		}
	}
	.popup_edit_price{
		width: 540rpx;
		background-color: #FFFFFF;
		color: #000000;
		font-size: 32rpx;
		position: relative;
		.edit_title{
			text-align: center;
			padding-top: 32rpx;
			padding-bottom: 60rpx;
		}
		.edit_item{
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 30rpx;
			.edit_lable{
				width: 4em;
			}
			.edit_btn{
				width: 100rpx;
				padding: 16rpx 0;
				text-align: center;
				color: #FF6600;
				border: 1px solid #EEEEEE;
				border-radius: 5px;
				font-size: 26rpx;
			}
			.edit_input{
				width: 186rpx;
				height: 64rpx;
				border: 1px solid #EEEEEE;
				border-radius: 5px;
				text-align: right;
				padding: 16rpx 26rpx;
				margin: 0 10rpx 0 16rpx;
			}
			.edit_unit{
				color: #999999;
				font-size: 24rpx;
			}
		}
	}
	.info_box{
		padding: 32rpx 36rpx;
		.info_top{
			display: flex;
			justify-content: space-between;
			.title{
				font-size: 32rpx;
				color: #000000;
			}
			.icon{
				color: #999999;
				display: flex;
				align-items: center;
			}
		}
		.info_items{
			padding: 36rpx 0 40rpx;
			.buttons{
				margin-top: 40rpx;
				display: flex;
				justify-content: space-between;
			}
		}
	}
</style>
