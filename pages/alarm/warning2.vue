<template>
	<view class="container">
		<text class="warnText">当前状态：预警响应</text>
		<view class="warnList">
			<radio-group @change="thisRadio">
				<label class="radio"><radio value="stage3" checked="true" />启动预案</label>
				<label class="radio"><radio value="stage5" />终止预案</label>
			</radio-group>
		</view>
		<text @click="postEvent" class="submit">下一步</text>
	</view>
</template>

<script>
	import {
		post,
		patch
	} from "../../common/util.js"
	export default {
		data() {
			return {
				stage:"stage3"
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
				uni.showLoading({
					title: '生成漂移扩散报告中',
					mask: true
				});
				var that = this;
				if(this.stage == 'stage3'){
					post("api/forecast_event/create_diffusion_docx/", {
						forecastevent: this.eventId,
					}, {
						success: (res) => {
							patch("api/forecast_event/"+this.eventId+"/", {
								is_started: this.stage
							}, {
								success: (res) => {
									uni.hideLoading();
									that.$emit("currentPage",that.stage)
								}
							})
						}
					})
				}else{
					patch("api/forecast_event/"+this.eventId+"/", {
						is_started: this.stage
					}, {
						success: (res) => {
							that.$emit("currentPage",that.stage)
						}
					})
				}
			},
			thisRadio:function(event){
				this.stage = event.target.value
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
	.radio{
		margin-right: 30rpx;
	}
	.radio radio{
		transform:scale(0.8);
	}
</style>
