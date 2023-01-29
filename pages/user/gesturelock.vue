<template>
	<view>
		<view class="gestureSwitch">
			<text>手势登录</text>
			<switch @change="gestureChange" color="#4bc065" :disabled="disabled" :checked="checked"></switch>
		</view>
		<view v-if="showGesture">
			<view class="uni-text">{{text}}</view>
			<mpvue-gesture-lock :containerWidth="590" :cycleRadius="40" @end="onEnd" :password="password"></mpvue-gesture-lock>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import {
		patch
	} from '../../common/util.js'
	import mpvueGestureLock from '@/components/mpvueGestureLock';

	export default {
		components: {
			mpvueGestureLock
		},
		data() {
			return {
				title: "手势图案",
				password: [],
				rightStorage: false,
				text: '请设定解锁手势',
				disabled: false,
				checked: false,
				showGesture: false
			}
		},
		computed: mapState(['userid']),
		onLoad() {
			if(uni.getStorageSync('gestureLock').length>0){
				this.text = '请输入已设定的解锁手势'
			}
			if(uni.getStorageSync("isgestureLock") == true && uni.getStorageSync('gestureLock').length>0){
				this.checked = true;
				this.showGesture = true;
			}
		},
		methods: {
			onEnd(data) {
				if(uni.getStorageSync('gestureLock').length<=0){
					if (this.password.length) {
						if (this.password.join('') === data.join('')) {
							this.text = '手势设定完成';
							uni.setStorageSync("gestureLock",this.password.join(""));
							uni.setStorageSync("isgestureLock",true);
							uni.navigateBack();
						} else {
							this.text = '两次手势设定不一致,请重新输入'
							this.password = []
						}
					} else {
						this.text = '请确认手势设定'
						this.password = data
					}
				}else{
					if(uni.getStorageSync('gestureLock') == data.join('') || this.rightStorage == true){
						if(this.rightStorage){
							if (this.password.length) {
								if (this.password.join('') === data.join('')) {
									this.text = '手势设定完成';
									uni.setStorageSync("gestureLock",this.password.join(""))
									uni.setStorageSync("isgestureLock",true);
									uni.navigateBack();;
								} else {
									this.text = '两次手势设定不一致,请重新输入'
									this.password = []
								}
							} else {
								this.text = '请确认手势设定'
								this.password = data
							}
						}else{
							this.text = '请重新设定手势'
							this.rightStorage = true;
						}
					}else if(uni.getStorageSync('gestureLock') != data.join('')){
						this.text = '原始手势错误'
					}
				}
			},
			gestureChange:function(){
				if(this.showGesture == true){
					uni.setStorageSync("isgestureLock",false);
					this.showGesture = false;
				}else{
					if(uni.getStorageSync("fingerPrint") == true){
						this.checked = false;
						uni.showModal({
						    title: '提示',
						    content: '指纹登录已打开,请先关闭指纹登录',
							showCancel: false,
						    success: function (res) {
								uni.navigateBack();
						    }
						});
					}else{
						this.showGesture = true;
						if(uni.getStorageSync('gestureLock').length>0){
							uni.setStorageSync("isgestureLock",true);
						}
					}
				}
			}
		}
	}
</script>

<style>
	.uni-text {
		font-size: 36upx;
		text-align: center;
		margin: 50upx 0 80upx;
	}
	
	.gestureSwitch{
		display: flex;
		height: 105rpx;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		font-size: 32rpx;
		border-bottom: 1rpx solid #EEEEEE;
	}
</style>
