<template>
	<view class="container">
		<image class="loginLogo" src="../../static/login_title.png"></image>
		<view class="loginContent">
			<text class="loginTitle">宁德海域风险生物预警平台</text>
			<!-- <text class="loginTitle">宁德核电冷源风险生物预警信息平台</text> -->
			<view class="loginBox">
				<view>
					<image src="../../static/login_username.png"></image>
				</view>
				<input v-model="username" class="username" placeholder="请输入用户名" />
			</view>
			<view class="loginBox">
				<view>
					<image src="../../static/login_password.png"></image>
				</view>
				<input v-model="password" class="password" type="password" placeholder="请输入密码" />
			</view>
			<text id="loginSubmit" :class="loginSubmit" @click="loginBind">登录</text>
		</view>
		<!-- <view class="loginContent2"></view>
		<view class="line">
			<view></view>
			<text>其他登录方式</text>
			<view></view>
		</view>
		<view class="otherLogin">
			<image @click="qqLogin" src="../../static/login_qq.png"></image>
			<image @click="weixinLogin" src="../../static/login_weixin.png"></image>
			<image @click="sinaLogin" src="../../static/login_sina.png"></image>
		</view> -->
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		getParams,
		post,
		showModals
	} from '../../common/util.js'
	export default {
		data() {
			return {
				username: "",
				password: "",
				isActive: false
			}
		},
		computed: {
			...mapState(['userName']),
			loginSubmit() {
				var that = this
				if (this.username.length <= 0 || this.password.length <= 0) {
					that.isActive = false;
				} else {
					that.isActive = true;
				}
				return this.isActive
			},
		},
		methods: {
			...mapMutations(['loginVuex']),
			loginBind: function() {
				if (!this.isActive) {
					return false;
				} else {
					post("login/", {
						username: this.username,
						password: this.password
					}, {
						success: (res) => {
							var loginList = [];
							uni.setStorageSync("token", res.data.token);
							uni.setStorageSync("userId", res.data.user.id);
							uni.setStorageSync("userName", res.data.user.name);
							uni.setStorageSync("userMobile", res.data.user.mobile);
							uni.setStorageSync("isSuperuser",res.data.user.is_superuser);
							loginList.push(res.data.token);
							loginList.push(res.data.user.id);
							loginList.push(res.data.user.name);
							loginList.push(res.data.user.mobile);
							loginList.push(res.data.user.is_superuser);
							this.loginVuex(loginList);
							uni.reLaunch({
								url: '../maps/maps?isLogin=true',
							});
						},
						fail: (err) => {
							uni.showToast({
								icon: 'none',
								title: '登陆失败',
							});
						}
					})
				}
			},
			qqLogin:function(){
				uni.login({
					provider: 'qq',
					success: function(loginRes) {
						console.log(loginRes.authResult);
					}
				});
			},
			weixinLogin:function(){
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log(loginRes.authResult);
					}
				});
			},
			sinaLogin:function(){
				uni.login({
					provider: 'sinaweibo',
					success: function(loginRes) {
						console.log(loginRes.authResult);
					}
				});
			},
		}
	}
</script>

<style>
	body {
		background-size: 100% 100vh;
		background-image: url("../../static/login_background.jpg");
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.loginLogo {
		width: 450rpx;
		height: 80rpx;
		margin-top: 276rpx;
		margin-bottom: 62rpx;
	}

	.loginContent {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 630rpx;
		height: 560rpx;
		border-radius: 30rpx;
		background-color: #FFFFFF;
	}

	.loginContent2 {
		position: absolute;
		width: 630rpx;
		height: 560rpx;
		top: 440rpx;
		right: 40rpx;
		background-color: #FFFFFF;
		border-radius: 30rpx;
		opacity: 0.5;
		z-index: -999;
	}

	.loginTitle {
		font-size: 32rpx;
		font-weight: bold;
		color: #d1524c;
		margin: 50rpx 0;
	}

	.loginBox {
		display: flex;
		align-items: center;
		width: 500rpx;
		height: 88rpx;
		margin-bottom: 30rpx;
		background-color: #ebeaf1;
	}

	.loginBox>view {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 88rpx;
		height: 88rpx;
		background-color: #e7e6ed;
	}

	.loginBox>input {
		font-size: 28rpx;
		padding: 20rpx;
	}

	.loginBox image {
		width: 32rpx;
		height: 32rpx;
	}

	#loginSubmit {
		width: 500rpx;
		height: 88rpx;
		text-align: center;
		line-height: 88rpx;
		margin-top: 10rpx;
		font-size: 30rpx;
		color: #FFFFFF;
		background-color: #d1524c;
	}
	
	.line{
		display: flex;
		width: 400rpx;
		justify-content: center;
		align-items: center;
		margin-top: 90rpx;
		opacity: 0.8;
	}
	
	.line text{
		padding: 0 30rpx;
		font-size: 30rpx;
		color: #FFFFFF;
	}
	
	.line view{
		flex-grow: 1;
		height: 1rpx;
		background-color: #FFFFFF;
	}
	
	.otherLogin{
		display: flex;
		width: 400rpx;
		margin-top: 50rpx;
	}
	
	.otherLogin image{
		flex-grow: 1;
		height: 90rpx;
		margin: 0 22rpx;
	}
</style>
