<template>
	<div id="simulated_exam" class="operateDiv">
		<div class="box">
			<mt-header fixed title="题库列表" style="font-size:16px">
				<mt-button slot="left" style="font-size:14px" @click="$router.back(-1)">返回</mt-button>
			</mt-header>
		</div>
		<mt-cell style="text-align:left" title="培训列表" is-link @click.native="handleClickTrainingList">
			<span style="color: green">{{trainingList}}</span>
		</mt-cell>
		
		<mt-cell style="text-align:left" title="培训类别" is-link @click.native="handleClickTrainingType">
			<span style="color: green">{{trainingType}}</span>
		</mt-cell>

		<mt-cell style="text-align:left" title="培训层次" is-link @click.native="handleClickTrainingLevel">
			<span style="color: green">{{trainingLevel}}</span>
		</mt-cell>

		<mt-cell style="text-align:left" title="专业内容" is-link @click.native="handleClickWorkType">
			<span style="color: green">{{workType}}</span>
		</mt-cell>

		<mt-cell style="text-align:left" title="考试题库" is-link @click.native="handleClickQuestions">
			<span style="color: green">{{questions}}</span>
		</mt-cell>

		<mt-popup v-model="trainingListVisible" position="bottom" style="width:100vw">
			<mt-picker :slots="trainingListOptions" valueKey="value" 
			:visible-item-count="9" :show-toolbar="true" ref="trainingListPicker">
				<div style="display:table;width:100vw">
					<div style="text-align:left;padding:5px;width:50vw;display:table-cell;">
						<mt-button @click="handleClickTrainingList" type="primary" size="small">取消</mt-button>
					</div>
					<div style="text-align:right;padding:5px;width:50vw;ddisplay:table-cell;">
						<mt-button @click="onListValuesChange" type="primary" size="small">确认</mt-button>
					</div>
				</div>
			</mt-picker>
		</mt-popup>

		<mt-popup v-model="trainingTypeVisible" position="bottom" style="width:100vw">
			<mt-picker :slots="trainingTypeOptions" valueKey="value" 
			:visible-item-count="9" :show-toolbar="true" ref="trainingTypePicker">
				<div style="display:table;width:100vw">
					<div style="text-align:left;padding:5px;width:50vw;display:table-cell;">
						<mt-button @click="handleClickTrainingType" type="primary" size="small">取消</mt-button>
					</div>
					<div style="text-align:right;padding:5px;width:50vw;ddisplay:table-cell;">
						<mt-button @click="onTypeValuesChange" type="primary" size="small">确认</mt-button>
					</div>
				</div>
			</mt-picker>
		</mt-popup>

		<mt-popup v-model="trainingLevelVisible" position="bottom" style="width:100vw">
			<mt-picker :slots="trainingLevelOptions" valueKey="value"
			:visible-item-count="9" :show-toolbar="true" ref="trainingLevelPicker">
				<div style="display:table;width:100vw">
					<div style="text-align:left;padding:5px;width:50vw;display:table-cell;">
						<mt-button @click="handleClickTrainingLevel" type="primary" size="small">取消</mt-button>
					</div>
					<div style="text-align:right;padding:5px;width:50vw;ddisplay:table-cell;">
						<mt-button @click="onLevelValuesChange" type="primary" size="small">确认</mt-button>
					</div>
				</div>
			</mt-picker>
		</mt-popup>

		<mt-popup v-model="workTypeVisible" position="bottom" style="width:100vw">
			<mt-picker :slots="workTypeOptions" valueKey="value"
			:visible-item-count="9" :show-toolbar="true" ref="workTypePicker">
				<div style="display:table;width:100vw">
					<div style="text-align:left;padding:5px;width:50vw;display:table-cell;">
						<mt-button @click="handleClickWorkType" type="primary" size="small">取消</mt-button>
					</div>
					<div style="text-align:right;padding:5px;width:50vw;display:table-cell;">
						<mt-button @click="onWorkTypeValuesChange" type="primary" size="small">确认</mt-button>
					</div>
				</div>
			</mt-picker>
		</mt-popup>

		<mt-popup v-model="questionsVisible" position="bottom" style="width:100vw">
			<mt-picker :slots="questionsOptions" valueKey="value"
			:visible-item-count="9" :show-toolbar="true" ref="questionsPicker">
				<div style="display:table;width:100vw">
					<div style="text-align:left;padding:5px;width:50vw;display:table-cell;">
						<mt-button @click="handleClickQuestions" type="primary" size="small">取消</mt-button>
					</div>
					<div style="text-align:right;padding:5px;width:50vw;display:table-cell;">
						<mt-button @click="onQuestionsValuesChange" type="primary" size="small">确认</mt-button>
					</div>
				</div>
			</mt-picker>
		</mt-popup>
		<!--<div style="text-align: left;padding-left: 10px;padding-right: 20px;">题库种类：{{questionsType}}</div>-->
    	<div class="footBox">
				<mt-button v-if="examinationType === '1'" size="large" type="primary" class="mybutton" @click="onlineOnClick()">在线考试</mt-button>
				<mt-button v-if="examinationType === '2'" size="large" type="primary" class="mybutton" @click="mockOnClick()">模拟考试</mt-button>
      </div>
  </div>
