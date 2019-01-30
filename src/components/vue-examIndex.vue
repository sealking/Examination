<template>
	<div v-loading="loading">
		<!-- 头部 -->
		<div id="tab-bar">
    		<mt-header title="模拟考试" fixed style="font-size:18px">
      			<mt-button slot="right" @click="submitClick()">交卷</mt-button>
    		</mt-header>
  		</div>
		<!-- 题目部 -->
		<div class="content-div">
			<div class="answer-result">
				<div class="success-count">
					<span class="mint-field-state is-success">
						<i class="mintui mintui-field-success result-icon"></i>
						<span class="result-count">{{rightNumber}}</span>
					</span>
				</div>
				<div class="error-count">
					<span class="mint-field-state is-error">
						<i class="mintui mintui-field-error result-icon"></i>
						<span class="result-count">{{answerNumber - rightNumber}}</span>
					</span>
				</div>
				<div class="timer">
					<mt-badge size="normal" type="error">{{minute2}}分{{seconds2}}秒</mt-badge>
				</div>
				<div class="all-count" >
					<span class="mint-field-state">
						<mt-badge size="normal" type="primary">答题进度</mt-badge>
						<span class="result-count">{{answerNumber}}/{{totalNumber}}</span>
					</span>
				</div>
			</div>
			<div class="question-info">
				<!-- 单选题 -->
				<div v-if="item.questionType === '1'">
					<div class="que-type">
						<mt-badge size="normal" type="success">单选题</mt-badge>
					</div>
					<div class="que-decription">
						<span>{{item.questionContent}}</span>                    
					</div>
					<div class="que-chose">
						<mt-radio v-model="item.choice" :options="item.itemInfoList" :disabled="item.finish" ></mt-radio>
					</div>
					
				</div>
				<!-- 多选题 -->
				<div v-if="item.questionType === '2'">
					<div class="que-type">
						<mt-badge size="normal" type="success">多选题</mt-badge>
					</div>
					<div class="que-decription">
						<span>{{item.questionContent}}</span>                    
					</div>
					<div class="que-chose">
						<mt-checklist v-model="item.checkboxInfo" :options="item.itemInfoList"></mt-checklist>
					</div>
					
				</div>
				<!-- 判断题 -->
				<div v-if="item.questionType === '3'">
					<div class="que-type">
						<mt-badge size="normal" type="success">判断题</mt-badge>
					</div>
					<div class="que-decription">
						<span>{{item.questionContent}}</span>                    
					</div>
					<div class="que-chose">
						<mt-radio v-model="item.choice" :options="item.itemInfoList"></mt-radio>
					</div>
				</div>
				<!-- 填空题 -->
				<div v-if="item.questionType === '4'">
					<div class="que-type">
						<mt-badge size="normal" type="success">填空题</mt-badge>
					</div>
					<div class="que-decription">
						<span>{{item.questionContent}}</span>
						<mt-field label="" placeholder="请输入正确答案" v-model="item.choice" :disabled="item.finish" ></mt-field>
					</div>
				</div>
			</div>
			<div class="btn-list">
				<mt-button type="primary" size="small" @click="getResult()" :disabled="item.finish">确认</mt-button>
			</div>
			<div class="answer" v-if="item.finish">
				<p class="answer-true" v-if="item.questionType === '1' || item.questionType === '4'">
					<span v-if="item.answer === item.choice">回答正确</span>
					<span v-if="item.answer !== item.choice">回答错误<span v-if="examinationType === '2'">，正确答案为【{{item.answer}}】</span></span>
				</p>
				<p class="answer-true" v-if="item.questionType === '2'">
					<span v-if="item.answer === item.checkboxInfo.sort().join(',')">回答正确</span>
					<span v-if="item.answer !== item.checkboxInfo.sort().join(',')">回答错误<span v-if="examinationType === '2'">，正确答案为【{{item.answer}}】</span></span>
				</p>
				<p class="answer-true" v-if="item.questionType === '3'">
					<span v-if="item.answer === item.choice">回答正确</span>
					<span v-if="item.answer !== item.choice">回答错误</span>
				</p>
			</div>
		</div>

		<!-- 底部 -->
		<div id="tab-bar">
			<mt-tabbar  fixed >
			<div class="prev">
				<mt-button  slot="left" @click="upBtnClick()" :disabled="upBtnFlg">上一题</mt-button>
			</div>
			<div class="next">
				<mt-button type="primary" slot="right" @click="downBtnClick()" :disabled="downBtnFlg">下一题</mt-button>
			</div>
			</mt-tabbar>
		</div>
	</div>
</template>

