import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
//Vue.prototype.$serverUrl="http://47.92.231.220:8103/";//测试环境
Vue.prototype.$serverUrl="http://140.206.129.162:8101/";//正式环境

App.mpType = 'app'

import store from './store'
Vue.prototype.$store = store

const app = new Vue({
	store,
    ...App
})
app.$mount()
