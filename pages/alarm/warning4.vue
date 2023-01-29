<template>
	<view class="container">
		<text class="warnText">当前状态：终止应急</text>
		<view class="warnList">
			<text>应急终止确认</text>
		</view>
		<text class="submit" @click="postEvent">下一步</text>
	</view>
</template>

<script>
	import {
		patch
	} from "../../common/util.js"
	export default {
		data() {
			return {
			}
		},
		beforeCreate() {
			uni.showLoading({
				title: '加载中',
				mask: true
			});
		},
		mounted(){
			uni.hideLoading();
		},
		props:{
			eventId:String
		},
		methods: {
			postEvent:function(){
				var that = this;
				uni.showModal({
				    title: '提示',
				    content: '确认终止应急？',
				    success: function (res) {
				        if (res.confirm) {
							patch("api/forecast_event/"+that.eventId+"/", {
								is_started: "stage5"
							}, {
								success: (res) => {
									that.$emit("currentPage","stage5")
								}
							})
				        } else if (res.cancel) {
							
				        }
				    }
				});
			}
		}
	}
</script>

<style>
	.container{
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;
	}
	.warnText{
		height: 105rpx;
		padding-left: 35rpx;
		line-height: 105rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		border-bottom: 1rpx solid #EEEEEE;
	}
	.warnList{
		padding: 35rpx;
		background-color: #FFFFFF;
		font-size: 28rpx;
	}
	.submit{
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		font-size: 34rpx;
		color: #FFFFFF;
		background-color: #d1524c;
	}
</style>
