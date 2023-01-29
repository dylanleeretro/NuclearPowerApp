<template>
	<view class="container">
		<view class="content" @click="document1()" v-for="(item,itemIndex) in formData" :key="itemIndex">
			<image src="../../static/pic_expert.png"></image>
			<text>{{item.name}}</text>
		</view>
	</view>
</template>

<script>
	import {
		post,
		get,
		getParams
	} from "../../common/util.js"
	export default {
		data() {
			return {
				formData:[]
			}
		},
		onLoad(){
			this.getMaterialdata();
		},
		methods: {
			getMaterialdata:function(){
				var that = this;
				getParams("api/material", {
					page:1
				}, {
					success: (res) => {
						for (var index in res.data.results) {
							that.formData.push({
								id:res.data.results[index].id,
								name:res.data.results[index].name
							})
						}
					}
				})
			},
			document1: function() {
				uni.navigateTo({
					url: "/pages/alarm/test"
				})
			},
			document2: function() {
				uni.openDocument({
					filePath: '../../static/document/document2.doc',
					success: function(res) {
						console.log('打开文档成功');
					}
				});
			},
		}
	}
</script>

<style>
	.container{
		margin-left: 40rpx;
	}
	.content{
		display: flex;
		align-items: center;
		padding: 40rpx 0;
		font-size: 30rpx;
		color: #333333;
		border-bottom: 1px solid #EEEEEE;
	}
	.content image{
		width: 56rpx;
		height: 56rpx;
		padding: 0 20rpx;
	}
</style>
