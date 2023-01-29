<template>
	<view class="container">
		<text class="warnText">当前状态：应急已终止</text>
		<view class="warnList">
			<view>
				<text class="warnTitle">事件名称</text>
				<text>{{name}}</text>
			</view>
			<view>
				<text class="warnTitle">接报方式</text>
				<text>{{receiving_method}}</text>
			</view>
			<view>
				<text class="warnTitle">冷源名称</text>
				<text>{{cold_source_name}}</text>
			</view>
			<view>
				<text class="warnTitle">冷源范围</text>
				<text>{{event_range}}</text>
			</view>
			<view>
				<text class="warnTitle">经度</text>
				<text>{{lng}}</text>
			</view>
			<view>
				<text class="warnTitle">纬度</text>
				<text>{{lat}}</text>
			</view>
			<view>
				<text class="warnTitle">联系人</text>
				<text>{{reporter}}</text>
			</view>
			<view>
				<text class="warnTitle">联系电话</text>
				<text>{{contact_information}}</text>
			</view>
		</view>
		<text class="warnText download">报告下载</text>
		<view class="warnList">
			<view @click="watchDoc">
				<image class="docIcon" src="../../static/pic_doc.png"></image>
				<text class="warnTitle">监测方案</text>
				<image v-if="watch_doc" class="downloadIcon" src="../../static/download_doc.png"></image>
			</view>
			<view @click="diffusionDocx">
				<image class="docIcon" src="../../static/pic_doc.png"></image>
				<text class="warnTitle">漂移扩散报告</text>
				<image v-if="diffusion_docx" class="downloadIcon" src="../../static/download_doc.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		get
	} from "../../common/util.js"
	export default {
		data() {
			return {
				name: "",
				receiving_method: "",
				cold_source_name: "",
				event_range: "",
				lng: "",
				lat: "",
				watch_doc: "",
				diffusion_docx: "",
				reporter: "",
				contact_information: ""
			}
		},
		beforeCreate() {
			uni.showLoading({
				title: '加载中',
				mask: true
			});
		},
		created() {
			this.getSitedata();
		},
		mounted(){
			uni.hideLoading();
		},
		props: {
			eventId: String
		},
		methods: {
			getSitedata: function() {
				var that = this;
				get("api/forecast_event/" + that.eventId + "/", {
					success: (res) => {
						that.name = res.data.name;
						that.cold_source_name = res.data.cold_source_name;
						that.event_range = res.data.event_range;
						that.lng = res.data.lng;
						that.lat = res.data.lat;
						that.watch_doc = res.data.watch_doc;
						that.diffusion_docx = res.data.diffusion_docx;
						that.reporter = res.data.reporter;
						that.contact_information = res.data.contact_information;
						if(res.data.receiving_method == 'phone'){
							that.receiving_method = "电话";
						}else if(res.data.receiving_method == 'email'){
							that.receiving_method = "右键";
						}else if(res.data.receiving_method == 'self'){
							that.receiving_method = "自报";
						}
					}
				})
			},
			watchDoc: function() {
				var that = this;
				if (this.watch_doc) {
					uni.downloadFile({
						url: "http://140.206.129.162:8101/" + this.watch_doc,
						success: function(res) {
							var filePath = res.tempFilePath;
							uni.openDocument({
								filePath: filePath,
								success: function(res) {
									console.log('打开文档成功');
								}
							});
						}
					});
				}
			},
			diffusionDocx: function() {
				var that = this;
				if (this.diffusion_docx) {
					uni.downloadFile({
						url: "http://140.206.129.162:8101/" + this.diffusion_docx,
						success: function(res) {
							var filePath = res.tempFilePath;
							uni.openDocument({
								filePath: filePath,
								success: function(res) {
									console.log('打开文档成功');
								}
							});
						}
					});
				}
			}
		}
	}
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}

	.warnText {
		height: 105rpx;
		padding-left: 35rpx;
		line-height: 105rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		border-bottom: 1rpx solid #EEEEEE;
		background-color: #FFFFFF;
	}

	.download {
		margin-top: 20rpx;
	}

	.warnList {
		padding-left: 35rpx;
		background-color: #FFFFFF;
	}

	.warnList>view {
		display: flex;
		align-items: center;
		height: 105rpx;
		font-size: 28rpx;
		color: #333333;
		border-top: 1rpx solid #EEEEEE;
	}

	.warnList>view:first-child {
		border-top: none;
	}

	.warnTitle {
		width: 250rpx;
		color: #777777;
	}

	.inIcon {
		width: 12rpx;
		height: 26rpx;
		margin-left: auto;
		margin-right: 50rpx;
	}

	.docIcon {
		width: 50rpx;
		height: 50rpx;
		margin-right: 30rpx;
	}
	
	.downloadIcon{
		width: 28rpx;
		height: 28rpx;
		margin-left: auto;
		margin-right: 25rpx;
	}
</style>
