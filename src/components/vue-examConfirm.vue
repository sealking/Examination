<template>
	<div id="simulated_exam" class="operateDiv">
		<mt-cell style="text-align:left" title="培训类别" is-link @click.native="handleClickTrainingType">
			<span style="color: green">{{trainingType}}</span>
		</mt-cell>

		<mt-cell style="text-align:left" title="培训层次" is-link @click.native="handleClickTrainingLevel">
		<span style="color: green">{{trainingLevel}}</span>
		</mt-cell>

		<mt-cell style="text-align:left" title="工种岗位" is-link @click.native="handleClickWorkType">
		<span style="color: green">{{workType}}</span>
		</mt-cell>

		<mt-popup v-model="trainingTypeVisible" position="bottom" style="width:100vw">
			<mt-picker :slots="trainingTypeOptions" @change="onTypeValuesChange" valueKey="value"></mt-picker>
		</mt-popup>

		<mt-popup v-model="trainingLevelVisible" position="bottom" style="width:100vw">
		<mt-picker :slots="trainingLevelOptions" @change="onLevelValuesChange" valueKey="value"></mt-picker>
		</mt-popup>

		<mt-popup v-model="workTypeVisible" position="bottom" style="width:100vw">
		<mt-picker :slots="workTypeOptions" @change="onProfessionValuesChange" valueKey="value"></mt-picker>
		</mt-popup>
    	<div>
			题库种类：{{questionsType}}
			<mt-button v-if="examinationType === '1'" size="large" type="primary" class="mybutton" @click="onlineOnClick()">在线考试</mt-button>
            <mt-button v-if="examinationType === '2'" size="large" type="primary" class="mybutton" @click="mockOnClick()">模拟考试</mt-button>
        </div>
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
				// 培训类别选中数据
				trainingTypeKey: "",
				// 培训层次选中数据
				trainingLevelKey: "",
				// 工种岗位选中数据
				workTypeKey: "",
				// 题库种类
				questionsType: "",
				getDataTypeInfoUrl: "/common/getDataTypeInfo",
				getQuestionsTypeUrl: "/examination/getQuestionsType",
				updateExamFlagUrl: "/examination/updateIsExamFlag",
				updateScoreUrl: "/examination/updateScore",
				getTypeInfoByDetailCodeUrl: "common/getDataTypeInfoByDetailCode",
				trainingTypeVisible: false,
				trainingLevelVisible: false,
				workTypeVisible: false,
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
				this.$router.push('/examIndex');
			},
			mockOnClick() {
				if(this.dataValid()) {
					localStorage.setItem("workType",this.workTypeKey);
					this.$router.push('mockQuestionSelect');
				}
			},

			dataValid() {
				if(this.workTypeKey === '0') {
					Toast('工种岗位不能为空，请选择');
					return false;
				}
				return true;
			},

			handleClickTrainingType() {
				if(this.examinationType !== '1') {
					this.trainingTypeVisible = true;
				}
    		},
			handleClickTrainingLevel() {
				if(this.examinationType !== '1') {
					this.trainingLevelVisible = true;
				}
			},
			handleClickWorkType() {
				if(this.examinationType !== '1') {
					this.workTypeVisible = true;
				}
			},
			onTypeValuesChange(picker, values) {
				if (picker.getSlotValue(0) != null) {
					this.trainingTypeKey = picker.getValues()[0].key;
					this.trainingType = picker.getValues()[0].value;
					this.trainingTypeVisible = false;
				} else {
					this.trainingType = "";
				}
			},
			onLevelValuesChange(picker, values) {
				if (picker.getSlotValue(0) != null) {
					this.trainingLevelKey = picker.getValues()[0].key;
					this.trainingLevel = picker.getValues()[0].value;
					this.trainingLevelVisible = false;
				} else {
					this.trainingLevel = "";
				}
			},
			onProfessionValuesChange(picker, values) {
				if (picker.getSlotValue(0) != null) {
					this.workTypeKey = picker.getValues()[0].key;
					this.workType = picker.getValues()[0].value;
					this.workTypeVisible = false;
				} else {
					this.workType = "";
				}
			}
		},
		mounted() {
			// 获取培训类别
			this.postAxios(this.getDataTypeInfoUrl, {typeCode: 'pxlb'}).then(data => {
				let valuesInfo = [{ key: '0', value: "请选择" }];
				data.dataTypeList.forEach(dataTypeInfo => {
					valuesInfo.push(dataTypeInfo);
				});
				let temp = {values: valuesInfo};
				this.trainingTypeOptions.push(temp);
			}).catch(err => {
				Toast('出现异常');
			});

			
			// 获取培训层次
			this.postAxios(this.getDataTypeInfoUrl, {typeCode: 'pxcc'}).then(data => {
				let valuesInfo = [{ key: '0', value: "请选择" }];
				data.dataTypeList.forEach(dataTypeInfo => {
					valuesInfo.push(dataTypeInfo);
				});
				let temp = {values: valuesInfo};
				this.trainingLevelOptions.push(temp);
			}).catch(err => {
				Toast('出现异常');
			});

			// 获取工种
			this.postAxios(this.getDataTypeInfoUrl, {typeCode: 'gz'}).then(data => {
				let valuesInfo = [{ key: '0', value: "请选择" }];
				data.dataTypeList.forEach(dataTypeInfo => {
					valuesInfo.push(dataTypeInfo);
				});
				let temp = {values: valuesInfo};
				this.workTypeOptions.push(temp);
			}).catch(err => {
				Toast('出现异常');
			});
			
			// 在线考试
			if(this.examinationType === '1') {
				this.trainingTypeKey = localStorage.getItem("trainType");
				this.trainingLevelKey = localStorage.getItem("trainLevel");
				this.workTypeKey = localStorage.getItem("workType");

				// 获取培训类别
				this.postAxios(this.getTypeInfoByDetailCodeUrl, {typeCode: 'pxlb', typeDetailCode: this.trainingTypeKey}).then(data => {
					this.trainingType = data.typeDetailName;
				}).catch(err => {
					Toast('出现异常');
				});

				// 获取培训类别
				this.postAxios(this.getTypeInfoByDetailCodeUrl, {typeCode: 'pxcc', typeDetailCode: this.trainingLevelKey}).then(data => {
					this.trainingLevel = data.typeDetailName
				}).catch(err => {
					Toast('出现异常');
				});

				// 获取工种
				this.postAxios(this.getTypeInfoByDetailCodeUrl, {typeCode: 'gz', typeDetailCode: this.workTypeKey}).then(data => {
					this.workType = data.typeDetailName
				}).catch(err => {
					Toast('出现异常');
				});

				// 获取题库种类
				this.postAxios(this.getQuestionsTypeUrl, {workTypeCode: this.workTypeKey}).then(data => {
					this.questionsType = data.questionsType;
				}).catch(err => {
					Toast('出现异常');
				});
			} else {
				this.trainingTypeKey = '0';
				this.trainingLevelKey = '0';
				this.workTypeKey = '0';

				this.trainingType = '请选择';
				this.trainingLevel = '请选择';
				this.workType = '请选择';
			}
		}
	}
</script>

<style scoped>
    /* 操作区域的样式*/
    .operateDiv {
      padding-left: 20px;
      padding-right: 20px;
      text-align: center;
    }
    .mybutton {
      margin-top: 20px;
    }
</style>