<template>
	<uni-popup ref="popup" type="center" :maskClick="false">
		<view class="tips">
			<view class="tips_title">{{tips}}</view>
			<btn-combo comfirmText="下架" @cancel="cancel" @confirm="confirm"></btn-combo>
		</view>
	</uni-popup>
</template>

<script>
	import UniPopup from '@/components/uni/uni-popup.vue'
	import BtnCombo from '@/components/store/btn-combo.vue'
	export default{
		name: 'TipsModel',
		components:{
			UniPopup,
			BtnCombo
		},
		props: {
			tips: {
				type: String,
				default: ''
			},
			open: {
				type: Boolean,
				default: false
			}
		},
		data(){
			return{
				opens: false
			}
		},
		methods: {
			cancel(){
				this.$refs.popup.close()
				this.$emit('cancel',false)
			},
			confirm(){
				this.$emit('confirm')
			}
		},
		watch: {
			open: {
				handler(val){
					if(val){
						this.$refs.popup.open()
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.tips{
		width: 540rpx;
		background-color: #FFFFFF;
		color: #000000;
		font-size: 26rpx;
		color: #333333;
		text-align: center;
		.tips_title{
			padding: 42rpx 0 52rpx;
		}
	}
</style>
