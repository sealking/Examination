<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<script>
	import { Toast } from 'mint-ui';

	export default {
		name: "App",
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