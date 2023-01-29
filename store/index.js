import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        /**
         * 是否需要强制登录
         */
        forcedLogin: false,
        hasLogin: false,
        userName: "",
		userMobile: "",
		company:"",
		token:"",
		userId:"",
		companyId:"",
		password:"",
		role:"",
		timer:"",
		gps_running: false,
		boxShowHide:false,
		isSuperuser: false
    },
    mutations: {
        loginVuex(state, userData) {
            state.token = userData[0] || '新用户';
			state.userId = userData[1]
			state.userName = userData[2]
			state.userMobile = userData[3]
			state.isSuperuser = userData[4]
        },		
        logoutVuex(state) {
			state.token = "";
			state.userId = "";
            state.userName = "";
			state.userMobile = "";
			state.isSuperuser = false;
        },
		boxShow(state){
			state.boxShowHide = true;
		},
		boxhide(state){
			state.boxShowHide = false;
		},
		stop_gps (state) {
			state.gps_running =false;
			clearInterval(state.timer)			
			state.timer = null
		},
		start_gps (state, timer_new) {
			state.timer = timer_new
			state.gps_running =true;
		},
		/*
		getLocation() {
			console.log("yes")
		}
		*/
    }
})

export default store
