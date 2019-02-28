<template>
    <div>
        <div class="box">
			<mt-header fixed title="个人信息" style="font-size:16px">
				<mt-button slot="right" @click="exit()">退出登录</mt-button>
			</mt-header>
		</div>
		<div style="height:40vh">
        <mt-cell :title="userName"></mt-cell>
        <mt-cell :title="userSex"></mt-cell>
        <mt-cell :title="userIdcard"></mt-cell>
        <mt-cell :title="userUnits"></mt-cell>
		<mt-cell style="text-align:left" title="培训列表" is-link @click.native="handleClickTrain">
			<span style="color: green">{{trainName}}</span>
		</mt-cell>
		<mt-popup v-model="trainListVisible" position="bottom" style="width:100vw">
			<mt-picker :slots="trainList" @change="onTrainChange" valueKey="value"></mt-picker>
		</mt-popup>
		<mt-navbar v-model="ranking">
  			<mt-tab-item id="1"><span style="font-size:16px">学习排名</span></mt-tab-item>
  			<mt-tab-item id="2"><span style="font-size:16px">考试排名</span></mt-tab-item>
		</mt-navbar>
		<mt-tab-container v-model="ranking" style="padding-bottom:50px">
			<mt-tab-container-item id="1">
				<mt-cell title="姓名" >
					<div style="margin-left:15px;width:40px">名次</div>
					<div style="margin-left:15px;width:40px">次数</div>
					<div style="margin-left:15px;width:40px">套数</div>
					<div style="margin-left:15px;width:50px">总成绩</div>
				</mt-cell>
				<mt-cell 
					v-for="(item,index) in mockRankingList"
					:title="item.studentName"
					:key="item.studentNo"
					:style="item.studentNo === studentNo? 'background-color:#FFF8DC': 'background-color:#FFFFFF'"
				>
					<div style="margin-left:15px;width:40px">{{index + 1}}</div>
					<div style="margin-left:15px;width:40px">{{item.examCount}}</div>
					<div style="margin-left:15px;width:40px">{{item.questionCount}}</div>
					<div style="margin-left:15px;width:50px">{{item.studentScore}}</div>
				</mt-cell>
			</mt-tab-container-item>
			<mt-tab-container-item id="2">
				<mt-cell title="姓名" >
					<div style="margin-left:15px;width:40px">名次</div>
					<div style="margin-left:15px;width:50px">成绩</div>
				</mt-cell>
				<mt-cell 
					v-for="(item,index) in onlineRankingList"
					:title="item.studentName"
					:key="item.studentNo"
					:style="item.studentNo === studentNo? 'background-color:#FFF8DC': 'background-color:#FFFFFF'"
				>
					<div style="margin-left:15px;width:40px">{{index + 1}}</div>
					<div style="margin-left:15px;width:50px">{{item.studentScore}}</div>
				</mt-cell>
			</mt-tab-container-item>
		</mt-tab-container>
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
				// 身份证号
				userIdcard: localStorage.getItem("userIdcard"),
				// 学员编号
				studentNo: localStorage.getItem('studentNo'),
				// 学员姓名
                userName: localStorage.getItem("userName"),
                // 学员性别
                userSex: localStorage.getItem("userSex"),
				// 所属单位
				userUnits: localStorage.getItem("userUnits"),
				// 培训popup显示Flag
				trainListVisible: false,
				// 培训popup选择的值
				trainValue: "",
				// 培训popup选择的名字
				trainName: "",
				// 培训列表
				trainList: [],
				// 考试类型。1：在线考试，2：模拟考试
				examinationType: "2",
				// 排名Tab
				ranking: "1",
				// 模拟考试排名List
				mockRankingList: [],
				// 在线考试排名
				onlineRankingList: [],
				// 获取用户的培训信息Url
				getTrainByStuNoUrl: "/examination/getTrainByStuNo",
				// 获取排名信息
				getRankingUrl: "/examination/getRanking"
			}
		},
		methods: {
            // 退出登录
            exit() {
				MessageBox({
					title: '提示',
					message: '确定要退出登录？',
					showConfirmButton: true,
					showCancelButton: true
				})
				.then(action => {
					if (action == 'confirm') { //确认的回调
						// 学员编号
						localStorage.setItem("studentNo", '');
						// 设置用户的身份证号
						localStorage.setItem("userIdcard",'');
						// 设置姓名
                        localStorage.setItem("userName",'');
                        // 设置性别
                        localStorage.setItem("userSex",'');
						// 设置所属单位
						localStorage.setItem("userUnits",'');
						// 试题信息
						localStorage.setItem("questionInfoList",JSON.stringify([]));
						// 考试分钟数
						localStorage.setItem("examinationMinute",0);
						// 培训编号
						localStorage.setItem("trainNo",'');
						// 考试编号
						localStorage.setItem("examinationNo",'');
						// 工种岗位
						localStorage.setItem("workType",'');
						// 培训类别
						localStorage.setItem("trainType",'');
						// 培训层次
						localStorage.setItem("trainLevel",'');
						// 考试类型（1：在线考试，2：模拟考试）
						localStorage.setItem("examinationType",'');
						// 分数
						localStorage.setItem("score", 0);
						// 回答的题数
						localStorage.setItem("answerNumber", 0);
						// 总题数
						localStorage.setItem("totalNumber", 0);
						this.$router.push('/login');
					}
				}).catch(err => { 
					Toast('出现异常');
                });
			},
			// 培训列表发生变化时
			onTrainChange(picker, values) {
				if (picker.getSlotValue(0) != null) {
					this.trainValue = picker.getValues()[0].key;
					this.trainName = picker.getValues()[0].value;
					this.trainListVisible = false;
					this.getMockRanking();
					this.getOnlineRanking();
				} else {
					this.trainingType = "";
				}
			},
			handleClickTrain() {
				this.trainListVisible = true;
    		},
			// 获取用户的培训信息
			getTrainByStuNo() {
				let parm = {
					stuNo: localStorage.getItem("studentNo")
				};
				this.postAxios(this.getTrainByStuNoUrl, parm).then(data => {
					if(data.length > 0) {
						let valuesInfoList = [];
						// 培训列表
						data.forEach(dataInfo => {
							var valuesInfo = {key: dataInfo.no, value: dataInfo.name };
							valuesInfoList.push(valuesInfo);
						});
						let temp = {values: valuesInfoList};
						this.trainList.push(temp);
						this.trainValue = data[0].no;
						this.trainName = data[0].name;

						// 获取模拟考试排名
						this.getMockRanking();
						// 获取在线考试排名
						this.getOnlineRanking();
					}
				}).catch(err => {
					Toast('出现异常');
				});
			},
			// 获取模拟考试排名
			getMockRanking() {
				let parm = {
					trainNo: this.trainValue,
					examinationType: "2"
				};

				this.postAxios(this.getRankingUrl, parm).then(data => {
					this.mockRankingList = data;
					
				}).catch(err => {
					Toast('出现异常');
				});
			},
			// 获取在线考试排名
			getOnlineRanking() {
				let parm = {
					trainNo: this.trainValue,
					examinationType: "1"
				};

				this.postAxios(this.getRankingUrl, parm).then(data => {
					this.onlineRankingList = data;
				}).catch(err => {
					Toast('出现异常');
				});
			}
        },
	    mounted() {
            // 身份证号
            let idCard = localStorage.getItem("userIdcard");
            let startNum = idCard.length - 6;
            let endNum = idCard.length - 2;
            idCard = idCard.substring(0,startNum) + "****" + idCard.substring(endNum,idCard.length);
            this.userIdcard = "身份证号码：" + idCard;
			// 学员姓名
            this.userName = "姓名：" + localStorage.getItem("userName");
            // 学员性别
            let sex = localStorage.getItem("userSex");
            if(sex === '1') {
                this.userSex = "性别：男";
            } else {
                this.userSex = "性别：女";
            }
			// 所属单位
			this.userUnits = "所属单位：" + localStorage.getItem("userUnits");

			// 获取用户的培训信息
			this.getTrainByStuNo();
        }
    }
</script>

<style scoped>
.box {
		display: -webkit-flex; /*在webkit内核的浏览器上使用要加前缀*/
		display: flex;
		flex-direction: column;
		border-bottom: solid 1px rgb(234, 234, 234);
		padding-bottom: 30px;
	}
</style>