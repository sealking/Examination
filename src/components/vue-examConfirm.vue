<template>
	<div id="simulated_exam" class="operateDiv">
		<div class="box">
			<mt-header fixed title="题库列表" style="font-size:16px">
				<mt-button slot="left" style="font-size:14px" @click="$router.back(-1)">返回</mt-button>
			</mt-header>
		</div>
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
		<div style="text-align: left;padding-left: 10px;padding-right: 20px;">题库种类：{{questionsType}}</div>
    	<div class="footBox">
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
				// 获取字典信息URL
				getDataTypeInfoUrl: "/common/getDataTypeInfo",
				// 获取题库种类URL
				getQuestionsTypeUrl: "/examination/getQuestionsType",
				// 更新分数URL
				updateScoreUrl: "/examination/updateScore",
				// 根据code获取数据字典信息
				getTypeInfoByDetailCodeUrl: "common/getDataTypeInfoByDetailCode",
				// 培训类别popup显示Flag
				trainingTypeVisible: false,
				// 培训层次popup显示Flag
				trainingLevelVisible: false,
				// 工种popup显示Flag
				workTypeVisible: false,
			}
		},
		methods: {
			onlineOnClick() {
				this.$router.replace('/examIndex');
			},
			mockOnClick() {
				if(this.dataValid()) {
					localStorage.setItem("workType",this.workTypeKey);
					this.$router.replace('mockQuestionSelect');
				}
			},

			dataValid() {
				if(this.workTypeKey === '0') {
					Toast('工种岗位不能为空，请选择');
					return false;
				}
				return true;
			},

			handleClickTrainingTypehandleClickTrainingType() {
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
					// 获取题库种类
					this.postAxios(this.getQuestionsTypeUrl, {workTypeCode: this.workTypeKey}).then(data => {
						this.questionsType = data.questionsType;
					}).catch(err => {
						Toast('出现异常');
					});
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
			font-size: 16px;
			display: inline-block;
			width: 90%;
		}
	.footBox {
		margin-bottom: 0px;
		position: absolute;
		bottom: 1px;
		left: 0px;
		width: 100%;
		text-align: center;
	}
	.box {
		display: -webkit-flex; /*在webkit内核的浏览器上使用要加前缀*/
		display: flex;
		flex-direction: column;
		border-bottom: solid 1px rgb(234, 234, 234);
		padding-bottom: 30px;
	}
</style>