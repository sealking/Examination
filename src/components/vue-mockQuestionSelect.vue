<template>
	<div>
		<el-row>
			<el-col :span="18" :offset="3">
			<el-table ref="mockExamTable" :data="mockExamTableData" highlight-current-row @current-change="handleCurrentChange" style="width: 100%">
				<el-table-column property="questionsNo" label="题库编号"></el-table-column>
				<el-table-column property="settingDate" label="日期" width="160"></el-table-column>
				<el-table-column v-if="false" property="studentNo" label="学员编号"></el-table-column>
			</el-table>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="18" :offset="3">
				<el-button  type="primary" @click="randomOnClick()" >随机生成试题</el-button>
				<el-button  type="primary" @click="selectOnClick()" >选择试题</el-button>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	import { Toast } from 'mint-ui';
	export default {
		data() {
			return {
				mockExamTableData: [],
				currentRow: null,
				getExamListUrl: "/examination/getExamListByStuNo",
				getQuestionsUrl: "/examination/getQuestions",
				getQuestionsByDateUrl: "/examination/getQuestionsByDate"

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.currentRow = val;
			},
			randomOnClick() {
				let parms = {
					examinationType: "2",
					studentNo: localStorage.getItem("studentNo"),
					questionType: localStorage.getItem("questionType"),
					workType: localStorage.getItem("workType")
				};

				this.postAxios(this.getQuestionsUrl, parms).then(data => {
					if(data.returnCode === '0') {
						// 试题信息
						localStorage.setItem("questionInfoList",JSON.stringify(data.questionInfoList));
						// 考试分钟数
						localStorage.setItem("examinationMinute",data.examinationMinute);
						this.$router.replace('examIndex');
					} else {
						Toast(data.msg);
					}
				}).catch(err => {
					Toast('出现异常');
				});
			},
			selectOnClick() {

				if(this.currentRow === null) {
					Toast('请选择相应的试题');
				} else {
					let parms = {
						studentNo: this.currentRow.studentNo,
						questionsNo: this.currentRow.questionsNo,
						settingDate: this.currentRow.settingDate
					};

					this.postAxios(this.getQuestionsByDateUrl, parms).then(data => {
						if(data.returnCode === '0') {
							// 试题信息
							localStorage.setItem("questionInfoList",JSON.stringify(data.questionInfoList));
							// 考试分钟数
							localStorage.setItem("examinationMinute",data.examinationMinute);
							this.$router.replace('examIndex');
						} else {
							Toast(data.msg);
						}
					}).catch(err => {
						Toast('出现异常');
					});



				}



			}
		},
		mounted() {
			let parm = {
				studentNo: localStorage.getItem("studentNo"),
				workType: localStorage.getItem("workType"),
			}
			this.postAxios(this.getExamListUrl, parm).then(data => {
					this.mockExamTableData = data;
					console.log(this.mockExamTableData);
				}).catch(err => {
					Toast('出现异常');
				});
		}
	}
</script>