<template>
	<div class="main">
    <div class="top">
      <div class="top-blank"></div>
      <div class="top-mid">
        <span class="title-font">安全生产在线模拟考试平台</span>
      </div>
      <div class="top-left">
        <span class="name-font">{{userName}}</span>
      </div>
      <div class="top-right">
          <img class="logout-image" src="../assets/img/logout.png" @click="exit()">
      </div>
      <div class="top-blank"></div>
    </div>
    <div><img class="banner-image" src="../assets/img/banner.png" ></div>
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
      <div class="menu-item" @click="offlineSyn()">
        <div class="menu-item-inner" style="background-color:#e87475">
          <img class="menu-icon" src="../assets/img/icon_data.png">
          <br/>
          <span class="menu-font">题库同步</span>
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
				// 试题同步URL
				offlineSynUrl: "examination/getQuestionsByType",
				// 获取在线考试试题
				getQuestionsUrl: "/examination/getQuestions",
				// 获取培训信息
				getTrainUrl: "/examination/getTrainByNo"
			}
		},
		methods: {
			// 在线考试
			onlineExam() {
				// 获取在线考试试题
				let parms = {
					examinationType: "1",
					studentNo: localStorage.getItem("studentNo")
				};

				this.postAxios(this.getQuestionsUrl, parms).then(data => {
					if(data.returnCode === '0') {
						// 学员是否参加考试Flag
						let isExamFlag = data.isExamFlag;
						if('1' !== isExamFlag) {
							// 试题信息
							localStorage.setItem("questionInfoList",JSON.stringify(data.questionInfoList));
							// 考试分钟数
							localStorage.setItem("examinationMinute",data.examinationMinute);
							// 培训编号
							localStorage.setItem("trainNo",data.trainNo);
							// 考试编号
							localStorage.setItem("examinationNo",data.examinationNo);
							// 工种岗位
							localStorage.setItem("workType",data.workType);

							// 获取培训类别、培训层次
							var trainNo = data.trainNo;
							this.postAxios(this.getTrainUrl, {trainNo: trainNo}).then(trainData => {
								localStorage.setItem("trainType",trainData.type);
								localStorage.setItem("trainLevel",trainData.level);
							}).catch(trainErr => {
								Toast('出现异常');
							});

							// 考试类型（1：在线考试，2：模拟考试）
							localStorage.setItem("examinationType",'1');
							this.$router.push('/examConfirm');
						} else {
							Toast("您已经参加过该考试");
						}
					} else {
						Toast(data.msg);
					}
				}).catch(err => {
					Toast('出现异常');
				});
			},

			// 模拟考试
			mockExam() {
				// 考试类型（1：在线考试，2：模拟考试）
				localStorage.setItem("examinationType",'2');
				// 清空工种岗位
				localStorage.setItem("workType",'');
				this.$router.push('/examConfirm');
			},

			// 离线学习
			offlineExam() {
				this.$router.push('/offline');
			},

			// 试题同步
			offlineSyn() {
				Indicator.open('加载中...');
				this.postAxios(this.offlineSynUrl).then(data => {
					localStorage.setItem("offlineQuestions",JSON.stringify(data));
					if(JSON.stringify(data).length > 0) {
						Toast("同步成功");
					} else {
						Toast("同步失败，请检查服务器数据");
					}
					Indicator.close();
				}).catch(err => {
					Toast('出现异常', 'error');
					Indicator.close();
				});
			},
			exit() {
				MessageBox({
					title: '提示',
					message: '确定是否退出',
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
  width:22%;
  height:100%;
  text-align:right;
  display:table-cell;
  vertical-align:bottom;
}

.top-mid {
  width:70%;
  height:100%;
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
  font-size: 5vw;
  font-family:微软雅黑;
  color:#FFFFFF;
}

.logout-image {
  height:4vw;
}

.banner-image {
  background-size:contain|cover;
  width:100%;
  height: auto;
}

.div-menu-blank {
  height:1vh;
}

.div-menu {
  width:100%;
  height:25vh;
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