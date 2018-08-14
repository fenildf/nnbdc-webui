<template>
  <div class="pageContent">

    <div data-role="content">
      <h2 id="chatName" style="display: inline;">English chat room</h2>

      <span id="onlineCount"></span>

      <div id="wrapper" :style="{height:infoAreaHeight+'px'}">
        <div id="content"></div>
      </div>

      <div id="hint" style="margin-top: 8px;">

        <label>Input text here, press <a href="javascript:;"
                                         id="sendBtn" style="text-decoration: none;">[Enter]</a> to send
        </label> <label id="warn" style="margin-left: 48px; color: red;"></label>
      </div>

      <input id="message" type="text" ref="chatContent" v-model="msgToSend" v-on:keyup.enter="sendMsg"/>
    </div>
  </div>
</template>
<style scoped>
  .pageContent {
    width: 98%;
    margin: auto;
  }

  #wrapper {
    position: relative;
    width: 100%;
    background-color: lightgreen;
    border-radius: 10px;
    border: 1px solid black;
    z-index: 1;
    overflow: hidden;
    /*height: 5em;*/
  }

  #content {
    word-wrap: break-word;
    overflow: auto;
    color: black;
    font-weight: bold;
    line-height: 1.5em;
  }

</style>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import { XButton, XInput, XTextarea, Group, Flexbox, FlexboxItem } from 'vux'

  export default {
    data () {
      return {
        msgs: [],
        infoAreaHeight: 0,
        msgToSend: ''
      }
    },
    components: {XButton, XInput, XTextarea, Group, Flexbox, FlexboxItem},
    mounted () {
      this.setNavVisible(true)
      this.setCurrMenuItem('聊天')

      // 监听到socket server的上报状态变化
      this.unwatchHandle = this.$store.watch(
        (state) => {
          return state.isUserReportedToSocketServer
        },
        () => {
          if (this.isUserReportedToSocketServer) {
            this.tryEnterChatRoom()
          }
        },
        {
          deep: true // add this if u need to watch object properties change etc.
        }
      )

      this.tryEnterChatRoom()

      window.addEventListener('resize', this.adjustInfoAreaSize)
      this.adjustInfoAreaSize()
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.adjustInfoAreaSize)
    },
    destroyed () {
      this.unwatchHandle() // 取消对store的监听
    },
    sockets: {
      USER_SPEAK: function (chatObj) {
        console.log(chatObj)
      }
    },
    computed: {
      ...mapGetters([
        'getLoggedInUser',
        'isUserReportedToSocketServer',
        'getOnlineUserCount'
      ])
    },
    methods: {
      ...mapActions([
        'setNavVisible',
        'setCurrMenuItem',
        'setForbiddenPopupDetailForAllWords',
        'setForbiddenWordForDetail'
      ]),
      getWinHeight () {
        return (window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight))
      },
      adjustInfoAreaSize () {
        this.infoAreaHeight = this.getWinHeight() - 180
      },
      /** 申请进入聊天室 */
      tryEnterChatRoom () {
        if (this.isUserReportedToSocketServer) {
          this.sendUserCmd('ENTER_CHAT_ROOM', [])
        }
      },
      sendUserCmd (cmd, args) {
        if (!this.getLoggedInUser.id) {
          this.warn('您尚未登录，请先登录')
          return
        }
        this.$socket.emit('userCmd', {
          userId: this.getLoggedInUser.id,
          system: 'chat',
          cmd: cmd,
          args: args
        })
      },
      sendMsg () {
        this.sendUserCmd('USER_SPEAK', [this.msgToSend])
        this.msgToSend = ''
        this.$refs.chatContent.focus()
      },
      appendMsg (senderId /* 发送者ID，为0表示系统 */, senderNickName, msg) {
        this.msgs.push({senderId: senderId, senderNickName: senderNickName, msg: msg})
        this.$nextTick(() => {
          this.$refs.msgsDiv.scrollTop = this.$refs.msgsDiv.scrollHeight
        })
      }
    }
  }
</script>
