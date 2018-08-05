<template>

  <div>
    <div id="div1" v-bind:style="{width:div1Width+'px',height:div1Height+'px',top:div1Top+'px',left:div1Left+'px'}">
      <div class="summary">一个好习惯</div>
      <div class="detail">轻松而有效，好习惯，自然来</div>
    </div>
    <div id="div2" v-bind:style="{width:div2Width+'px',height:div2Height+'px',top:div2Top+'px',left:div2Left+'px'}">
      <div class="summary">一个好氛围</div>
      <div class="detail">这里有一群与你一样的人，来吧！一起学</div>
    </div>
    <div id="div3" v-bind:style="{width:div3Width+'px',height:div3Height+'px',top:div3Top+'px',left:div3Left+'px'}">
      <div class="summary">一个好工具</div>
      <div class="detail">没有最好，只有更好，变好，没有终点</div>
    </div>

    <div id="div4" v-bind:style="{width:div4Width+'px',height:div4Height+'px',top:div4Top+'px',left:div4Left+'px'}">
      <div class="summary">一份感动</div>
      <div class="detail">一个永久免费的产品，由大家一起打造，我为人人，人人为我</div>
    </div>

    <div id="updateLog">
      <div class="title">
        最后更新于：{{lastUpdateLog.time | formatDate}}
      </div>
      <div class="content">{{lastUpdateLog.content}}</div>
    </div>

    <div id="div5"
         v-bind:style="{width:div5Width+'px',height:div5Height+'px',top:div5Top+'px',left:div5Left+'px'}">


      <group>
        <x-input title="用户名" v-model="email" @keyup.native.enter="login()"></x-input>
        <x-input title="密　码" v-model="password" type="password" ref="password" @keyup.native.enter="login()"></x-input>
      </group>
      <check-icon style="margin:5px 0px" :value.sync="rememberPwd">记住密码</check-icon>
      <br/>

      <div>
        <flexbox orient="horizontal">
          <flexbox-item>
            <x-button type="primary" @click.native="login()">登录</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type="primary" @click.native="register()">注册</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type="primary" @click.native="getPwd()">找回密码</x-button>
          </flexbox-item>
        </flexbox>
        <flexbox orient="horizontal" style = "margin-top:4px;">
          <flexbox-item>
            <x-button type="primary" @click.native="fastTry()" v-bind:style="{'font-size':'9px'}">快速体验（不需登录）
            </x-button>
          </flexbox-item>
        </flexbox>


        <div style="color: #000; font-size: 12px; margin: 4px 0 0 0">客服QQ：34672691</div>
      </div>
    </div>
  </div>


