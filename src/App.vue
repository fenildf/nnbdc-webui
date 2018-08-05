<template>
  <div id="app" @mouseup="onMouseUp($event)" v-shortkey="['esc']" @shortkey="escPressed()">
    <my-nav ref="nav" v-on:popWordDetailWindow="popWordDetailWindow"
            v-on:hideWordDetailWindow="hideWordDetailWindow"></my-nav>
    <div :style="{height:routerViewHeight+'px', overflowY: 'auto'}">
      <transition name="fade" mode="out-in">
        <router-view v-on:popWordDetailWindow="popWordDetailWindow"
                     v-on:hideWordDetailWindow="hideWordDetailWindow" :key="key"></router-view>
      </transition>
    </div>
    <WordDetailWindow ref="wordDetailWindow"></WordDetailWindow>
  </div>
</template>
<style lang="less">
  @import '~vux/src/styles/reset.less';

  html {
    height: 100%;
  }

  body {
    background-color: #fbf9fe;
    height: 100%;
  }

  #app {
    //overflow: hidden; /*当app div含有脱离标准流的子div时，可以使app div自动调整高度*/
    height: 100%;
  }
</style>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import api from './pages/api'
  import WordDetailWindow from './components/WordDetailWindow.vue'

  export default {
    name: 'app',
    components: {
      WordDetailWindow
    },
    data () {
      return {routerViewHeight: 0}
    },
    mounted () {
      api.getLoggedInUser().then((res) => {
        this.setLoggedInUser(res.data == null ? {} : res.data)
      })

      window.addEventListener('resize', this.resetRouterWindowHeight)
      this.resetRouterWindowHeight()
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.resetRouterWindowHeight)
    },
    computed: {
      ...mapGetters([
        'getForbiddenPopupDetailForAllWords',
        'getForbiddenWordForDetail',
        'getLoggedInUser',
        'isUserReportedToSocketServer'
      ]),
      key () {
        return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
      }
    },
    methods: {
      ...mapActions([
        'setLoggedInUser',
        'setIsUserReportedToSocketServer']),
      popWordDetailWindow (spell, event) {
        this.$refs.wordDetailWindow.show(spell, event)
      },
      resetRouterWindowHeight () {
        this.routerViewHeight = this.getWinHeight() - 56 // 56是导航条的高度
      },
      hideWordDetailWindow () {
        this.$refs.wordDetailWindow.hide()
      },
      hideSearchCandidateWordsWindow () {
        this.$refs.nav.hideCandidateWordsWindow()
      },
      escPressed () {
        this.hideWordDetailWindow()
        this.hideSearchCandidateWordsWindow()
      },
      onMouseUp (event) {
        var spell
        if (this.browserType().startsWith('IE')) {
          spell = document.selection.createRange().text
        } else {
          spell = window.getSelection()
        }

        // 显示或隐藏单词详情弹出框
        spell = ('' + spell).trim() // 此行必不可少，否则chrome浏览器会挂起
        if (!this.hasChinese(spell) && !this.getForbiddenPopupDetailForAllWords && spell !== '' && spell.toLowerCase() !== this.getForbiddenWordForDetail.toLowerCase()) {
          this.$refs.wordDetailWindow.show(spell, event)
        } else {
          this.$refs.wordDetailWindow.hide()
        }

        // 隐藏单词搜索的备选单词列表
        this.hideSearchCandidateWordsWindow()

        // 隐藏消息弹出窗口
        this.$refs.nav.hideMsgs()
      },
      getWinHeight () {
        return (window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight))
      },
      browserType () {
        var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf('Opera') > -1 // 判断是否Opera浏览器
        var isIE = window.ActiveXObject || 'ActiveXObject' in window
        var isEdge = userAgent.indexOf('Edge') > -1 // 判断是否IE的Edge浏览器
        var isFF = userAgent.indexOf('Firefox') > -1 // 判断是否Firefox浏览器
        var isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1 // 判断是否Safari浏览器
        var isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1 && !isEdge // 判断Chrome浏览器

        if (isIE) {
          var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
          reIE.test(userAgent)
          var fIEVersion = parseFloat(RegExp['$1'])
          if (userAgent.indexOf('MSIE 6.0') !== -1) {
            return 'IE6'
          } else if (fIEVersion === 7) {
            return 'IE7'
          } else if (fIEVersion === 8) {
            return 'IE8'
          } else if (fIEVersion === 9) {
            return 'IE9'
          } else if (fIEVersion === 10) {
            return 'IE10'
          } else if (userAgent.toLowerCase().match(/rv:([\d.]+)\) like gecko/)) {
            return 'IE11'
          } else {
            return '0'
          } // IE版本过低
        }

        if (isFF) {
          return 'FF'
        }
        if (isOpera) {
          return 'Opera'
        }
        if (isSafari) {
          return 'Safari'
        }
        if (isChrome) {
          return 'Chrome'
        }
        if (isEdge) {
          return 'Edge'
        }
      }
    }
  }
</script>
