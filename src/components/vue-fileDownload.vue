<template>
	<div id="exam_history" class="operateDiv">
    <div class="box">
			<mt-header fixed title="文件列表" style="font-size:16px">
				<mt-button slot="left" style="font-size:14px" @click="$router.back(-1)">返回</mt-button>
			</mt-header>
		</div>
		<div class="history-wrapper" id="history">
			<mt-cell style="text-align:left" title="文件类别" is-link @click.native="showModal()">
				<span style="color: green">{{fileTypeValue}}</span>
			</mt-cell>
			<div>
				<mt-cell style="text-align:left" title="文件名" >
					<span style="text-align:right">上传日期</span>
				</mt-cell>
				<mt-popup v-model="popupVisible" position="bottom" style="width:100vw">
					<mt-picker :slots="fileTypeOptions"  valueKey="value" :visible-item-count="9" :show-toolbar="true" ref="picker" >
						<div style="display:table;width:100vw">
							<div style="text-align:left;padding:5px;width:50vw;display:table-cell;">
								<mt-button @click="showModal" type="primary" size="small">取消</mt-button>
							</div>
							<div style="text-align:right;padding:5px;width:50vw;display:table-cell;">
								<mt-button @click="onFileTypeChange" type="primary" size="small">确认</mt-button>
							</div>
						</div>
					</mt-picker>
				</mt-popup>
			</div>
			<div v-for="item in fileInfoData" v-bind:key="item.id" @click="selectOnClick(item)" >
					<mt-cell v-model="fileInfoData"
						style="text-align:left"
						v-bind:title="item.fileName"
					>{{item.uploadTime}}</mt-cell>
			</div>
  	</div>
  </div>
</template>
<script>
	import { Toast } from 'mint-ui';
	export default {
		data() {
			return {
				// 文件列表
				fileInfoData: [],
				// 文件类型Popup显示Flag
				popupVisible: false,
				// 文件类型Options
				fileTypeOptions: [],
				// 选中的文件类别
				fileTypeValue: "",
				// 获取文件列表URL
				getFileInfoUrl: "/common/getFileInfo",
				// 获取字典信息URL
				getDataTypeInfoUrl: "/common/getDataTypeInfo"

			}
		},
		methods: {
			selectOnClick(item) {
				window.open(item.filePath);
			},
			showModal: function (){
				if(this.popupVisible) {
					this.popupVisible = false;
				} else {
					this.popupVisible = true;
				}
				
			},
			getFileType() {
				// 获取培训类别
				this.postAxios(this.getDataTypeInfoUrl, {typeCode: 'fileType'}).then(data => {
					let valuesInfo = [{ key: '0', value: "全部" }];
					data.dataTypeList.forEach(dataTypeInfo => {
						valuesInfo.push(dataTypeInfo);
					});
					let temp = {values: valuesInfo};
					this.fileTypeOptions.push(temp);
				}).catch(err => {
					Toast('出现异常');
				});
			},
			onFileTypeChange() {
				if (this.$refs.picker.getSlotValue(0) != null) {
					this.fileTypeValue = this.$refs.picker.getValues()[0].value;
					let key = this.$refs.picker.getValues()[0].key;

					if(key === '0') {
						this.postAxios(this.getFileInfoUrl).then(data => {
							this.fileInfoData = data;
						}).catch(err => {
							Toast('出现异常');
						});
					} else {
						this.postAxios(this.getFileInfoUrl,{fileTypeKey: key}).then(data => {
							this.fileInfoData = data;
						}).catch(err => {
							Toast('出现异常');
						});
					}
				}
				this.popupVisible = false;
			}
		},
		mounted() {
			this.postAxios(this.getFileInfoUrl).then(data => {
				this.fileInfoData = data;
			}).catch(err => {
				Toast('出现异常');
			});

			this.getFileType();
			this.fileTypeValue = "全部";
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