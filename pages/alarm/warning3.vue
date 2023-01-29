<template>
	<view class="container">
		<text class="warnText">当前状态：应急监测</text>
		<view class="warnList">
			<view>
				<text class="warnTitle important">监测频率</text>
				<input type="number" v-model="frequency" placeholder="请输入监测频率" />
			</view>
			<view>
				<text class="warnTitle">监测参数</text>
				<!-- <view class="warnParameter" >
					<text>{{item.name}}</text>
				</view> -->
				<scroll-view class="warnParameter" scroll-x="true">
					<view class="warnContent">
						<view v-for="(item,itemIndex) in checkboxArr" :key="itemIndex">
							<text :id="item.id" @click="deleteParameter">{{item.name}}</text>
							<image :id="item.id" @click="deleteParameter" class="warnDelete" src="../../static/deleteParameter.png"></image>
						</view>
					</view>
				</scroll-view>
				<image @click="openPop1" class="addParameter" src="../../static/addParameter.png"></image>
			</view>
		</view>
		<view class="addSite">
			<text class="siteTitle">监测站点</text>
			<text class="siteAdd" @click="openPop2">新增监测站点</text>
		</view>
		<view class="siteForm">
			<view class="formTitle">
				<view>站点名称</view>
				<view>经度</view>
				<view>纬度</view>
				<view>操作</view>
			</view>
			<view v-for="(item,itemIndex) in siteData" :key="itemIndex" class="formContent">
				<view>{{item.name}}</view>
				<view>{{item.lng}}</view>
				<view>{{item.lat}}</view>
				<view>
					<image @click="openPop2(item.id,item.name,item.lng,item.lat)" class="siteEdit" src="../../static/siteEdit.png"></image>
					<image @click="deleteSite" :id="item.id" class="siteDelete" src="../../static/siteDelete.png"></image>
				</view>
			</view>
		</view>
		<view class="submit">
			<text class="eventSubmit" :style="{opacity: isActive?'1':'0.4'}" @click="postEvent">下一步</text>
		</view>
		<uni-popup ref="popup1" type="center" maskClick="false">
			<scroll-view class="popupScroll" scroll-y="true">
				<view class="popupCenter">
					<checkbox-group v-for="(item,itemIndex) in Parameter" :key="itemIndex">
						<checkbox @click="checkBox($event, item)" :checked="item.checked" :value="item.id">{{item.name}}</checkbox>
					</checkbox-group>
				</view>
			</scroll-view>
			<view class="tipButton">
				<view @click="cancelPop1">取消</view>
				<view @click="submitCheckbox">确认</view>
			</view>
		</uni-popup>
		<uni-popup ref="popup2" type="center" maskClick="false">
			<view class="popupSite">
				<view>
					<text>站点名称:</text>
					<input v-model="siteName" placeholder="请输入站点名称"/>
				</view>
				<view>
					<text>经度:</text>
					<input v-model="siteLng" type="number" placeholder="请输入经度"/>
				</view>
				<view>
					<text>纬度:</text>
					<input v-model="siteLat" type="number" placeholder="请输入纬度"/>
				</view>
			</view>
			<view class="tipButton">
				<view @click="cancelPop2">取消</view>
				<view @click="submitSite">确认</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		post,
		get,
		getParams,
		patch,
		ajaxDelete
	} from "../../common/util.js"
	import uniPopup from "../../components/uni-popup/uni-popup.vue"
	export default {
		data() {
			return {
				Parameter:[],
				siteData:[],
				checkboxArr:[],
				frequency:"",
				siteId:"",
				siteName:"",
				siteLng:"",
				siteLat:"",
				isPatchsite:false,
				isActive:false
			}
		},
		components: {
			uniPopup
		},
		beforeCreate() {
			uni.showLoading({
				title: '加载中',
				mask: true
			});
		},
		created() {
			this.getParameter();
			this.getSitedata();
			this.getCurrenttime();
		},
		mounted(){
			uni.hideLoading();
		},
		updated() {
			uni.hideLoading()
		},
		props:{
			eventId:String
		},
		computed: {
			eventSubmit() {
				var that = this
				if (this.frequency&&this.checkboxArr!=""&&this.siteData!="") {
					that.isActive = true;
				} else {
					that.isActive = false;
				}
				return this.isActive
			},
		},
		methods: {
			getParameter:function(){
				var that = this;
				getParams("api/indexitem/", {
					page_size:999
				}, {
					success: (res) => {
						for(var index in res.data.results){
							that.Parameter.push({
								id:res.data.results[index].id,
								name:res.data.results[index].index_name,
								checked: false
							})
						}
					}
				})
			},
			submitSite:function(){
				var that = this;
				if(this.siteLat && this.siteLng && this.siteName){
					if(this.isPatchsite){
						patch("api/temporary_site/"+this.siteId+"/", {
							add_time:this.getCurrenttime(),
							forecast_event: this.eventId,
							id:this.siteId,
							lat:this.siteLat,
							lng:this.siteLng,
							name:this.siteName
						}, {
							success: (res) => {
								that.getSitedata();
								that.cancelPop2();
							}
						})
					}else{
						post("api/temporary_site/", {
							forecast_event: this.eventId,
							lat:this.siteLat,
							lng:this.siteLng,
							name:this.siteName
						}, {
							success: (res) => {
								that.getSitedata();
								that.cancelPop2();
							}
						})
					}
				}else{
					console.log("填完整，please");
				}
			},
			getSitedata:function(){
				var that = this;
				this.siteData = [];
				getParams("api/temporary_site/", {
					page:1,
					forecast_event:this.eventId
				}, {
					success: (res) => {
						for(var index in res.data.results){
							that.siteData.push({
								id:res.data.results[index].id,
								name:res.data.results[index].name,
								lng:res.data.results[index].lng,
								lat:res.data.results[index].lat
							})
						}
					}
				})
			},
			submitCheckbox:function(){
				this.checkboxArr = [];
				var that = this;
				for(var index in this.Parameter){
					if(that.Parameter[index].checked == true){
						that.checkboxArr.push({
							id:that.Parameter[index].id,
							name:that.Parameter[index].name
						})
					}
				}
				this.cancelPop1()
			},
			postEvent:function(){
				uni.showLoading({
					title: '生成监测方案中',
					mask: true
				});
				var that = this;
				if(this.isActive){
					var patchParameter = [];
					for(var index in this.checkboxArr){
						patchParameter.push(this.checkboxArr[index].id)
					}
					post("api/forecast_event/create_docx/", {
						forecastevent: this.eventId,
					}, {
						success: (res) => {
							patch("api/forecast_event/"+that.eventId+"/", {
								is_started: "stage4",
								item: patchParameter
							}, {
								success: (res) => {
									uni.hideLoading();
									that.$emit("currentPage","stage4")
								}
							})
						}
					})
					/* post("api/forecast_event/create_docx/", {
						forecastevent: this.eventId,
						frequency: this.frequency
					}, {
						success: (res) => {
							console.log(that.eventId);
							console.log(JSON.stringify(res))
							console.log("doc2");
						}
					}) */
				}
			},
			deleteParameter:function(e){
				var that = this;
				uni.showModal({
				    title: '提示',
				    content: '确认删除参数？',
				    success: function (res) {
				        if (res.confirm) {
							for(var index in that.checkboxArr){
								if(that.checkboxArr[index].id == e.target.id){
									that.checkboxArr.splice(index, 1)
								}
							}
							for(var index in that.Parameter){
								if(that.Parameter[index].id == e.target.id){
									that.Parameter[index].checked = false
								}
							}
				        } else if (res.cancel) {
							return false
				        }
				    }
				});
			},
			checkBox:function(e, item) {
				if(item.checked == false){
					item.checked = true;
				}else{
					item.checked = false;
				}
			},
			getCurrenttime:function(){
				var currentTime=new Date();
				var year = currentTime.getFullYear();
				var month = this.PrefixInteger(currentTime.getMonth()+1,2);
				var day = this.PrefixInteger(currentTime.getDate(),2);
				var hour = this.PrefixInteger(currentTime.getHours(),2);
				var minutes = this.PrefixInteger(currentTime.getMinutes(),2);
				var seconds = this.PrefixInteger(currentTime.getSeconds(),2);
				return year+'-'+month+'-'+day+'T'+hour+':'+minutes+':'+seconds;
			},
			PrefixInteger:function(num, n){//补零
				return (Array(n).join(0) + num).slice(-n);
			},
			deleteSite:function(e){
				var that = this;
				uni.showModal({
				    title: '提示',
				    content: '此操作将永久删除当前信息, 是否继续?',
				    success: function (res) {
				        if (res.confirm) {
							ajaxDelete("api/temporary_site/"+e.target.id+"/", {
								success: (res) => {
									that.getSitedata();
								}
							})
				        } else if (res.cancel) {
							return false
				        }
				    }
				});
			},
			openPop1() {
				this.$refs.popup1.open()
			},
			cancelPop1(type) {
				this.$refs.popup1.close()
			},
			openPop2(id,name,lng,lat) {
				if (id&&name&&lng&&lat) {
					this.siteId = id;
					this.siteName = name;
					this.siteLng = lng;
					this.siteLat = lat;
					this.isPatchsite = true
				}else{
					this.siteName = "";
					this.siteLng = "";
					this.siteLat = "";
					this.isPatchsite = false;
				}
				this.$refs.popup2.open()
			},
			cancelPop2(type) {
				this.$refs.popup2.close()
			},
		}
	}
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		padding-bottom: 88rpx;
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

	.warnList {
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
		padding-left: 35rpx;
		width: 250rpx;
		color: #777777;
	}
	
	.warnParameter{
		width: 350rpx;
		height: 105rpx;
		
	}
	.warnContent{
		display: flex;
		height: 100%;
		align-items: center;
	}
	.warnContent>view{
		display: flex;
		align-items: center;
		flex-grow:0;
		flex-shrink:0;
		height: 70rpx;
		padding-left: 20rpx;
		margin-right: 20rpx;
		font-size: 28rpx;
		line-height: 70rpx;
		background-color: #f1f1f1;
	}
	
	.warnDelete{
		width: 26rpx;
		height: 26rpx;
		margin-left: auto;
		padding: 0 20rpx 0 10rpx;
	}

	.addParameter {
		width: 45rpx;
		height: 45rpx;
		margin-left: auto;
		margin-right: 50rpx;
	}
	
	.submit{
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 88rpx;
		background-color: #FFFFFF;
	}

	.submit text{
		display: block;
		width: 100%;
		height: 100%;
		line-height: 88rpx;
		text-align: center;
		font-size: 34rpx;
		color: #FFFFFF;
		background-color: #d1524c;
	}
	.popupScroll{
		width: 500rpx;
		height: 500rpx;
		padding: 20rpx 0;
		background-color: #FFFFFF;
		border-top-left-radius:10rpx;
		border-top-right-radius:10rpx;
	}
	.popupCenter{
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.popupCenter checkbox{
		height: 70rpx;
		line-height: 70rpx;
		padding-left: 40rpx;
		font-size: 28rpx;
	}
	.popupSite{
		width: 500rpx;
		height: 300rpx;
		padding: 20rpx 30rpx;
		background-color: #FFFFFF;
		border-top-left-radius:10rpx;
		border-top-right-radius:10rpx;
	}
	.popupSite>view{
		display: flex;
		align-items: center;
		margin: 30rpx 0;
	}
	.popupSite>view text{
		width: 150rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 30rpx;
		color: #333333;
	}
	.popupSite>view input{
		height: 60rpx;
		line-height: 60rpx;
		padding: 0 20rpx;
		font-size: 26rpx;
		border: 1rpx solid #DDDDDD;
		border-radius: 10rpx;
	}
	.addSite{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 110rpx;
		line-height: 110rpx;
		margin-top: 20rpx;
		background-color: #FFFFFF
	}
	.siteTitle{
		font-size: 28rpx;
		color: #333333;
		padding-left: 35rpx;
	}
	.siteAdd{
		width: 210rpx;
		height: 70rpx;
		text-align: center;
		line-height: 70rpx;
		margin-right: 30rpx;
		font-size: 28rpx;
		color: #FFFFFF;
		border-radius: 8rpx;
		background-color: #67c7bc;
	}
	.formTitle{
		display: flex;
		height: 88rpx;
		line-height: 88rpx;
		background-color: #f1f1f1;
		border-top: 1rpx solid #EEEEEE;
		border-bottom: 1rpx solid #EEEEEE;
	}
	.formTitle view{
		flex-grow: 1;
		text-align: center;
		font-size: 30rpx;
		color: #333333;
	}
	.formContent{
		display: flex;
		height: 88rpx;
		line-height: 88rpx;
		border-bottom: 1rpx solid #DDDDDD;
	}
	.formContent view{
		width: 33%;
		text-align: center;
		font-size: 28rpx;
		color: #777777;
	}
	.tipButton{
		display: flex;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #FFFFFF;
		border-bottom-right-radius:10rpx;
		border-bottom-left-radius:10rpx;
		border-top: 1rpx solid #EEEEEE;
	}
	.tipButton view{
		font-size: 30rpx;
		flex-grow: 1;
		text-align: center;
		color: #333333;
	}
	.tipButton view:first-child{
		border-right: 1rpx solid #EEEEEE;
	}
	.siteEdit{
		width: 40rpx;
		height: 40rpx;
		padding-top: 10rpx;
	}
	.siteDelete{
		width: 30rpx;
		height: 40rpx;
		margin-top: 20rpx;
		margin-left: 30rpx;
	}
	.important{
		background-image: url(../../static/important.png);
		background-repeat: no-repeat;
		background-size: 14rpx 14rpx;
		background-position: 15rpx 50%;
	}
</style>
