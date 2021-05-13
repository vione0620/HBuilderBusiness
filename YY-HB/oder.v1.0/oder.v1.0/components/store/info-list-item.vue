<template>
	<view class="info_item">
		<view class="title">
			<view v-if="must" class="must">*</view>
			<view class="text">{{title}}</view>
		</view>
		<view class="info">
			<block v-if="type!='class' && type!='status'">
				<input class="info_input" type="text" :value="value" @input="changeInput"/>
				<text v-if="type==='price'" class="unit">元</text>
				<text v-if="type==='stock'" class="unit">{{unit}}</text>
			</block>
			<block v-if="type==='class'">
				<text>{{value}}</text>
				<uni-icons type="forward" size="22" color="#999999"></uni-icons>
			</block>
			<block v-if="type==='status'">
				<stock-switch :defaultSwitch="value" :switchList="['上架','下架']" @change="changeSwitch"></stock-switch>
			</block>
		</view>
	</view>
</template>

<script>
	import UniIcons from '@/components/uni/uni-icons.vue'
	import StockSwitch from '@/components/store/stock-switch.vue'
	
	export default{
		components:{
			UniIcons,
			StockSwitch
		},
		props:{
			value: {
				type: [String, Number, Boolean],
				default: false
			},
			type: { //name，class，price，stock，status
				type: String,
				default: 'name'
			},
			title: { //左侧标题信息
				type: String,
				default: ''
			},
			must: { //是否为比选项
				type: Boolean,
				default: true
			},
			unit: { //库存单位信息
				type: String,
				default: ''
			}
		},
		methods:{
			changeSwitch(isSwitch){
				this.$emit('changeSwitch',isSwitch)
			},
			changeInput(e){
				this.$emit('changeInput',e.detail.value)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.info_item{
		font-size: 26rpx;
		color: #333333;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 36rpx 0;
		border-bottom: 1px solid #EEEEEE;
		.title{
			display: flex;
			align-items: center;
			position: relative;
			.must{
				position: absolute;
				left: 0;
				top: 8rpx;
				font-size: 54rpx;
				color: #FF6600;
			}
			.text{
				padding-left: 22rpx;
				font-weight: bold;
				color: #999999;
			}
		}
		.info{
			display: flex;
			align-items: center;
			text-align: right;
			.unit{	
				color: #999999;
				margin-left: 16rpx;
			}
		}
	}
</style>
