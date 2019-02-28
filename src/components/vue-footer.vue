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
    <i class="iconfont icon-shouye"></i>
    </span>
    <span>首页</span>
    </div>

    <div class="guide_item" @click="goto('/myPage')" :class="{on: isCurrent('/myPage')}">
    <span>
    <i class="iconfont icon-wode-active"></i>
    </span>
    <span>我的</span>
    </div>
  </footer>
</template>

<script>
	export default {
    data() {
      return {
        mySelected: 'index'
      }
    },
    methods: {
      goto (path) {
        this.$router.replace(path)
      },
      isCurrent (path) {
        return this.$route.path === path
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