<template>
	<div id="login">
		<div id=“login-top” style="height:87vh">
			<div id="logo">
				<img style="height:120px" src="../assets/img/logo.png">
			</div>
			<!-- 操作区域 -->
			<div class="operateDiv">
				<!-- 身份证号码 -->
				<mt-field  v-model="userIdcard" placeholder="请输入身份证号码" class="myinput" ></mt-field>
				<!-- 登录和切换登录方式块 -->
				<div>
					<mt-button size="large" type="primary" class="mybutton" @click="onlineLogin()">登录</mt-button>
				</div>
			</div>
		</div>
		<div class="footBox"  style="height:8vh">
			<span style="font-size: 14px;color:#676767;">山东黄金矿业（玲珑）有限公司</span>
		</div>
	</div>
</template>
<script>
	import { Toast } from 'mint-ui';

	export default {
		data() {
			return {
				// 登录ControllerURL（在线）
				loginUrl: "/login/userLogin",
				// 身份证号
				userIdcard: ""
			}
		},
		methods: {
			onlineLogin() {
				if(!this.userIdcard) {
					Toast("请输入身份证号码");
					return;
				}
				let options = {
					userIdcard: this.userIdcard
				};
				this.postAxios(this.loginUrl, options).then(data => {
					if(data.returnCode === '0') {
						Toast(data.msg);
						// 学员编号
						localStorage.setItem("studentNo",data.studentNo);
						// 设置用户的身份证号
						localStorage.setItem("userIdcard",this.userIdcard);
						// 设置姓名
						localStorage.setItem("userName",data.name);
						// 设置性别
						localStorage.setItem("userSex",data.sex);
						// 设置所属单位
						localStorage.setItem("userUnits",data.units);
						// 跳转到登录确认页面
						this.$router.replace ('/');
					}else{
						Toast(data.msg,);
					}
				}).catch(err => {
					Toast('出现异常');
				});
			},
		}
	}
</script>
<style scoped>
    /* 操作区域的样式*/
    .operateDiv {
      padding-left: 20px;
      padding-right: 20px;
    }
    .mybutton {
      margin-top: 20px;
    }
    .myinput {
      margin-top: 30px;
      border:1px solid rgb(234,234,234);
      border-radius:5px;
      min-height:41px;
    }
    .imgDiv {
      display: flex;
      justify-content: center;
    }

	#logo {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin-top: 5vh;
	}
.footBox {
	width: 100%;
	text-align: center;
	color: #676767;
}

</style>