<template>
    <div>
        这是预览页
		{{count}}秒后页面跳转
    </div>
</template>

<script>
	export default {
		data() {
			return {
				count:""//倒计时
			}
		},
		methods: {
			goGrdoupRecor(){
				const TIME_COUNT = 3;
				if(!this.timer){
					this.count = TIME_COUNT;
					this.show = false;
					this.timer = setInterval(()=>{
						if(this.count > 0 && this.count <= TIME_COUNT){
							this.count--;
						}else{
							this.show = true;
							clearInterval(this.timer);
							this.timer = null;
							//跳转的页面写在此处
							this.$router.push('/');

						}
					},1000)
				}
			}
        },
	    mounted() {
            this.goGrdoupRecor()
        }
    }
</script>

<style scoped>

</style>