<template>
	<div>
		<!-- 头部 -->
		<div id="tab-bar">
    		<mt-header title="离线学习" fixed style="font-size:16px">
				<mt-button slot="left" style="font-size:14px" @click="$router.back(-1)">返回</mt-button>
				<mt-button v-if="questiones.length === 0" slot="right" @click="offlineSyn()">试题同步</mt-button>
				<mt-button v-if="questiones.length !== 0" slot="right" @click="showModal()">…</mt-button>
    		</mt-header>
  		</div>
		<!-- 题目部 -->
		<div class="content-div">
			<div>
				<!-- 用户双向绑定，刷新页面 -->
				<input type="hidden" v-model="hiddenData" >
				<div class="exam-type">
                    <mt-cell title="题目类别" is-link @click.native="questionsTypeOptionsClick">
                        <span style="color: green">{{optionValue}}</span>
                    </mt-cell>
                </div>
				<div class="all-count" v-if="questiones.length !== 0">
					<span class="mint-field-state">
						<mt-badge size="normal" type="primary">答题进度</mt-badge>
						<span class="result-count">{{answerNumber}}/{{totalNumber}}</span>
					</span>
					<mt-popup
						v-model="popupVisible"
						popup-transition="popup-fade" class="mint-popup modal-popup" position="bottom" style="width:100%;min-height:250px" >
						<div class="modal-div">
							<div class="que-list" v-for="(item, indexTemp) in questiones"  v-bind:key="indexTemp" @click="getQueList(indexTemp)">
								<span :class="indexTemp == index? 'indexSelected':'indexNoSelected'">{{indexTemp + 1}}</span>
							</div>
						</div>
					</mt-popup>
				</div>
                <mt-popup v-model="pullDownVisible" position="bottom" style="width:100%">
                	<mt-picker :slots="questionsTypeOptions" value-key="value" :visible-item-count="9" :show-toolbar="true" ref="picker">
						<div style="display:table;width:100vw">
							<div style="text-align:left;padding:5px;width:50vw;display:table-cell;">
								<mt-button @click="questionsTypeOptionsClick" type="primary" size="small">取消</mt-button>
							</div>
							<div style="text-align:right;padding:5px;width:50vw;display:table-cell;">
								<mt-button @click="onValuesChange" type="primary" size="small">确认</mt-button>
							</div>
						</div>
					</mt-picker>
                </mt-popup>
				
			</div>
			<div class="question-info" v-if="questiones.length !== 0">
				<!-- 单选题 -->
				<div v-if="item.questionType === '1'">
					<div class="que-type">
						<mt-badge size="normal" type="success">单选题</mt-badge>
					</div>
					<div class="que-decription">
						<span>{{index + 1}}、{{item.questionContent}}</span>
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
						<span>{{index + 1}}、{{item.questionContent}}</span>                    
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
						<span>{{index + 1}}、{{item.questionContent}}</span>                    
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
						<span>{{index + 1}}、{{item.questionContent}}</span>
						<mt-field label="" placeholder="请输入正确答案" v-model="item.choice" :disabled="item.finish" ></mt-field>
					</div>
				</div>
			</div>
			<div class="btn-list" v-if="questiones.length !== 0">
				<mt-button type="primary" size="small" @click="getResult()" :disabled="item.finish">确认</mt-button>
			</div>
			<div class="answer" v-if="item.finish && questiones.length !== 0">
				<p class="answer-true" v-if="item.questionType === '1' || item.questionType === '4'">
					<span v-if="item.answer === item.choice">回答正确</span>
					<span v-if="item.answer !== item.choice">回答错误，正确答案为【{{item.answer}}】</span>
				</p>
				<p class="answer-true" v-if="item.questionType === '2'">
					<span v-if="item.answer === item.checkboxInfo.sort().join(',')">回答正确</span>
					<span v-if="item.answer !== item.checkboxInfo.sort().join(',')">回答错误，正确答案为【{{item.answer}}】</span>
				</p>
				<p class="answer-true" v-if="item.questionType === '3'">
					<span v-if="item.answer === item.choice">回答正确</span>
					<span v-if="item.answer !== item.choice">回答错误</span>
				</p>
			</div>
		</div>

		<!-- 底部 -->
		<div id="tab-bar" v-if="questiones.length !== 0">
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
	import { Indicator } from 'mint-ui';
	import { MessageBox } from 'mint-ui';
	
	export default {
		data() {
			return {
				// 用于刷新页面
				hiddenData: 0,
				// 总题数
				totalNumber: 0,
				// 已回答题数
				answerNumber: 0,
				// 题目类别Options
				questionsTypeOptions: [],
				// 题号popup显示Flag
				popupVisible: false,
				// 题目类别Key
				optionKey: "",
				// 题目类别Value
				optionValue: "",
				// 试题信息
				questiones: [],
				// 每道题的对象
				item: "",
				// 试题索引
				index:0,
				// 上一页是否显示Flag
				upBtnFlg: true,
				// 下一页是否显示Flag
				downBtnFlg: true,
				// 题目类别popup显示Flag
				pullDownVisible: false,
				// 获取题目类型
				getDataTypeInfoUrl: "/common/getDataTypeInfo",
				// 试题同步URL
				offlineSynUrl: "examination/getQuestionsByType",
				// 试题题库
				allquestions: []
			}
		},
		methods: {
			questionsTypeOptionsClick() {
				if(this.pullDownVisible) {
					this.pullDownVisible = false;
				} else {
					this.pullDownVisible = true;
				}
				
			},
			getQueList(indexTemp) {
				this.popupVisible = false;
				this.index = indexTemp;
				this.item = this.questiones[this.index];

				if(this.questiones.length === 1) {
					this.downBtnFlg = true;
					this.upBtnFlg = true;
				} else {
					if(indexTemp === this.questiones.length - 1) {
						this.downBtnFlg = true;
						this.upBtnFlg = false;
					}

					if(indexTemp === 0) {
						this.upBtnFlg = false;
						this.upBtnFlg = true;
					}
				}
			},
			showModal: function (){
            	this.popupVisible = true;
        	},
			
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
					this.item.choiceTemp = this.item.choice;
					this.answerNumber++;
				} else if(this.item.questionType === '2') {
					if(this.item.checkboxInfo.length < 1) {
						Toast('请选择答案');
						return;
					}
					this.item.checkboxInfoTemp = this.item.checkboxInfo;
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
				this.hiddenData++;
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
				this.hiddenData++;
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
				this.hiddenData++;
			},
			// 题目类型改变时
			onValuesChange() {
            if (this.$refs.picker.getSlotValue(0) != null) {
					this.optionKey = this.$refs.picker.getValues()[0].key;
					this.optionValue = this.$refs.picker.getValues()[0].value;
					this.pullDownVisible = false;

					if(this.allquestions) {
						if(this.allquestions.length > 0) {
							for(var i = 0; i < this.allquestions.length; i++) {
								if(this.optionKey === this.allquestions[i].questionTypeKey) {
									this.questiones = this.allquestions[i].questionInfoList;
									break;
								}
								if(i === this.allquestions.length - 1) {
									this.questiones = [];
								}
							}
							if(this.questiones.length === 0) {
								Toast('你选择的题目类别没有试题，请同步');
							} else {
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
								this.totalNumber = this.questiones.length;
							}
						} else {
							Toast('题库未同步，请同步');
						}
					} else {
						Toast('题库未同步，请同步');
					}
					
				} else {
					this.trainingType = "";
				}	
			},
			// 试题同步
			offlineSyn() {
				Indicator.open('同步中...');
				this.postAxios(this.offlineSynUrl).then(data => {
					if(JSON.stringify(data).length > 0) {
						Toast("同步成功");
						localStorage.setItem("offlineQuestions",JSON.stringify(data));
						this.allquestions = data;
						this.optionKey = '0';
						this.optionValue = '请选择';

						// 获取题目类别
						let valuesObj = new Object();
						let valuesList = [{ key: '0', value: "请选择" }];

						if(this.allquestions) {
							this.allquestions.forEach(itemInfo => {
								let valuesItem = new Object();
								valuesItem.key = itemInfo.questionTypeKey;
								valuesItem.value = itemInfo.questionTypeValue;
								valuesList.push(valuesItem);
							});
						}
						valuesObj.values = valuesList;
						this.questionsTypeOptions = [];
						this.questionsTypeOptions.push(valuesObj);
					} else {
						Toast("同步失败，请检查服务器数据");
					}
					Indicator.close();
				}).catch(err => {
					Toast('出现异常', 'error');
					Indicator.close();
				});
			}
		},
		mounted() {
			
			this.allquestions = JSON.parse(localStorage.getItem("offlineQuestions"));
			this.optionKey = '0';
			this.optionValue = '请选择';

			// 获取题目类别
			let valuesObj = new Object();
			let valuesList = [{ key: '0', value: "请选择" }];

			if(this.allquestions) {
				this.allquestions.forEach(itemInfo => {
					let valuesItem = new Object();
					valuesItem.key = itemInfo.questionTypeKey;
					valuesItem.value = itemInfo.questionTypeValue;
					valuesList.push(valuesItem);
				});
			}
			valuesObj.values = valuesList;
			this.questionsTypeOptions.push(valuesObj);
		}
	}
</script>
<style scoped>
	.foot-btn{
		height:25px;
    	line-height:20px;
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
        padding:10px；
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
        width:50%；
    }
    .answer-true{
        font-weight: bold;
    }
    .que-list {
        float:left;
		width:9%;
		text-align:center;
		padding:5px;
		margin:3px;
		border:1px solid #8E959F;
		color:#363D45;
		font-size:80%；
    }
    .modal-popup {
        border-radius:5px;
    }
    .modal-popup .modal-div{
        margin:5px,10px；
    }
    .exam-type{
        margin-bottom:10px;
        margin-top:5px;
    }
	.indexSelected{
		color:rgb(0, 255, 200);
	}
	.indexNoSelected{
		color: rgb(0, 0, 0);
	}
</style>