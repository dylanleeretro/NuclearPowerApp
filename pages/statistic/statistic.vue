<template>
	<view class="qiun-columns">
		<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="text" active-color="#d1524c"></uni-segmented-control>
		<view class="content">
			<view v-show="current === 0">
				<view class="pickerBox">
					<picker @change="bindProjectChange" class="picker" :value="projectIndex" :range="projectName">
						<view class="uni-input" v-if="projectName.length">{{projectName[projectIndex]}}</view>
						<view class="uni-input" v-else></view>
						<view class="triangle">
							<image src="../../static/triangle.png"></image>
						</view>
					</picker>
					<picker @change="bindItemChange" class="picker" :value="itemIndex" :range="itemName">
						<view class="uni-input" v-if="itemName.length">{{itemName[itemIndex]}}</view>
						<view class="uni-input" v-else></view>
						<view class="triangle">
							<image src="../../static/triangle.png"></image>
						</view>
					</picker>
				</view>
				<view class="qiun-charts">
					<canvas canvas-id="canvasPie" id="canvasPie" class="charts" @touchstart="touchPie"></canvas>
				</view>
				<view class="progressBox">
					<text class="progressTitle">水质评价情况</text>
					<view class="progressContent" v-for="(item,itemIndex) in serverData" :key="itemIndex">
						<view class="progressData">
							<text>{{item.name}}</text>
							<text>{{item.data}}</text>
						</view>
						<progress stroke-width=4 :percent="item.data" :activeColor="item.color" />
					</view>
				</view>
			</view>
			<view v-show="current === 1">
				<view class="pickerBox">
					<picker @change="bindProjectChange2" class="picker" :value="projectIndex2" :range="projectName2">
						<view class="uni-input" v-if="projectName2.length">{{projectName2[projectIndex2]}}</view>
						<view class="uni-input" v-else></view>
						<view class="triangle">
							<image src="../../static/triangle.png"></image>
						</view>
					</picker>
					<picker @change="bindItemChange2" class="picker" :value="itemIndex2" :range="itemName2">
						<view class="uni-input" v-if="itemName2.length">{{itemName2[itemIndex2]}}</view>
						<view class="uni-input" v-else></view>
						<view class="triangle">
							<image src="../../static/triangle.png"></image>
						</view>
					</picker>
				</view>
				<view class="qiun-charts">
					<canvas canvas-id="canvasPie2" id="canvasPie2" class="charts" @touchstart="touchPie"></canvas>
				</view>
				<view class="progressBox">
					<text class="progressTitle">沉积物评价情况</text>
					<view class="progressContent" v-for="(item,itemIndex) in serverData2" :key="itemIndex">
						<view class="progressData">
							<text>{{item.name}}</text>
							<text>{{item.data}}</text>
						</view>
						<progress stroke-width=4 :percent="item.data" :activeColor="item.color" />
					</view>
				</view>
			</view>
			<view v-show="current === 2">
				<view class="pickerBox">
					<picker @change="bindProjectChange3" class="picker" :value="projectIndex3" :range="projectName3">
						<view class="uni-input" v-if="projectName3.length">{{projectName3[projectIndex3]}}</view>
						<view class="uni-input" v-else></view>
						<view class="triangle">
							<image src="../../static/triangle.png"></image>
						</view>
					</picker>
					<picker @change="bindItemChange3" class="picker" :value="itemIndex3" :range="itemName3">
						<view class="uni-input" v-if="itemName3.length">{{itemName3[itemIndex3]}}</view>
						<view class="uni-input" v-else></view>
						<view class="triangle">
							<image src="../../static/triangle.png"></image>
						</view>
					</picker>
					<picker @change="bindTypeChange3" class="picker" :value="typeIndex" :range="dataTypeName">
						<view class="uni-input" v-if="dataTypeList.length">{{dataTypeList[typeIndex].name}}</view>
						<view class="uni-input" v-else></view>
						<view class="triangle">
							<image src="../../static/triangle.png"></image>
						</view>
					</picker>
				</view>
				<view class="qiun-charts">
					<canvas canvas-id="canvasPie3" id="canvasPie3" class="charts" @touchstart="touchPie"></canvas>
				</view>
				<view class="progressBox">
					<text class="progressTitle">生物多样性评价情况</text>
					<view class="progressContent" v-for="(item,itemIndex) in serverData3" :key="itemIndex">
						<view class="progressData">
							<text>{{item.name}}</text>
							<text>{{item.data}}</text>
						</view>
						<progress stroke-width=4 :percent="item.data" :activeColor="item.color" />
					</view>
				</view>
				<view class="progressBox">
					<text class="progressTitle">优势种</text>
					<view class="biodiversityBox" v-for="(item,itemIndex) in biodiversityBox" :key="itemIndex">
						<view class="biodiversityImage" v-if="item.pic!=null">
							<image :src="item.pic"></image>
						</view>
						<view class="biodiversityImage" v-else>
							<text>加载失败</text>
						</view>
						<text class="biodiversityText1">{{item.name}}</text>
						<text class="biodiversityText2">{{item.species}}</text>
						<text class="biodiversityText2">{{item.characteristics}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import uniSegmentedControl from "../../components/uni-segmented-control/uni-segmented-control.vue"
	import uCharts from "../../js_sdk/u-charts/u-charts/u-charts.js";
	import {
		post,
		get,
		getParams
	} from "../../common/util.js"
	var _self;
	var canvaPie = null;

	export default {
		components: {
			uniSegmentedControl
		},
		data() {
			return {
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				projectArr: [],
				projectName: [],
				projectId: "",
				projectIndex: 0,
				itemArr: [],
				itemName: [],
				itemId: "",
				itemIndex: 0,
				projectArr2: [],
				projectName2: [],
				projectId2: "",
				projectIndex2: 0,
				itemArr2: [],
				itemName2: [],
				itemId2: "",
				itemIndex2: 0,
				projectArr3: [],
				projectName3: [],
				projectId3: "",
				projectIndex3: 0,
				itemArr3: [],
				itemName3: [],
				itemId3: "",
				itemIndex3: 0,
				serverData: [{
						"name": "I",
						"data": 0,
						"color": "#438ef7"
					}, {
						"name": "II",
						"data": 0,
						"color": "#61bf67"
					},
					{
						"name": "III",
						"data": 0,
						"color": "#f2cd49"
					}, {
						"name": "IV",
						"data": 0,
						"color": "#dd5567"
					}, {
						"name": "V",
						"data": 0,
						"color": "#7c46d8"
					}
				],
				serverData2: [{
						"name": "I",
						"data": 0,
						"color": "#438ef7"
					}, {
						"name": "II",
						"data": 0,
						"color": "#61bf67"
					},
					{
						"name": "III",
						"data": 0,
						"color": "#f2cd49"
					}, {
						"name": "IV",
						"data": 0,
						"color": "#dd5567"
					}, {
						"name": "V",
						"data": 0,
						"color": "#7c46d8"
					}
				],
				serverData3: [{
						"name": "高",
						"data": 0,
						"color": "#438ef7"
					}, {
						"name": "优良",
						"data": 0,
						"color": "#61bf67"
					},
					{
						"name": "中",
						"data": 0,
						"color": "#f2cd49"
					}, {
						"name": "一般",
						"data": 0,
						"color": "#dd5567"
					}, {
						"name": "低",
						"data": 0,
						"color": "#7c46d8"
					}
				],
				items: ['水质','沉积物','生物多样性'],
				dataTypeName:['浮游植物物种','浮游动物物种','浅海大型底栖生物物种','潮间带生物物种'],
				dataTypeList: [{
						id: 'PhytoplanktonZooplanktonMesh',
						name: '浮游植物物种'
					},
					{
						id: 'ZooplanktonAmount',
						name: '浮游动物物种'
					},
					{
						id: 'BenthosRation',
						name: '浅海大型底栖生物物种'
					},
					{
						id: 'TidalZoneBiologyRation',
						name: '潮间带生物物种'
					}
				],
				first_level: "浮游植物物种多样性",
				model_name: "PhytoplanktonZooplanktonMesh",
				typeIndex:0,
				current: 0,
				biodiversityBox:[]
			}
		},
		onLoad() {
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.getProject();
			this.getProject2();
			this.getProject3();
		},
		methods: {
			...mapMutations(['login']),
			onClickItem(index) {
				var that = this;
				if (this.current !== index) {
					this.current = index;
					if(this.current == 0){
						that.getPieData()
					}else if(this.current == 1){
						that.getPieData2()
					}else{
						that.getPieData3()
					}
				}
			},
			getProject: function() {
				var that = this;
				get("api/projects/", {
					success: (res) => {
						that.projectArr = res.data.results;
						for (var index in that.projectArr) {
							that.projectName.push(that.projectArr[index].name)
						}
						that.projectId = that.projectArr[that.projectIndex].id;
						that.getItem();
					}
				})
			},
			getItem: function() {
				var that = this;
				getParams("api/databatch/", {
					Projects: this.projectId,
					WaterQuality: true
				}, {
					success: (res) => {
						that.itemArr = res.data.results;
						for (var index in that.itemArr) {
							that.itemName.push(that.itemArr[index].BatchName)
						}
						that.itemId = that.itemArr[that.itemIndex].id;
						that.getPieData();
					}
				})
			},
			getPieData: function() {
				var that = this;
				getParams("api/evaluation/batch/", {
					data_batch: this.itemId,
				}, {
					success: (res) => {
						for (var index in res.data) {
							if (index == 1) {
								that.serverData[0].data = res.data[index];
							}
							if (index == 2) {
								that.serverData[1].data = res.data[index];
							}
							if (index == 3) {
								that.serverData[2].data = res.data[index];
							}
							if (index == 4) {
								that.serverData[3].data = res.data[index];
							}
							if (index == 5) {
								that.serverData[4].data = res.data[index];
							}
						}
						that.showPie("canvasPie", that.serverData);
					}
				})
			},
			getProject2: function() {
				var that = this;
				get("api/projects/", {
					success: (res) => {
						that.projectArr2 = res.data.results;
						for (var index in that.projectArr2) {
							that.projectName2.push(that.projectArr2[index].name)
						}
						that.projectId2 = that.projectArr2[that.projectIndex2].id;
						that.getItem2();
					}
				})
			},
			getItem2: function() {
				var that = this;
				getParams("api/databatch/", {
					Projects: this.projectId,
					Sediment: true
				}, {
					success: (res) => {
						that.itemArr2 = res.data.results;
						for (var index in that.itemArr2) {
							that.itemName2.push(that.itemArr2[index].BatchName)
						}
						that.itemId2 = that.itemArr2[that.itemIndex2].id;
						/* that.getPieData2(); */
					}
				})
			},
			getPieData2: function() {
				var that = this;
				getParams("api/sediment_envidadoevaluate/batch/", {
					data_batch: this.itemId2,
				}, {
					success: (res) => {
						for (var index in res.data) {
							if (index == 1) {
								that.serverData2[0].data = res.data[index];
							}
							if (index == 2) {
								that.serverData2[1].data = res.data[index];
							}
							if (index == 3) {
								that.serverData2[2].data = res.data[index];
							}
							if (index == 4) {
								that.serverData2[3].data = res.data[index];
							}
							if (index == 5) {
								that.serverData2[4].data = res.data[index];
							}
						}
						that.showPie("canvasPie2", that.serverData2);
					}
				})
			},
			getProject3: function() {
				var that = this;
				get("api/projects/", {
					success: (res) => {
						that.projectArr3 = res.data.results;
						for (var index in that.projectArr3) {
							that.projectName3.push(that.projectArr3[index].name)
						}
						that.projectId3 = that.projectArr3[that.projectIndex].id;
						that.getItem3();
					}
				})
			},
			getItem3: function() {
				var that = this;
				getParams("api/databatch/", {
					Projects: this.projectId3,
					MarineiLife: true
				}, {
					success: (res) => {
						that.itemArr3 = res.data.results;
						for (var index in that.itemArr3) {
							that.itemName3.push(that.itemArr3[index].BatchName)
						}
						that.itemId3 = that.itemArr3[that.itemIndex].id;
						/* that.getPieData3(); */
					}
				})
			},
			getPieData3: function() {
				this.biodiversityBox = [];
				var that = this;
				getParams("api/ocean_diversity_data/statistics", {
					data_batch: this.itemId3,
					first_level: this.first_level,
					model_name: this.model_name
				}, {
					success: (res) => {
						for (var index in res.data) {
							if (index == 1) {
								that.serverData3[0].data = res.data[index];
							}
							if (index == 2) {
								that.serverData3[1].data = res.data[index];
							}
							if (index == 3) {
								that.serverData3[2].data = res.data[index];
							}
							if (index == 4) {
								that.serverData3[3].data = res.data[index];
							}
							if (index == 5) {
								that.serverData3[4].data = res.data[index];
							}
						}
						that.showPie("canvasPie3", that.serverData3);
					}
				})
				getParams("api/ocean_diversity_data/dominant_species", {
					data_batch: this.itemId3,
					first_level: this.first_level,
					model_name: this.model_name
				}, {
					success: (res) => {
						for(var index in res.data.results){
							that.biodiversityBox.push({
								pic: res.data.results[index].pic,
								name: res.data.results[index].name,
								species: res.data.results[index].biology_species,
								characteristics: res.data.results[index].species_characteristics
							})
						}
					}
				})
			},
			bindProjectChange: function(e) {
				this.itemArr = []
				this.projectIndex = e.target.value
				this.projectId = this.projectArr[this.projectIndex].id
				this.getItem();
			},
			bindItemChange: function(e) {
				this.itemIndex = e.target.value
				this.itemId = this.itemArr[this.itemIndex].id
				this.getPieData()
			},
			bindProjectChange2: function(e) {
				this.itemArr2 = []
				this.projectIndex2 = e.target.value
				this.projectId2 = this.projectArr2[this.projectIndex2].id
				this.getItem2();
			},
			bindItemChange2: function(e) {
				this.itemIndex2 = e.target.value
				this.itemId2 = this.itemArr2[this.itemIndex2].id
				this.getPieData2()
			},
			bindProjectChange3: function(e) {
				this.itemArr3 = []
				this.projectIndex3 = e.target.value
				this.projectId3 = this.projectArr3[this.projectIndex3].id
				this.getItem3();
			},
			bindItemChange3: function(e) {
				this.itemIndex3 = e.target.value
				this.itemId3 = this.itemArr3[this.itemIndex3].id
			},
			bindTypeChange3: function(e) {
				this.typeIndex = e.target.value
				this.first_level = this.dataTypeList[this.typeIndex].name;
				this.model_name = this.dataTypeList[this.typeIndex].id;
				this.getPieData3()
			},
			getServerData() {
				var that = this;
				uni.request({
					url: 'https://www.ucharts.cn/data.json',
					data: {},
					success: function(res) {
						/* console.log(res.data.data)
						let Pie = {
							series: []
						};
						//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
						Pie.series = that.serverData; */
						/* _self.showPie("canvasPie", that.serverData);
						_self.showPie("canvasPie2", that.serverData); */
					},
					fail: () => {
						_self.tips = "网络错误，小程序端请检查合法域名";
					},
				});
			},
			showPie(canvasId, chartData) {
				canvaPie = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'pie',
					fontSize: 11,
					legend: {
						show: true
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: chartData,
					animation: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					dataLabel: true,
					extra: {
						pie: {
							lableWidth: 15
						}
					},
				});
			},
			touchPie(e) {
				canvaPie.showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data
					}
				});
			},
		}
	}
