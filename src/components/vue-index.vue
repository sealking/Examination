<template>
	<div v-loading="loading" element-loading-text="正在出题中...">
		<el-row >
			<el-col :span="18" :offset="3">
				<div>姓名：杨晰</div>
				<div>性别：男</div>
				<div>身份证号：370303198512021012</div>
			</el-col>
		</el-row>
		<el-row class="title">
			<el-col :span="18" :offset="3">
				总计:{{totalNumber}}&nbsp;已答:{{answerNumber}}&nbsp;正确:{{rightNumber}}&nbsp;错误:{{answerNumber - rightNumber}}
			</el-col>
		</el-row>
		<el-row class="title">
			<el-col :span="18" :offset="3" >
				剩余时间：{{minute2}}分钟{{seconds2}}秒
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
					
					<el-checkbox-group v-model="item.checkboxInfo" :disabled="item.finish">
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
					<el-button class="submit-btn" @click="getResult(index)" :disabled="item.finish">提交</el-button>
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
			<el-row class="answer">
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
		name: "vue-index",
		data() {
			return {
				minute: 20,
				seconds: 0,
				timer: null,
				totalNumber: 0,
				answerNumber: 0,
				rightNumber: 0,
				loading: true,
				getQuestionUrl: "/examination/getQuestion",
				questiones: [],
				item: "",
				index:0,
				upBtnFlg: true,
				downBtnFlg: true
			}
		},
		methods: {
			//弹窗函数
			messageAlert( msg) {
				this.$message(msg);
			},

			//提交答案函数
			getResult(index) {
				// 显示正确错误之前，上一题和下一题按钮不可用
				var upBtnFlgTemp = this.upBtnFlg;
				var downBtnFlgTemp = this.downBtnFlg;
				this.upBtnFlg = false;
				this.downBtnFlg = false;

				this.questiones[index].finish = true;
				this.questiones[index].answerFlg = true;
				if(this.item.questionType === '1' || this.item.questionType === '3' || this.item.questionType === '4') {
					this.questiones[index].choiceTemp = this.questiones[index].choice
					if(this.questiones[index].choice === this.questiones[index].answer) {
						this.rightNumber++;
					}
					this.answerNumber++;
				} else if(this.item.questionType === '2') {
					this.questiones[index].checkboxInfoTemp = this.questiones[index].checkboxInfo;
					if(this.questiones[index].checkboxInfo.sort().join(',') === this.questiones[index].answer) {
						this.rightNumber++;
					}
					this.answerNumber++;
				} else if(this.item.questionType === '4'){

				}
				

				this.upBtnFlg = upBtnFlgTemp;
				this.downBtnFlg = downBtnFlgTemp;

			},

			// 点击上一题按钮
			upBtnClick() {
				var indexTemp = this.index;
				if(!this.questiones[indexTemp].answerFlg) {
					this.$message("请先提交本题答案");
					return;
				}
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

				} else if(this.item.questionType === '4'){

				}
			},

			// 点击下一题按钮
			downBtnClick() {
				var indexTemp = this.index;
				if(!this.questiones[indexTemp].answerFlg) {
					this.$message("请先提交本题答案");
					return;
				}
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
				} else if(this.item.questionType === '4'){

				}
			}
		},
		computed: {
			//显示在页面的秒数
			seconds2() {
				return this.seconds < 10 ? "0"+this.seconds : this.seconds;
			},
			//显示在页面的分钟数
			minute2() {
				return this.minute < 10 ? "0"+this.minute : this.minute;
			}
		},
		mounted() {
			// 获取题目
			this.postAxios(this.getQuestionUrl).then(data => {
				if(data.returnCode === '0') {
					if(data.list.length > 0) {
						this.questiones = data.list;
						this.totalNumber = this.questiones.length;

						// 初始化多选的的数据数组
						this.questiones.forEach(itemTemp => {
      						itemTemp.checkboxInfo = [];
						})

						this.minute = data.examinationMinute;
						this.seconds = data.examinationSeconds;
						this.loading = false;
						this.index = 0;
						this.item = this.questiones[this.index];

						if(this.questiones.length === 1) {
							this.downBtnFlg = true;
						} else {
							this.downBtnFlg = false;
						}
						this.upBtnFlg = true;
						
						// 定时器
						var _this = this;
						this.timer = setInterval(function() {
							if(_this.minute === 0 && _this.seconds === 0) {
								clearInterval(_this.timer);
								_this.questiones.map((item, index, array) => {
									_this.questiones[index].finish = true;
								});
								_this.postScore();
									return;
							}
							if(_this.seconds === 0) {
								_this.minute--;
								_this.seconds = 59;
							}else{
								_this.seconds--;
							}
						},1000);
					} else {
						this.messageAlert('获取题目数量为零');
					}
				}
			}).catch(err => {
				this.messageAlert('出现异常');
			});
		}
	}
</script>
<style lang="less">
	@import '../assets/css/public.css';
	.exam-question {
		user-select:none;
		margin-top: 35px;
		font-size: 16px;
		// .option {
		// 	display: block;
		// 	position: relative;
		// 	margin-top: 12px;
		// 	left: -30px;
		// }
		.option:first-child {
			left: 0;
		}
		.question {
			width:100%;
			margin-bottom: 10px;
			white-space:normal;
		}
		.answer {
			margin-top: 10px;
			font-size: 14px;
			.right {
				color: #67C23A;
			}
			.false {
				color: #FA5555;
			}
		}
		.submit-btn {
			height: 30px;
			line-height: 2px;
		}
	}
</style>