<template>
	<div id="index">
		学员姓名：{{userName}},
		身份证号：{{userIdcard}},
		所属单位：{{userUnits}}
		<mt-button size="large" type="primary" @click="onlineExam()">在线考试</mt-button>
		<mt-button size="large" type="primary" @click="mockExam()">模拟考试</mt-button>
		<mt-button size="large" type="primary" @click="offlineExam()">离线学习</mt-button>
		<mt-button size="large" type="primary" @click="offlineSyn()">试题同步</mt-button>
		<mt-button size="large" type="primary" @click="exit()">退出</mt-button>
	</div>
</template>
<script>
	import { Toast } from 'mint-ui';

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
							this.$emit('showExamConfirmPage');
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
				this.$emit('showExamConfirmPage');
			},

			// 离线学习
			offlineExam() {
				this.$emit('showOfflinePage');
			},

			// 试题同步
			offlineSyn() {
				this.postAxios(this.offlineSynUrl).then(data => {
					localStorage.setItem("offlineQuestions",JSON.stringify(data));
					if(JSON.stringify(data).length > 0) {
						Toast("同步成功");
					} else {
						Toast("同步失败，请检查服务器数据");
					}
				}).catch(err => {
					Toast('出现异常', 'error');
				});
			}
		}
	}
</script>