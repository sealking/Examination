<template>
	<div>
		<el-row >
			<el-col :span="18" :offset="3">
				<div>题目类别：
					<el-select v-model="questionsType" @change="questionsTypeOnChange()">
						<el-option
							v-for="item in questionsTypeOptions"
							:key="item.typeDetailCode"
							:label="item.typeDetailName"
							:value="item.typeDetailCode">
						</el-option>
					</el-select>
				</div>
				<!-- 用户双向绑定，刷新页面 -->
				<input type="hidden" v-model="hiddenData" >
			</el-col>
		</el-row>
		<div class="exam-question">
			<el-row>
				<el-col :span="18" :offset="3" v-if="item.questionType === '1'">
					<div class="question">单选题</div>
					<div class="question">{{item.questionContent}}</div>
					<div v-for="itemInfo in item.itemInfoList" :key="itemInfo" class="question">{{itemInfo}}</div>

					<el-radio-group v-model="item.choice" :disabled="item.finish" @change="getResult(index)">
						<el-radio v-for="itemIndexInfo in item.itemList" :key="itemIndexInfo" :label="itemIndexInfo">
							{{itemIndexInfo}}
						</el-radio>
					</el-radio-group>
				</el-col>
				<el-col :span="18" :offset="3" v-if="item.questionType === '2'">
					<div class="question">多选题</div>
					<div class="question">{{item.questionContent}}</div>
					<div v-for="itemInfo in item.itemInfoList" :key="itemInfo" class="question">{{itemInfo}}</div>
					
					<el-checkbox-group v-model="item.checkboxInfo" :disabled="item.finish" @change="refreshData()">
						<el-checkbox v-for="itemIndexInfo in item.itemList" :key="itemIndexInfo" :label="itemIndexInfo">
							{{itemIndexInfo}}
						</el-checkbox>
					</el-checkbox-group>
				</el-col>
				<el-col :span="18" :offset="3" v-if="item.questionType === '3'">
					<div class="question">判断题</div>
					<div class="question">{{item.questionContent}}</div>
					
					<el-radio-group v-model="item.choice" :disabled="item.finish" @change="getResult(index)">
						<el-radio :key="'A'" :label="'A'">正确</el-radio>
						<el-radio :key="'B'" :label="'B'">错误</el-radio>
					</el-radio-group>
				</el-col>
				<el-col :span="18" :offset="3" v-if="item.questionType === '4'">
					<div class="question">填空题</div>
					<div class="question">{{item.questionContent}}</div>
					
					<el-input v-model="item.choice" :disabled="item.finish" placeholder="请输入内容"></el-input>
				</el-col>
			</el-row>
			<el-row class="answer" v-if="item.questionType === '2' || item.questionType === '4'">
				<el-col :span="18" :offset="3">
					<el-button class="submit-btn" @click="getResult(index)" :disabled="item.finish">确认</el-button>
				</el-col>
			</el-row>
			<el-row class="answer" v-if="item.finish">
				<el-col :span="18" :offset="3" v-if="item.questionType === '1' || item.questionType === '4'">
					<div class="right" v-if="item.answer === item.choice">回答正确</div>
					<div class="false" v-if="item.answer !== item.choice">回答错误，正确答案为【{{item.answer}}】</div>
				</el-col>

				<el-col :span="18" :offset="3" v-if="item.questionType === '2' ">
					<div class="right" v-if="item.answer === item.checkboxInfo.sort().join(',')">回答正确</div>
					<div class="false" v-if="item.answer !== item.checkboxInfo.sort().join(',')">回答错误，正确答案为【{{item.answer}}】</div>
				</el-col>

				<el-col :span="18" :offset="3" v-if="item.questionType === '3' ">
					<div class="right" v-if="item.answer === item.choice">回答正确</div>
					<div class="false" v-if="item.answer !== item.choice">回答错误</div>
				</el-col>
			</el-row>
			<el-row class="answer" v-if="questiones.length !== 0">
				<el-col :span="18" :offset="3">
					{{index + 1}}/{{totalNumber}}
					<el-input  v-model="questionsNo" type="text" placeholder="请输入题号"></el-input>
					<el-button type="primary" @click="gotoQuestions()">跳转</el-button>
				</el-col>
			</el-row>
			<el-row class="answer" v-if="questiones.length !== 0">
				<el-col :span="18" :offset="3">
					<el-button  type="primary" @click="upBtnClick()" :disabled="upBtnFlg">上一题</el-button>
					<el-button  type="primary" @click="downBtnClick()" :disabled="downBtnFlg">下一题</el-button>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				hiddenData: 0,
				// 题目类别Options
				questionsTypeOptions: [],
				// 题目类别选中数据
				questionsType: "",
				getDataTypeInfoUrl: "/common/getDataTypeInfo",
				getQuestionUrl: "/examination/getQuestion",
				allquestions: [],
				questiones: [],
				item: "",
				index:0,
				upBtnFlg: true,
				downBtnFlg: true,
				totalNumber: 0,
				questionsNo: ""
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

			// 确认答案函数
			getResult(index) {
				// 显示正确错误之前，上一题和下一题按钮不可用
				var upBtnFlgTemp = this.upBtnFlg;
				var downBtnFlgTemp = this.downBtnFlg;
				this.upBtnFlg = false;
				this.downBtnFlg = false;

				if(this.item.questionType === '1' || this.item.questionType === '3' || this.item.questionType === '4') {
					if(!this.item.choice) {
						this.messageAlert('请填写答案', 'error');
						return;
					}
					this.item.choiceTemp = this.item.choice
					
				} else if(this.item.questionType === '2') {
					if(this.item.checkboxInfo.length < 1) {
						this.messageAlert('请选择答案', 'error');
						return;
					}
					this.item.checkboxInfoTemp = this.item.checkboxInfo;
				}
				this.hiddenData++;
				this.item.finish = true;
				this.item.answerFlg = true;
				
				this.upBtnFlg = upBtnFlgTemp;
				this.downBtnFlg = downBtnFlgTemp;

			},

			// 点击上一题按钮
			upBtnClick() {
				var indexTemp = this.index;
				this.downBtnFlg = false;
				if(indexTemp === 1) {
					this.upBtnFlg = true;
				}
				
				this.index = --indexTemp;
				this.item = this.questiones[indexTemp];

				if(this.item.questionType === '1' || this.item.questionType === '3' || this.item.questionType === '4') {
					if(this.questiones[indexTemp].answerFlg) {
						this.item.choice = this.questiones[indexTemp].choiceTemp;
						this.questiones[indexTemp].finish = true;
					} else {
						this.item.choice = "";
						this.questiones[indexTemp].finish = false;
					}
				} else if(this.item.questionType === '2') {
					if(this.questiones[indexTemp].answerFlg) {
						this.item.checkboxInfo = this.questiones[indexTemp].checkboxInfoTemp;
						this.questiones[indexTemp].finish = true;
					} else {
						this.item.checkboxInfo = [];
						this.questiones[indexTemp].finish = false;
					}
				}
			},

			// 点击下一题按钮
			downBtnClick() {
				var indexTemp = this.index;

				this.upBtnFlg = false;
				if(this.index === this.questiones.length - 2) {
					this.downBtnFlg = true;
				}

				this.index = ++indexTemp;
				this.item = this.questiones[indexTemp];

				if(this.item.questionType === '1' || this.item.questionType === '3' || this.item.questionType === '4') {
					if(this.questiones[indexTemp].answerFlg) {
						this.item.choice = this.questiones[indexTemp].choiceTemp;
						this.questiones[indexTemp].finish = true;
					} else {
						this.item.choice = "";
						this.questiones[indexTemp].finish = false;
					}
				} else if(this.item.questionType === '2') {
					if(this.questiones[indexTemp].answerFlg) {
						this.item.checkboxInfo = this.questiones[indexTemp].checkboxInfoTemp;
						this.questiones[indexTemp].finish = true;
					} else {
						this.item.checkboxInfo = [];
						this.questiones[indexTemp].finish = false;
					}
				}
			},
			refreshData() {
				this.hiddenData++;
			},
			questionsTypeOnChange(){
				for(var i = 0; i < this.allquestions.length; i++) {
					if(this.questionsType === this.allquestions[i].questionType) {
						this.questiones = this.allquestions[i].questionInfoList;
						break;
					}
					if(i === this.allquestions.length - 1) {
						this.questiones = [];
						this.messageAlert('你选择的题目类别没有试题，请同步', 'error');
						return;
					}
				}
				
				this.totalNumber = this.questiones.length;

				// 初始化多选的的数据数组
				this.questiones.forEach(itemTemp => {
					itemTemp.checkboxInfo = [];
				})
				this.index = 0;
				this.item = this.questiones[this.index];

				if(this.questiones.length === 1) {
					this.downBtnFlg = true;
				} else {
					this.downBtnFlg = false;
				}
				this.upBtnFlg = true;
			},
			gotoQuestions() {
				if(this.questionsNo < 1 || this.questionsNo > this.totalNumber){
					this.messageAlert('请输入正确的题号', 'error');
					return;
				}
				this.index = this.questionsNo - 1;
				var indexTemp = this.index;
				if(this.questionsNo === "1"){
					this.upBtnFlg = true;
					this.downBtnFlg = false;
				} else if(this.questionsNo == this.totalNumber + "") {
					this.upBtnFlg = false;
					this.downBtnFlg = true;
				} else {
					this.upBtnFlg = false;
					this.downBtnFlg = false;
				}

				this.item = this.questiones[indexTemp];

				if(this.item.questionType === '1' || this.item.questionType === '3' || this.item.questionType === '4') {
					if(this.questiones[indexTemp].answerFlg) {
						this.item.choice = this.questiones[indexTemp].choiceTemp;
						this.questiones[indexTemp].finish = true;
					} else {
						this.item.choice = "";
						this.questiones[indexTemp].finish = false;
					}
				} else if(this.item.questionType === '2') {
					if(this.questiones[indexTemp].answerFlg) {
						this.item.checkboxInfo = this.questiones[indexTemp].checkboxInfoTemp;
						this.questiones[indexTemp].finish = true;
					} else {
						this.item.checkboxInfo = [];
						this.questiones[indexTemp].finish = false;
					}
				}
			}
		},
		mounted() {
			// 获取题目类别
			this.postAxios(this.getDataTypeInfoUrl, {typeCode: 'tmzl'}).then(data => {
				this.questionsTypeOptions = data.dataTypeList;
			}).catch(err => {
				this.messageAlert('出现异常', 'error');
			});
			this.allquestions = JSON.parse(localStorage.getItem("offlineQuestions"));
		}	
	}
</script>