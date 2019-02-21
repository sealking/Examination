<template>
  <div>
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
  </div>
</template>

<script>
	export default {
    // 接受父组件的值
    props: {
      mySelected: String,
      required: true
    },

    watch: {
      mySelected: function (val) {
        if(val === 'index') {
           this.$router.push('/');
        } else {
          this.$router.push('/myPage');
        }
      }
    }
  }
</script>