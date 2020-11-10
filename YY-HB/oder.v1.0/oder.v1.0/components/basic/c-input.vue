<template>
		<view class="c-input">  
			<input 
			 :focus="focus"
			 :type="inputType"
			 :value="value"
			 @input="onInput"
			 :placeholder="placeholder"
			 :password="type==='password' && !showPassword"
			 @focus="onFocus"
			 @blur="onBlur"
			 :maxlength="maxSize"
			 />
			 
			 <template v-if="clearable && !displayable && value.length"> 
				<view class="input-icon iconfont iconclose" @click="clear"></view>
			 </template>
			<template v-if="displayable"> 
				<view :style="{color:showPassword ?'#666666':'#cccccc'}"
				 class="input-icon iconfont iconeyes" @click="display"></view>
			</template> 
		</view>
</template>

<script> 
	
	export default { 
		props: { 
			type: String, 
			value: String, 
			placeholder: String, 
			clearable: {
				type: [Boolean, String],
				default: false
			}, 
			displayable: {
				type: [Boolean, String],
				default: false
			}, 
			focus: {
				type: [Boolean, String],
				default: false
			},
			maxSize:Number
		},
		model: {
			prop: 'value',
			event: 'input'
		},
		data(){
			return { 
				showPassword: false, 
				isFocus: false
				
			}
		},
		computed:{
			inputType() {
				const type = this.type
				return type === 'password' ? 'text' : type
			}
		},
		methods: {
			clear() {
				this.$emit('input', '')
			},
			display() {
				this.showPassword = !this.showPassword
			},
			onFocus() {
				this.isFocus = true
			},
			onBlur() {
				this.$nextTick(() => {
					this.isFocus = false
				})
			},
			onInput(e) {
				this.$emit('input', e.detail.value)
			}
		}
		 
	}
</script>

<style lang="scss">
	.c-input{   
		position: relative; 
		
		margin: 12rpx auto;
		padding: 12rpx 36rpx; 
		height: 80rpx; 
		width: 100%; 
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 40rpx;
		background-color: #F2F2F2;
		
		
		.input-icon{   
			margin-right: 0;
		}  
	}  
</style>
