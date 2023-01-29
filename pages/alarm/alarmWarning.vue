<template>
	<view>
		<view class="progressSelect">
			<text>应急事件：</text>
			<picker @change="bindEventchange" class="picker" :value="eventIndex" :range="eventName">
				<view class="uni-input" v-if="eventList.length">{{eventList[eventIndex].name}}</view>
				<view class="triangle">
					<image src="../../static/triangle.png"></image>
				</view>
			</picker>
		</view>
		<image class="addEvent" @click="addEvent" src="../../static/addEvent.png"></image>
		<warning1 @currentPage="currentPage" :eventId="eventId" v-if="startPage=='stage1'&&isRouterAlive"></warning1>
		<warning2 @currentPage="currentPage" :eventId="eventId" v-if="startPage=='stage2'&&isRouterAlive"></warning2>
		<warning3 @currentPage="currentPage" :eventId="eventId" v-if="startPage=='stage3'&&isRouterAlive"></warning3>
		<warning4 @currentPage="currentPage" :eventId="eventId" v-if="startPage=='stage4'&&isRouterAlive"></warning4>
		<warning5 @currentPage="currentPage" :eventId="eventId" v-if="startPage=='stage5'&&isRouterAlive"></warning5>
	</view>
</template>

<script>
	import {
		post,
		get,
		getParams
	} from "../../common/util.js"
	import warning1 from "../../pages/alarm/warning1.vue"
	import warning2 from "../../pages/alarm/warning2.vue"
	import warning3 from "../../pages/alarm/warning3.vue"
	import warning4 from "../../pages/alarm/warning4.vue"
	import warning5 from "../../pages/alarm/warning5.vue"
	export default {
		data() {
			return {
				isRouterAlive: true,
				page: 1,
				startPage: "",
				eventIndex: 0,
				eventId: "",
				eventName: [],
				eventList: []
			}
		},
		onLoad() {
			this.getEventdata();
		},
		components: {
			warning1,
			warning2,
			warning3,
			warning4,
			warning5
		},
		watch:{
			startPage(value){
				if(value == 'stage2'){
					this.getEventdata();
				}
			},
		},
		methods: {
			getEventdata: function() {
				this.eventName = [];
				this.eventList = [];
				get("api/forecast_event/", {
					success: (res) => {
						for (var index in res.data.results) {
							this.startPage = res.data.results[0].is_started;
							this.eventId = res.data.results[0].id;
							this.eventName.push(res.data.results[index].name);
							this.eventList.push({
								name: res.data.results[index].name,
								id: res.data.results[index].id,
								Page: res.data.results[index].is_started
							})
						}
					}
				})
			},
			bindEventchange: function(e) {
				this.eventIndex = e.target.value;
				this.eventId = this.eventList[this.eventIndex].id;
				if(this.startPage == this.eventList[this.eventIndex].Page){//page页面相同刷新，不同切换组件
					this.reload()
				}else{
					this.startPage = this.eventList[this.eventIndex].Page;
				}
			},
			reload:function() {
				this.isRouterAlive = false
				this.$nextTick(() => (this.isRouterAlive = true))
			},
			addEvent: function() {
				this.startPage = "stage1"
			},
			currentPage: function(page) {
				var that = this;
				this.startPage = page;
				for (var index in this.eventList) {
					that.eventList[that.eventIndex].Page = that.startPage;
				}
			}
		}
	}
</script>

<style>
	body {
		background-color: #f7f7f7;
	}

	.progressSelect {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 110rpx;
		line-height: 110rpx;
		margin-bottom: 20rpx;
		background-color: #FFFFFF;
	}

	.progressSelect>text {
		width: 25%;
		font-size: 28rpx;
		padding-left: 35rpx;
	}

	.picker {
		position: relative;
		width: 75%;
		height: 70rpx;
		line-height: 70rpx;
		padding: 0 20rpx;
		margin: 0 40rpx;
		border: 1px solid #EEEEEE;
		font-size: 30rpx;
		color: #777777;
		border-radius: 5rpx;
		overflow: hidden;
	}

	.triangle image {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 20rpx;
		height: 15rpx;
	}

	.addEvent {
		position: fixed;
		right: 20rpx;
		bottom: 250rpx;
		width: 100rpx;
		height: 100rpx;
	}
</style>