</template>
<script>
  import {
    Group,
    Cell,
    Datetime,
    XInput,
    Selector,
    XTextarea,
    XButton,
    Checker,
    CheckerItem,
    CheckIcon,
    FlexboxItem,
    Flexbox
  } from 'vux'
  import { mapActions } from 'vuex'
  import api from './api'
  import util from './util'

  export default {
    components: {
      Group,
      Cell,
      Datetime,
      XInput,
      Selector,
      XTextarea,
      XButton,
      Checker,
      CheckerItem,
      CheckIcon,
      Flexbox,
      FlexboxItem
    },
    mounted () {
      this.initUI()
      this.initInput()
      this.$refs.password.focus()
      api.getLastUpdateLog().then((res) => {
        this.lastUpdateLog = res.data
      })

      window.addEventListener('resize', this.initUI)
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.initUI)
    },
    data () {
      return {
        lastUpdateLog: {},
        div1Width: 400,
        div1Height: 310,
        div1Left: 0,
        div1Top: 0,
        div2Width: 400,
        div2Height: 310,
        div2Left: 0,
        div2Top: 0,
        div3Width: 400,
        div3Height: 310,
        div3Left: 0,
        div3Top: 0,
        div4Width: 400,
        div4Height: 310,
        div4Left: 0,
        div4Top: 0,
        div5Width: 400,
        div5Height: 310,
        div5Left: 0,
        div5Top: 0,
        email: null,
        password: null,
        rememberPwd: false
      }
    },
    methods: {
      getWinHeight () {
        return (window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight))
      },
      getWinWidth () {
        return (window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth))
      },
      initUI () {
        let winHeight = this.getWinHeight()
        let winWidth = this.getWinWidth()
        this.div5Top = winHeight / 2 - this.div5Height / 2
        this.div5Left = winWidth / 2 - this.div5Width / 2

        // 中央空白区的尺寸
        let centerWidth = this.div5Width
        let centerHeight = this.div5Height

        this.div1Height = winHeight / 2 - centerHeight / 2
        this.div1Width = winWidth / 2 + centerWidth / 2
        this.div1Top = 0
        this.div1Left = 0

        this.div2Height = winHeight / 2 + centerHeight / 2
        this.div2Width = winWidth / 2 - centerWidth / 2
        this.div2Top = 0
        this.div2Left = winWidth / 2 + centerWidth / 2

        this.div3Height = winHeight / 2 + centerHeight / 2
        this.div3Width = winWidth / 2 - centerWidth / 2
        this.div3Top = winHeight / 2 - centerHeight / 2
        this.div3Left = 0

        this.div4Height = winHeight / 2 - centerHeight / 2
        this.div4Width = winWidth / 2 + centerWidth / 2
        this.div4Top = winHeight / 2 + centerHeight / 2
        this.div4Left = winWidth / 2 - centerWidth / 2
      },
      initInput () {
        this.rememberPwd = this.$localStorage.get('rememberPwd')
        this.email = this.$localStorage.get('email')
        this.password = this.$localStorage.get('password')
      },
      login () {
        api.login(this.email, this.password).then((res) => {
          if (res.data.success) {
            api.getLoggedInUser().then((res) => {
              this.setLoggedInUser(res.data)
            })
            this.$localStorage.set('rememberPwd', this.rememberPwd)
            this.$localStorage.set('email', this.email)
            if (this.rememberPwd) {
              this.$localStorage.set('password', this.password)
            } else {
              this.$localStorage.remove('password')
            }
            this.$router.push({path: '/main', query: {}})
          } else {
            this.$vux.toast.show({type: 'warn', text: res.data.msg})
          }
        })
      },
      fastTry () {
        api.fastTry().then((res) => {
          if (res.data.success) {
            api.getLoggedInUser().then((res) => {
              this.setLoggedInUser(res.data)
            })
            this.$router.push({path: '/main', query: {}})
          } else {
            this.$vux.toast.show({type: 'warn', text: res.data.msg})
          }
        })
      },
      register () {
        this.$router.push({path: '/register', query: {}})
      },
      getPwd () {
        this.$router.push({path: '/getPwd', query: {}})
      },
      ...mapActions([
        'setLoggedInUser'
      ]),
      toQzoneLogin () {
        window.location.assign('/service/nnbdc-service/qqlogin2.do')
      }
    },
    filters: {
      formatDate (value) {
        let date = new Date(value)
        return util.formatDate(date, 'yyyy-MM-dd')
      }
    }
  }
</script>
<style scoped>
  body {
    margin: 0;
    padding: 0;
  }

  #div1 {
    background-color: #2ECC71;
    position: fixed;
    width: 50%;
    z-index: 0;
    color: #ECF0F1;
    padding: 64px;
  }

  #div2 {
    background-color: #3498DB;
    position: fixed;
    width: 50%;
    z-index: 0;
    color: #ECF0F1;
    padding: 64px;
  }

  #div3 {
    background-color: #9B59B6;
    position: fixed;
    width: 50%;
    z-index: 0;
    color: #ECF0F1;
    padding-left: 64px;
    padding-top: 180px;
  }

  #div4 {
    background-color: #F1C40F;
    position: fixed;
    width: 50%;
    z-index: 0;
    color: #ECF0F1;
    padding-left: 64px;
    padding-top: 64px;
  }

  #div5 {
    background-color: #ECF0F1;
    position: fixed;
    width: 30%;
    z-index: 1;
    padding: 16px 24px;
    box-sizing: border-box;
  }

  #updateLog {
    position: fixed;
    bottom: 16px;
    left: 16px;
    max-width: 400px;
    font-size: 9px;
  }

  div.summary {
    font-size: x-large;
  }
</style>
