<template>
    <div>
        <div class="box">
			<mt-header fixed title="个人信息" style="font-size:16px">
			</mt-header>
		</div>
        <mt-cell :title="userName"></mt-cell>
        <mt-cell :title="userSex"></mt-cell>
        <mt-cell :title="userIdcard"></mt-cell>
        <mt-cell :title="userUnits"></mt-cell>
        <mt-button type="primary" size="large" @click="exit()">退出登录</mt-button>
    </div>
</template>

<script>
	import { Toast } from 'mint-ui';
	import { Indicator } from 'mint-ui';
	import { MessageBox } from 'mint-ui';

	export default {
		data() {
			return {
				// 身份证号
				userIdcard: localStorage.getItem("userIdcard"),
				// 学员姓名
                userName: localStorage.getItem("userName"),
                // 学员性别
                userSex: localStorage.getItem("userSex"),
				// 所属单位
                userUnits: localStorage.getItem("userUnits")
			}
		},
		methods: {
            // 退出登录
            exit() {
				MessageBox({
					title: '提示',
					message: '确定要退出登录？',
					showConfirmButton: true,
					showCancelButton: true
				})
				.then(action => {
					if (action == 'confirm') { //确认的回调
						// 学员编号
						localStorage.setItem("studentNo", '');
						// 设置用户的身份证号
						localStorage.setItem("userIdcard",'');
						// 设置姓名
                        localStorage.setItem("userName",'');
                        // 设置性别
                        localStorage.setItem("userSex",'');
						// 设置所属单位
						localStorage.setItem("userUnits",'');
						// 试题信息
						localStorage.setItem("questionInfoList",JSON.stringify([]));
						// 考试分钟数
						localStorage.setItem("examinationMinute",0);
						// 培训编号
						localStorage.setItem("trainNo",'');
						// 考试编号
						localStorage.setItem("examinationNo",'');
						// 工种岗位
						localStorage.setItem("workType",'');
						// 培训类别
						localStorage.setItem("trainType",'');
						// 培训层次
						localStorage.setItem("trainLevel",'');
						// 考试类型（1：在线考试，2：模拟考试）
						localStorage.setItem("examinationType",'');
						// 分数
						localStorage.setItem("score", 0);
						// 回答的题数
						localStorage.setItem("answerNumber", 0);
						// 总题数
						localStorage.setItem("totalNumber", 0);
						this.$router.push('/login');
					}
				}).catch(err => { 
					Toast('出现异常');
                });
			}
        },
	    mounted() {
            // 身份证号
            let idCard = localStorage.getItem("userIdcard");
            let startNum = idCard.length - 6;
            let endNum = idCard.length - 2;
            idCard = idCard.substring(0,startNum) + "****" + idCard.substring(endNum,idCard.length);
            this.userIdcard = "身份证号码：" + idCard;
			// 学员姓名
            this.userName = "姓名：" + localStorage.getItem("userName");
            // 学员性别
            let sex = localStorage.getItem("userSex");
            if(sex === '1') {
                this.userSex = "性别：男";
            } else {
                this.userSex = "性别：女";
            }
			// 所属单位
			this.userUnits = "所属单位：" + localStorage.getItem("userUnits");
        }
    }
</script>

<style scoped>
.box {
		display: -webkit-flex; /*在webkit内核的浏览器上使用要加前缀*/
		display: flex;
		flex-direction: column;
		border-bottom: solid 1px rgb(234, 234, 234);
		padding-bottom: 30px;
	}
</style>