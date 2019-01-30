<template>
	<div>
		<!-- 头部 -->
		<div id="tab-bar">
    		<mt-header title="离线学习" fixed style="font-size:18px">
    		</mt-header>
  		</div>
		<!-- 题目部 -->
		<div class="content-div">
			<div>
				<!-- 用户双向绑定，刷新页面 -->
				<input type="hidden" v-model="hiddenData" >
				<div class="exam-type">
                    <mt-cell title="题目类别" is-link @click.native="questionsTypeOptionsClick">
                        <span>{{optionValue}}</span>
                    </mt-cell>
                </div>
				<div class="all-count" v-if="questiones.length !== 0">
					<span class="mint-field-state" @click="showModal">
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
                	<mt-picker @change="onValuesChange" :slots="questionsTypeOptions" value-key="value" ></mt-picker>
                </mt-popup>
				
			</div>
			<div class="question-info" v-if="questiones.length !== 0">
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
	import { MessageBox } from 'mint-ui';
	
	export default {
		data() {
			return {
				hiddenData: 0,
				totalNumber: 0,
				answerNumber: 0,
				// 题目类别Options
				questionsTypeOptions: [],
				popupVisible: false,
				optionKey: "",
				optionValue: "",
				questiones: [],
				item: "",
				index:0,
				upBtnFlg: true,
				downBtnFlg: true,
				currentTags: {},
				pullDownVisible: false,
				examinationType : localStorage.getItem("examinationType"),
				getDataTypeInfoUrl: "/common/getDataTypeInfo",
				allquestions: []
			}
		},
		methods: {
			questionsTypeOptionsClick() {
				this.pullDownVisible = true;
			},
			getQueList(indexTemp) {
				this.popupVisible = false;
				this.index = indexTemp;
				this.item = this.questiones[this.index];
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
			onValuesChange(picker, values) {
            if (picker.getSlotValue(0) != null) {
					this.optionKey = picker.getValues()[0].key;
					this.optionValue = picker.getValues()[0].value;
					this.pullDownVisible = false;

					if(this.allquestions) {
						if(this.allquestions.length > 0) {
							for(var i = 0; i < this.allquestions.length; i++) {
								if(this.optionKey === this.allquestions[i].questionType) {
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

				
        }
		},
		mounted() {
			// 获取题目类别
			this.postAxios(this.getDataTypeInfoUrl, {typeCode: 'tmzl'}).then(data => {
			let valuesObj = new Object();
			let valuesList = [{ key: '0', value: "请选择" }];

			data.dataTypeList.forEach(itemInfo => {
				let valuesItem = new Object();
				valuesItem.key = itemInfo.key;
				valuesItem.value = itemInfo.value;
				valuesList.push(valuesItem);
			});
			valuesObj.values = valuesList;
			this.questionsTypeOptions.push(valuesObj);
			}).catch(err => {
				Toast('出现异常');
			});
			this.optionKey = '0';
			this.optionValue = '请选择';

			this.allquestions = JSON.parse(localStorage.getItem("offlineQuestions"));


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
        float:left;
		width:9%;
		text-align:center;
		padding:5px;
		border:1px solid #8E959F;
		color:#363D45;
		font-size:80%
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
	.indexSelected{
		color:rgb(0, 255, 200);
	}
	.indexNoSelected{
		color: rgb(0, 0, 0);
	}
</style>