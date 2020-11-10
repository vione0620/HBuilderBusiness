<template>
	<view :style="[{ backgroundColor: checked ? bgColorChecked : bgColor }]" @click="onClick" class="uni-fav uni-fav--circle">
		<text :style="{color: checked ? fgColorChecked : fgColor}" class="uni-fav-text">{{ checked ? contentText.contentFav : contentText.contentDefault }}</text>
	</view>
</template>

<script> 

	/**
	 * Fav 收藏按钮
	 * @description 用于收藏功能，可点击切换选中、不选中的状态
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=864
	 * @property {Boolean} star = [true|false] 按钮是否带星星
	 * @property {String} bgColor 未收藏时的背景色
	 * @property {String} bgColorChecked 已收藏时的背景色
	 * @property {String} fgColor 未收藏时的文字颜色
	 * @property {String} fgColorChecked 已收藏时的文字颜色
	 * @property {Boolean} circle = [true|false] 是否为圆角
	 * @property {Boolean} checked = [true|false] 是否为已收藏
	 * @property {Object} contentText = [true|false] 收藏按钮文字
	 * @event {Function} click 点击 fav按钮触发事件
	 * @example <uni-fav :checked="true"/>
	 */
	export default {
		name: "UniFav", 
		props: {
			star: {
				type: [Boolean, String],
				default: true
			},
			bgColor: {
				type: String,
				default: "#eeeeee"
			},
			fgColor: {
				type: String,
				default: "#666666"
			},
			bgColorChecked: {
				type: String,
				default: "#FF0000"
			},
			fgColorChecked: {
				type: String,
				default: "#FFFFFF"
			},
			circle: {
				type: [Boolean, String],
				default: false
			},
			checked: {
				type: Boolean,
				default: false
			},
			contentText: {
				type: Object,
				default () {
					return {
						contentDefault: "标记热门",
						contentFav: "取消热门"
					};
				}
			}
		},
		watch: {
			checked() {
				if (uni.report) {
					if (this.checked) {
						uni.report("标记热门", "标记热门");
					} else {
						uni.report("取消热门", "取消热门");
					}
				}
			}
		},
		methods: {
			onClick() {
				this.$emit("click");
			}
		}
	};
</script>

<style scoped>
	.uni-fav {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 60px;
		height: 25px;
		line-height: 25px;
		text-align: center;
		border-radius: 3px;
	}

	.uni-fav--circle {
		border-radius: 30px;
	}

	.uni-fav-star {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		height: 25px;
		line-height: 24px;
		margin-right: 3px;
		align-items: center;
		justify-content: center;
	}

	.uni-fav-text {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		height: 25px;
		line-height: 25px;
		align-items: center;
		justify-content: center;
		font-size: 14px;
	}
</style>