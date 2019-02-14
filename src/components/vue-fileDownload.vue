<template>
	<div id="exam_history" class="operateDiv">
    <div class="box">
		<mt-header fixed title="文件列表" style="font-size:18px">
			<mt-button slot="left" @click="$router.back(-1)">返回</mt-button>
		</mt-header>
    </div>
    <div class="history-wrapper" id="history">
		<div>
			<mt-cell style="text-align:left" title="文件名" class="history-listitem">
				<span style="text-align:right">上传日期</span>
			</mt-cell>
		</div>
		<div v-for="item in mockExamTableData" v-bind:key="item.settingDate" @click="selectOnClick(item)" >
        <mt-cell
          style="text-align:left"
          v-bind:title="item.questionsNo"
          class="history-listitem"
        >{{item.settingDate}}</mt-cell>
      </div>
    </div>
  </div>
</template>
<script>
	import { Toast } from 'mint-ui';
	export default {
		data() {
			return {
				// 模拟考试历史列表
				mockExamTableData: [],
				// 获取模拟考试历史列表URL
				getExamListUrl: "/examination/getExamListByStuNo",
				// 随机获取模拟试题URL
				getQuestionsUrl: "/examination/getQuestions",
				// 根据日期获得模拟试题URL
				getQuestionsByDateUrl: "/common/fileDownload"

			}
		},
		methods: {
			randomOnClick() {
				let parms = {
					examinationType: "2",
					studentNo: localStorage.getItem("studentNo"),
					questionType: localStorage.getItem("questionType"),
					workType: localStorage.getItem("workType")
				};

				this.postAxios(this.getQuestionsUrl, parms).then(data => {
					if(data.returnCode === '0') {
						// 试题信息
						localStorage.setItem("questionInfoList",JSON.stringify(data.questionInfoList));
						// 考试分钟数
						localStorage.setItem("examinationMinute",data.examinationMinute);
						this.$router.replace('examIndex');
					} else {
						Toast(data.msg);
					}
				}).catch(err => {
					Toast('出现异常');
				});
			},
			selectOnClick(item) {
				let parms = {
					studentNo: item.studentNo,
					questionsNo: item.questionsNo,
					settingDate: item.settingDate
				};

				plus.nativeUI.showWaiting( "下载中..." ); 
	                //创建下载管理对象
		        var SX_down= plus.downloader.createDownload(this.getQuestionsByDateUrl,{}, function ( d, status ) {	
		        // 下载完成
		        if ( status == 200 ) { 
		    	    plus.nativeUI.closeWaiting();
		    	    //下载成功后的回调函数
		            plus.nativeUI.toast( "下载成功，准备安装" + d.filename );
	                    plus.runtime.install(
	            	        d.filename,
	            	        {},
	            	        function(){
	                	        plus.nativeUI.toast('安装成功');
	                	        plus.runtime.restart();
	                        },
	                        function(e){
	                	        plus.nativeUI.toast(d.filename+'安装失败');
 
                                        alert(JSON.stringify(e))
 
	                        }
	            	    );
		        } else {
		             alert( "下载失败 " + status ); 
		        }  
		    });
 
                    //开始下载任务
 
		    SX_down.start();

				this.downloadAxios(this.getQuestionsByDateUrl).then((data) => {
					if (!data) {
						Toast('下载失败');
					}
					// let url = window.URL.createObjectURL(data);
					// let link = document.createElement('a');
					// link.style.display = 'none';
					// link.href = url;
					// link.setAttribute('download', 'excel.docx');
					// document.body.appendChild(link);
					// link.click();

					// var _this = this;
					// window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
					// 	fs.root.getFile("downloadedImage.png", { create: true, exclusive: false }, function (fileEntry) {
					// 		console.log(fileEntry);
					// 		//调用fileTransfer插件，下载图片
					// 		_this.downLoadImg(fileEntry.nativeURL);
							
					// 	}, function(err) {
					// 		console.log(err);
					// 	});
					// }, function(error) {
					// 	console.log(error);
					// });
				}).catch(err => {
					Toast('下载失败');
				});
			}
		},
		mounted() {
			let parm = {
				studentNo: localStorage.getItem("studentNo"),
				workType: localStorage.getItem("workType"),
			}
			this.postAxios(this.getExamListUrl, parm).then(data => {
					this.mockExamTableData = data;
				}).catch(err => {
					Toast('出现异常');
				});
		}
	}
	
</script>
<style scoped>
/* 操作区域的样式*/
	.mybutton {
		margin-top: 20px;
			display: inline-block;
			width: 90%;
		}

	.history-wrapper {
		height: 85vh;
		overflow: scroll;
	}

	.history-list {
		list-style: none;
	}

	.history-listitem {
		height: 50px;
		line-height: 50px;
		border-radius: 2px;
		border-bottom: solid 1px rgb(234, 234, 234);
	}

	.box {
		display: -webkit-flex; /*在webkit内核的浏览器上使用要加前缀*/
		display: flex;
		flex-direction: column;
		border-bottom: solid 1px rgb(234, 234, 234);
		padding-bottom: 30px;
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