</script>

<style>
	page {
		background: #F2F2F2;
		width: 750upx;
		overflow-x: hidden;
	}

	.qiun-padding {
		padding: 2%;
		width: 96%;
	}

	.qiun-wrap {
		display: flex;
		flex-wrap: wrap;
	}

	.qiun-rows {
		display: flex;
		flex-direction: row !important;
	}

	.qiun-columns {
		display: flex;
		flex-direction: column !important;
	}

	.qiun-common-mt {
		margin-top: 10upx;
	}

	.qiun-bg-white {
		background: #FFFFFF;
	}

	.qiun-title-bar {
		width: 96%;
		padding: 10upx 2%;
		flex-wrap: nowrap;
	}

	.qiun-title-dot-light {
		border-left: 10upx solid #0ea391;
		padding-left: 10upx;
		font-size: 32upx;
		color: #000000
	}

	.qiun-charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.pickerBox {
		display: flex;
		padding: 20rpx 0;
		background-color: #FFFFFF;
	}

	.picker {
		position: relative;
		width: 45%;
		height: 70rpx;
		line-height: 70rpx;
		padding: 0 20rpx;
		margin: 0 10rpx;
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

	.progressBox {
		display: flex;
		flex-wrap: wrap;
		padding: 10rpx 10rpx 40rpx 10rpx;
		margin-top: 20rpx;
		background-color: #FFFFFF;
	}

	.progressTitle {
		display: block;
		width: 100%;
		font-size: 34rpx;
		color: #333333;
		margin-top: 25rpx;
		margin-left: 20rpx;
		padding-left: 20rpx;
		border-left: 10rpx solid #d1524c;
		background-color: #FFFFFF;
	}

	.progressContent {
		width: 50%;
		padding: 10rpx 20rpx;
		box-sizing: border-box;
	}

	.progressData {
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
		font-size: 30rpx;
		color: #777777;
	}
	
	.biodiversityBox{
		display: flex;
		flex-direction: column;
		width: 44%;
		height: 400rpx;
		margin: 20rpx 3%;
		padding: 20rpx;
		border: 1rpx solid #DDDDDD;
		box-sizing: border-box;
		overflow: hidden;
	}
	
	.biodiversityImage{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 240rpx;
		border: 1rpx solid #EEEEEE;
		background-color: #EEEEEE;
	}
	
	.biodiversityImage image{
		width: 100%;
		height: 100%;
	}
	
	.biodiversityImage text{
		font-size: 32rpx;
		color: #999999;
	}
	
	.biodiversityText1{
		text-align: center;
		font-size: 32rpx;
		color: #333333;
	}
	
	.biodiversityText2{
		text-align: center;
		font-size: 26rpx;
		color: #333333;
	}
</style>
