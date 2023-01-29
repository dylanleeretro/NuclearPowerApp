<template>
	<view class="container">
		<view class="userInfo">
			<image src="../../static/user_logo.png"></image>
			<view class="userBox">
				<text>{{name}}</text>
				<text>{{mobile}}</text>
			</view>
		</view>
		<view class="userList">
			<view v-if="Superuser" @click="management">
				<image class="management" src="../../static/user_management.png"></image>
				<view>人员管理</view>
				<image class="inIcon" src="../../static/inIcon.png"></image>
			</view>
			<view @click="modify">
				<image class="modify" src="../../static/user_modify.png"></image>
				<view>信息修改</view>
				<image class="inIcon" src="../../static/inIcon.png"></image>
			</view>
			<view @click="gesture">
				<image class="management" src="../../static/user_gesture.png"></image>
				<view>手势登录</view>
				<image class="inIcon" src="../../static/inIcon.png"></image>
			</view>
			<view @click="fingerPrint">
				<image class="modify" src="../../static/user_fingerprint.png"></image>
				<view>指纹登录</view>
				<image class="inIcon" src="../../static/inIcon.png"></image>
			</view>
			<view @click="info">
				<image class="info" src="../../static/user_info.png"></image>
				<view>关于应用</view>
				<image class="inIcon" src="../../static/inIcon.png"></image>
			</view>
			<!-- <view>
				<image class="feedback" src="../../static/user_feedback.png"></image>
				<view>应用反馈</view>
				<image class="inIcon" src="../../static/inIcon.png"></image>
			</view> -->
		</view>
		<text @click="logoutBind" class="logout">退出登录</text>
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
				name:"",
				mobile:"",
				Superuser: false
			};
		},
		computed: mapState(['userName', 'token', 'userId','userMobile','isSuperuser']),
		onLoad() {
			this.name = this.userName;
			this.mobile = this.mobileRegular(this.userMobile);
			this.Superuser = this.isSuperuser
		},
		methods: {
			...mapMutations(['loginVuex', 'logoutVuex']),
			logoutBind: function() {
				var that = this;
				uni.showModal({
					title: '提示',
					content: '确认退出登录？',
					success: function(res) {
						if (res.confirm) {
							uni.clearStorageSync();
							that.logoutVuex();
							uni.navigateTo({
								url: '../login/login',
							})
						} else if (res.cancel) {
							return false
						}
					}
				});
			},
			mobileRegular:function(tel){
				tel = "" + tel;
				var reg=/(\d{3})\d{4}(\d{4})/;
				var mobile = tel.replace(reg, "$1****$2");
				return mobile;
			},
			management:function(){
				uni.navigateTo({
					url: "/pages/user/management"
				})
			},
			modify:function(){
				console.log(this.userId);
				uni.navigateTo({
					url: "/pages/user/modify?id="+this.userId
				})
			},
			gesture:function(){
				uni.navigateTo({
					url: "/pages/user/gesturelock"
				})
			},
			fingerPrint:function(){
				uni.navigateTo({
					url: "/pages/user/fingerprint"
				})
			},
			info:function(){
				uni.navigateTo({
					url: "/pages/user/info"
				})
			}
		}
	}
</script>

<style>
	body {
		background-color: #f7f7f7;
	}

	.userInfo {
		display: flex;
		height: 210rpx;
		align-items: center;
		margin-bottom: 30rpx;
		border-bottom: 1rpx solid #EEEEEE;
		background-color: #FFFFFF;
	}

	.userInfo image {
		width: 135rpx;
		height: 135rpx;
		margin-left: 50rpx;
		border-radius: 50%;
	}
	
	.userBox{
		display: flex;
		flex-direction: column;
		margin-left: 35rpx;
	}
	
	.userBox>text{
		line-height: 60rpx;
		font-size: 32rpx;
		color: #333333;
	}
	
	.userBox>text:first-child{
		font-weight: bold;
	}

	.userList {
		padding-left: 20rpx;
		border-top: 1rpx solid #EEEEEE;
		border-bottom: 1rpx solid #EEEEEE;
		background-color: #FFFFFF;
	}

	.userList>view {
		display: flex;
		align-items: center;
		height: 105rpx;
		font-size: 32rpx;
		color: #333333;
		border-top: 1rpx solid #EEEEEE;
	}

	.userList>view:first-child {
		border-top: none;
	}

	.userList>view>view {
		padding-left: 30rpx;
	}

	.management {
		width: 42rpx;
		height: 32rpx;
		padding: 0 18rpx;
	}

	.modify {
		width: 38rpx;
		height: 41rpx;
		padding: 0 20rpx;
	}

	.info {
		width: 38rpx;
		height: 36rpx;
		padding: 0 20rpx;
	}

	.feedback {
		width: 40rpx;
		height: 37rpx;
		padding: 0 19rpx;
	}

	.inIcon {
		width: 12rpx;
		height: 26rpx;
		margin-left: auto;
		margin-right: 50rpx;
	}

	.logout {
		display: block;
		height: 108rpx;
		line-height: 108rpx;
		text-align: center;
		margin-top: 30rpx;
		font-size: 32rpx;
		color: #d1524c;
		background-color: #FFFFFF;
		border-top: 1rpx solid #EEEEEE;
		border-bottom: 1rpx solid #EEEEEE;
	}
</style>
