<template>
	<view class="container">
		<text class="warnText">基本信息</text>
		<view class="warnList">
			<view>
				<text class="warnTitle important">用户名</text>
				<input v-model="username" placeholder="请输入用户名" />
			</view>
			<view>
				<text class="warnTitle important">姓名</text>
				<input v-model="name" placeholder="请输入姓名" />
			</view>
			<view>
				<text class="warnTitle important">密码</text>
				<input v-model="password" type="password" placeholder="请输入密码" />
			</view>
			<view>
				<text class="warnTitle important">手机</text>
				<input v-model="mobile" placeholder="请输入手机" />
			</view>
			<view>
				<text class="warnTitle important">邮箱</text>
				<input v-model="email" placeholder="请输入邮箱" />
			</view>
			<view>
				<text class="warnTitle">出生日期</text>
				<picker mode="date" :value="date" class="picker" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="uni-input">{{date}}</view>
				</picker>
			</view>
			<view>
				<text class="warnTitle">性别</text>
				<picker @change="bindGenderchange" class="picker" :value="genderIndex" :range="genderName">
					<view class="uni-input" v-if="genderList.length">{{genderList[genderIndex].name}}</view>
					<view class="uni-input" v-else></view>
				</picker>
			</view>
		</view>
		<text class="addSubmit" @click="addMember" :style="{opacity: isActive?'1':'0.4'}">完成</text>
	</view>
</template>

<script>
	import {
		post
	} from "../../common/util.js"
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				username:'',
				name:'',
				password:'',
				mobile:'',
				email:'',
				gender:'',
				genderIndex: 0,
				genderName: ['请选择性别', '男', '女'],
				genderList: [{
						name: '请选择性别',
						id: ''
					},
					{
						name: '男',
						id: 'male'
					}, {
						name: '女',
						id: 'female'
					}
				],
				date: currentDate,
				isActive: false
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
			addSubmit(){
				var that = this;
				if (this.username&&this.name&&this.password&&this.mobile&&this.email) {
					that.isActive = true;
				} else {
					that.isActive = false;
				}
				return this.isActive
			}
		},
		methods: {
			addMember: function() {
				var that = this;
				post("api/user/", {
					username: this.username,
					name: this.name,
					password: this.password,
					mobile: this.mobile,
					email: this.email,
					birth_date: this.date,
					gender: this.gender
				}, {
					success: (res) => {
						uni.navigateBack()
					},
					fail: (err) => {
						uni.showToast({
							icon: 'none',
							title: '发送失败',
						});
					}
				})
			},
			bindGenderchange: function(e) {
				this.genderIndex = e.target.value;
				this.gender = this.genderList[this.genderIndex].id
			},
			bindDateChange: function(e) {
				this.date = e.target.value
			},
			getDate: function(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			}
		}
	}
</script>

<style>
	body {
		background-color: #f7f7f7;
	}

	.container {
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;
	}

	.warnText {
		height: 105rpx;
		padding-left: 50rpx;
		line-height: 105rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		border-bottom: 1rpx solid #EEEEEE;
	}

	.warnList>view {
		display: flex;
		align-items: center;
		height: 105rpx;
		font-size: 28rpx;
		color: #333333;
		border-bottom: 1rpx solid #EEEEEE;
	}

	.warnList input {
		width: 400rpx;
	}

	.warnTitle {
		padding-left: 50rpx;
		width: 250rpx;
		color: #777777;
	}

	.addSubmit {
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

	.important {
		background-image: url(../../static/important.png);
		background-repeat: no-repeat;
		background-size: 14rpx 14rpx;
		background-position: 30rpx 50%;
	}

	.picker view {
		width: 400rpx;
		height: 105rpx;
		line-height: 105rpx;
		color: #777777;
	}
</style>
