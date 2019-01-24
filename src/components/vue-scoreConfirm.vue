<template>
	<div>
		<el-row >
			<el-col :span="18" :offset="3">
				<div>您本次测试的分数为：{{score}}分</div>
				<el-button type="primary" @click="submitClick()">确认</el-button>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				// 分数
				score: localStorage.getItem("score")
			}
		},
		methods: {
			submitClick() {
				this.$router.push('/');
			}
		}
	}
</script>