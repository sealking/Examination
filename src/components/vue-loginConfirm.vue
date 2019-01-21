<template>
	<div>
		<el-row >
			<el-col :span="18" :offset="3">
				<div>身份证号：{{userIdcard}}</div>
				<div>所属单位：{{userUnits}}</div>
				<div>培训类别：
					<el-select v-model="trainingType">
						<el-option
							v-for="item in trainingTypeOptions"
							:key="item.typeDetailCode"
							:label="item.typeDetailName"
							:value="item.typeDetailCode">
						</el-option>
					</el-select>
				</div>
				<div>培训层次：
					<el-select v-model="trainingLevel">
						<el-option
							v-for="item in trainingLevelOptions"
							:key="item.typeDetailCode"
							:label="item.typeDetailName"
							:value="item.typeDetailCode">
						</el-option>
					</el-select>
				</div>
				<div>工种岗位：
					<el-select v-model="workType" @change="workTypeOnchange()">
						<el-option
							v-for="item in workTypeOptions"
							:key="item.typeDetailCode"
							:label="item.typeDetailName"
							:value="item.typeDetailCode">
						</el-option>
					</el-select>
				</div>
				<div>题库种类：{{questionsType}}</div>
			</el-col>
		</el-row>
		<el-row class="answer">
			<el-col :span="18" :offset="3">
				<el-button  v-if="questionType === '1'" type="primary" @click="onlineOnClick()" >在线考试</el-button>
				<el-button  type="primary" @click="mockOnClick()" >模拟考试</el-button>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				// 身份证号码
				userIdcard: localStorage.getItem("userIdcard"),
				// 所属单位
				userUnits: localStorage.getItem("userUnits"),
				// 试题类型（1：在线试题，2：离线试题）
				questionType: localStorage.getItem("questionType"),
				// 培训类别Options
				trainingTypeOptions: [],
				// 培训层次Options
				trainingLevelOptions: [],
				// 工种岗位Options
				workTypeOptions: [],
				// 培训类别选中数据
				trainingType: "",
				// 培训层次选中数据
				trainingLevel: "",
				// 工种岗位选中数据
				workType: "",
				// 题库种类
				questionsType: "",
				loginConfirmUrl: "/login/userLogin",
				getDataTypeInfoUrl: "/common/getDataTypeInfo",
				getQuestionsTypeUrl: "/examination/getQuestionsType",
				getQuestionsUrl: "/examination/getQuestions"
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
			workTypeOnchange() {
				// 获取题库种类
				this.postAxios(this.getQuestionsTypeUrl, {workTypeCode: this.workType}).then(data => {
					this.questionsType = data.questionsType;
				}).catch(err => {
					this.messageAlert('出现异常', 'error');
				});
			},
			onlineOnClick() {
				let parms = {
					examinationType: "1",
					studentNo: localStorage.getItem("studentNo"),
					questionType: localStorage.getItem("questionType")
				};

				localStorage.setItem("examinationType","1");
				this.postAxios(this.getQuestionsUrl, parms).then(data => {
					if(data.returnCode === '0') {
						// 试题信息
						localStorage.setItem("questionInfoList",JSON.stringify(data.questionInfoList));
						// 考试分钟数
						localStorage.setItem("examinationMinute",data.examinationMinute);
						this.$emit('showIndexPage');
					} else {
						this.messageAlert(data.msg, 'error');
					}
				}).catch(err => {
					this.messageAlert('出现异常', 'error');
				});
			},
			mockOnClick() {
				if(this.dataValid()) {
					localStorage.setItem("examinationType","2");
					localStorage.setItem("workType",this.workType);
					this.$emit('showMockQuestionSelectPage');
				}
			},

			dataValid() {
				if(this.workType === "") {
					this.messageAlert('工种岗位不能为空，请选择', 'error');
					return false;
				}
				return true;
			}
		},
		mounted() {
			// 获取培训类别
			this.postAxios(this.getDataTypeInfoUrl, {typeCode: 'pxlb'}).then(data => {
				this.trainingTypeOptions = data.dataTypeList;
			}).catch(err => {
				this.messageAlert('出现异常', 'error');
			});

			
			// 获取培训层次
			this.postAxios(this.getDataTypeInfoUrl, {typeCode: 'pxcc'}).then(data => {
				this.trainingLevelOptions = data.dataTypeList;

			}).catch(err => {
				this.messageAlert('出现异常', 'error');
			});

			// 获取工种
			this.postAxios(this.getDataTypeInfoUrl, {typeCode: 'gz'}).then(data => {
				this.workTypeOptions= data.dataTypeList;
			}).catch(err => {
				this.messageAlert('出现异常', 'error');
			});




		}
	}
</script>