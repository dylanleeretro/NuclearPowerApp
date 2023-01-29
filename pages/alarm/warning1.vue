<template>
	<view class="container">
		<text class="warnText">当前状态：事件接报</text>
		<view class="warnList">
			<view>
				<text class="warnTitle important">事件名称</text>
				<input v-model="name" placeholder="请输入事件名称" />
			</view>
			<view>
				<text class="warnTitle">接报方式</text>
				<picker @change="bindEventchange" class="picker" value="eventIndex" :range="eventName">
					<view class="uni-input" v-if="eventList.length">{{eventList[eventIndex].name}}</view>
					<view class="triangle">
						<image src="../../static/triangle.png"></image>
					</view>
				</picker>
			</view>
			<view>
				<text class="warnTitle important">风险生物</text>
				<input v-model="cold_source_name" placeholder="请输入风险生物" />
			</view>
			<view>
				<text class="warnTitle">分布范围</text>
				<input v-model="event_range" placeholder="请输入分布范围" />
			</view>
			<view>
				<text class="warnTitle">经度</text>
				<input v-model="lng" type="number" placeholder="请输入经度" />
			</view>
			<view>
				<text class="warnTitle">纬度</text>
				<input v-model="lat" type="number" placeholder="请输入纬度" />
			</view>
			<view>
				<text class="warnTitle">报告人</text>
				<input v-model="poster" placeholder="请输入报告人" />
			</view>
			<view>
				<text class="warnTitle">联系方式</text>
				<input v-model="tel" type="number" placeholder="联系方式" />
			</view>
		</view>
		<text class="submit" @click="postEvent" :style="{opacity: isColor?'1':'0.4'}">下一步</text>
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
				eventIndex:0,
				name:"",
				receiving_method:"phone",
				cold_source_name:"",
				event_range:"",
				poster:"",
				tel:"",
				lng:"",
				lat:"",
				isColor:false,
				eventName:["电话","邮件","自报"],
				eventList:[{
					name:"电话",
					id:"phone"
				},{
					name:"邮件",
					id:"email"
				},{
					name:"自报",
					id:"self"
				}]
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
		watch:{
			name(value){
				this.buttonColor();
			},
			cold_source_name(value){
				this.buttonColor();
			},
			event_range(value){
				this.buttonColor();
			},
			poster(value){
				this.buttonColor();
			},
			tel(value){
				this.buttonColor();
			},
			lng(value){
				this.buttonColor();
				var that = this;
				if(value<-180||value>180){
					uni.showModal({
					    title: '提示',
					    content: '请输入有效值（-180至180）',
						showCancel:false,
					    success: function () {
							that.lng = "";
							return false
					    }
					});
				}
			},
			lat(value){
				this.buttonColor();
				var that = this;
				if(value<-180||value>180){
					uni.showModal({
					    title: '提示',
					    content: '请输入有效值（-180至180）',
						showCancel:false,
					    success: function () {
							that.lat = "";
							return false
					    }
					});
				}
			},
		},
		methods: {
			bindEventchange: function(e) {
				this.eventIndex = e.target.value;
				this.receiving_method = this.eventList[this.eventIndex].id
			},
			buttonColor:function(){
				if(this.name && this.cold_source_name && this.event_range && this.lng && this.lat && this.poster && this.tel){
					this.isColor = true;
				}else{
					this.isColor = false;
				}
			},
			postEvent:function(){
				var that = this;
				if(this.isColor){
					post("api/forecast_event/", {
						item:[],
						name:this.name,
						receiving_method: this.receiving_method,
						cold_source_name: this.cold_source_name,
						event_range: this.event_range,
						lng: this.lng,
						lat: this.lat,
						reporter: this.poster,
						contact_information: this.tel,
						is_started: "stage2"
					}, {
						success: (res) => {
							that.$emit("currentPage","stage2")
						}
					})
				}
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
		background-color: #FFFFFF;
	}
	.warnList>view{
		display: flex;
		align-items: center;
		height: 105rpx;
		font-size: 28rpx;
		color: #333333;
		border-top: 1rpx solid #EEEEEE;
	}
	.warnList>view:first-child{
		border-top: none;
	}
	.warnTitle{
		padding-left: 35rpx;
		width: 250rpx;
		color: #777777;
	}
	.inIcon{
		width: 12rpx;
		height: 26rpx;
		margin-left: auto;
		margin-right: 50rpx;
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
	.picker{
		border: none;
	}
	.important{
		background-image: url(../../static/important.png);
		background-repeat: no-repeat;
		background-size: 14rpx 14rpx;
		background-position: 15rpx 50%;
	}
</style>
