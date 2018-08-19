<template>
  <div class="pageContent">

    <div data-role="content">
      <span>{{userCount}} persons</span>

      <div id="wrapper" ref="msgsWrapper" :style="{height:infoAreaHeight+'px'}">
        <div id="content">
          <div v-for="msg in msgs"
               :class="{sysMsg:msg.senderId==0, myMsg:msg.senderId==getLoggedInUser.id, hisMsg:msg.senderId!==0&&msg.senderId!=getLoggedInUser.id}">
            {{msg.senderNickName}}: {{msg.content}}
          </div>
        </div>
      </div>

      <x-input size="large" style="margin-top: 8px;border:solid lightgray 1px" ref="chatContent" v-model="msgToSend"
               :class="{invalidInput: isInputChinese}"
               placeholder="Input text here, press [Enter] to send"
               @keyup.native.enter="sendMsg()"
               type="text"/>
    </div>
  </div>
</template>
<style scoped>
  .pageContent {
    width: 98%;
    margin: auto;
  }

  .sysMsg {
    color: blue;
  }

  .hisMsg {
    color: red;
  }

  .myMsg {
    color: gray;
  }

  #wrapper {
    position: relative;
    width: 100%;
    background-color: white;
    border-radius: 2px;
    border: 1px solid #bbb;
    z-index: 1;
    overflow: hidden;
    overflow-y: auto;
    flex-grow: 1;
  }

  #content {
    word-wrap: break-word;
    overflow: auto;
    color: black;
    font-weight: bold;
    line-height: 1.5em;
  }

  .invalidInput {
    color: red;
  }

</style>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import { XButton, XInput, XTextarea, Group, Flexbox, FlexboxItem } from 'vux'

  export default {
    data () {
      return {
        userCount: 0,
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
      this.$nextTick(() => {
        this.focusToInputBox()
      })
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.adjustInfoAreaSize)
    },
    destroyed () {
      this.unwatchHandle() // 取消对store的监听
      this.sendUserCmd('LEAVE_CHAT_ROOM', [])
    },
    sockets: {
      USER_SPEAK: function (chatMsg) {
        console.log(chatMsg)
        let speaker = chatMsg[0]
        this.appendMsg(speaker.id, speaker.displayNickName, chatMsg[1])
      },
      USER_LEFT: function (data) {
        let nickName = data
        this.appendMsg(0, '牛牛', nickName + '离开了')
      },
      USER_ENTERED: function (data) {
        let nickName = data
        this.appendMsg(0, '牛牛', nickName + '进来了')
      },
      USER_COUNT: function (data) {
        this.userCount = data
      }
    },
    computed: {
      ...mapGetters([
        'getLoggedInUser',
        'isUserReportedToSocketServer',
        'getOnlineUserCount'
      ]),
      isInputChinese () {
        // 验证待发送内容是否是中文
        var pattern = new RegExp('[\u4E00-\u9FA5]+')
        return pattern.test(this.msgToSend)
      }
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
        this.infoAreaHeight = this.getWinHeight() - 160
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
      focusToInputBox () {
        this.$refs.chatContent.focus()
      },
      sendMsg () {
        if (this.msgToSend.trim() === '') {
          this.warn('聊天内容不能为空')
        } else if (this.isInputChinese) {
          this.warn('这是英文聊天室，不能使用中文')
        } else {
          this.sendUserCmd('USER_SPEAK', [this.msgToSend])
          this.msgToSend = ''
        }
        this.focusToInputBox()
      },
      appendMsg (senderId /* 发送者ID，为0表示系统 */, senderNickName, content) {
        this.msgs.push({senderId: senderId, senderNickName: senderNickName, content: content})
        this.$nextTick(() => {
          this.$refs.msgsWrapper.scrollTop = this.$refs.msgsWrapper.scrollHeight
        })
      }
    }
  }
</script>
