<template>
	<view class="container">
		<text class="title">模拟预警</text>
		<view class="menuBox">
			<view class="menuIcon">
				<image src="../../static/alarm_menu1.png" @click="openWarning"></image>
				<view>监测预警</view>
			</view>
			<!-- <view class="menuIcon">
				<image src="../../static/alarm_menu2.png"></image>
				<view>预测查询</view>
			</view> -->
		</view>
		<view class="splitLine"></view>
		<text class="title">应急资源</text>
		<view class="menuBox">
			<view class="menuIcon">
				<image src="../../static/alarm_menu3.png" @click="openExpert"></image>
				<view>应急专家</view>
			</view>
			<view class="menuIcon">
				<image src="../../static/alarm_menu4.png" @click="openAgency"></image>
				<view>应急机构</view>
			</view>
			<view class="menuIcon">
				<image src="../../static/alarm_menu5.png" @click="openMaterial"></image>
				<view>应急物资</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {
			openExpert: function() {
				uni.navigateTo({
					url: "/pages/alarm/alarmExpert"
				})
			},
			openAgency: function() {
				uni.navigateTo({
					url: "/pages/alarm/alarmAgency"
				})
			},
			openMaterial: function() {
				uni.navigateTo({
					url: "/pages/alarm/alarmMaterial"
				})
			},
			openWarning:function(){
				uni.navigateTo({
					url: "/pages/alarm/alarmWarning"
				})
			}
		}
	}
</script>

<style>
	.menuBox {
		display: flex;
		align-items: center;
	}

	.menuIcon {
		width: 190rpx;
		height: 200rpx;
	}

	.menuIcon image {
		display: block;
		width: 90rpx;
		height: 90rpx;
		margin: 30rpx auto 0;
	}

	.menuIcon view {
		display: block;
		margin-top: 20rpx;
		text-align: center;
		font-size: 28rpx;
		color: #333333;
	}
	
	.title{
		display: block;
		padding: 35rpx 0 0 40rpx;
		font-size: 34rpx;
		color: 272727;
	}
	
	.splitLine{
		height: 20rpx;
		background-color: #f7f7f7;
		border-top: 1rpx solid #EEEEEE;
		border-bottom: 1rpx solid #EEEEEE;
	}
</style>
