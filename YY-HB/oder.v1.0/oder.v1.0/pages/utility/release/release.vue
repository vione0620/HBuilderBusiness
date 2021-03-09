<template>
	<view style="padding-bottom: 140rpx;overflow: hidden;">
		<template v-if="isload">
			<default-page :load="true"></default-page>
		</template>
		<template v-if="isnohave">
			<default-page :nohave="true"></default-page>
		</template>
		<template v-if="isready">
			<view class="white-bg class-box">
				<scroll-view class="scroll-view-box" scroll-x="true" style="width: 98vw;">
					<block v-for="(categoryItem,index) in this.categorys" :key="index">
						<view class="item" :class="{ active: tabCurrentIndex === index }" @tap="tabClick(index,categoryItem.classNo)">{{categoryItem.className}}</view>
					</block>
				</scroll-view>
				<view class="small-class" v-for="(categoryItem,index) in this.categorys" :key="index" v-if="tabCurrentIndex === index">
					<view class="item" :class="{ active: smallTabCurrentIndex === index2 }" v-for="(categoryItemSmall,index2) in categoryItem.category"
					 @tap="tabClickSmall(index2,categoryItemSmall.categoryNo)">{{categoryItemSmall.categoryName}}</view>
				</view>
			</view>
			<!--end white-bg-->
			<view class="white-bg prolist-box">
				<checkbox-group @change="checkboxChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="item in items" :key="item.goodsNo">
						<view>
							<checkbox :value="item.goodsNo" :checked="checkedArr.includes(item.goodsNo)" class="uni-checkbox-input" />
							<!-- :value="String(item.value)" :checked="checkedArr.includes(String(item.value))" -->
						</view>
						<view>
							<image :src="item.goodsPic"></image>
						</view>
						<view>{{item.goodsName}}</view>
					</label>
				</checkbox-group>
			</view>
		</template>
		<view class="footer">
			<view class="flex-1">
				<checkbox-group @change="allChoose">
					<label>
						<checkbox value="all" :class="{'checked':allChecked}" :checked="allChecked?true:false"></checkbox> 全选(已选{{count}})
					</label>
				</checkbox-group>
			</view>
			<view><view class="btn" @click="addMerchGoods()">提交</view></view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex'
	import {
		b64Md5,
		hexMD5
	} from '@/network/md5.js'
	import {
		getSortAscii,
		arrayExclude,
		handleDate,
		handleYesterday,
	} from '@/common/util/utils.js'

	import UniPopup from '@/components/uni/uni-popup.vue'
	import UniNavBar from '@/components/uni/uni-nav-bar.vue'

	import BtnFoot from '@/components/basic/btn-foot.vue'
	import PopUp from '@/components/BuyMall/rk-pop.vue'
	import DefaultPage from '@/components/basic/default-page.vue'
	export default {
		data() {
			return {
				loginWhether: '', //登陆状态
				merchNo: '', //商户号
				isload: false,
				isnohave: false,
				isready: true,
				tabCurrentIndex: 0,
				smallTabCurrentIndex: 0,
				categorys: [], //分类列表
				categoryNo: "", //小类商品编号
				items: [],
				checkedArr: [], //
				allChecked: false, //是否全选
				count: 0, //选择条数
			}
		},
		onLoad() {
			this.loginWhether = uni.getStorageSync('status');
			this.merchNo = uni.getStorageSync('user').merchNo;
			this.getClassCategory();
		},
		methods: {
			//大分类tab点击
			tabClick(index, classNo) {
				this.tabCurrentIndex = index;
				this.classNo = classNo;
				this.categoryNo = this.categorys[index].category[0].categoryNo;
				this.smallTabCurrentIndex = 0;
				this.getCategoryGoods(this.categoryNo, this.onSale);

			},
			//小分类
			tabClickSmall(index, categoryNo) {
				this.smallTabCurrentIndex = index;
				this.categoryNo = categoryNo;
				this.getCategoryGoods(this.categoryNo);
				this.checkedArr=[];
			},
			//获取分类列表
			getClassCategory() {
				if(this.merchNo=='35110000000000'){
					let testDate = [{"classNo":"ZC000604","className":"早餐","category":[{"categoryNo":"YYZC000625","categoryName":"营养早餐"}]},{"classNo":"JSYP0608","className":"酒水饮品","category":[{"categoryNo":"JS00000642","categoryName":"酒水"},{"categoryNo":"YL00000641","categoryName":"饮料"}]},{"classNo":"NNHB0609","className":"牛奶烘焙","category":[{"categoryNo":"BGGD000644","categoryName":"饼干糕点"}]}]
					this.categorys = testDate;
					this.categoryNo = this.categorys[0].category[0].categoryNo;
					this.getCategoryGoods(this.categoryNo, this.onSale);
					return
				}
				let vVlue = {
					"merchNo": this.merchNo
				} //必传   
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post('getClassCategory', {
					...vVlue,
					"sign": sSign
				}, {
					token: true
				}).then(res => {
					this.$api.initPage(res.code, res.message)
					if (res.code === 200) {
						this.categorys = res.data;
						this.categoryNo = this.categorys[0].category[0].categoryNo;
						this.getCategoryGoods(this.categoryNo, this.onSale);
					}
				}).catch((err) => {
					uni.showToast({
						icon: 'none',
						title: err,
						duration: 2000
					})
				})
			},
			//获取小类商品(添加商户之前)
			getCategoryGoods(categoryNo) {
				if(this.merchNo=='35110000000000'){
					let testDate
					if(categoryNo == 'YYZC000625'){
						testDate = [{"goodsNo":"BZ0XRDB0000075","goodsPic":"http://res.yiyichina.cn/breakfast/6f55c7a2-41e5-4f45-a5dc-13a3f3252783.png","goodsName":"鲜肉大包"},{"goodsNo":"BZ0ZRBCB000076","goodsPic":"http://res.yiyichina.cn/breakfast/e5b4941a-6f7b-4676-a0d2-17b21e86cd5d.png","goodsName":"猪肉包菜包"},{"goodsNo":"BZ0JRJGB000077","goodsPic":"http://res.yiyichina.cn/breakfast/f1e5e5f3-d54a-439f-a06d-1b5e4c6f92c2.png","goodsName":"鸡肉菌菇包"},{"goodsNo":"BZ0JGQCB000078","goodsPic":"http://res.yiyichina.cn/breakfast/1ccf6efe-77a2-4efd-8863-051d193dbea6.png","goodsName":"菌菇青菜包"},{"goodsNo":"MD0HTMT0000079","goodsPic":"http://res.yiyichina.cn/breakfast/e87fddc7-8508-4d3e-9e09-13b615addcf1.png","goodsName":"红糖馒头"}]
					} else if (categoryNo == 'JS00000642') {
						testDate = [{"goodsNo":"BWPJBP00001491","goodsPic":"http://res.yiyichina.cn/JSYP0608/JS00000642/x1fAFYAB.jpg","goodsName":"百威啤酒冰啤500ml"},{"goodsNo":"KLNPJ000001492","goodsPic":"http://res.yiyichina.cn/JSYP0608/JS00000642/ZdTHX7iK.jpg","goodsName":"科罗娜啤酒330ml"},{"goodsNo":"XJTZPJ00001493","goodsPic":"http://res.yiyichina.cn/JSYP0608/JS00000642/twboUMHy.jpg","goodsName":"雪津特制啤酒330ml"},{"goodsNo":"XJLBPJ00001494","goodsPic":"http://res.yiyichina.cn/JSYP0608/JS00000642/yX6VHTID.png","goodsName":"雪津蓝冰啤酒330ml"},{"goodsNo":"LMPJ0000001495","goodsPic":"http://res.yiyichina.cn/JSYP0608/JS00000642/CwWuUTrB.jpg","goodsName":"蓝妹啤酒醇香浓郁330ml"}]
					} else {
						testDate = [{"goodsNo":"HSXXMBZX001514","goodsPic":"http://res.yiyichina.cn/NNHB0609/BGGD000644/7WnPXxdV.jpg","goodsName":"豪士小小面包整箱380g"},{"goodsNo":"DLYRSJ00001515","goodsPic":"http://res.yiyichina.cn/NNHB0609/BGGD000644/H5f3v55J.jpg","goodsName":"达利园瑞士卷160g"},{"goodsNo":"DLYFSRMB001516","goodsPic":"http://res.yiyichina.cn/NNHB0609/BGGD000644/lEiHQX1E.jpg","goodsName":"达利园法式软面包200g"}]
					}
					this.items = testDate;
					return
					
				}
				let vVlue = {
					"merchNo": this.merchNo,
					"categoryNo": categoryNo,
				} //必传   
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post('getCategoryGoods', {
					...vVlue,
					"sign": sSign
				}, {
					token: true
				}).then(res => {
					this.$api.initPage(res.code, res.message)
					if (res.code === 200) {
						this.items = res.data;
					}
				}).catch((err) => {
					uni.showToast({
						icon: 'none',
						title: err,
						duration: 2000
					})
				})
			},
			checkboxChange: function(e) {
				this.checkedArr = e.detail.value;
				this.count=this.checkedArr.length;
				// 如果选择的数组中有值，并且长度等于列表的长度，就是全选
				if (this.checkedArr.length > 0 && this.checkedArr.length == this.items.length) {
					this.allChecked = true;
				} else {
					this.allChecked = false;
				}
			},
			// 全选事件
			allChoose(e) {
				let chooseItem = e.detail.value;
				// 全选
				if (chooseItem[0] == 'all') {
					this.allChecked = true;
					for (let item of this.items) {
						let itemVal = item.goodsNo;
						if (!this.checkedArr.includes(itemVal)) {
							this.checkedArr.push(itemVal);
							this.count=this.checkedArr.length;
						}
					}
				} else {
					// 取消全选
					this.allChecked = false;
					this.checkedArr = [];
					this.count=0;
				}
			},
			//发布(添加)商品
			addMerchGoods(){
				if(this.checkedArr.length>0){
					let vVlue1 = {
						"goodsList":JSON.stringify(this.checkedArr),
						"merchNo": this.merchNo,
						
					} //必传 
					let sSort = getSortAscii(vVlue1) ///排序 
					//console.log(sSort);
					let sSigns = (sSort + "&key=" + this.loginWhether.md5key);
					console.log(sSigns);
					let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
					this.$request.post('addMerchGoods', {
						...vVlue1,
						"sign": sSign
					}, {
						token: true
					}).then(res => {
						this.$api.initPage(res.code, res.message)
						if (res.code === 200) {
							uni.showToast({
								mask: true,
								title: res.message
							});
							this.checkedArr = [];
						}
					}).catch((err) => {
						uni.showToast({
							icon: 'none',
							title: err,
							duration: 2000
						})
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '请选择商品',
						duration: 2000
					})
				}
		
			}
		}
	}
