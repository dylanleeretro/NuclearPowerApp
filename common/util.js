import Vue from 'vue'

const url = Vue.prototype.$serverUrl; //测试环境
//const url = Vue.prototype.$serverUrl; //正式环境

function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

function showModals(title, content, callback) {
	uni.showModal({
		title: title,
		content: content,
		showCancel: false,
		success: (res) => {
			if (res.confirm) {
				if (callback) {
					callback()
				}
			}
		}
	});
	return false;
}


function ajax(o) {
	uni.request({
		method: o.type || "GET",
		url: url + o.url,
		timeout: 1000000000,
		/* header:{"Cookie":"JWT="+uni.getStorageSync("cookieKey")}, */
		data: o.data || {},
		success: function(data) {
			var status = data.statusCode;
			// console.log(JSON.stringify(data))
			if (status.toString().startsWith("2")) {
				if (o.success) {
					o.success(data);
				}
			} else {
				console.log(JSON.stringify(data));
				if (data.data) {
					uni.showModal({
						content: getFirst(data.data)[0],
					})
				} else {
					uni.showModal({
						content: "请求失败，请稍后再试"
					})
					plus.nativeUI.closeWaiting();
				}
			}
		},
		fail: function(e) {
			/* console.log(e); */
			if (o.fail) {
				o.fail(e)
			} else {
				uni.showModal({
					content: Ajax_error_message(e)
				})
			}
		}
	})
}

// get请求
function get(dataUrl, options) {
	options['url'] = dataUrl;
	options['type'] = 'GET';
	ajax(options);
}

function getParams(dataUrl, params, options) {
	options['url'] = dataUrl;
	options['data'] = params;
	options['type'] = 'GET';
	ajax(options);
}
// POST请求
function post(dataUrl, params, options) {
	options['url'] = dataUrl;
	options['data'] = params;
	options['type'] = 'POST';
	ajax(options);
}

// PATCH请求
function patch(dataUrl, params, options) {
	options['url'] = dataUrl;
	options['data'] = params;
	options['type'] = 'PATCH';
	ajax(options);
}

// DELETE请求
function ajaxDelete(dataUrl, options) {
	options['url'] = dataUrl;
	options['type'] = 'DELETE';
	ajax(options);
}

function Ajax_error_message(data) {
	// data=JSON.parse(data.responseText)
	/* console.log(data) */
	if (data) {
		return data.data.non_field_errors[0]
	} else {
		return "网络超时,请稍后再试";
	}
}

//获取对象的第一个元素
function getFirst(obj) { //obj为我们的对象
	var n = 0;
	for (var key in obj) {
		return obj[key];
	}
}

module.exports = {
	formatTime: formatTime,
	formatLocation: formatLocation,
	dateUtils: dateUtils,
	showModals: showModals,
	get: get,
	post: post,
	getParams: getParams,
	patch: patch,
	ajaxDelete: ajaxDelete
}
