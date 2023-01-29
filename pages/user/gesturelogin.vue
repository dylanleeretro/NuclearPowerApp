<template>
	<view>
		<view>
			<view class="uni-text">{{text}}</view>
			<mpvue-gesture-lock :containerWidth="590" :cycleRadius="40" @end="onEnd" :password="password"></mpvue-gesture-lock>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import {
		patch
	} from '../../common/util.js'
	import mpvueGestureLock from '@/components/mpvueGestureLock';

	export default {
		components: {
			mpvueGestureLock
		},
		data() {
			return {
				title: "手势图案",
				password: [],
				rightStorage: false,
				text: '请输入手势',
				disabled: false,
				checked: false,
				showGesture: false
			}
		},
		computed: mapState(['userid']),
		onLoad() {
		},
		methods: {
			onEnd(data) {
				if (uni.getStorageSync('gestureLock') == data.join('')) {
					uni.switchTab({
						url: '../maps/maps',
					})
				} else {
					this.text = '手势输入错误,请重新输入'
				}
			}
		}
	}
</script>

<style>
	.uni-text {
		font-size: 36upx;
		text-align: center;
		margin: 250upx 0 80upx;
	}
</style>
