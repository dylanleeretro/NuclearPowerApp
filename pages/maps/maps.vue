<template>
	<view class="container">
		<!-- <view class="navigationBar">
			<view class="menuIcon" @click="showDrawer">
				<image src="../../static/maps_menu.png"></image>
			</view>
			<view class="navText">宁德核电海域冷源威胁性</view>
		</view> -->
		<view class="page-body">
			<web-view src="../../hybrid/html/index.html"></web-view>
			<!-- <web-view src="http://47.92.231.220:8103/#/appview"></web-view> -->
			<!-- <view class="page-section page-section-gap">
				<map style="width: 100%; height: 100vh;" :latitude="latitude" :longitude="longitude" :markers="covers" :polyline="polyline"
				 :scale="scale">
				</map>
			</view> -->
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				isLogin: false,
				title: 'map',
				latitude: 31.229,
				longitude: 121.475,
				scale: 13,
				covers: [{
					latitude: 31.222,
					longitude: 121.446,
					iconPath: '../../../static/location.png'
				}, {
					latitude: 31.238,
					longitude: 121.497,
					iconPath: '../../../static/location.png'
				}],
				polyline: [{
					points: [{
							latitude: 31.222,
							longitude: 121.446,
						},
						{
							latitude: 31.288,
							longitude: 121.446,
						},
						{
							latitude: 31.544,
							longitude: 121.788,
						}
					],
					color: "#cdcdcd"
				}],
				webviewStyles: {
					progress: false
				}
			}
		},
		onLoad(option) {
			this.isLogin = Boolean(option.isLogin);
			if(this.isLogin == true){
				return false;
			}else{
				if (uni.getStorageSync("userName") && uni.getStorageSync("token") && uni.getStorageSync("userId") && uni.getStorageSync("userMobile")) {
					var loginList = [];
					loginList.push(uni.getStorageSync("token"));
					loginList.push(uni.getStorageSync("userId"));
					loginList.push(uni.getStorageSync("userName"));
					loginList.push(uni.getStorageSync("userMobile"));
					loginList.push(uni.getStorageSync("isSuperuser"));
					this.loginVuex(loginList);
					if(uni.getStorageSync("fingerPrint") == true){
						this.fingerprint();
					}else if(uni.getStorageSync("isgestureLock") == true){
						this.isgestureLock();
					}
				} else {
					uni.navigateTo({
						url: '../login/login',
					})
				}
			}
		},
		onShow() {
			var currentWebview = this.$mp.page.$getAppWebview() //获取当前页面的webview对象
			var wv = currentWebview.children()[0]
			wv.reload();
		},
		methods: {
			...mapMutations(['loginVuex','logoutVuex']),
			showDrawer: function() {
				uni.getSubNVueById('drawer').show('slide-in-left', 200);
			},
			isgestureLock:function(){
				uni.navigateTo({
					url: '../user/gesturelogin',
					animationType: 'slide-in-bottom'
				})
			},
			fingerprint: function() {
				var that = this;
				// #ifdef APP-PLUS
				plus.fingerprint.authenticate(function() {
				}, function(e) {
					switch (e.code) {
						case e.AUTHENTICATE_MISMATCH:
							plus.nativeUI.toast('指纹匹配失败，请重新输入');
							break;
						case e.AUTHENTICATE_OVERLIMIT:
							plus.nativeUI.closeWaiting(); //兼容Android平台关闭等待框
							plus.nativeUI.alert('指纹识别失败次数超出限制，请使用其它方式进行认证');
							break;
						case e.CANCEL:
							plus.nativeUI.toast('已取消识别');
							that.logoutBind();
							break;
						default:
							plus.nativeUI.closeWaiting(); //兼容Android平台关闭等待框
							plus.nativeUI.alert('指纹识别失败，请重试');
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
			},
			logoutBind: function() {
				var that = this;
				uni.clearStorageSync();
				that.logoutVuex();
				uni.navigateTo({
					url: '../login/login',
				})
			},
		},
	}
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100vh;
	}

	.navigationBar {
		display: flex;
		width: 100%;
		height: 11vh;
		background-color: #d1524c;
	}

	.menuIcon {
		padding-top: 60rpx;
		padding-left: 40rpx;
	}

	.menuIcon image {
		width: 40rpx;
		height: 28rpx;
	}

	.navText {
		padding-top: 65rpx;
		padding-left: 20rpx;
		font-size: 32rpx;
		color: #FFFFFF;
	}
</style>
