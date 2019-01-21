<template>
	<div id="login">
		<el-row class="title">
			<el-col :span="18" :offset="3">{{title}}</el-col>
		</el-row>
		<el-row >
			<el-col :span="18" :offset="3">
				<el-form :model="info" :rules="rules" ref="info">
					<el-form-item label="身份证号：" prop="userIdcard">
						<el-input
							autofocus 
							v-model="info.userIdcard"
							type="text" 
							placeholder="请输入您的身份证号">
						</el-input>
					</el-form-item>
				</el-form>
				试题类型：
				<el-radio-group v-model="info.questionType" >
					<el-radio :key="'1'" :label="'1'">在线试题</el-radio>
					<el-radio :key="'2'" :label="'2'">离线试题</el-radio>
				</el-radio-group>
				<el-button type="primary" round  @click="onSubmit('info')" center="true">立即登录</el-button>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				title: "安全生产在线模拟考试平台",
				loginUrl: "/login/userLogin",
				info: {
					userIdcard: "",
					questionType: '1'
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
						userIdcard: this.info.userIdcard
					};
					if(valid) {
						this.postAxios(this.loginUrl, options).then(data => {
							 if(data.returnCode === '0') {
								this.messageAlert(data.msg, 'success');
								// 学员编号
								localStorage.setItem("studentNo",data.studentNo);
								// 设置用户的身份证号
								localStorage.setItem("userIdcard",this.info.userIdcard);
								// 设置姓名
								localStorage.setItem("userName",data.name);
								// 设置所属单位
								localStorage.setItem("userUnits",data.units);
								// 设置试题类型（1：在线试题，2：离线试题）
								localStorage.setItem("questionType",this.info.questionType);
								// 跳转到登录确认页面
								this.$emit('showLoginConfirmPage');
							}else{
								this.messageAlert(data.msg, 'error');
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