<template>
	<view class="wrap" style="overflow: hidden;padding-bottom: 140rpx;">
		<uni-nav-bar :status-bar="true" :fixed="true" left-icon="arrowleft" @clickLeft="back()" color="#ffffff"
		 background-color="RGBA(70, 184, 91, 1)">
			<view class="navTagBar" v-for="(items,index) in navTag">
				<view class="title" :class="tabIndex === index ? 'active':''" @tap="changeTab(index)">{{items}}</view>
			</view>
			<view class="fb-btn" @tap="navToRelease()">+发布宝贝</view>
		</uni-nav-bar>

		<template v-if="isload">
			<default-page :load="true"></default-page>
		</template>
		<!-- <template v-if="isnohave">
			<default-page :nohave="true"></default-page>
		</template> -->
		<view class="plank-box" v-if="isnohave">
			<view style="text-align: center;">
				<image src="../../../static/bank/icon-plank.png"></image>
				<view>您的店铺没有出售中的宝贝~</view>
				<view @tap="navToRelease()" class="fb-btn1" v-if="isSalePage">发布宝贝</view>
			</view>
		</view>
		<template v-if="isready">
			<view>
				<view class="white-bg class-box">
					<scroll-view class="scroll-view-box" scroll-x="true" @scroll="scroll" style="width: 98vw;" show-scrollbar="false">
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
					<template>
						<scroll-view :scroll-y="isScroll" style="width: 100vw;padding-bottom: 150rpx;">
							<checkbox-group @change="checkboxChange">
								<block :key="index" v-for="(item, index) in dataList">
									<view :data-index="index" class="proitem" @touchstart="drawStart" @touchmove="drawMove" @touchend="drawEnd"
									 :style="{ right: item.right + 'rpx' }">
										<view style="display: flex;align-items: center;">
											<label class="uni-list-cell uni-list-cell-pd ">
												<view>
													<checkbox :value="item.goodsNo" :checked="checkedArr.includes(item.goodsNo)" />
												</view>
											</label>
										</view>
										<view>
											<image :src="item.goodsPic"></image>
										</view>
										<view style="padding-right: 30rpx;">
											<view class="input-box" style="padding-left: 0;;">
												<input style="padding-left: 8rpx;width: 100%;" class="uni-input nameinput" type="text" placeholder="请输入" :value="item.goodsName" @input="editName($event,index)"/>
											</view>
											<view class="input-box">
												<text>原&emsp;价</text>
												<text style="left: 100rpx;color: #020101; font-weight: 400;">￥</text>
												<input id="oldInput" type="number" :disabled = "loginType==2" class="uni-input" placeholder="请输入原价" v-model="item.goodsPrice" @input="clearInput($event,index)" />
												<icon id="oldIcon" type="clear" size="16" v-if="item.showClearIcon" @click="clearIcon($event,index)" />
											</view>
											<view class="input-box">
												<text>促销价</text>
												<text style="left: 100rpx;color: #020101; font-weight: 400;">￥</text>
												<input id="newInput" type="number" :disabled = "loginType==2" class="uni-input" placeholder="可填写促销价" v-model="item.promotePrice" @input="clearInput($event,index)" />
												<icon id="newIcon" type="clear" size="16" v-if="item.showClearIconTo" @click="clearIcon($event,index)" />
											</view>
											<view class="input-box">
												<text>库存</text>
												<span class="minu" @click="reduce(item)">-</span>
												<input id="storeInput" style="padding-left: 0" type="number" v-model="item.storeNum" class="kc" @input="clearInput($event,index)"/>
												<span class="add" @click="add(item)">+</span>
											</view>
										</view>
										<view class="remove" @click="delItem(item.goodsNo)">删除</view>
									</view>
								</block>
							</checkbox-group>
						</scroll-view>
					</template>
				</view>
				<!--end white-bg-->
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
			<view>
				<view  @click="downSaleGoods()" v-if="this.tabIndex==0" class="btn">下架</view>
				<view  @click="onSaleGoods()" v-if="this.tabIndex==1" class="btn">上架</view>
			</view>
			<view><view class="btn plain" plain="true" @click="changeMerchGoods()">修改</view></view>
		</view>
		<!--end footer-->
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
				categorys: [], //分类列表
				unOrderList: [],
				pages: 1,
				loadmore: '上拉加载更多',
				isload: false,
				isnohave: false,
				isSalePage: false,
				isready: true,
				navTag: ['出售中', '仓库中'],
				tabIndex: 0,
				scrollH: 0,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				tabCurrentIndex: 0,
				smallTabCurrentIndex: 0,
				delBtnWidth: 160,
				isScroll: true,
				windowHeight: 0,
				dataList: [],
				dataListCopy: [], //商品对比数组
				inputClearValue: '',
				showClearIcon: false,
				classNo: "", //大类编号
				categoryNo: "", //小分类编号
				onSale: 0, //0:出售 1:仓库
				checkedArr: [], //
				allChecked: false, //是否全选
				count: 0, //选择条数
				loginType: 0,
			}
		},
		onLoad() {
			this.loginWhether = uni.getStorageSync('status')
			this.merchNo = uni.getStorageSync('user').merchNo
			this.loginType = uni.getStorageSync('user').loginType
			uni.getSystemInfo({
				success: res => {
					this.scrollH = res.windowHeight
				}
			})
			this.$store.dispatch('get_coupon_id', '')
			this.$store.dispatch('get_cart_amt', '')
			// this.getClassCategory();
			this.getOnSaleClassCategory();
			var that = this;
			uni.getSystemInfo({
				success: function(res) {
					that.windowHeight = res.windowHeight;
				}
			});
		},
		computed: {
			...mapState(['userOrderList', 'userUnPayList', 'getCouponId', 'getCartAmt', 'getUnusualAmt', 'getUnusualNo',
				'canCredit'
			]),
			...mapGetters(['totalCount', 'totalPrice', 'prevOrderPrice']),


		},
		onShow() {},
		components: {
			UniPopup,
			UniNavBar,
			PopUp,
			BtnFoot,
			DefaultPage
		},

		methods: {
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			linktabindex(e) {
				this.tabIndex = e.detail.current
			},
			changeTab(index) {
				if (this.tabIndex === index) {
					return
				}
				this.tabIndex = index;
				this.onSale = index;
				this.dataList="";
				// 清除全选
				this.allChecked = false;
				this.checkedArr = [];
				this.count = 0;
				//大分类重置
				this.tabCurrentIndex = 0
				// 小标签重置
				this.smallTabCurrentIndex = 0;
				if(index===0){
					this.getOnSaleClassCategory();
				}
				if(index===1){
					this.getStoreClassCategory();
				}
			},
			//大分类tab点击
			tabClick(index, classNo) {
				this.tabCurrentIndex = index;
				this.classNo = classNo;
				this.categoryNo = this.categorys[index].category[0].categoryNo;
				// 小标签重置
				this.smallTabCurrentIndex = 0;
				// 清除全选
				this.allChecked = false;
				this.checkedArr = [];
				this.count = 0;
				this.getMerchCategoryGoods(this.categoryNo, this.onSale);

			},
			//小分类
			tabClickSmall(index, categoryNo) {
				this.smallTabCurrentIndex = index;
				this.categoryNo = categoryNo;
				// 清除全选
				this.allChecked = false;
				this.checkedArr = [];
				this.count = 0;
				this.getMerchCategoryGoods(this.categoryNo, this.onSale);
			},
			//获取分类列表
			getClassCategory() {
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
						this.getMerchCategoryGoods(this.categoryNo, this.onSale);
					}
				}).catch((err) => {
					uni.showToast({
						icon: 'none',
						title: err,
						duration: 2000
					})
				})
			},
			//获取仓库商品大小类 getStoreClassCategory
			getStoreClassCategory() {
				if(this.merchNo=='35110000000000'){
					let testDate = {
						"classStore":[
							{
								"classNo":"ZD000613",
								"className":"早点",
								"category":[
									{
										"categoryNo":"ZCSP000652",
										"categoryName":"早餐食品",
									},
								],
							},
							{
								"classNo":"XXLS0610",
								"className":"休闲零食",
								"category":[
									{
										"categoryNo":"XXLS000645",
										"categoryName":"休闲零食",
									},
								],
							},
							{
								"classNo":"JSYP0608",
								"className":"酒水饮品",
								"category":[
									{
										"categoryNo":"YL00000641",
										"categoryName":"饮料",
									},
								],
							},
						]}

					this.isSalePage = true
					this.isnohave = false
					this.categorys = testDate.classStore;
					this.categoryNo = this.categorys[0].category[0].categoryNo;
					this.getMerchCategoryGoods(this.categoryNo, this.onSale);
					return
				}
				let vVlue = {
					"merchNo": this.merchNo,
				} //必传   
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post('getStoreClassCategory', {
					...vVlue,
					"sign": sSign
				}, {
					token: true
				}).then(res => {
					this.$api.initPage(res.code, res.message)
					if (res.code === 200) {
						this.isSalePage = true
						// console.log(res.data.classStore);
						if(res.data.classStore.length==0){
							this.isnohave = true
						}
						else{
							this.isnohave = false
						}
						this.categorys = res.data.classStore;
						this.categoryNo = this.categorys[0].category[0].categoryNo;
						this.getMerchCategoryGoods(this.categoryNo, this.onSale);
					}
				}).catch((err) => {
					uni.showToast({
						icon: 'none',
						title: err,
						duration: 2000
					})
				})
			},
			//获取出售商品大小类
			getOnSaleClassCategory() {
				if(this.merchNo=='35110000000000'){
					let testDate = {"classOnSale":[{"classNo":"XXLS0610","className":"休闲零食","category":[{"categoryNo":"XXLS000645","categoryName":"休闲零食"}]},{"classNo":"JSYP0608","className":"酒水饮品","category":[{"categoryNo":"YL00000641","categoryName":"饮料"}]},{"classNo":"ZC000604","className":"早餐","category":[{"categoryNo":"YYZC000625","categoryName":"营养早餐"}]}],"categoryGoods":[{"goodsName":"阿尔卑斯多口味牛奶硬糖31g","goodsNo":"AEBSDKWN001563","goodsPrice":300,"onSale":0,"goodsPic":"http://res.yiyichina.cn/XXLS0610/XXLS000645/TnjYPbiS.jpg","storeNum":0},{"goodsName":"彩虹糖迷你桶罐-（装30g","goodsNo":"CHTMNTGZ001560","goodsPrice":550,"onSale":0,"goodsPic":"http://res.yiyichina.cn/XXLS0610/XXLS000645/qGWhioSf.jpg","storeNum":0},{"goodsName":"大白兔奶糖114g","goodsNo":"DBTNT000001562","goodsPrice":850,"onSale":0,"goodsPic":"http://res.yiyichina.cn/XXLS0610/XXLS000645/Xkrqlunn.jpg","storeNum":0}]}
					this.isSalePage = false
					this.isnohave = false;
					this.categorys = testDate.classOnSale;
					this.categoryNo = this.categorys[0].category[0].categoryNo
					this.getMerchCategoryGoods(this.categoryNo, this.onSale)
					return
				}
				
				let vVlue = {
					"merchNo": this.merchNo,
				} //必传   
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post('getOnSaleClassCategory', {
					...vVlue,
					"sign": sSign
				}, {
					token: true
				}).then(res => {
					this.$api.initPage(res.code, res.message)
					if (res.code === 200) {
						this.isSalePage = false
						// console.log(res.data.classOnSale);
						if(res.data.classOnSale.length==0){
							this.isnohave = true
						}
						else{
							this.isnohave = false;
						}
						this.categorys = res.data.classOnSale;
						this.categoryNo = this.categorys[0].category[0].categoryNo;
						this.getMerchCategoryGoods(this.categoryNo, this.onSale);
					}
				}).catch((err) => {
					uni.showToast({
						icon: 'none',
						title: err,
						duration: 2000
					})
				})
			},
			//获取商户小类商品（仓库或出售)
			getMerchCategoryGoods(categoryNo, onSale) {
				if(this.merchNo=='35110000000000'){
					let testDate
					if(categoryNo == 'XXLS000645'){
						testDate = [{"goodsName":"阿尔卑斯多口味牛奶硬糖31g","goodsNo":"AEBSDKWN001563","goodsPrice":300,"onSale":0,"goodsPic":"http://res.yiyichina.cn/XXLS0610/XXLS000645/TnjYPbiS.jpg","storeNum":0},{"goodsName":"彩虹糖迷你桶罐-（装30g","goodsNo":"CHTMNTGZ001560","goodsPrice":550,"onSale":0,"goodsPic":"http://res.yiyichina.cn/XXLS0610/XXLS000645/qGWhioSf.jpg","storeNum":0},{"goodsName":"大白兔奶糖114g","goodsNo":"DBTNT000001562","goodsPrice":850,"onSale":0,"goodsPic":"http://res.yiyichina.cn/XXLS0610/XXLS000645/Xkrqlunn.jpg","storeNum":0}]
					} else if (categoryNo == 'YL00000641') {
						testDate = [{"goodsName":"百事可乐（塑料瓶）500ml","goodsNo":"BSKLSLP0001456","goodsPrice":350,"onSale":0,"goodsPic":"http://res.yiyichina.cn/JSYP0608/YL00000641/T3vxfsKS.png","storeNum":2}]
					} else {
						testDate = [{"goodsName":"豆沙包","goodsNo":"BZ0DSB00000085","goodsPrice":250,"onSale":0,"goodsPic":"http://res.yiyichina.cn/breakfast/2a12ee69-7142-49f3-a30c-41ba9af2b3cc.png","storeNum":0},{"goodsName":"南瓜花生糖包","goodsNo":"BZ0HSTB0000086","goodsPrice":200,"onSale":0,"goodsPic":"http://res.yiyichina.cn/breakfast/44a0bbde-1411-4d9a-9acf-0dc601ab63c3.png","storeNum":0},{"goodsName":"菌菇青菜包3","goodsNo":"BZ0JGQCB000078","goodsPrice":300,"onSale":0,"goodsPic":"http://res.yiyichina.cn/breakfast/1ccf6efe-77a2-4efd-8863-051d193dbea6.png","storeNum":1}]
					}
					testDate.forEach((item, index) => {
						item.right = '0';
						item.showClearIcon = false;
						item.goodsPrice=(item.goodsPrice/100).toFixed(2);
					})
					this.dataList = testDate;
					return
				}
				
				let vVlue = {
					"merchNo": this.merchNo,
					"categoryNo": categoryNo,
					"onSale": onSale,
				} //必传   
				let sSort = getSortAscii(vVlue) ///排序 
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post('getMerchCategoryGoods', {
					...vVlue,
					"sign": sSign
				}, {
					token: true
				}).then(res => {
					this.$api.initPage(res.code, res.message)
					if (res.code === 200) {
						let resData = res.data;
						if (resData) {
							this.dataListCopy = []
							resData.forEach((item, index) => {
								item.right = '0';
								item.showClearIcon = false;
								item.goodsPrice=(item.goodsPrice/100).toFixed(2);
								item.promotePrice=(item.promotePrice/100).toFixed(2);
								let newObject = {
									"goodsName": item.goodsName,
									"goodsNo": item.goodsNo,
									"goodsPrice": Math.round((item.goodsPrice*100)).toString(),
									"promotePrice": Math.round((item.promotePrice*100)).toString(),
									"storeNum": item.storeNum.toString()
								}
								this.dataListCopy.push(newObject)
							})
							this.dataList = resData;
							this.dataList.forEach((item,index) => {
								if(item.promotePrice==0){
									item.promotePrice = null
								}
							})
						} else {
							this.isnohave = true
						}
					}
				}).catch((err) => {
					uni.showToast({
						icon: 'none',
						title: err,
						duration: 2000
					})
				})
			},
			servebtn() {
				// console.log('点击售后服务')
				uni.navigateTo({
					url: '../../aftersale/check'
				})

			},
			back() {
				uni.navigateBack({
					url: '../../utility/index/index'
				})
			},
			closePrev() {
				this.$refs.hasUnpaid.close()
			},
			drawStart: function(e) {
				var touch = e.touches[0];
				var index = e.currentTarget.dataset.index;
				var item = this.dataList[e.currentTarget.dataset.index];
				// console.log(touch);
				// console.log('item1', item);
				this.startX = touch.clientX;
				if (item.right > 0 && this.startX < 285) {
					this.dataList[index].right = 0;
				}
				for (let i = 0; i < this.dataList.length; i++) {
					// console.log("i", i);
					if (i != index) {
						// console.log("index2", index);
						this.dataList[i].right = 0;
					}
				}

			},
			drawMove: function(e) {
				var touch = e.touches[0];
				var item = this.dataList[e.currentTarget.dataset.index];
				var disX = this.startX - touch.clientX;

				if (disX >= 20) {
					if (disX > this.delBtnWidth) {
						disX = this.delBtnWidth;
					}
					this.isScroll = true;
					this.dataList[e.currentTarget.dataset.index].right = disX;
				} else {
					this.isScroll = true;
					this.dataList[e.currentTarget.dataset.index].right = 0;
				}
			},
			drawEnd: function(e) {
				// console.log("滑动结束");
				var item = this.dataList[e.currentTarget.dataset.index];
				// console.log(item);
				if (item.right >= this.delBtnWidth / 2) {
					this.isScroll = false;
					// console.log('1');
					this.dataList[e.currentTarget.dataset.index].right = this.delBtnWidth;
				} else {
					this.isScroll = true;
					// console.log('2');
					// console.log(item.right);
					this.dataList[e.currentTarget.dataset.index].right = 0;
				}
			},
			delItem: function(goodsNo) {
				var goodsNo = goodsNo;
				// console.log(goodsNo)
				this.clearGoods(goodsNo);
			},
			clearInput: function(event, index) {
				if(event.currentTarget.id == "oldInput"){
					if (event.target.value.length > 0) {
						this.dataList[index].showClearIcon = true;
						var itemVal=this.dataList[index].goodsNo;
						this.checkedArr.push(itemVal);
					} else {
						this.dataList[index].showClearIcon = false;
					}
					//正则表达试 只能输入两位小数
					event.target.value = (event.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
					//重新赋值给input
					this.$nextTick(() => {
						this.dataList[index].goodsPrice= event.target.value
					})
				} else if(event.currentTarget.id == "newInput") {
					if (event.target.value.length > 0) {
						this.dataList[index].showClearIconTo = true;
						var itemVal=this.dataList[index].goodsNo;
						this.checkedArr.push(itemVal);
					} else {
						this.dataList[index].showClearIconTo = false;
					}
					//正则表达试 只能输入两位小数
					event.target.value = (event.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
					//重新赋值给input
					this.$nextTick(() => {
						this.dataList[index].promotePrice= event.target.value
					})
				} else {
					//正则表达试 只能输入两位小数
					event.target.value = (event.target.value.match(/^\d*/g)[0]) || null
					//重新赋值给input
					this.$nextTick(() => {
						this.dataList[index].storeNum= event.target.value
					})
				}

			},
			//编辑名称
			editName: function(event, index) {
				this.dataList[index].goodsName = event.target.value;
				if (event.target.value.length > 0) {
					var itemVal=this.dataList[index].goodsNo;
					this.checkedArr.push(itemVal);
				}
			},
			clearIcon: function(event,index) {
				if(event.currentTarget.id == "oldIcon"){
					this.dataList[index].goodsPrice = '';
					this.dataList[index].showClearIcon = false;
				} else {
					this.dataList[index].promotePrice = '';
					this.dataList[index].showClearIconTo = false;
				}

			},
			checkboxChange: function(e) {
				this.checkedArr = e.detail.value;
				// console.log(this.checkedArr)
				this.count = this.checkedArr.length;
				// 如果选择的数组中有值，并且长度等于列表的长度，就是全选
				if (this.checkedArr.length > 0 && this.checkedArr.length == this.dataList.length) {
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
					for (let item of this.dataList) {
						let itemVal = item.goodsNo;
						if (!this.checkedArr.includes(itemVal)) {
							this.checkedArr.push(itemVal);
							this.count = this.checkedArr.length;
						}
					}
				} else {
					// 取消全选
					this.allChecked = false;
					this.checkedArr = [];
					this.count = 0;
				}
			},
			//商户商品上架（可批量
			onSaleGoods() {
				if(this.checkedArr.length === 0){
					uni.showToast({
						icon: 'none',
						title: '请选择要上架的商品',
						duration: 2000
					})
					return
				}
				let vVlue = {
					"goodsList": JSON.stringify(this.checkedArr),
					"merchNo": this.merchNo,
					"categoryNo": this.categoryNo,

				} //必传 
				let sSort = getSortAscii(vVlue) ///排序 
				//console.log(sSort);
				let sSigns = (sSort + "&key=" + this.loginWhether.md5key);
				// console.log(sSigns);
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post('onSaleGoods', {
					...vVlue,
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

			},
			//下架
			downSaleGoods() {
				if(this.checkedArr.length === 0){
					uni.showToast({
						icon: 'none',
						title: '请选择要下架的商品',
						duration: 2000
					})
					return
				}
				let vVlue = {
					"goodsList": JSON.stringify(this.checkedArr),
					"merchNo": this.merchNo,
					"categoryNo": this.categoryNo,

				} //必传 
				let sSort = getSortAscii(vVlue) ///排序 
				//console.log(sSort);
				let sSigns = (sSort + "&key=" + this.loginWhether.md5key);
				// console.log(sSigns);
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post('downSaleGoods', {
					...vVlue,
					"sign": sSign
				}, {
					token: true
				}).then(res => {
					this.$api.initPage(res.code, res.message)
					if (res.code === 200) {
						uni.showToast({
							mask: true,
							title: res.message
						})
						// setTimeout(() => {
						// 	uni.hideLoading()
						// }, 1000)
						this.checkedArr = [];
						setTimeout(()=>{
							this.getMerchCategoryGoods(this.categoryNo, this.onSale);
						},500)
					}
				}).catch((err) => {
					uni.showToast({
						icon: 'none',
						title: err,
						duration: 2000
					})
				})
			},
			//删除商品 clearGoods
			clearGoods(goodsNo) {
				let vVlue = {
					"goodsNo": goodsNo,
					"merchNo": this.merchNo,

				} //必传 
				let sSort = getSortAscii(vVlue) ///排序 
				//console.log(sSort);
				let sSigns = (sSort + "&key=" + this.loginWhether.md5key);
				// console.log(sSigns);
				let sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码   
				this.$request.post('clearGoods', {
					...vVlue,
					"sign": sSign
				}, {
					token: true
				}).then(res => {
					this.$api.initPage(res.code, res.message)
					if (res.code === 200) {
						uni.showToast({
							mask: true,
							title: res.message
						})
						this.checkedArr = [];
						uni.showLoading()
						setTimeout(()=>{ 
							uni.hideLoading()							
							this.getMerchCategoryGoods(this.categoryNo,this.onSale);
						},2000)
					}
				}).catch((err) => {
					uni.showToast({
						icon: 'none',
						title: err,
						duration: 2000
					})
				})
			},
			//减号
			reduce(item) {
				let num = item.storeNum
				if (num > 0) {
					num -= 1
				} else {
					num = 0
					return
				}
				item.storeNum = num;
				var itemVal=item.goodsNo;
				this.checkedArr.push(itemVal);
			},
			//加号
			add(item) {
				// console.log("storeNum", item.storeNum)
				let num = item.storeNum;
				item.storeNum = num + 1;
				var itemVal=item.goodsNo;
				this.checkedArr.push(itemVal);
			},
			//修改商户商品信息（可批量） changeMerchGoods
			changeMerchGoods() {
				if(this.checkedArr.length === 0){
					uni.showToast({
						icon: 'none',
						title: '请选择要修改的商品',
						duration: 2000
					})
					return
				}
				let newArr = [];
				let vVlue, vVlues, sSort, sSigns, sSign;
				this.postCheck().then((res) => {
					newArr = res
					this.dataListCopy.forEach((item1,index1)=>{
						newArr.forEach((item2,index2)=>{
							if(item1.goodsNo === item2.goodsNo){
								if(item1.goodsName === item2.goodsName)
									item2.goodsName = ""
								
								if(item1.goodsPrice === item2.goodsPrice)
									item2.goodsPrice = ""
		
								if(item1.storeNum === item2.storeNum)
									item2.storeNum = ""
									
								if(item1.promotePrice == item2.promotePrice)
									item2.promotePrice = ""
							}
						})
					})
					vVlue = {
						"goodsList": JSON.stringify(newArr),
						"merchNo": this.merchNo,
						"categoryNo": this.categoryNo,
					}
					vVlues = {
						"merchNo": this.merchNo,
						"categoryNo": this.categoryNo,
					}
					// } //必传 
					sSort = getSortAscii(vVlues) ///排序 
					sSigns = (sSort + "&key=" + this.loginWhether.md5key);
					sSign = hexMD5(sSort + "&key=" + this.loginWhether.md5key).toUpperCase() //转码
					
					uni.showLoading()
					this.$request.post('changeMerchGoods', {
						...vVlue,
						"sign": sSign
					}, {
						token: true
					}).then(res => {
						this.$api.initPage(res.code, res.message)
						if (res.code === 200) {
					
							uni.showToast({
								mask: true,
								title: res.message
							})
							this.checkedArr = [];
							setTimeout(()=>{
								uni.hideLoading()
								this.getMerchCategoryGoods(this.categoryNo,this.onSale);
							},2000)
							
						}
					}).catch((err) => {
						uni.hideLoading()
						uni.showToast({
							icon: 'none',
							title: err,
							duration: 2000
						})
					})
				}).catch(() => {})
			},
			//发布宝贝
			navToRelease(){
				uni.navigateTo({
				    url: '../release/release'
				});
			},
			postCheck(){
				return new Promise((resolve,reject)=>{
					let newArr = [];
					this.dataList.forEach((item, index) => {
						if (this.checkedArr.indexOf(item.goodsNo) > -1) {
							let newObject = {
								"goodsName": item.goodsName,
								"goodsNo": item.goodsNo,
								"goodsPrice": Math.round((item.goodsPrice*100)).toString(),
								"promotePrice": Math.round((item.promotePrice*100)).toString(),
								"storeNum": item.storeNum.toString()
							}
							newArr.push(newObject);
						}
					});
					newArr.forEach((item,index)=>{
						if(item.goodsPrice==0||item.goodsName==0){
							uni.showToast({
								icon: 'none',
								title: "请输入"+item.goodsName+"的价格",
								duration: 2000
							})
							reject()
						}
						let goodsPrice = parseInt(item.goodsPrice)
						let promotePrice = parseInt(item.promotePrice)
						if(goodsPrice<=promotePrice){
							uni.showToast({
								icon: 'none',
								title: item.goodsName+"的促销价不能大于原价",
								duration: 2000
							})
							reject()
						}
					});
					resolve(newArr)
				})
			},
		},
	}
</script>

<style lang="scss">
	page {
		width: 100vw;
	}
	::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
		color: transparent;
	  }
    .plank-box{
		position: fixed;
		width: 100%;
		height: 100%;
		top: 80rpx;
		left: 0;
		background-color: #F2F2F2;
		z-index: 997;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.plank-box image{
		display: inline-block;
		width: 369rpx;
		height: 164rpx;
		
		
	}
	.plank-box .fb-btn1{
		display: inline-block;
		width: 240rpx;
		margin: 20rpx auto;
	}
	.white-bg {
		background: #fff;
	}

	.navTagBar {
		width: 40%;
		text-align: center;

		&:last-child {
			text-align: left;
		}

		.title {
			color: #9ddeaa;
			font-size: 30rpx;
			// background-color: #F0AD4E;

		}

		.active {
			color: #FFFFFF;
			font-weight: 500;
		}
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

	.fb-btn {
		position: absolute;
		right: 30rpx;
		bottom: 22rpx;
		font-size: 24rpx;
		border: 2rpx solid #fff;
		padding: 6rpx 10rpx;
		line-height: normal;
		border-radius: 4rpx;
	}

	.prolist-box {
		margin-top: 20rpx;
	}

	.proitem {
		width: 100%;
		display: flex;
		position: relative;
		// align-items: center;
		padding: 20rpx 0 40rpx;
	}
	.proitem image {
		width: 192rpx;
		height: 192rpx;
		border-radius: 16rpx;
		margin-right: 20rpx;
	}

	.remove {
		width: 160rpx;
		height: 100%;
		background-color: red;
		color: white;
		position: absolute;
		top: 0;
		right: -160rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 99;
	}

	.uni-list-cell-pd {
		padding: 22rpx 30rpx;
		display: inline-block;
	}

	.input-box {
		position: relative;
		padding: 10rpx 20rpx 10rpx 110rpx;
	}

	.input-box text {
		position: absolute;
		left: 0;
		top: 14rpx;
		color: #999;
	}

	.input-box uni-input {
		width: 86%;
		border-bottom: 2rpx solid #E4E4E4;
		padding-left: 20rpx;
		// padding-bottom: 10rpx;
	}

	.input-box uni-icon {
		display: inline-block;
		font-size: 0;
		box-sizing: border-box;
		position: absolute;
		right: 20rpx;
		top: 14rpx;
	}

	.nameinput {
		background: #F4F4F4 url(../../../static/bank/icon-edit.png) no-repeat;
		background-size: 14rpx 16rpx;
		background-position: 98% 16rpx;
		padding: 6rpx 32rpx 6rpx 6rpx;
		height: auto;
	}

	.minu {
		width: 46rpx;
		height: 46rpx;
		line-height: 40rpx;
		border: 2rpx solid #E4E4E4;
		display: inline-block;
		text-align: center;
		font-size: 40rpx;
		position: absolute;
		left: 110rpx;
		top: 6rpx;
	}

	.add {
		width: 46rpx;
		height: 46rpx;
		line-height: 46rpx;
		border: 2rpx solid #E4E4E4;
		display: inline-block;
		text-align: center;
		font-size: 40rpx;
		position: absolute;
		left: 270rpx;
		top: 6rpx;
	}

	.input-box .kc {
		display: inline-block;
		width: 120rpx;
		height: 46rpx;
		line-height: 46rpx;
		padding-bottom: 0;
		border-width: 2rpx 0 2rpx 0;
		border-style: solid;
		border-color: #E4E4E4;
		position: absolute;
		left: 150rpx;
		top: 6rpx;
		text-align: center;
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

	.footer .btn ,.fb-btn1{
		background-color: #5DB55F;
		color: #fff;
		line-height: 70rpx;
		height: 70rpx;
		width: 160rpx;
		margin-right: 20rpx;
		border-radius: 10rpx;
		text-align: center;
	}
    .footer .btn.plain{
		border: 0;
		border-radius: 10rpx;
		background-color: #fff;
		border: 1px solid #5DB55F;
		color: #5DB55F;
	}

	.footer .uni-label-pointer {
		cursor: pointer;
		padding: 15px;
		display: flex;
		align-items: center;
	}
	uni-checkbox .uni-checkbox-input {
	    border-radius: 100rpx;
	}
</style>
