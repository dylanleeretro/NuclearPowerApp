<template>
	<div class:="dmap" style="width: 100%; height: 100%;">
		<div id="left-map" class="left-map" style="width:100%;height:100%" v-loading="loading" element-loading-text="拼命加载中">
		</div>
		<div id="popup" ref="popup" class="ol-popup" style="color:#060000" v-show="stationShow">{{popupText}}
			<a href="#" id="popup-closer" ref="popCloser" class="ol-popup-closer"></a>
			<hr>
			<div id="popup-content" ref="popContent"></div>
		</div>
		<div id="chart" ref="chart" display: none></div>
	</div>

</template>


<script>

	import global_ from '@/components/global.vue'
	var points =global_.points
	import 'ol/ol.css'
    import 'ol-layerswitcher/src/ol-layerswitcher.css'
	import { Map, View, Feature, Overlay} from 'ol'
	import {Tile, Vector, Image} from'ol/layer'
	import {XYZ, TileImage,ImageCanvas, Vector as sVector} from 'ol/source'
	import {Point, Polygon, LineString} from 'ol/geom'
	import {circular, fromExtent} from 'ol/geom/Polygon'
    import LayerGroup from 'ol/layer/Group'
	import {Style, Fill, Stroke, Text, Circle, Icon, RegularShape} from 'ol/style'
	import {GeoJSON, } from 'ol/format'
    import LayerSwitcher from 'ol-layerswitcher'
	import axios from 'axios'
	import { fromLonLat} from 'ol/proj';

	const bd_resolution =[]
	for (var i=0; i<19 ; i++) {
		bd_resolution[i] = Math.pow(2,18-i)
	}

    let selectedByAttriFeature = null

    const layerSwitcher = new LayerSwitcher()


    export default {
        name: 'index',
        data() {
            return {
				mappara:null,
				data:[],
                loading: false,
                stationShow: false,
                attributeShow: true,
                popupText: 'N/A',
				url: '/api/Site/',
                url_type: '/api/space_geographical_type/',
                url_ply: '/api/space_space_data/',
                id: '',
				resData: [],
                typeId: '',
				basemap: null,
				webKey: 'be754f986c0a3eb6af4f03023cb4d42b',// 个人key
				layerList: null,
				projection: null,
				markerVectorLayer: null,
                nuMarkerVectorLayer: null,
                preMarkerVectorLayer: null,
                baMarkerVectorLayer: null,
                ofMarkerVectorLayer: null,
                nvStringLayer: null,
                polyFeature: null,
                plyVectorLayer: null,
				pointcoordinates: [],
                pointFeature: null,
                krigingPly: null,
                krigingLayers: null,
                markers: [],
                nuMarkers: [],
                preMarkers: [],
                baMarkers: [],
                ofMarkers: [],
				map_center: [120.5, 27.],
				hd_center:[120.27724,27.040124],//[120.27724,27.040124],
				layerDis:null,
                mapLayers:{},
				seaPs: null,
				krigingLayer: null,
				navRoute: '',
                siteOn: false,
				chart: null,
                navList:[
                    {
                        name:'基础地理信息图层',
                        router:'',
                        icon: '',
                        children:[{
                            name: '监测站点',
                            router: 'getSitePoint',
                            icon: 'iconfont icon-jianceshuju1',
                            checked: false,
                            layername: "siteLayer"
                        },{
                            name: '核电站',
                            router: 'getNuclear',
                            icon: 'iconfont icon-jianceshuju1',
                            checked: false,
                            layername: "nuclearLayer"
                        },{
                            name: '功能区',
                            router: 'getFunctional',
                            icon: 'iconfont icon-jianceshuju1',
                            checked: false,
                            layername: "functionalLayer"
                        },{
                            name: '保护区',
                            router: 'getPreserves',
                            icon: 'iconfont icon-jianceshuju1',
                            checked: false,
                            layername: "preservesLayer"
                        },{
                            name: '领海基线',
                            router: 'getNavigation',
                            icon: 'iconfont icon-jianceshuju1',
                            checked: false,
                            layername: "navigationLayer"
                        },{
                            name: '等深线',
                            router: 'getDepthContour',
                            icon: 'iconfont icon-jianceshuju1',
                            checked: false,
                            layername: "DepthContourLayer"
                        },{
                            name: '海水浴场',
                            router: 'getBath',
                            icon: 'iconfont icon-jianceshuju1',
                            checked: false,
                            layername: "BathLayer"
                        },{
                            name: '排污口',
                            router: 'getOutfall',
                            icon: 'iconfont icon-jianceshuju1',
                            checked: false,
                            layername: "outfallLayer"
                        }]
                    },{
                        name:'环境监测数据',
                        router:'s',
                        icon: '',
                        children:[{
                            name: '水质评价数据',
                            router: 'showWater2',
                            icon: 'iconfont icon-jianceshuju1',
                            checked: false,
                            layername: "KrigingLayer"
                        },{
                            name: '沉积物评价结果',
                            router: 'showWater2',
                            icon: 'iconfont icon-jianceshuju1',
                            checked: false,
                            layername: "KrigingLayer"
                        },{
                            name: '站位评价结果',
                            router: 'showStWater',
                            icon: 'iconfont icon-jianceshuju1',
                            checked: false,
                            layername: "KrigingLayer"
                        }]
                    }
                ],
			}
        },
        created() {

        },
		props:['parepara',],
		computed: {
			//mappara(){
			//	return this.parepara
			//}
		},
        mounted() {
			this.initmap()
            this.doPopup()
            this.loading = false
            // this.$initHeight()
			// this.getPoint()
        },
        methods: {
            routerLink(actionFunc,checked, layername) {
                if (checked) {
                    if (this.mapLayers[layername] !== undefined) {
                        this.basemap.addLayer(this.mapLayers[layername])
                        this.stationShow = true
                        if (layername === 'siteLayer') {
                            this.siteOn = true
                        }
                    } else {
                        this[actionFunc]()
                    }

                } else {
                    if (layername === 'siteLayer' && this.siteOn === true) {
                        if (selectedByAttriFeature !== null) {
                            this.$confirm('此举将去除查询,是否继续？','提示',{
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() =>{
                                console.log("移除图层: " + layername)
                                this.basemap.removeLayer(this.mapLayers[layername])
                                this.siteOn = false
                                this.attributeShow = true
                                this.removeLayerByAttribute()
                                this.$message({
                                    type: 'success',
                                    message: '去除成功！'
                                })
                            }).catch(() =>{
                                this.$message({
                                    type: 'info',
                                    message: '取消删除'
                                })
                                this.$set(this.navList[0].children[0],'checked',true)
                            })
                        } else {
                            console.log("移除图层: " + layername)
                            this.basemap.removeLayer(this.mapLayers[layername])
                            this.siteOn = false
                        }
                    } else {
                        console.log("移除图层: " + layername)
                        this.basemap.removeLayer(this.mapLayers[layername])
                        // this.attributeShow = false
                    }
                }
            },
            getElse () {
                this.$alert("暂无数据，请稍后",'提示',{center: true})
            },
            getFunctional () {
                this.getElse()
                this.$set(this.navList[0].children[2],'checked',false)
            },
            getNavigation () {
                let line = []
                let layerGroup = []
                this.$axios.get('/api/space_geographical_type/?name=领海基线').then(res =>{
                    const id = res.data.results[0].id
                    let jsonData = res.data.results[0].file
                    jsonData = jsonData.replace(/^http:\/\/[^/]{3,255}/g, '')
                    this.$axios.get(jsonData).then(res =>{
                        let lineStringFeature
                        const features = res.data.features
                        const num = features.length
                        console.log('一共'+ num + '条线')
                        for (const feature of features) {
                            const name = feature.attributes.NAME
                            const paths = feature.geometry.paths
                            const linePath = [paths, name]
                            line.push(linePath)
                        }
                        for (const lineString of line) {
                            for (const coordinate of lineString[0]) {
                                lineStringFeature = new Feature({geometry: new LineString(coordinate), geometryName: lineString[1], geometryName_:'navigation'})
                                const lineSource = new sVector()
                                lineSource.addFeature(lineStringFeature)
                                const layer = new Vector({title: lineString[1], source: lineSource, style: new Style({stroke: new Stroke({color: '#1f33ff', width: 2})})})
                                layerGroup.push(layer)
                            }
                        }
                        this.nvStringLayer = new LayerGroup({title: '领海基线', layers: layerGroup})
                        console.log(this.nvStringLayer)
                        this.basemap.addLayer(this.nvStringLayer)
                        this.mapLayers['navigationLayer'] = this.nvStringLayer
                    })
                })
            },
			showStWater () {
				var Barstyle = new Style({
					image: new RegularShape({
					  points: 4,
					  radius: 10,
					  fill: new Fill({
						color: 'blue'
					  })
					})
				  });
				this.chart = this.$refs.chart;

				const marker = []
                const name = '宁德监测站点'
                let coor = []
                let coors = []
				var indd = 0
                this.$axios.get(this.url_type + '?name=' + name).then(res =>{
                    const id = res.data.results[0].id
                    let jsonData = res.data.results[0].file
                    jsonData = jsonData.replace(/^http:\/\/[^/]{3,255}/g, '')
					var html='';
                    this.$axios.get(jsonData).then(res =>{
                        const features = res.data.features
                        const num = features.length
                        console.log('一共'+ num + '个点')
						var dvalue = 1
                        for (const feature of features) {
                            const siteId = feature.attributes.站位编号
                            const x = feature.geometry.x
                            const y = feature.geometry.y
                            var pt = [x,y]
							var domid = "chart" + indd
							indd =indd + 1
							html+="<div id='"+domid+"' style='width: 10px;height: 200px; margin-left: -2px;margin-bottom: -60px;'></div>",
						    this.chart.innerHTML=html;
                            //const site = [coor, siteId, x, y]
                            //coors.push(site)
							var option = {};
						    var myChart = this.$echarts.init(document.getElementById(domid));
							option = {
								tooltip: {
								  trigger: 'axis',
								  axisPointer: {
									type: 'shadow'
								  }
								},
								xAxis: {
								  name: '监测点名称',
								  data: "1",
								  show:false
								},
								yAxis: {
								  max:'10',
								  name: '2',
								  show:false
								},
								series: [{
								  name: '汞浓度(mg/kg)',

								  type: 'bar',
								  itemStyle:{
									  normal: {
										  color: function(params){
											  var colorList = [
												'#C1232B','#B5C334','#FCCE10','#E87C25','#27727B'
											  ];
											  //console.log(colorList[params.value])
											  return "#C1232B"//colorList[params.value]
										  }
									  }
								  },
								  data: [Math.ceil(Math.random()*6),],
								  //
								}]
							};
							dvalue =dvalue+1
							if (dvalue >4) {
								dvalue=1
							}
						    myChart.setOption(option);
							var stchart = new Overlay({
								id: domid,
								positioning: "bottom-center",
								element: document.getElementById(domid),
								offset: [0, 5],
								stopEvent: false  //overlay也支持滚珠放大缩小
							});
							//console.log(pt)
							stchart.setPosition(pt);
						    this.basemap.addOverlay(stchart);
							//popoverLay.setPosition(coordinate)
							//this.basemap.addOverlay(popoverLay)
                        }
                    }),err =>{
                        console.log(err)
                    }
                }),err =>{
                    console.log(err)
                }
                this.stationShow = ! this.stationShow
			},
            getDepthContour () {
                this.getElse()
                this.$set(this.navList[0].children[5],'checked',false)
            },
            getBath () {
                const hd_style = new Style({
                    image: new Circle({
                        radius: 8,
                        fill: new Fill({
                            color: '#000ebc'
                        })
                    })
                })
                // [121.49937407612674, 27.99898150361065]    [120.27724,27.040124]
                const marker = []
                const name = '海水浴场'
                let coor = []
                let coors = []
                this.$axios.get(this.url_type + '?name=' + name).then(res =>{
                    const id = res.data.results[0].id
                    let jsonData = res.data.results[0].file
                    jsonData = jsonData.replace(/^http:\/\/[^/]{3,255}/g, '')
                    this.$axios.get(jsonData).then(res =>{
                        const features = res.data.features
                        const num = features.length
                        console.log('一共'+ num + '个点')
                        for (const feature of features) {
                            const featureName = feature.attributes.站位编号
                            const tLng = feature.attributes.经度
                            const tLat = feature.attributes.纬度
                            const lng = feature.geometry.x
                            const lat = feature.geometry.y
                            coor = [lng,lat]
                            const bath = [coor, featureName, tLng, tLat]
                            coors.push(bath)
                        }
                        for (const bath of coors) {
                            let feature = new Feature({geometry: new Point(bath[0]), geometryName: bath[1], geometryName_: 'bath', lng: bath[2], lat: bath[3]})
                            marker.push(feature)
                        }
                        this.baMarkers = marker
                        const vectorSource = new sVector({features: this.baMarkers})
                        const layer = new Vector({title: '海水浴场', source: vectorSource, style: [hd_style]})
                        this.baMarkerVectorLayer = new LayerGroup({title: '海水浴场', layers: [layer]})
                        this.basemap.addLayer(this.baMarkerVectorLayer)
                        this.siteOn = true
                        this.mapLayers['BathLayer'] = this.baMarkerVectorLayer
                    }),err =>{
                        console.log(err)
                    }
                }),err =>{
                    console.log(err)
                }
            },
            getOutfall () {
                const of_style = new Style({
                    image: new Circle({
                        radius: 8,
                        fill: new Fill({
                            color: '#bca100'
                        })
                    })
                })
                // [121.49937407612674, 27.99898150361065]    [120.27724,27.040124]
                const marker = []
                const name = '排污口'
                let coor = []
                let coors = []
                this.$axios.get(this.url_type + '?name=' + name).then(res =>{
                    const id = res.data.results[0].id
                    let jsonData = res.data.results[0].file
                    jsonData = jsonData.replace(/^http:\/\/[^/]{3,255}/g, '')
                    this.$axios.get(jsonData).then(res =>{
                        const features = res.data.features
                        const num = features.length
                        console.log('一共'+ num + '个点')
                        for (const feature of features) {
                            const featureName = feature.attributes.污口名称
                            const lng = feature.geometry.x
                            const lat = feature.geometry.y
                            coor = [lng,lat]
                            const nuclear = [coor, featureName]
                            coors.push(nuclear)
                        }
                        for (const outfall of coors) {
                            let feature = new Feature({geometry: new Point(outfall[0]), geometryName: outfall[1], geometryName_: 'outfall', lng: outfall[2], lat: outfall[3]})
                            marker.push(feature)
                        }
                        this.ofMarkers = marker
                        const vectorSource = new sVector({features: this.ofMarkers})
                        const layer = new Vector({title: '核电站', source: vectorSource, style: [of_style]})
                        this.ofMarkerVectorLayer = new LayerGroup({title: '核电站', layers: [layer]})
                        this.basemap.addLayer(this.ofMarkerVectorLayer)
                        this.siteOn = true
                        this.mapLayers['outfallLayer'] = this.ofMarkerVectorLayer
                    }),err =>{
                        console.log(err)
                    }
                }),err =>{
                    console.log(err)
                }
            },
            preGetLayerByAttribute () {
                if (this.markerVectorLayer !== null && this.siteOn) {
                    this.$prompt('请输入需要查询的站点:','站点查询',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(({value}) =>{
                        this.getLayerByAttribute(value)
                    })
                } else {
                    this.$alert("请先添加监测站点要素",'提示',{center: true})
                }
            },
            getLayerByAttribute (values) {
                const marker = this.markerVectorLayer
                const vectorLayer = marker.getLayers().getArray()[0]
                const features = vectorLayer.getSource().getFeatures()
                // const value = '1#'
                const value = values
                const property = 'geometryName'
                const featureSelectedStyle = new Style({image: new Circle({radius: 5, fill: new Fill({color: 'rgb(255,0,0)'})})})

                for (const feature of features) {
                    if (feature.get(property) === value) {
                        selectedByAttriFeature = feature
                        break
                    }
                }
                if (selectedByAttriFeature !== null) {
                    this.$alert('已找到name为:' + value + '的点','提示',{center: true}).then(() =>{
                        selectedByAttriFeature.setStyle(featureSelectedStyle)
                        this.attributeShow = false
                    })
                } else {
                    this.$alert('没有找到name为:' + value + '的点','提示',{center: true})
                }
            },
            removeLayerByAttribute () {
                if(selectedByAttriFeature !== null){
                    selectedByAttriFeature.setStyle(null)
                    selectedByAttriFeature = null
                    this.attributeShow = true
                }
            },
            getSitePoint () {
                const marker = []
                const name = '宁德监测站点'
                let coor = []
                let coors = []
                this.$axios.get(this.url_type + '?name=' + name).then(res =>{
                    const id = res.data.results[0].id
                    let jsonData = res.data.results[0].file
                    jsonData = jsonData.replace(/^http:\/\/[^/]{3,255}/g, '')
                    this.$axios.get(jsonData).then(res =>{
                        const features = res.data.features
                        const num = features.length
                        console.log('一共'+ num + '个点')
                        for (const feature of features) {
                            const siteId = feature.attributes.站位编号
                            const x = feature.geometry.x
                            const y = feature.geometry.y
                            coor = [x,y]
                            const site = [coor, siteId, x, y]
                            coors.push(site)
                        }
                        for (const site of coors) {
                            let feature = new Feature({geometry: new Point(site[0]), geometryName: site[1], geometryName_: 'site', lng: site[2], lat: site[3]})
                            marker.push(feature)
                        }
                        this.markers = marker
                        const vectorSource = new sVector({features: this.markers})
                        const layer = new Vector({title: '站点', source: vectorSource})
                        this.markerVectorLayer = new LayerGroup({title: '矢量点', layers: [layer]})
                        this.basemap.addLayer(this.markerVectorLayer)
                        this.siteOn = true
                        this.mapLayers['siteLayer'] = this.markerVectorLayer
                    }),err =>{
                        console.log(err)
                    }
                }),err =>{
                    console.log(err)
                }
                this.stationShow = ! this.stationShow
			},
            getNuclear () {
                const hd_style = new Style({
                    image: new Circle({
                        radius: 8,
                        fill: new Fill({
                            color: '#BC8F8F'
                        })
                    })
                })
                // [121.49937407612674, 27.99898150361065]    [120.27724,27.040124]
                const marker = []
                const name = '核电站'
                let coor = []
                let coors = []
                this.$axios.get(this.url_type + '?name=' + name).then(res =>{
                    const id = res.data.results[0].id
                    let jsonData = res.data.results[0].file
                    jsonData = jsonData.replace(/^http:\/\/[^/]{3,255}/g, '')
                    this.$axios.get(jsonData).then(res =>{
                        const features = res.data.features
                        const num = features.length
                        console.log('一共'+ num + '个点')
                        for (const feature of features) {
                            const featureName = feature.attributes.核电站名称
                            const tLng = feature.attributes.东经
                            const tLat = feature.attributes.北纬
                            const lng = feature.geometry.x
                            const lat = feature.geometry.y
                            coor = [lng,lat]
                            const nuclear = [coor, featureName, tLng, tLat]
                            coors.push(nuclear)
                        }
                        for (const nuclear of coors) {
                            let feature = new Feature({geometry: new Point(nuclear[0]), geometryName: nuclear[1], geometryName_: 'nuclear', lng: nuclear[2], lat: nuclear[3]})
                            marker.push(feature)
                        }
                        this.nuMarkers = marker
                        const vectorSource = new sVector({features: this.nuMarkers})
                        const layer = new Vector({title: '核电站', source: vectorSource, style: [hd_style]})
                        this.nuMarkerVectorLayer = new LayerGroup({title: '核电站', layers: [layer]})
                        this.basemap.addLayer(this.nuMarkerVectorLayer)
                        this.siteOn = true
                        this.mapLayers['nuclearLayer'] = this.nuMarkerVectorLayer
                    }),err =>{
                        console.log(err)
                    }
                }),err =>{
                    console.log(err)
                }
            },
            doPopup () {
                const container = this.$refs.popup
                const content = this.$refs.popContent
                const popupCloser = this.$refs.popCloser
                const popoverLay = new Overlay({element: container,autoPan: true})
                this.basemap.on('click', e =>{
                    const pixel = this.basemap.getEventPixel(e.originalEvent)
                    const feature = this.basemap.forEachFeatureAtPixel(pixel, feature =>{
                        return feature
                    })
                    let geometryName = ""
                    try {
                        geometryName = feature.get("geometryName_")
                    } catch (e) {

                    }
                    console.log(geometryName)
                    if (geometryName === "site" ) {
                        this.basemap.forEachFeatureAtPixel(pixel, tfeature =>{
                            const coordinate = e.coordinate
							console.log(coordinate)
                            content.innerHTML = ""
                            const featureName = feature.get('geometryName')
                            let lng = feature.get("lng").toString()
                            let lat = feature.get("lat").toString()
                            lng = this.getLngLat(lng)
                            lat = this.getLngLat(lat)
                            // this.popupText = "站点信息"
                            this.popupText = "站点名称：" + featureName
                            // content.innerHTML += "<p style=\"color:#060000\">站点名称：" + featureName + "</p>"
                            content.innerHTML += "<p style=\"color:#060000\">站点经度：" + lng + " E</p>"
                            content.innerHTML += "<p style=\"color:#060000\">站点纬度：" + lat + " N</p>"
                            content.innerHTML += "<p style=\"color:#060000\">水质评价：" + " </p>"
                            content.innerHTML += "<p style=\"color:#060000\">沉积物评价：" + " </p>"
                            content.innerHTML += "<p style=\"color:#060000\">生物多样性：" + " </p>"
                            // content.innerHTML += "<p style=\"color:#060000\">站点位置：" + coordinate + "</p>"
                            popoverLay.setPosition(coordinate)
                            this.basemap.addOverlay(popoverLay)
                        })
                    }
                })
                popupCloser.addEventListener('click',function(){
                    popoverLay.setPosition(undefined);
                })
            },
            getLngLat (coordinate) {
                const degree =coordinate.split(".")[0]
                let left = ((Number(coordinate) - Number(degree)) * 60).toString()
                const minute = left.split(".")[0]
                left = (Number(left) - Number(minute)) * 60
                let second = (left.toFixed(2)).toString()
                const second1 = second.split(".")[0]
                const second2 = second.split(".")[1]
                if (second2 === "00") {
                    second = second1
                }
                const point = degree + "° " + minute + "′ " + second + "″ "
                return point
            },
			initmap() {
                const td_layer = [
                    new LayerGroup({
                        title: '矢量底图',
                        layers: [
                            new Tile({
                                title: "天地图",
                                source: new XYZ({
                                    url : "http://t{0-6}.tianditu.gov.cn/DataServer?T=vec_w&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&x={x}&y={y}&l={z}&tk=" + this.webKey,
                                    wrapX:false,
                                })
                            }),
                            new Tile({
                                title: "标记",
                                source: new XYZ({
                                    //url: "http://t{0-6}.tianditu.gov.cn/cia_w/wmts?x={x}&y={y}&l={z}&tk=8a45f3c67c839d86c1f63c193e370066",
                                    url: "http://t{0-6}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=" + this.webKey,
                                    wrapX:false,
                                    //
                                }),
                            })
                            // ndhd_vector
                        ]
                    })
                ]
				this.basemap = new Map({
					target: 'left-map',
					layers: td_layer,
					view: new View({
						center:this.map_center,
						zoom: 11,
						projection:　"EPSG:4326"
					})
				})
				this.projection = this.basemap.getView().getProjection();
				this.layerDis = new LayerGroup({title: '缓冲区', layers: [this.DefineDistCircle(100000)]})
				this.basemap.addLayer(this.layerDis)
				this.showStWater()
                // this.basemap.addControl(layerSwitcher)
			},
            doBuffer () {
                this.layerDis = new LayerGroup({title: '缓冲区', layers: [this.DefineDistCircle(100000)]})
                this.basemap.addLayer(this.layerDis)
            },
			DefineDistCircle(distance) {
				var DistVector  = new Vector ({
                    title: '宁德核电缓冲区',
					source : new sVector({
						features: [ new Feature(new fromExtent(this.projection.getExtent())) ]
					}),
					style:  new Style({
						geometry: circular(this.hd_center, distance, 128).transform('EPSG:4326', this.projection),
						stroke: new Stroke({
							color: 'black',
							width: 3
						}),
						fill:　new Fill({
							 color: 'rgba(8, 46, 84, 0.1)'
						})
					})
				})
				return DistVector
			},
			closeDistCircle() {
				this.basemap.removeLayer(this.layerDis)
			},
            getPreserves () {
                const pre_style = new Style({
                    image: new Circle({
                        radius: 8,
                        fill: new Fill({
                            color: '#00bc01'
                        })
                    })
                })
                // [121.49937407612674, 27.99898150361065]    [120.27724,27.040124]
                const marker = []
                const name = '宁德保护区'
                let coor = []
                let coors = []
                this.$axios.get(this.url_type + '?name=' + name).then(res =>{
                    const id = res.data.results[0].id
                    let jsonData = res.data.results[0].file
                    jsonData = jsonData.replace(/^http:\/\/[^/]{3,255}/g, '')
                    this.$axios.get(jsonData).then(res =>{
                        const features = res.data.features
                        const num = features.length
                        console.log('一共'+ num + '个点')
                        for (const feature of features) {
                            const featureName = feature.attributes.护区名称
                            const tLng = feature.attributes.东经
                            const tLat = feature.attributes.北纬
                            const lng = feature.geometry.x
                            const lat = feature.geometry.y
                            const object = feature.attributes.保护对象
                            coor = [lng,lat]
                            const preserves = [coor, featureName, tLng, tLat, object]
                            coors.push(preserves)
                        }
                        for (const preserve of coors) {
                            let feature = new Feature({geometry: new Point(preserve[0]), geometryName: preserve[1], geometryName_: 'preserve', lng: preserve[2], lat: preserve[3], object: preserve[4]})
                            marker.push(feature)
                        }
                        this.preMarkers = marker
                        const vectorSource = new sVector({features: this.preMarkers})
                        const layer = new Vector({title: '保护区', source: vectorSource, style: [pre_style]})
                        this.preMarkerVectorLayer = new LayerGroup({title: '保护区', layers: [layer]})
                        this.basemap.addLayer(this.preMarkerVectorLayer)
                        this.siteOn = true
                        this.mapLayers['preservesLayer'] = this.preMarkerVectorLayer
                    }),err =>{
                        console.log(err)
                    }
                }),err =>{
                    console.log(err)
                }
            },
			showWater2() {
				this.seaPs = seaPoints
				var params={
					krigingModel:'exponential',//model还可选'gaussian','spherical'
					krigingSigma2:0,
					krigingAlpha:100,
					canvasAlpha:0.5,
					//colors:["#00A600", "#01A600", "#03A700", "#04A700", "#05A800", "#07A800", "#08A900", "#09A900", "#0BAA00", "#0CAA00", "#0DAB00", "#0FAB00", "#10AC00", "#12AC00", "#13AD00", "#14AD00", "#16AE00", "#17AE00", "#19AF00", "#1AAF00", "#1CB000", "#1DB000", "#1FB100", "#20B100", "#22B200", "#23B200", "#25B300", "#26B300", "#28B400", "#29B400", "#2BB500", "#2CB500", "#2EB600", "#2FB600", "#31B700", "#33B700", "#34B800", "#36B800", "#37B900", "#39B900", "#3BBA00", "#3CBA00", "#3EBB00", "#3FBB00", "#41BC00", "#43BC00", "#44BD00", "#46BD00", "#48BE00", "#49BE00", "#4BBF00", "#4DBF00", "#4FC000", "#50C000", "#52C100", "#54C100", "#55C200", "#57C200", "#59C300", "#5BC300", "#5DC400", "#5EC400", "#60C500", "#62C500", "#64C600", "#66C600", "#67C700", "#69C700", "#6BC800", "#6DC800", "#6FC900", "#71C900", "#72CA00", "#74CA00", "#76CB00", "#78CB00", "#7ACC00", "#7CCC00", "#7ECD00", "#80CD00", "#82CE00", "#84CE00", "#86CF00", "#88CF00", "#8AD000", "#8BD000", "#8DD100", "#8FD100", "#91D200", "#93D200", "#95D300", "#97D300", "#9AD400", "#9CD400", "#9ED500", "#A0D500", "#A2D600", "#A4D600", "#A6D700", "#A8D700", "#AAD800", "#ACD800", "#AED900", "#B0D900", "#B2DA00", "#B5DA00", "#B7DB00", "#B9DB00", "#BBDC00", "#BDDC00", "#BFDD00", "#C2DD00", "#C4DE00", "#C6DE00", "#C8DF00", "#CADF00", "#CDE000", "#CFE000", "#D1E100", "#D3E100", "#D6E200", "#D8E200", "#DAE300", "#DCE300", "#DFE400", "#E1E400", "#E3E500", "#E6E600", "#E6E402", "#E6E204", "#E6E105", "#E6DF07", "#E6DD09", "#E6DC0B", "#E6DA0D", "#E6D90E", "#E6D710", "#E6D612", "#E7D414", "#E7D316", "#E7D217", "#E7D019", "#E7CF1B", "#E7CE1D", "#E7CD1F", "#E7CB21", "#E7CA22", "#E7C924", "#E8C826", "#E8C728", "#E8C62A", "#E8C52B", "#E8C42D", "#E8C32F", "#E8C231", "#E8C133", "#E8C035", "#E8BF36", "#E9BE38", "#E9BD3A", "#E9BC3C", "#E9BB3E", "#E9BB40", "#E9BA42", "#E9B943", "#E9B945", "#E9B847", "#E9B749", "#EAB74B", "#EAB64D", "#EAB64F", "#EAB550", "#EAB552", "#EAB454", "#EAB456", "#EAB358", "#EAB35A", "#EAB35C", "#EBB25D", "#EBB25F", "#EBB261", "#EBB263", "#EBB165", "#EBB167", "#EBB169", "#EBB16B", "#EBB16C", "#EBB16E", "#ECB170", "#ECB172", "#ECB174", "#ECB176", "#ECB178", "#ECB17A", "#ECB17C", "#ECB17E", "#ECB27F", "#ECB281", "#EDB283", "#EDB285", "#EDB387", "#EDB389", "#EDB38B", "#EDB48D", "#EDB48F", "#EDB591", "#EDB593", "#EDB694", "#EEB696", "#EEB798", "#EEB89A", "#EEB89C", "#EEB99E", "#EEBAA0", "#EEBAA2", "#EEBBA4", "#EEBCA6", "#EEBDA8", "#EFBEAA", "#EFBEAC", "#EFBFAD", "#EFC0AF", "#EFC1B1", "#EFC2B3", "#EFC3B5", "#EFC4B7", "#EFC5B9", "#EFC7BB", "#F0C8BD", "#F0C9BF", "#F0CAC1", "#F0CBC3", "#F0CDC5", "#F0CEC7", "#F0CFC9", "#F0D1CB", "#F0D2CD", "#F0D3CF", "#F1D5D1", "#F1D6D3", "#F1D8D5", "#F1D9D7", "#F1DBD8", "#F1DDDA", "#F1DEDC", "#F1E0DE", "#F1E2E0", "#F1E3E2", "#F2E5E4", "#F2E7E6", "#F2E9E8", "#F2EBEA", "#F2ECEC", "#F2EEEE", "#F2F0F0", "#F2F2F2"]
					colors:["#006837","#1a9850", "#d9ef8b",  "#a50026"]
					}//colors:["#006837", "#1a9850", "#66bd63", "#a6d96a", "#d9ef8b", "#ffffbf","#fee08b", "#fdae61", "#f46d43", "#d73027", "#a50026"]				};
				var points = [
					{"lat":26.9,"lng":120.1, "value":3.2},
					{"lat":27,"lng":120.1, "value":3.0},
					{"lat":26.8,"lng":119.5, "value":2},
					{"lat":26.9,"lng":120.5, "value":1},
				]
				//points= [{"lat":29.62972222,"lng":103.6905556, "value":1}, {"lat":29.47833333,"lng":103.7508333, "value":24.1},{"lat":29.69166667,"lng":103.4647222, "value":23.1},{"lat":29.62416667,"lng":103.4522222, "value":23.5}]

				var i, j, k, n ;
				n = points.length;
				var t = Array(n);
				var x = Array(n);
				var y = Array(n);
				for(i = 0;i < n ; i++){
					t[i] = points[i].value
					x[i] = points[i].lng;
					y[i] = points[i].lat
				}
				var polygonSource2 = new sVector({
					url:　"../nd3333.json",
					format: new GeoJSON()
				})

				var polygonLayer2 = new Vector({
					source: polygonSource2,
					style: new Style({
					  stroke: new Stroke({
						color: 'blue',
						lineDash: [4],
						width: 3
					  }),
					  fill: new Fill({
						color: 'rgba(0, 0, 255, 0)'
					  })
					})
				});
				var polygon = turf.polygon(world);
				var polygonSource = new sVector({
					features: (new GeoJSON()).readFeatures(polygon)
				});

				var polygonLayer = new Vector({
                    title: '差值边界',
					source: polygonSource,
					style: new Style({
					  stroke: new Stroke({
						color: 'blue',
						lineDash: [4],
						width: 3
					  }),
					  fill: new Fill({
						color: 'rgba(0, 0, 255, 0)'
					  })
					})
				});
				//this.basemap.addLayer(polygonLayer)
				var canvasLayer=null;
				var drawKriging=(extent)=>{
					var that = this
					if (t.length>3){
						var variogram=kriging.train(t,x,y,
							params.krigingModel,params.krigingSigma2,params.krigingAlpha);
						console.log(extent)
						var polygons=[];
						polygons.push([[extent[0],extent[1]],[extent[0],extent[3]],
							[extent[2],extent[3]],[extent[2],extent[1]]]);
						//var grid=kriging.grid(polygons,variogram,(extent[2]-extent[0])/200);
						console.log(new Date())
						//var grid=kriging.grid(world,variogram,(extent[2]-extent[0])/500);
						var grid=kriging.gridModified(world,variogram,(extent[2]-extent[0])/500, seaPoints);
						console.log(new Date())

						var dragboxExtent=extent;
						//移除已有图层console.log(2222222)
						//console.log(JSON.stringify(grid))
						if (this.krigingLayer  !== null){
							this.basemap.removeLayer(this.krigingLayer );
						}
						//创建新图层
						canvasLayer=new Image({
                            title: '插值面',
							source: new ImageCanvas({
								canvasFunction:(extent, resolution, pixelRatio, size, projection) =>{
									let canvas = document.createElement('canvas');
									canvas.width = size[0];
									canvas.height = size[1];
									canvas.style.display='block';
									//设置canvas透明度
									canvas.getContext('2d').globalAlpha=1;

									//使用分层设色渲染
									console.log(2222222)
									kriging.plotModidied(canvas,grid, [extent[0],extent[2]],[extent[1],extent[3]],params.colors,seaPoints);
									console.log([extent[0],extent[2]],[extent[1],extent[3]])
									return canvas;
								},
								projection: 'EPSG:4326'
							})
						})
						//向map添加图层
						//console.log(canvasLayer)
						this.krigingLayer = canvasLayer
						// this.basemap.addLayer(canvasLayer);
					}else {
						console.log("有效样点个数不足，无法插值");
					}
				}

				drawKriging(polygonLayer.getSource().getExtent());
				this.krigingPly = polygonLayer // 差值边界
                this.krigingLayers = new LayerGroup({title: '克里金插值', layers: [this.krigingLayer, this.krigingPly]}) // 注意顺序问题
                this.basemap.addLayer(this.krigingLayers)
                this.mapLayers['KrigingLayer'] = this.krigingLayers
				// this.basemap.addLayer(this.krigingPly);//添加多边形界限
				//this.basemap.addLayer(WFSVectorLayer);//添加插值点

			},
			closeKrigingLayer() {
				if (this.krigingLayer  !== null){
					// this.basemap.removeLayer(this.krigingLayer )
                    // this.basemap.removeLayer(this.krigingPly)
                    this.basemap.removeLayer(this.krigingLayers)
				}
			},
			showWater() {
				var waterjsource = new sVector({
					url:　"../nd333.json",
					format: new GeoJSON()
				})

				var styleFunction = function(feature) {
				  return styles[feature.getGeometry().getType()];
				};

				var image = new Circle({
					radius:333,
					fill: null,
					stroke: new Stroke({
						color: 'red',
						width:1
					})
				})
				var waterLayer = new Vector({
					source: waterjsource,//waterjsource,vectorSource
					style: new Style({
						stroke: new Stroke({
							color:'black'
						}),
						fill: new Fill({
							color: 'rgba(255, 255, 255, 0.6)'
						})
					})
				})
				this.basemap.addLayer(waterLayer)
			}

        },
		watch: {
			parepara(val){
				this.showStWater()
			}
		},
        components: {Map}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .ol-popup {
        position: absolute;
        background-color: #eeeeee;

        -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));

        filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));

        padding: 15px;

        border-radius: 10px;

        border: 1px solid #cccccc;

        bottom: 12px;

        left: -50px;

        min-width: 280px;

    }


    .ol-popup:before {

        top: 100%;

        border: solid transparent;

        content: " ";

        height: 0;

        width: 0;

        position: absolute;

        pointer-events: none;

    }



    .ol-popup:after {

        border-top-color: #eeeeee;

        border-width: 10px;

        left: 48px;

        margin-left: -10px;

    }



    .ol-popup:before {

        border-top-color: #ffffff;

        border-width: 11px;

        left: 48px;

        margin-left: -11px;

    }



    .ol-popup-closer {

        text-decoration: none;

        position: absolute;

        top: 2px;

        right: 8px;

    }



    .ol-popup-closer:after {

        content: "✖";

    }

	.dmap {
		padding: 0px;
		min-width: 600px;
		background-color: #042B5B;
		//width: 100%;
		overflow: auto;
		.left-map {
			background-color: #F5F5F5;
			box-sizing: border-box;
			float: left;
			height: calc(100% - 2px);
			padding: 10px, 10px, 0px, 0px;
			border: 2px solid rgba(22, 99, 180, 1);
			border-radius: 0 10px 10px 0;
			width: 100%;
			overflow: hidden;
		}
	}




	.view {
		box-sizing: border-box;
		/*margin: 30px 20px 20px 20px;*/
		/*height: 150px;*/
	}

	table {
		margin-top: 10px;
		width: 100%;
		border: 1px solid #2C5B93;
	}

	th {
		width: 20%;
		text-align: center;
		background-color: #14448F;
		font-weight: 300;
		color: rgba(255, 255, 255, 1);
		height: 23px;
		font-size: 0.8vw;
	}

	tr {
		font-size: 0.9vw;
		height: 3.5vh;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
		text-align: center;
	}

	td {
		width: 32%;
	}
</style>
