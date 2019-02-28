<template>
	<div id="app">
		<router-view/>
		<vFooter v-if="$route.meta.showFooter"></vFooter>
	</div>
</template>

<script>
	import { Toast } from 'mint-ui';
	import vFooter from './components/vue-footer.vue';
	export default {
		name: "App",
		data() {
			return {
				mySelected: 'index'
			}
		},
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
		components:{
            vFooter
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