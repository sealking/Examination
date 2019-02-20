<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<script>
	import { Toast } from 'mint-ui';

	export default {
		name: "App",
		// 监听,当路由发生变化的时候执行
		watch:{
  			$route(to,from){
				let studentNo = localStorage.getItem("studentNo");
				
				if(to.name === 'login' || to.name === 'index') {
					if(studentNo) {
						this.$router.push('/');
					} else {
						this.$router.push('/login');
					}
				}
				
  			}
		},
		mounted() {
			let studentNo = localStorage.getItem("studentNo");
			if(studentNo) {
				this.$router.push('/');
			} else {
				this.$router.push('/login');
			}
		}
	}
</script>