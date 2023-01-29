<script>
	export default {
		onLaunch: function() {
			/* this.login(); */
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			/* this.login(); */
			console.log('App Hide')
		},
		/* methods:{
			login:function(){
				uni.request({
					method:"POST",
					url:"http://47.92.231.220:8101/login/",
					data: {
						username: "admin",
						password: "rainbowfish123..",
					},
					success:function(res){
					},
					fail:function(e){
						if(o.fail){
							o.fail(e)
						}else{
							uni.showModal({
								content:Ajax_error_message(e)
							})
						}
					}
				})
			}
		} */
	}
</script>

<style>
	/*每个页面公共css */
</style>
