<template>
	<div class="main">
    <div class="top">
      <div class="top-blank"></div>
      <div class="top-mid">
        <span class="title-font">安全生产在线模拟考试平台</span>
      </div>
      <div class="top-blank"></div>
    </div>
  	<!-- <div><img class="banner-image" src="../assets/img/banner.png" ></div> -->
		<div class="banner">
      <div class="banner-text">
        <span class="banner-font">关注安全 关注生命</span>
      </div>
    </div>
    <div class="div-menu-blank"></div>
    <div class="div-menu">
      <div class="menu-bank"></div>
      <div class="menu-item" @click="onlineExam()">
        <div class="menu-item-inner" style="background-color:#2c8dff">
          <img class="menu-icon" src="../assets/img/icon_online.png">
          <br/>
          <span class="menu-font">在线考试</span>
        </div>
      </div>
      <div class="menu-bank"></div>
      <div class="menu-item" @click="mockExam()">
        <div class="menu-item-inner" style="background-color:#8e91fa">
          <img class="menu-icon" src="../assets/img/icon_simulate.png">
          <br/>
          <span class="menu-font">模拟考试</span>
        </div>
      </div>
      <div class="menu-bank"></div>
    </div>
    <div class="div-menu-blank"></div>
    <div class="div-menu">
      <div class="menu-bank"></div>
      <div class="menu-item" @click="offlineExam()">
        <div class="menu-item-inner" style="background-color:#26bfab">
          <img class="menu-icon" src="../assets/img/icon_offline.png">
          <br/>
          <span class="menu-font">离线学习</span>
        </div>
      </div>
      <div class="menu-bank"></div>
      <div class="menu-item" @click="fileDownload()">
        <div class="menu-item-inner" style="background-color:#e87475">
          <img class="menu-icon" src="../assets/img/icon_data.png">
          <br/>
          <span class="menu-font">文件学习</span>
        </div>
      </div>
      <div class="menu-bank"></div>
    </div>
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
				// 所属单位
				userUnits: localStorage.getItem("userUnits"),
				// // 获取在线考试试题
				// getQuestionsUrl: "/examination/getQuestions",
				// 获取培训信息
        getTrainUrl: "/examination/getTrainByNo",
        // 登录ControllerURL（在线）
				loginUrl: "/login/userLogin"
			}
		},
		methods: {
      
			// 在线考试
			onlineExam() { 
        let options = {
          userIdcard: localStorage.getItem("userIdcard")
        };

        this.postAxios(this.loginUrl, options).then(data => {
          if(data.returnCode === '0') {
            // 考试类型（1：在线考试，2：模拟考试）
            localStorage.setItem("examinationType",'1');
            // 清空题库
            localStorage.setItem("questionBank",'');
            this.$router.push('/examConfirm');
          } else {
            this.exit();
          }
        }).catch(err => {
          Toast('出现异常');
        });
        
				// // 获取在线考试试题
				// let parms = {
				// 	examinationType: "1",
				// 	studentNo: localStorage.getItem("studentNo")
				// };
        // Indicator.open('试题生成中...');
				// this.postAxios(this.getQuestionsUrl, parms).then(data => {
				// 	if(data.returnCode === '0') {
				// 		// 学员是否参加考试Flag
				// 		let isExamFlag = data.isExamFlag;
				// 		if('1' !== isExamFlag) {
				// 			// 试题信息
				// 			localStorage.setItem("questionInfoList",JSON.stringify(data.questionInfoList));
				// 			// 考试分钟数
				// 			localStorage.setItem("examinationMinute",data.examinationMinute);
				// 			// 培训编号
				// 			localStorage.setItem("trainNo",data.trainNo);
				// 			// 考试编号
				// 			localStorage.setItem("examinationNo",data.examinationNo);
				// 			// 工种岗位
				// 			localStorage.setItem("workType",data.workType);

				// 			// 获取培训类别、培训层次
				// 			localStorage.setItem("trainType",data.trainType);
        //       localStorage.setItem("trainLevel",data.trainLevel);

				// 			// 考试类型（1：在线考试，2：模拟考试）
        //       localStorage.setItem("examinationType",'1');
        //       Indicator.close();
				// 			this.$router.push('/examConfirm');
				// 		} else {
        //       Indicator.close();
        //       Toast("您已经参加过该考试");
				// 		}
				// 	} else {
        //     Indicator.close();
        //     Toast(data.msg);
				// 	}
				// }).catch(err => {
        //   Indicator.close();
        //   Toast('出现异常');
				// });
			},

			// 模拟考试
			mockExam() {
        let options = {
          userIdcard: localStorage.getItem("userIdcard")
        };

        this.postAxios(this.loginUrl, options).then(data => {
          if(data.returnCode === '0') {
            // 考试类型（1：在线考试，2：模拟考试）
          localStorage.setItem("examinationType",'2');
          // 清空工种岗位
          localStorage.setItem("questionBank",'');
          this.$router.push('/examConfirm');
          } else {
            this.exit();
          }
        }).catch(err => {
          Toast('出现异常');
        });
			},

			// 离线学习
			offlineExam() {
				this.$router.push('/offline');
      },
      // 文件学习
			fileDownload() {
      let options = {
          userIdcard: localStorage.getItem("userIdcard")
        };

        this.postAxios(this.loginUrl, options).then(data => {
          if(data.returnCode === '0') {
            this.$router.push('/fileDownload');
          } else {
            this.exit();
          }
        }).catch(err => {
          Toast('出现异常');
        });
      },
      
      // 用户有效性校验
      exit() {
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
        // 设置所属单位ID
        localStorage.setItem("userUnitsId",'');
        // 试题信息
        localStorage.setItem("questionInfoList",JSON.stringify([]));
        // 考试分钟数
        localStorage.setItem("examinationMinute",0);
        // 培训编号
        localStorage.setItem("trainNo",'');
        // 考试编号
        localStorage.setItem("examinationNo",'');
        // 考试类型（1：在线考试，2：模拟考试）
        localStorage.setItem("examinationType",'');
        // 分数
        localStorage.setItem("score", 0);
        // 回答的题数
        localStorage.setItem("answerNumber", 0);
        // 总题数
        localStorage.setItem("totalNumber", 0);
        // 题库编号
        localStorage.setItem("questionBank",'');
        // 设置学员类别
        localStorage.setItem("userType",'');
        // 考试设定时间
        localStorage.setItem("questionsSettingDate",'');
        Toast("无效用户，请于管理员联系");
        this.$router.push('/login');
      }
		}
	}