</template>
<script>
	import { Toast } from 'mint-ui';
	import { Indicator } from 'mint-ui';

	export default {
		data() {
			return {
				// 考试类型（1：在线考试，2：模拟考试）
				examinationType: localStorage.getItem("examinationType"),
				// 学员类别
				studentType: localStorage.getItem("userType"),
				// 学员组织ID
				userUnitsId: localStorage.getItem("userUnitsId"),
				// 培训列表Options
				trainingListOptions: [],
				// 培训类别Options
				trainingTypeOptions: [],
				// 培训层次Options
				trainingLevelOptions: [],
				// 专业内容Options
				workTypeOptions: [],
				// 考试题库Options
				questionsOptions: [],
				// 培训列表选中数据
				trainingList: "",
				// 培训类别选中数据
				trainingType: "",
				// 培训层次选中数据
				trainingLevel: "",
				// 专业内容选中数据
				workType: "",
				// 考试题库选中的数据
				questions: "",
				// 培训列表选中数据key
				trainingListKey: "",
				// 培训类别选中数据key
				trainingTypeKey: "",
				// 培训层次选中数据key
				trainingLevelKey: "",
				// 专业内容选中数据key
				workTypeKey: "",
				// 考试题库选中的数据
				questionsKey: "",
				// 题库种类
				//questionsType: "",
				// 获取用户的培训信息Url
				getTrainByStuNoForExamUrl: "/examination/getTrainByStuNoForExam",
				//getTrainByStuNoUrl: "/examination/getTrainByStuNo",
				// 获取字典信息URL
				getDataTypeInfoUrl: "/common/getDataTypeInfo",
				// 获取题库种类URL
				//getQuestionsTypeUrl: "/examination/getQuestionsType",
				// 更新分数URL
				updateScoreUrl: "/examination/updateScore",
				// 根据code获取数据字典信息
				getTypeInfoByDetailCodeUrl: "/common/getDataTypeInfoByDetailCode",
				// 获取考试题库
				getQuestionBankUrl: "/examination/getQuestionBank",
				// 获取在线考试试题
				getQuestionsUrl: "/examination/getQuestions",
				// 培训列表popup显示Flag
				trainingListVisible: false,
				// 培训类别popup显示Flag
				trainingTypeVisible: false,
				// 培训层次popup显示Flag
				trainingLevelVisible: false,
				// 工种popup显示Flag
				workTypeVisible: false,
				// 题库popup显示Flag
				questionsVisible: false
			}
		},
		methods: {
			onlineOnClick() {
				if(this.dataValid()) {
					let parms = {
						examinationType: "1",
						trainNo: this.trainingListKey,
						studentNo: localStorage.getItem("studentNo"),
						questionBankId: this.questionsKey
					};
					Indicator.open('试题生成中...');
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
								localStorage.setItem("trainNo",this.trainingListKey);
								// 考试编号
								localStorage.setItem("examinationNo",data.examinationNo);
								Indicator.close();
								localStorage.setItem("questionBank",this.questionsKey);
								this.$router.replace('examIndex');
							} else {
								Indicator.close();
								Toast("您已经参加过该考试");
							}
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
			mockOnClick() {
				if(this.dataValid()) {
					localStorage.setItem("trainNo",this.trainingListKey);
					localStorage.setItem("questionBank",this.questionsKey);
					this.$router.replace('mockQuestionSelect');
				}
			},

			dataValid() {
				if(this.trainingListKey === '0') {
					Toast('培训列表不能为空，请选择');
					return false;
				}

				if(this.trainingTypeKey === '0') {
					Toast('培训类别不能为空，请选择');
					return false;
				}

				if(this.trainingLevelKey === '0') {
					Toast('培训层次不能为空，请选择');
					return false;
				}

				if(this.workTypeKey === '0') {
					Toast('专业内容不能为空，请选择');
					return false;
				}

				if(this.questionsKey === '0') {
					Toast('考试题库不能为空，请选择');
					return false;
				}

				return true;
			},

			handleClickTrainingList() {
				if (this.trainingListVisible) {
					this.trainingListVisible = false;
				} else {
					this.trainingListVisible = true;
				}
			},

			handleClickTrainingType() {
				// if (this.trainingTypeVisible) {
				// 	this.trainingTypeVisible = false;
				// } else {
				// 	this.trainingTypeVisible = true;
				// }
			},
			
			handleClickTrainingLevel() {
				// if(this.trainingLevelVisible) {
				// 	this.trainingLevelVisible = false;
				// } else {
				// 	this.trainingLevelVisible = true;
				// }
			},
			handleClickWorkType() {
				if(this.workTypeVisible) {
					this.workTypeVisible = false;
				} else {
					this.workTypeVisible = true;
				}
			},
			handleClickQuestions() {
				if(this.trainingListKey === '0') {
					Toast('培训类别不能为空，请选择');
					return;
				}

				if(this.trainingTypeKey === '0') {
					Toast('培训类别不能为空，请选择');
					return;
				}

				if(this.trainingLevelKey === '0') {
					Toast('培训层次不能为空，请选择');
					return;
				}

				if(this.workTypeKey === '0') {
					Toast('专业内容不能为空，请选择');
					return;
				}

				if(this.questionsVisible) {
					this.questionsVisible = false;
				} else {
					this.questionsVisible = true;
				}
				
			},
			onListValuesChange() {
				this.trainingTypeKey = '0';
				this.trainingType = '请选择';
				this.trainingLevelKey = '0';
				this.trainingLevel = '请选择';
				this.workTypeKey = '0';
				this.workType = '请选择';
				this.questionsKey = '0';
				this.questions = '请选择';

				let trainType = "";
				let trainTypeName = "";
				let trainLevel = "";
				let trainLevelName = "";
				if (this.$refs.trainingListPicker.getSlotValue(0) != null) {
					this.trainingListKey = this.$refs.trainingListPicker.getValues()[0].key;
					this.trainingList = this.$refs.trainingListPicker.getValues()[0].value;
					trainType = this.$refs.trainingListPicker.getValues()[0].trainType;
					trainTypeName = this.$refs.trainingListPicker.getValues()[0].trainTypeName;
					trainLevel = this.$refs.trainingListPicker.getValues()[0].trainLevel;
					trainLevelName = this.$refs.trainingListPicker.getValues()[0].trainLevelName;
					this.trainingListVisible = false;
				} else {
					this.trainingList = "";
				}

				// localStorage.setItem("trainNo",this.trainingListKey);
				this.trainingTypeOptions[0].values.forEach(item => {
					if (item.key === trainType) {
						this.trainingTypeKey = trainType;
						this.trainingType = trainTypeName;
					}
				});

				this.trainingLevelOptions[0].values.forEach(item => {
					if (item.key === trainLevel) {
						this.trainingLevelKey = trainLevel;
						this.trainingLevel = trainLevelName;
					}
				});

				if(this.examinationType === '2') {
					localStorage.setItem("trainingListKey",this.trainingListKey);
					localStorage.setItem("trainingTypeKey",this.trainingTypeKey);
					localStorage.setItem("trainingLevelKey",this.trainingLevelKey);
					localStorage.setItem("workTypeKey",this.workTypeKey);
				}

				this.getQuestionsValues();
			},
			onTypeValuesChange() {
				if (this.$refs.trainingTypePicker.getSlotValue(0) != null) {
					this.trainingTypeKey = this.$refs.trainingTypePicker.getValues()[0].key;
					this.trainingType = this.$refs.trainingTypePicker.getValues()[0].value;
					this.trainingTypeVisible = false;
				} else {
					this.trainingType = "";
				}
				
				if(this.examinationType === '2') {
					localStorage.setItem("trainingTypeKey",this.trainingTypeKey);
				}

				this.getQuestionsValues();
			},
			onLevelValuesChange() {
				if (this.$refs.trainingLevelPicker.getSlotValue(0) != null) {
					this.trainingLevelKey = this.$refs.trainingLevelPicker.getValues()[0].key;
					this.trainingLevel = this.$refs.trainingLevelPicker.getValues()[0].value;
					this.trainingLevelVisible = false;
				} else {
					this.trainingLevel = "";
				}

				if(this.examinationType === '2') {
					localStorage.setItem("trainingLevelKey",this.trainingLevelKey);
				}
				
				this.getQuestionsValues();
			},
			onWorkTypeValuesChange() {
				if (this.$refs.workTypePicker.getSlotValue(0) != null) {
					this.workTypeKey = this.$refs.workTypePicker.getValues()[0].key;
					this.workType = this.$refs.workTypePicker.getValues()[0].value;
					this.workTypeVisible = false;
					// // 获取题库种类
					// this.postAxios(this.getQuestionsTypeUrl, {workTypeCode: this.workTypeKey}).then(data => {
					// 	this.questionsType = data.questionsType;
					// }).catch(err => {
					// 	Toast('出现异常');
					// });
				} else {
					this.workType = "";
				}

				if(this.examinationType === '2') {
					localStorage.setItem("workTypeKey",this.workTypeKey);
				}

				this.getQuestionsValues();
			},
			onQuestionsValuesChange() {
				if (this.$refs.questionsPicker.getSlotValue(0) != null) {
					this.questionsKey = this.$refs.questionsPicker.getValues()[0].key;
					this.questions = this.$refs.questionsPicker.getValues()[0].value;
					this.questionsVisible = false;
				} else {
					this.questions = "";
				}
			},
			getQuestionsValues() {
				this.questionsKey = '0';
				this.questions = '请选择';
				//  培训类别,培训层次,专业内容为空时
				if(this.trainingTypeKey === '0' || this.trainingTypeKey === ''|| this.trainingLevelKey === '0' || this.trainingLevelKey === ''|| this.workTypeKey === '0' || this.workTypeKey === '') {

				} else {
					let valuesInfoList = [{ key: '0', value: '请选择' }];
					let parms = {
						// 考试类型
						examinationType: this.examinationType,
						// 培训类型
						trainingType: this.trainingTypeKey,
						// 培训层次
						trainingLevel: this.trainingLevelKey,
						// 专业内容
						workType: this.workTypeKey,
						// 学员类型
						studentType: this.studentType,
						// 学员组织ID
						userUnitsId: this.userUnitsId
					}

					// 获取考试题库
					this.postAxios(this.getQuestionBankUrl, parms).then(data => {
						data.forEach(dataInfo => {
							var valuesInfo = {key: dataInfo.questionBankId, value: dataInfo.questionBankId };
							valuesInfoList.push(valuesInfo);
						});

						let temp = {values: valuesInfoList};
						this.questionsOptions = [temp];

						if (valuesInfoList.length === 2) {
							this.questionsOptions[0].defaultIndex = 1;
							this.questionsKey = valuesInfoList[1].key;
							this.questions = valuesInfoList[1].value;
						}
					}).catch(err => {
						Toast('出现异常');
					});
					// let temp = {values: valuesInfoList};
					// this.questionsOptions = [temp];
				}
			}
		},
		mounted() {
			let tmpTrainingListKey = localStorage.getItem("trainingListKey");
			let tmpTrainingTypeKey = localStorage.getItem("trainingTypeKey");
			let tmpTrainingLevelKey = localStorage.getItem("trainingLevelKey");
			let tmpWorkTypeKey = localStorage.getItem("workTypeKey");

			let tmpTrainingList = "";
			let tmpTrainingType = "";
			let tmpTrainingLevel = "";
			let tmpWorkType = "";

			let tmpTrainingListIndex = 0;
			let tmpTrainingTypeIndex = 0;
			let tmpTrainingLevelIndex = 0;
			let tmpWorkTypeIndex = 0;

			let self = this;
			// 获取培训列表
			let parm = {
				stuNo: localStorage.getItem("studentNo")
			};

			this.postAxios(this.getTrainByStuNoForExamUrl, parm).then(data => {
				let i = 0;
				let valuesInfo = [{ key: '0', value: '请选择', pxlb: '', pxlbName: '', pxcc: '', pxccName: '' }];
				// 培训列表
				data.forEach(dataListInfo => {
					var value = {key: dataListInfo.no, value: dataListInfo.name, trainType: dataListInfo.trainType, trainTypeName: dataListInfo.trainTypeName, trainLevel: dataListInfo.trainLevel, trainLevelName: dataListInfo.trainLevelName };
					valuesInfo.push(value);

					i++;
					if(this.examinationType === '2') {
						if(tmpTrainingListKey === dataListInfo.no) {
							tmpTrainingListIndex = i;
							tmpTrainingList = dataListInfo.name;
						} 
					}
				});
				let temp = {values: valuesInfo};
				this.trainingListOptions.push(temp);

				if (tmpTrainingListIndex > 0 ) {
					this.trainingListOptions[0].defaultIndex = tmpTrainingListIndex;
					this.trainingListKey = tmpTrainingListKey;
					this.trainingList = tmpTrainingList;

					this.getQuestionsValues();
					// localStorage.setItem("trainNo",this.trainingListKey);
				} else {
					this.trainingListKey = '0';
					this.trainingList = '请选择';
				}
			}).catch(err => {
				Toast('出现异常');
			});
		
			// 获取培训类别
			this.postAxios(this.getDataTypeInfoUrl, {typeCode: 'pxlb'}).then(data => {
				let i = 0;
				let valuesInfo = [{ key: '0', value: '请选择' }];
				data.dataTypeList.forEach(dataTypeInfo => {
					valuesInfo.push(dataTypeInfo);
					i++;
					if(this.examinationType === '2') {
						if(tmpTrainingTypeKey === dataTypeInfo.key) {
							tmpTrainingTypeIndex = i;
							tmpTrainingType = dataTypeInfo.value;
						} 
					}
				});
				let temp = {values: valuesInfo};
				this.trainingTypeOptions.push(temp);

				if (tmpTrainingTypeIndex > 0 ) {
					this.trainingTypeOptions[0].defaultIndex = tmpTrainingTypeIndex;
					this.trainingTypeKey = tmpTrainingTypeKey;
					this.trainingType = tmpTrainingType;

					this.getQuestionsValues();
				} else {
					this.trainingTypeKey = '0';
					this.trainingType = '请选择';
				}
			}).catch(err => {
				Toast('出现异常');
			});
			
			// 获取培训层次
			this.postAxios(this.getDataTypeInfoUrl, {typeCode: 'pxcc'}).then(data => {
				let i = 0;
				let valuesInfo = [{ key: '0', value: '请选择' }];
				data.dataTypeList.forEach(dataTypeInfo => {
					valuesInfo.push(dataTypeInfo);
					i++;
					if(this.examinationType === '2') {
						if(tmpTrainingLevelKey === dataTypeInfo.key) {
							tmpTrainingLevelIndex = i;
							tmpTrainingLevel = dataTypeInfo.value;
						} 
					}
				});
				let temp = {values: valuesInfo};
				this.trainingLevelOptions.push(temp);

				if (tmpTrainingLevelIndex > 0 ) {
					this.trainingLevelOptions[0].defaultIndex = tmpTrainingLevelIndex;
					this.trainingLevelKey = tmpTrainingLevelKey;
					this.trainingLevel = tmpTrainingLevel;

					this.getQuestionsValues();
				} else {
					this.trainingLevelKey = '0';
					this.trainingLevel = '请选择';
				}
			}).catch(err => {
				Toast('出现异常');
			});

			// 获取工种tmpWorkTypeIndex
			this.postAxios(this.getDataTypeInfoUrl, {typeCode: 'gz'}).then(data => {
				let i = 0;
				let valuesInfo = [{ key: '0', value: '请选择' }];
				data.dataTypeList.forEach(dataTypeInfo => {
					valuesInfo.push(dataTypeInfo);
					i++;
					if(this.examinationType === '2') {
						if(tmpWorkTypeKey === dataTypeInfo.key) {
							tmpWorkTypeIndex = i;
							tmpWorkType = dataTypeInfo.value;
						} 
					}
				});
				let temp = {values: valuesInfo};
				this.workTypeOptions.push(temp);

				if (tmpWorkTypeIndex > 0 ) {
					this.workTypeOptions[0].defaultIndex = tmpWorkTypeIndex;
					this.workTypeKey = tmpWorkTypeKey;
					this.workType = tmpWorkType;

					this.getQuestionsValues();
				} else {
					this.workTypeKey = '0';
					this.workType = '请选择';
				}
			}).catch(err => {
				Toast('出现异常');
			});
			
			// // 在线考试
			// if(this.examinationType === '1') {
			// 	this.trainingTypeKey = localStorage.getItem("trainType");
			// 	this.trainingLevelKey = localStorage.getItem("trainLevel");
			// 	this.workTypeKey = localStorage.getItem("workType");

			// 	// 获取培训类别
			// 	this.postAxios(this.getTypeInfoByDetailCodeUrl, {typeCode: 'pxlb', typeDetailCode: this.trainingTypeKey}).then(data => {
			// 		this.trainingType = data.typeDetailName;
			// 	}).catch(err => {
			// 		Toast('出现异常');
			// 	});

			// 	// 获取培训类别
			// 	this.postAxios(this.getTypeInfoByDetailCodeUrl, {typeCode: 'pxcc', typeDetailCode: this.trainingLevelKey}).then(data => {
			// 		this.trainingLevel = data.typeDetailName
			// 	}).catch(err => {
			// 		Toast('出现异常');
			// 	});

			// 	// 获取工种
			// 	this.postAxios(this.getTypeInfoByDetailCodeUrl, {typeCode: 'gz', typeDetailCode: this.workTypeKey}).then(data => {
			// 		this.workType = data.typeDetailName
			// 	}).catch(err => {
			// 		Toast('出现异常');
			// 	});

			// 	// 获取题库种类
			// 	this.postAxios(this.getQuestionsTypeUrl, {workTypeCode: this.workTypeKey}).then(data => {
			// 		this.questionsType = data.questionsType;
			// 	}).catch(err => {
			// 		Toast('出现异常');
			// 	});
			// } else {
			// 	this.trainingTypeKey = '0';
			// 	this.trainingLevelKey = '0';
			// 	this.workTypeKey = '0';
			// 	this.questionsKey = '0';

			// 	this.trainingType = '请选择';
			// 	this.trainingLevel = '请选择';
			// 	this.workType = '请选择';
			// 	this.questions = '请选择';
			// }

			this.trainingListKey = '0';
			this.trainingTypeKey = '0';
			this.trainingLevelKey = '0';
			this.workTypeKey = '0';
			this.questionsKey = '0';

			this.trainingList = '请选择';
			this.trainingType = '请选择';
			this.trainingLevel = '请选择';
			this.workType = '请选择';
			this.questions = '请选择';
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