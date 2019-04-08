<template>
  <!--<div>
    <div>
      <mt-tabbar v-model="mySelected" fixed>
        <mt-tab-item id="index">
          <span style="font-size:20px;">首页</span>
        </mt-tab-item>
        <mt-tab-item id="myPage">
           <span style="font-size:20px;">我的</span>
        </mt-tab-item>
      </mt-tabbar>
    </div>
  </div>-->
    <footer class="footer_guide border-1px">
    <div class="guide_item" @click="goto('/')" :class="{on: isCurrent('/')}">
    <span>
    <i class="iconfont iconshouye"></i>
    </span>
    <span>首页</span>
    </div>

    <div class="guide_item" @click="goto('/myPage')" :class="{on: isCurrent('/myPage')}">
    <span>
    <i class="iconfont iconwode-active"></i>
    </span>
    <span>我的</span>
    </div>
  </footer>
</template>

<script>
  import { Toast } from 'mint-ui';
	export default {
    data() {
      return {
        mySelected: 'index',
        // 登录ControllerURL（在线）
				loginUrl: "/login/userLogin"
      }
    },
    methods: {
      goto (path) {
        if('/myPage' === path) {
          let options = {
            userIdcard: localStorage.getItem("userIdcard")
          };

          this.postAxios(this.loginUrl, options).then(data => {
            if(data.returnCode === '0') {
              this.$router.replace(path);
            } else {
              this.exit();
              Toast("无效用户，请于管理员联系");
            }
          }).catch(err => {
            Toast('出现异常');
          });
          
        } else {
          this.$router.replace(path);
        }
      },

      isCurrent (path) {
        return this.$route.path === path
      },

      exit() {
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
				// 设置所属单位ID
				localStorage.setItem("userUnitsId",'');
				// 试题信息
				localStorage.setItem("questionInfoList",JSON.stringify([]));
				// 考试分钟数
				localStorage.setItem("examinationMinute",0);
				// 培训编号
				localStorage.setItem("trainNo",'');
				// 考试编号
				localStorage.setItem("examinationNo",'');
				// 考试类型（1：在线考试，2：模拟考试）
				localStorage.setItem("examinationType",'');
				// 分数
				localStorage.setItem("score", 0);
				// 回答的题数
				localStorage.setItem("answerNumber", 0);
				// 总题数
				localStorage.setItem("totalNumber", 0);
				// 题库编号
				localStorage.setItem("questionBank",'');
				// 设置学员类别
				localStorage.setItem("userType",'');
				// 考试设定时间
				localStorage.setItem("questionsSettingDate",'');
				this.$router.push('/login');
      }
    },
  }
</script>


<style lang="stylus" rel="stylesheet/stylus">
/*引入公共样式*/
@import "../assets/css/mixins.styl"
.footer_guide
  // 顶部有白色的边框
  top-border-1px(#e4e4e4)
  position fixed
  z-index 100
  left 0
  right 0
  bottom 0
  background-color #fff
  width 100%
  height 50px
  display flex
  .guide_item
    display flex
    flex 1
    text-align center
    flex-direction column
    align-items center
    margin 5px
    color #999999
    &.on
      color #26A2FF
    span
      font-size 12px
      margin-top 2px
      margin-bottom 2px
      .iconfont
        font-size 22px
</style>