</script>

<style scoped>

.top {
  width:100%;
  height:10vh;
  background-color:#2C8BFF;
  display:table;
}

.top-blank {
  width:1%;
}

.top-left {
  width:17%;
  height:100%;
  text-align:right;
  display:table-cell;
  vertical-align:bottom;
}

.top-mid {
  text-align:center;
  display:table-cell;
  vertical-align:middle;
}

.top-right {
  width:6%;
  height:100%;
  text-align:right;
  display:table-cell;
  vertical-align:bottom;
}

.name-font {
  font-style:normal;
  font-weight:bold;
  font-size: 4vw;
  font-family:微软雅黑;
  color:#cdcdcd;
}

.title-font {
  font-style:normal;
  font-weight:bold;
  font-size: 6vw;
  font-family:微软雅黑;
  color:#FFFFFF;
}

.logout-image {
  height:4vw;
}

.banner-image {
  background-size:contain|cover;
  width:100%;
  height:auto;
}

.banner {
  width:100%;
  height: 36vh;
  background: url('../assets/img/banner.png') no-repeat;
  background-size: auto 100%;
  display:table;
}

.banner-text {
  width:100%;
  height:100%;
  text-align:center;
  display:table-cell;
  vertical-align:middle;
}

.banner-font {
  font-style:normal;
  font-weight:bold;
  font-size: 7vw;
  font-family:微软雅黑;
  color:#F53A00;
}

.div-menu-blank {
  height:1vh;
}

.div-menu {
  width:100%;
  height:22vh;
  display: flex;
  justify-content: center;
}

.div-menu-bottom {
   width:100%;
  height:5vh;
  display: flex;
  justify-content: center;
}

.menu-bank {
  width:2%;
}

.menu-item {
  width:47%;
  height:100%;
  display:table;
}

.menu-item-bottom {
  width:97%;
  height:100%;
  display:table;
}

.menu-item-inner {
  display:table-cell;
  vertical-align:middle;
  text-align:center;
}

.menu-icon {
  height:15vw;
}

.menu-font {
  color:white;
  font-size: 4.5vw;
}
</style>