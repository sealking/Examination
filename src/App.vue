<template>
	<div id="app">
		<vueLogin v-if="showLogin" @showIndexPage="showIndexPage" @showOfflinePage="showOfflinePage"></vueLogin>
		<vueIndex v-if="showIndex" 
		@showExamConfirmPage="showExamConfirmPage" 
		@showOfflinePage="showOfflinePage"></vueIndex>
		<vueOffline v-if="showOffline" @showExamIndexPage="showExamIndexPage"></vueOffline>
		<vueExamConfirm v-if="showExamConfirm" @showMockQuestionSelectPage="showMockQuestionSelectPage" @showExamIndexPage="showExamIndexPage"></vueExamConfirm>
		<vueMockQuestionSelect v-if="showMockQuestionSelect" @showExamIndexPage="showExamIndexPage"></vueMockQuestionSelect>
		<vueExamIndex v-if="showExamIndex" @showScoreConfirmPage="showScoreConfirmPage"></vueExamIndex>
		<vueScoreConfirm v-if="showScoreConfirm" @showIndexPage="showIndexPage"></vueScoreConfirm>
	</div>
</template>

<script>
	import vueLogin from './components/vue-login.vue';
	import vueIndex from './components/vue-index.vue';
	import vueExamConfirm from './components/vue-examConfirm.vue';
	import vueMockQuestionSelect from './components/vue-mockQuestionSelect.vue';
	import vueExamIndex from './components/vue-examIndex.vue';
	import vueScoreConfirm from './components/vue-scoreConfirm.vue';
	import vueOffline from './components/vue-offline.vue';
	import Mui from 'vue-awesome-mui';
	
	// mui.init({
	// 	keyEventBind: {
	// 		backbutton: true  //关闭back按键监听
	// 	}
	// });
	// //首页返回键处理
	// //处理逻辑：1秒内，连续两次按返回键，则退出应用；
	// var first = null;
	// mui.back = function() {
	// 	//首次按键，提示  再按一次退出应用
	// 	if (!first) {
	// 		first = new Date().getTime();//记录第一次按下回退键的时间
	// 		mui.toast('再按一次退出应用');//给出提示
    //     	history.go(-1)//回退到上一页面
	// 		setTimeout(function() {//1s中后清除
    //         	first = null;
    //     	}, 1000);
    // 	} else {
    //     	if (new Date().getTime() - first < 1000) {//如果两次按下的时间小于1s，
    //         	plus.runtime.quit();//那么就退出app
	// 		  }
	// 	}
	// };

	export default {
		name: "App",
		data() {
			return {
				showLogin: true,
				showIndex: false,
				showExamConfirm: false,
				showMockQuestionSelect: false,
				showExamIndex: false,
				showScoreConfirm: false,
				showOffline: false
			}
		},
		methods: {
			showLoginPage() {
				this.showLogin = true;
				this.showIndex = false;
				this.showExamConfirm = false;
				this.showMockQuestionSelect = false,
				this.showExamIndex = false;
				this.showScoreConfirm = false;
				this.showOffline = false;
			},
			showIndexPage() {
				this.showLogin = false;
				this.showIndex = true;
				this.showExamConfirm = false;
				this.showMockQuestionSelect = false,
				this.showExamIndex = false;
				this.showScoreConfirm = false;
				this.showOffline = false;
			},
			showExamConfirmPage() {
				this.showLogin = false;
				this.showIndex = false;
				this.showExamConfirm = true;
				this.showMockQuestionSelect = false,
				this.showExamIndex = false;
				this.showScoreConfirm = false;
				this.showOffline = false;
			},
			showMockQuestionSelectPage() {
				this.showLogin = false;
				this.showIndex = false;
				this.showExamConfirm = false;
				this.showMockQuestionSelect = true,
				this.showExamIndex = false;
				this.showScoreConfirm = false;
				this.showOffline = false;
			},
			showExamIndexPage() {
				this.showLogin = false;
				this.showIndex = false;
				this.showExamConfirm = false;
				this.showMockQuestionSelect = false,
				this.showExamIndex = true;
				this.showScoreConfirm = false;
				this.showOffline = false;
			},
			showScoreConfirmPage() {
				this.showLogin = false;
				this.showIndex = false;
				this.showExamConfirm = false;
				this.showMockQuestionSelect = false,
				this.showExamIndex = false;
				this.showScoreConfirm = true;
				this.showOffline = false;
			},
			showOfflinePage() {
				this.showLogin = false;
				this.showIndex = false;
				this.showExamConfirm = false;
				this.showMockQuestionSelect = false,
				this.showExamIndex = false;
				this.showScoreConfirm = false;
				this.showOffline = true;
			}
		},
		components: {
			vueLogin,
			vueIndex,
			vueExamConfirm,
			vueMockQuestionSelect,
			vueExamIndex,
			vueScoreConfirm,
			vueOffline
		}
	}
</script>