</script>

<style lang="scss">
	.white-bg {
		background: #fff;
	}
    ::-webkit-scrollbar {
    	display: none;
    	width: 0 !important;
    	height: 0 !important;
    	-webkit-appearance: none;
    	background: transparent;
    	color: transparent;
     }
	.footer {
		position: fixed;
		width: 100%;
		left: 0;
		bottom: 0;
		border-top: 2rpx solid #F4F4F4;
		display: flex;
		background: #fff;
		align-items: center;
		padding-bottom: 40rpx;
	}

	.footer .btn {
		background-color: #5DB55F;
		color: #fff;
		line-height: 70rpx;
		height: 70rpx;
		width: 160rpx;
		margin-right: 20rpx;
		border-radius: 10rpx;
		text-align: center;
	}
    
	.class-box {
		padding: 30rpx;

		.scroll-view-box .item {
			display: inline-block;
			padding: 0 30rpx 10rpx;
			color: #666;
			position: relative;
		}

		.scroll-view-box {
			white-space: nowrap;

			.item.active {
				color: #060606;
				font-weight: bold;
			}
		}

		.scroll-view-box .item.active::before {
			content: '';
			position: absolute;
			width: 50rpx;
			height: 6rpx;
			background: #5DB55F;
			left: 50%;
			margin-left: -25rpx;
			bottom: 0;
		}

		.small-class {
			display: flex;
			flex-wrap: wrap;

			.item {
				background: #F6F6F6;
				padding: 16rpx 20rpx 10rpx;
				color: #666;
				border-radius: 30rpx;
				font-size: 22rpx;
				margin-top: 30rpx;
				margin-right: 20rpx;

				&.active {
					color: #5DB55F;
					background: rgba(93, 181, 95, 0.2);
				}
			}

		}

	}

	.prolist-box {
		margin-top: 20rpx;
	}

	.uni-label-pointer {
		cursor: pointer;
		padding: 15px;
		display: flex;
		align-items: center;
	}

	.uni-label-pointer image {
		width: 148rpx;
		height: 148rpx;
		border-radius: 16rpx;
		margin-right: 20rpx;
	}
</style>
