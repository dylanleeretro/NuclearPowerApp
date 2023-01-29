<template>
	<view class="container">
		<!-- <view>
			<button type="primary" @tap="fingerprint()" :disabled="disabled">按下开始识别指纹</button>
		</view> -->
		<view class="printSwitch">
			<text>指纹登录</text>
			<switch @change="switchChange" color="#4bc065" :disabled="disabled" :checked="checked"></switch>
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

	export default {
		data() {
			return {
				result: "",
				checked: false,
				disabled: true
			}
		},
		watch: {
			checked(val, oldVal) { //普通的watch监听
				console.log("a: " + val, oldVal);
			},
		},
		computed: mapState(['userid']),
		onLoad() {
			if (uni.getStorageSync("fingerPrint") == true) {
				this.checked = true;
			}
			this.fingerprint();
		},
		methods: {
			fingerprint: function() {
				// #ifdef APP-PLUS
				if (!plus.fingerprint.isSupport()) {
					plus.nativeUI.alert('此设备不支持指纹识别');
					this.disabled = true;
				} else if (!plus.fingerprint.isKeyguardSecure()) {
					plus.nativeUI.alert('此设备未设置密码锁屏，无法使用指纹识别');
					this.disabled = true;
				} else if (!plus.fingerprint.isEnrolledFingerprints()) {
					plus.nativeUI.alert('此设备未录入指纹，请到设置中开启');
					this.disabled = true;
				} else {
					this.disabled = false;
				}
				// #endif
				// #ifdef MP-WEIXIN
				this.disabled = false;
				plus.nativeUI.alert('请在微信真机中使用，模拟器不支持');
				// #endif
				// #ifndef APP-PLUS || MP-WEIXIN
				plus.nativeUI.alert('此平台不支持指纹识别');
				// #endif
			},
			switchChange: function(event) {
				var that = this;
				if (uni.getStorageSync("fingerPrint") == true) {
					uni.setStorageSync("fingerPrint", false);
				} else {
					if (uni.getStorageSync("isgestureLock") == true) {
						uni.showModal({
						    title: '提示',
						    content: '手势登录已打开,请先关闭手势登录',
							showCancel: false,
						    success: function (res) {
								that.checked = false;
								uni.navigateBack();
						    }
						});
					} else {
						var userid = this.userid;
						// #ifdef APP-PLUS
						plus.fingerprint.authenticate(function() {
							uni.showModal({
								title: '提示',
								content: '指纹登录已打开',
								showCancel: false,
								success: function(res) {
									uni.setStorageSync("fingerPrint", true);
									uni.navigateBack();
								}
							});
							/* plus.device.getInfo({
								success: function(e) {
									patch("api/user/" + userid + '/', {
										device_code: e.uuid
									}, {
										success: function(data) {
											if (data.statusCode.toString().substr(0, 1) == 2) {
												plus.nativeUI.closeWaiting(); //兼容Android平台关闭等待框
												plus.nativeUI.alert("指纹识别成功", function() {
													uni.navigateBack();
												});
											}
										}
									})
								}
							}); */
						}, function(e) {
							switch (e.code) {
								case e.AUTHENTICATE_MISMATCH:
									plus.nativeUI.toast('指纹匹配失败，请重新输入');
									this.checked = false;
									console.log(this.checked);
									break;
								case e.AUTHENTICATE_OVERLIMIT:
									plus.nativeUI.closeWaiting(); //兼容Android平台关闭等待框
									plus.nativeUI.alert('指纹识别失败次数超出限制，请使用其它方式进行认证');
									this.checked = false;
									break;
								case e.CANCEL:
									plus.nativeUI.toast('已取消识别');
									this.checked = false;
									break;
								default:
									plus.nativeUI.closeWaiting(); //兼容Android平台关闭等待框
									plus.nativeUI.alert('指纹识别失败，请重试');
									this.checked = false;
									break;
							}
						});
						// Android平台手动弹出等待提示框 
						if ('Android' == plus.os.name) {
							plus.nativeUI.showWaiting('指纹识别中...').onclose = function() {
								plus.fingerprint.cancel();
							}
						}
						// #endif

						// #ifdef MP-WEIXIN
						wx.startSoterAuthentication({
							requestAuthModes: ['fingerPrint'],
							challenge: '123456',
							authContent: '请用指纹解锁',
							success(res) {
								uni.showToast({
									title: '识别成功',
									mask: false,
									duration: 1500
								});
							}
						})
						// #endif
					}
				}
			}
		}
	}
</script>

<style>
	.printSwitch {
		display: flex;
		height: 105rpx;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		font-size: 32rpx;
		border-bottom: 1rpx solid #EEEEEE;
	}
</style>