<script>
	import { Toast } from 'mint-ui';
	import { MessageBox } from 'mint-ui';
	
	export default {
		data() {
			return {
				minute: 0,
				seconds: 0,
				timer: null,
				totalNumber: 0,
				answerNumber: 0,
				rightNumber: 0,
				score: 0,
				loading: true,
				questiones: [],
				item: "",
				index:0,
				upBtnFlg: true,
				downBtnFlg: true,
				examinationType : localStorage.getItem("examinationType"),
				updateScoreUrl: "/examination/updateScore"
			}
		},
		methods: {
			// 确认答案函数
			getResult() {
				// 显示正确错误之前，上一题和下一题按钮不可用
				var upBtnFlgTemp = this.upBtnFlg;
				var downBtnFlgTemp = this.downBtnFlg;
				this.upBtnFlg = false;
				this.downBtnFlg = false;

				if(this.item.questionType === '1' || this.item.questionType === '3' || this.item.questionType === '4') {
					if(!this.item.choice) {
						Toast('请填写答案');
						return;
					}
					this.item.choiceTemp = this.item.choice
					if(this.item.choice === this.item.answer) {
						this.rightNumber++;
						this.score += this.item.score;
					}
					this.answerNumber++;
				} else if(this.item.questionType === '2') {
					if(this.item.checkboxInfo.length < 1) {
						Toast('请选择答案');
						return;
					}
					this.item.checkboxInfoTemp = this.item.checkboxInfo;
					if(this.item.checkboxInfo.sort().join(',') === this.item.answer) {
						this.rightNumber++;
						this.score += this.item.score;
					}
					this.answerNumber++;
				}
				if(this.item.questionType === '1' || this.item.questionType === '2' || this.item.questionType === '3') {
					this.item.itemInfoList.forEach(itemInfoTemp => {
						itemInfoTemp.disabled =true;
					})
				}
				this.item.finish = true;
				this.item.answerFlg = true;
				
				this.upBtnFlg = upBtnFlgTemp;
				this.downBtnFlg = downBtnFlgTemp;
			},

			// 点击上一题按钮
			upBtnClick() {
				var indexTemp = this.index;
				if(!this.questiones[indexTemp].answerFlg) {
					Toast('请选择答案');
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
				}
			},

			// 点击下一题按钮
			downBtnClick() {
				var indexTemp = this.index;
				if(!this.questiones[indexTemp].answerFlg) {
					Toast('请选择答案');
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
				}
			},
			submitClick() {
				if(this.totalNumber !== this.answerNumber) {
					MessageBox({
					title: '提示',
					message: '试题未全部作答，是否提交',
					showConfirmButton: true,
					showCancelButton: true
					})
					.then(action => {
 						if (action == 'confirm') { //确认的回调
 							this.postScore();
						}
 					}).catch(err => { 
						Toast('出现异常');
 					});
				} else {
					this.postScore();
				}
			},
			postScore() {
				if(this.examinationType === '1') {
					let option = {
					stuNo: localStorage.getItem("studentNo"),
					examNo: localStorage.getItem("examinationNo"),
					score: this.score
					}
					// 提交分数
					this.postAxios(this.updateScoreUrl,option).then(data => {
						localStorage.setItem("score", this.score);
						localStorage.setItem("answerNumber", this.answerNumber);
						localStorage.setItem("totalNumber", this.totalNumber);
						this.$router.push('scoreConfirm');
					}).catch(err => {
						Toast('出现异常');
					});
				} else {
					localStorage.setItem("score", this.score);
					localStorage.setItem("answerNumber", this.answerNumber);
					localStorage.setItem("totalNumber", this.totalNumber);
					this.$router.push('scoreConfirm');
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
			this.questiones = [];
			this.questiones = JSON.parse(localStorage.getItem("questionInfoList"));
			this.totalNumber = this.questiones.length;

			// 初始化多选的的数据数组
			this.questiones.forEach(itemTemp => {
      			itemTemp.checkboxInfo = [];
			})
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
			this.minute = localStorage.getItem("examinationMinute");
			this.seconds = 0;
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
		}	
	}
</script>
<style scoped>
  .foot-btn{
    height:25px;
    line-height:20px;
    
  }
  .next{
    
  }
  .prev, .next{
    width:50%;
  }
  .prev button,.next button{
    width:100%
  }

  .content-div {
        margin: 40px 0px 0px 5px
    }
    .result-icon {
        float:left;
        padding: 5px;
    }
    .success-count, .error-count{
        float:left;
        width:15%;
    }
    .timer{
        float:left;
        width:30%;
        text-align:center;
        margin-top:5px
    }
    .all-count {
        float:right;
        margin-top:1px
    }
    .result-count{
        line-height:32px
    }
    .answer-result .mint-field-state{
        margin-left:0px;
    }
    .answer-result{
        height:35px
    }
    .question-info{
        margin-left:5px
    }
    .answer{
        margin-left:15px;
        margin-top: 10px;
    }
    .que-decription, .answer-explain{
        margin-left:15px;
        margin-top: 10px;
        --min-height: 100px;
        color: #6f6658;
        font-weight: normal;
    }
    .que-chose{
        color: #6f6658;
        font-weight: normal;
        margin-left:15px;
    }
    .que-chose div{
        margin:5px;
        box-sizing: border-box;
    }
    .check-chose-list, .radio-chose-list{
        color: #6f6658;
        padding:10px
    }
    .check-chose-list .mint-checklist-label, .radio-chose-list .mint-radiolist-label{
        display:inline;
    }
    .que-type span{
        font-weight: bold;
    }
    .btn-list {
        margin-top: 15px; 
        text-align:center;
    }
    .btn-list .mt-button{
        width:50%
    }
    .answer-true{
        font-weight: bold;
    }
    .que-list {
        padding:5px
    }
    .modal-popup {
        border-radius:5px;
    }
    .modal-popup .modal-div{
        margin:5px,10px
    }
    .exam-type{
        margin-bottom:10px;
        margin-top:5px;
    }
</style>