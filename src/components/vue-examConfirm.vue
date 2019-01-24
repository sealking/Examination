<template>
	<div>
		<el-row >
			<el-col :span="18" :offset="3">
				<div>培训类别：
					<el-select v-model="trainingType" :disabled="examinationType === '1'">
						<el-option
							v-for="item in trainingTypeOptions"
							:key="item.typeDetailCode"
							:label="item.typeDetailName"
							:value="item.typeDetailCode">
						</el-option>
					</el-select>
				</div>
				<div>培训层次：
					<el-select v-model="trainingLevel" :disabled="examinationType === '1'">
						<el-option
							v-for="item in trainingLevelOptions"
							:key="item.typeDetailCode"
							:label="item.typeDetailName"
							:value="item.typeDetailCode">
						</el-option>
					</el-select>
				</div>
				<div>工种岗位：
					<el-select v-model="workType" @change="workTypeOnchange()" :disabled="examinationType === '1'">
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
				<el-button  v-if="examinationType === '1'" type="primary" @click="onlineOnClick()" >在线考试</el-button>
				<el-button  v-if="examinationType === '2'" type="primary" @click="mockOnClick()" >模拟考试</el-button>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	import { Toast } from 'mint-ui';
	export default {
		data() {
			return {
				// 考试类型（1：在线考试，2：模拟考试）
				examinationType: localStorage.getItem("examinationType"),
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
				getDataTypeInfoUrl: "/common/getDataTypeInfo",
				getQuestionsTypeUrl: "/examination/getQuestionsType",
				updateExamFlagUrl: "/examination/updateIsExamFlag",
				updateScoreUrl: "/examination/updateScore"
			}
		},
		methods: {
			workTypeOnchange() {
				// 获取题库种类
				this.postAxios(this.getQuestionsTypeUrl, {workTypeCode: this.workType}).then(data => {
					this.questionsType = data.questionsType;
				}).catch(err => {
					Toast('出现异常');
				});
			},
			onlineOnClick() {
				// 更新成绩表中的是否考试Flg
				let option = {
					stuNo: localStorage.getItem("studentNo"),
					examNo: localStorage.getItem("examinationNo"),
					score: 0
				}
				this.postAxios(this.updateExamFlagUrl, option).then(data => {
				}).catch(err => {
					Toast('出现异常');
				});
				// 初始化成绩表中的成绩
				this.postAxios(this.updateScoreUrl, option).then(data => {
				}).catch(err => {
					Toast('出现异常');
				});
				this.$emit('showExamIndexPage');
			},
			mockOnClick() {
				if(this.dataValid()) {
					localStorage.setItem("workType",this.workType);
					this.$emit('showMockQuestionSelectPage');
				}
			},

			dataValid() {
				if(this.workType === "") {
					Toast('工种岗位不能为空，请选择');
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
				Toast('出现异常');
			});

			
			// 获取培训层次
			this.postAxios(this.getDataTypeInfoUrl, {typeCode: 'pxcc'}).then(data => {
				this.trainingLevelOptions = data.dataTypeList;

			}).catch(err => {
				Toast('出现异常');
			});

			// 获取工种
			this.postAxios(this.getDataTypeInfoUrl, {typeCode: 'gz'}).then(data => {
				this.workTypeOptions= data.dataTypeList;
			}).catch(err => {
				Toast('出现异常');
			});
			
			// 在线考试
			if(this.examinationType === '1') {
				this.trainingType = localStorage.getItem("trainType");
				this.trainingLevel = localStorage.getItem("trainLevel");
				this.workType = localStorage.getItem("workType");

				// 获取题库种类
				this.postAxios(this.getQuestionsTypeUrl, {workTypeCode: this.workType}).then(data => {
					this.questionsType = data.questionsType;
				}).catch(err => {
					Toast('出现异常');
				});


			}


		}
	}
</script>