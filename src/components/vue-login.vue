<template>
	<div id="login">
		<el-row class="title">
			<el-col>{{title}}<br/>
			</el-col>
		</el-row>
		<el-row >
			<el-col>
				<el-form :model="info" :rules="rules" ref="info">
					<el-form-item label="身份证号：" prop="userIdcard">
						<el-input
							autofocus 
							v-model="info.userIdcard"
							type="text" 
							placeholder="请输入您的身份证号">
						</el-input>
					</el-form-item>
					<el-form-item label="考试类型：" prop="examinationType">
						<el-radio-group v-model="info.examinationType" >
						<el-radio :key="'0'" :label="'0'">模拟考试</el-radio>
						<el-radio :key="'1'" :label="'1'">正式考试</el-radio>
					</el-radio-group>
					</el-form-item>
					<el-form-item style="text-align:center">
						<el-button type="primary" round  @click="onSubmit('info')">立即登录</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	export default {
		name: "vue-login",
		data() {
			return {
				title: "安全生产在线模拟考试平台",
				labelPosition: "top",
				loginUrl: "/login/userLogin",
				info: {
					userIdcard: "",
					examinationType: '0'
				},
				rules: {
					userIdcard: [
						{ required: true, message: '请输入您的身份证号', trigger: 'blur' }
					]
				}
			}
		},
		methods: {
			messageAlert(msg, type) {
				if(type === 'success' || type === 'warning') {
					this.$message({
						message: msg,
						type: type
					});
				} else if(type === 'error'){
					this.$message.error(msg);
				} else {
					this.$message(msg);
				}
				
			},
			MessageBoxAlert(title, msg) {
				this.$alert(msg, title, {
					confirmButtonText: '确定',
				});
			},
			onSubmit(info) {
				this.$refs[info].validate((valid) => {
					let options = {
						userIdcard: this.info.userIdcard,
						examinationType: this.info.examinationType
					};
					if(valid) {
						this.postAxios(this.loginUrl, options).then(data => {
							//console.log(data);
							 if(data.returnCode === '0') {
								this.messageAlert(data.msg, 'success');

								// 设置用户的身份证号
								localStorage.setItem("userIdcard",this.info.userIdcard);
								// 设置姓名
								localStorage.setItem("userName",data.name);
								// 设置所属单位
								localStorage.setItem("userunits",data.units);
								// 试题信息
								localStorage.setItem("questionInfoList",JSON.stringify(data.questionInfoList));
								// 设置考试类型
								localStorage.setItem("examinationType",this.info.examinationType);
								console.log(localStorage.getItem("questionList"));
								// 跳转到主页
								this.$emit('showIndexPage');
							}else{
								this.messageAlert(data.msg, 'warning');
							 }
						}).catch(err => {
							this.messageAlert('出现异常', 'error');
						});
					}else {
						return false;
					}
		        });
			}
		}
	}
</script>
<style lang="less">
	@import '../assets/css/public.css';
	#login {
		margin-top: 10px;
	}
</style>