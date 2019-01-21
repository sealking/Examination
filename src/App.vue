<template>
	<div>
		<vueLogin v-if="showLogin" @showLoginConfirmPage="showLoginConfirmPage"></vueLogin>
		<vueLoginConfirm v-if="showLoginConfirm" @showMockQuestionSelectPage="showMockQuestionSelectPage" @showIndexPage="showIndexPage"></vueLoginConfirm>
		<vueMockQuestionSelect v-if="showMockQuestionSelect" @showIndexPage="showIndexPage"></vueMockQuestionSelect>
		<vueIndex v-if="showIndex" @showScoreConfirmPage="showScoreConfirmPage"></vueIndex>
		<vueScoreConfirm v-if="showScoreConfirm" @showLoginPage="showLoginPage"></vueScoreConfirm>
	</div>
</template>

<script>
	import vueLogin from './components/vue-login.vue';
	import vueLoginConfirm from './components/vue-loginConfirm.vue';
	import vueMockQuestionSelect from './components/vue-mockQuestionSelect.vue';
	import vueIndex from './components/vue-index.vue';
	import vueScoreConfirm from './components/vue-scoreConfirm.vue';

	export default {
		name: "App",
		data() {
			return {
				showLogin: true,
				showLoginConfirm: false,
				showMockQuestionSelect: false,
				showIndex: false,
				showScoreConfirm: false
			}
		},
		methods: {
			showLoginPage() {
				this.showLogin = true;
				this.showLoginConfirm = false;
				this.showMockQuestionSelect = false,
				this.showIndex = false;
				this.showScoreConfirm = false;
			},
			showLoginConfirmPage() {
				this.showLogin = false;
				this.showLoginConfirm = true;
				this.showMockQuestionSelect = false,
				this.showIndex = false;
				this.showScoreConfirm = false;
			},
			showMockQuestionSelectPage() {
				this.showLogin = false;
				this.showLoginConfirm = false;
				this.showMockQuestionSelect = true,
				this.showIndex = false;
				this.showScoreConfirm = false;
			},
			showIndexPage() {
				this.showLogin = false;
				this.showLoginConfirm = false;
				this.showMockQuestionSelect = false,
				this.showIndex = true;
				this.showScoreConfirm = false;
			},
			showScoreConfirmPage() {
				this.showLogin = false;
				this.showLoginConfirm = false;
				this.showMockQuestionSelect = false,
				this.showIndex = false;
				this.showScoreConfirm = true;
			}
		},
		components: {
			vueLogin,
			vueLoginConfirm,
			vueMockQuestionSelect,
			vueIndex,
			vueScoreConfirm
		}
	}
</script>