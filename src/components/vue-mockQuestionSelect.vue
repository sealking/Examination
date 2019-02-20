<template>
	<div id="exam_history" class="operateDiv">
    <div class="box">
		<mt-header fixed title="题库列表" style="font-size:16px">
			<mt-button slot="left" style="font-size:14px" @click="$router.back(-1)">返回</mt-button>
		</mt-header>
    </div>
    <div class="history-wrapper" id="history">
		<div><mt-cell style="text-align:left" title="题库编号" ><span style="text-align:right">日期</span></mt-cell></div>
      <div v-for="item in mockExamTableData" v-bind:key="item.settingDate" @click="selectOnClick(item)" >
		  
        <mt-cell
          style="text-align:left"
          v-bind:title="item.questionsNo"
        >{{item.settingDate}}</mt-cell>
      </div>
    </div>
    <div class="footBox">
      <mt-button size="large" type="primary" class="mybutton" @click="randomOnClick()">随机生成试题</mt-button>
    </div>
  </div>
</template>
<script>
	import { Toast } from 'mint-ui';
	import { Indicator } from 'mint-ui';
	
	export default {
		data() {
			return {
				// 模拟考试历史列表
				mockExamTableData: [],
				// 获取模拟考试历史列表URL
				getExamListUrl: "/examination/getExamListByStuNo",
				// 随机获取模拟试题URL
				getQuestionsUrl: "/examination/getQuestions",
				// 根据日期获得模拟试题URL
				getQuestionsByDateUrl: "/examination/getQuestionsByDate"

			}
		},
		methods: {
			randomOnClick() {
				let parms = {
					examinationType: "2",
					studentNo: localStorage.getItem("studentNo"),
					questionType: localStorage.getItem("questionType"),
					workType: localStorage.getItem("workType")
				};
				Indicator.open('试题生成中...');
				this.postAxios(this.getQuestionsUrl, parms).then(data => {
					if(data.returnCode === '0') {
						// 试题信息
						localStorage.setItem("questionInfoList",JSON.stringify(data.questionInfoList));
						// 考试分钟数
						localStorage.setItem("examinationMinute",data.examinationMinute);
						Indicator.close();
						this.$router.replace('examIndex');
					} else {
						Indicator.close();
						Toast(data.msg);
					}
				}).catch(err => {
					Indicator.close();
					Toast('出现异常');
				});
			},
			selectOnClick(item) {
				let parms = {
					studentNo: item.studentNo,
					questionsNo: item.questionsNo,
					settingDate: item.settingDate
				};
				Indicator.open('试题生成中...');
				this.postAxios(this.getQuestionsByDateUrl, parms).then(data => {
					if(data.returnCode === '0') {
						// 试题信息
						localStorage.setItem("questionInfoList",JSON.stringify(data.questionInfoList));
						// 考试分钟数
						localStorage.setItem("examinationMinute",data.examinationMinute);
						Indicator.close();
						this.$router.replace('examIndex');
					} else {
						Indicator.close();
						Toast(data.msg);
					}
				}).catch(err => {
					Indicator.close();
					Toast('出现异常');
				});
			}
		},
		mounted() {
			let parm = {
				studentNo: localStorage.getItem("studentNo"),
				workType: localStorage.getItem("workType"),
			}
			this.postAxios(this.getExamListUrl, parm).then(data => {
					this.mockExamTableData = data;
				}).catch(err => {
					Toast('出现异常');
				});
		}
	}
	
</script>
<style scoped>
/* 操作区域的样式*/
	.mybutton {
		margin-top: 20px;
			display: inline-block;
			width: 90%;
			font-size: 16px;
		}

	.history-wrapper {
		height: 85vh;
		overflow: scroll;
	}

	.history-list {
		list-style: none;
	}

	.history-listitem {
		height: 50px;
		line-height: 50px;
		border-radius: 2px;
		border-bottom: solid 1px rgb(234, 234, 234);
	}

	.box {
		display: -webkit-flex; /*在webkit内核的浏览器上使用要加前缀*/
		display: flex;
		flex-direction: column;
		border-bottom: solid 1px rgb(234, 234, 234);
		padding-bottom: 30px;
	}

	.footBox {
			margin-bottom: 0px;
			position: absolute;
			bottom: 1px;
			left: 0px;
			width: 100%;
			text-align: center;
	}
</style>