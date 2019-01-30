<template>
  <div id="score" class="operateDiv">
    <div class="title">
      <mt-header fixed title="成绩信息" style="font-size:18px"></mt-header>
    </div>
    <div class="box">
      <div style="width:60%;text-align:left;">已答题数：&nbsp;&nbsp;&nbsp;&nbsp;{{answerNumber}}</div>
      <div style="width:40%;text-align:left;">未答题数：&nbsp;&nbsp;&nbsp;&nbsp;{{noAnswerNumber}}</div>
    </div>

    <div style="font-size:6vw;">总成绩:&nbsp;&nbsp;<span style="font-size:8vw;color:red">{{score}}</span>&nbsp;分</div>
    <div class="footBox">
      <mt-button size="large" type="primary" class="mybutton" @click="submitClick()">返回主页</mt-button>
    </div>
  </div>
</template>
<script>
	export default {
		data() {
			return {
				// 分数
				score: localStorage.getItem("score"),
				// 回答的题数
				answerNumber: localStorage.getItem("answerNumber"),
				// 未回答题数
				noAnswerNumber: localStorage.getItem("totalNumber") - localStorage.getItem("answerNumber")

			}
		},
		methods: {
			submitClick() {
				this.$router.push('/');
			}
		}
	}
</script>


<style scoped>
.operateDiv {
  padding-left: 20px;
  padding-right: 20px;
  text-align: center;
}
.box {
  display: -webkit-flex;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  font-size: 4vw;
}
.title {
  margin-bottom: 100px;
}

.mybutton {
  margin-top: 20px;
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
</style>