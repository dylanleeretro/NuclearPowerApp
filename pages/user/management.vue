<template>
	<view class="container">
		<uni-swipe-action v-for="(item,itemIndex) in memberdata" :key="itemIndex">
			<view class="memberList"></view>
			<uni-swipe-action-item :options="options" @click="deleteMember(item.id)">
				<view class="memberBox" @click="modifyMember(item.id)">
					<text>{{item.name}}</text>
					<text>{{item.phone}}</text>
				</view>
			</uni-swipe-action-item>
		</uni-swipe-action>
	</view>
</template>

<script>
	import {get,ajaxDelete} from "../../common/util.js"
	import {mapState} from 'vuex'
	import uniSwipeAction from '../../components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '../../components/uni-swipe-action-item/uni-swipe-action-item.vue'
	export default {
		data() {
			return {
				options: [{
					text: '确认',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				memberdata:[]
			}
		},
		onShow() {
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			this.getMemberlist();
		},
		onNavigationBarButtonTap(){
			uni.navigateTo({
				url: "/pages/user/addmember"
			})
		},
		components: {
			uniSwipeAction,
			uniSwipeActionItem
		},
		methods:{
			deleteMember:function(id){
				var that = this;
				ajaxDelete("api/user/"+id+"/", {
					success: (res) => {
						that.getMemberlist()
					}
				})
			},
			modifyMember:function(id){
				uni.navigateTo({
					url: "/pages/user/modify?id="+id
				})
			},
			getMemberlist:function(){
				var that = this;
				this.memberdata = []
				get("api/user/?page=1", {
					success: (res) => {
						for (var index in res.data.results) {
							that.memberdata.push({
								id: res.data.results[index].id,
								name: res.data.results[index].username,
								phone: res.data.results[index].mobile
							})
						}
						uni.hideLoading();
					}
				})
			}
		}
	}
</script>

<style>
	body {
		background-color: #f7f7f7;
	}
	.memberList{
		height: 30rpx;
	}
	.memberBox {
		display: flex;
		width: 100%;
		height: 100rpx;
		border-top: 1rpx solid #EEEEEE;
		border-bottom: 1rpx solid #EEEEEE;
	}

	.memberBox text {
		height: 100%;
		line-height: 100rpx;
		font-size: 32rpx;
		color: #333333;
	}
	.memberBox text:first-child{
		min-width: 250rpx;
		padding-left: 50rpx;
	}
</style>
