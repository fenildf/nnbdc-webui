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

      <input id="message" type="text"/>
    </div>
  </div>
</template>
<style scoped>
  .pageContent{
    width:98%;
    margin:auto;
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
        gameState: '',
        gameTimer: null,
        timeInterval: 200, // 游戏主循环的时间间隔
        hallGroups: [], // 系统定义的游戏大厅分组
        halls: [], // 实际运行中的所有游戏大厅实例
        topUserGames: [], // 游戏排名靠前的用户
        unwatchHandle: null,
        isShowingResult: false,
        gameResultHint1: '',
        gameResultHint2: '',
        gameResultHint3: '',
        roomId: 0,
        msgs: [],
        infoAreaHeight: 0,
        msgToSend: '',
        isPlaying: false,
        isExercise: false,
        wordSoundFile: '',
        soundsToPlay: [],
        isInviting: false, // 是否正在邀请其他用户
        idleUsers: [],
        playerA: {
          userId: null,
          started: false, // 是否已经点击了【开始比赛】按钮
          nickName: '',
          score: 0,
          cowDung: 0,
          winCount: 0,
          lostCount: 0,
          dropSpeed: 1,
          deadWords: [],
          currWord: {},
          wordDivHeight: 20,
          currWordTop: 0,
          bottomTop: 200, // 千斤顶的顶端位置
          bottomHeight: 0,
          wordIndex: 0,
          correctCount: 0,
          playGroundHeight: 200,
          correctIndex: -1, // 正确答案序号
          otherWordMeanings: [], // 所有备选答案的内容
          props: [0, 0] // 每种道具的数量
        },
        playerB: {
          userId: null,
          started: false, // 是否已经点击了【开始比赛】按钮
          nickName: '',
          score: 0,
          cowDung: 0,
          winCount: 0,
          lostCount: 0,
          dropSpeed: 1,
          deadWords: [],
          currWord: {},
          wordDivHeight: 20,
          currWordTop: 0,
          bottomTop: 200, // 千斤顶的顶端位置
          bottomHeight: 0,
          wordIndex: 0,
          correctCount: 0,
          playGroundHeight: 200,
          props: [0, 0] // 每种道具的数量
        }
      }
    },
    components: {XButton, XInput, XTextarea, Group, Flexbox, FlexboxItem},
    mounted () {
      this.setNavVisible(true)
      this.setCurrMenuItem('游戏')

      // 监听到socket server的上报状态变化
      this.unwatchHandle = this.$store.watch(
        (state) => {
          return state.isUserReportedToSocketServer
        },
        () => {
          this.tryEnterGameHall()
        },
        {
          deep: true // add this if u need to watch object properties change etc.
        }
      )

      this.tryEnterGameHall()

      window.addEventListener('resize', this.adjustInfoAreaSize)
      this.adjustInfoAreaSize()

      this.initGame()
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.adjustInfoAreaSize)
    },
    destroyed () {
      this.unwatchHandle() // 取消对store的监听
      clearInterval(this.gameTimer)
      this.sendUserCmd('LEAVE_HALL', [])
    },
    sockets: {
      sysCmd: function (cmd) {
        if (cmd === 'BEGIN_EXERCISE') {
          this.isExercise = true
          this.startGame()
          this.appendMsg(0, '牛牛', '练习开始')
        } else if (cmd === 'BEGIN') {
          this.isExercise = false
          this.startGame()
          this.appendMsg(0, '牛牛', '比赛开始')
        } else {
          alert('不支持的系统命令：' + cmd)
        }
      },
      idleUsers: function (users) {
        this.idleUsers = users
      },
      userStarted: function (userId) {
        if (userId === this.playerA.userId) {
          this.playerA.started = true
        } else {
          this.playerB.started = true
        }
      },
      giveProps: function (data) {
        if (!this.isExercise) {
          let propsType = data[0]
          let propsCount = data[1]
          this.playerA.props[propsType] = propsCount
        }
      },
      noEnoughCowDung: function (data) {
        alert('开始游戏需要至少' + data + '个牛粪')
      },
      propsUsed: function (data) {
        let userId = data[0]
        let props = data[1]
        let currNumber = data[2]
        let nickName = data[3]
        this.appendMsg(0, '牛牛', nickName + '使用了道具')

        // 己方使用了道具
        if (userId === this.getLoggedInUser.id) {
          this.playerA.props[props] = currNumber

          if (props === 0) { // 【加一行】
            this.liftDeadWords(this.playerB, this.playerB.wordDivHeight)
          } else if (props === 1) { // 【减一行】
            this.liftDeadWords(this.playerA, (-1) * this.playerA.wordDivHeight)
          }
        } else { // 对方使用了道具
          if (props === 0) { // 【加一行】
            this.liftDeadWords(this.playerA, this.playerA.wordDivHeight)
          } else if (props === 1) { // 【减一行】
            this.liftDeadWords(this.playerB, (-1) * this.playerB.wordDivHeight)
          }
        }
      },
      userInfo: function (userInfo) {
        let player = userInfo.userId === this.getLoggedInUser.id ? this.playerA : this.playerB
        player.nickName = userInfo.nickName
        player.score = userInfo.score
        player.cowDung = userInfo.cowDung
        player.winCount = userInfo.winCount
        player.lostCount = userInfo.lostCount
      },
      roomId: function (value) {
        this.roomId = value
      },
      Chat: function (chatObj) {
        this.appendMsg(chatObj.userId, chatObj.nickName, chatObj.message)
      },
      leaveRoom: function (data) {
        let userId = data[0]
        let nickName = data[1]
        let player = userId === this.getLoggedInUser.id ? this.playerA : this.playerB
        player.userId = null
        this.playSounds([this.$refs.leaveRoomSound])
        this.appendMsg(0, '牛牛', nickName + '离开了')
      },
      enterRoom: function (data) {
        let userId = data[0]
        let nickName = data[1]
        let player = userId === this.getLoggedInUser.id ? this.playerA : this.playerB
        player.userId = userId
        this.playSounds([this.$refs.enterRoomSound])
        this.appendMsg(0, '牛牛', nickName + '进来了')
      },
      wordA: function (data) {
        if (!this.isPlaying) {
          return
        }
        this.playerA.currWord = data[0]
        this.playerA.otherWordMeanings = data[1]

        // 为正确答案随机选择一个索引号（1～3）
        let correctIndex = Math.ceil((3.0 * Math.random()))
        if (correctIndex === 0) {
          correctIndex = 1
        }
        if (correctIndex === 4) {
          correctIndex = 3
        }
        this.playerA.correctIndex = correctIndex

        // 禁止显示当前下落单词的详情
        this.setForbiddenWordForDetail(this.playerA.currWord.spell)

        this.wordSoundFile = '/sound/' + data[2] + '.mp3'
        this.$nextTick(() => {
          this.playSounds([this.$refs.wordSound])
        })
      },
      wordB: function (data) {
        if (!this.isPlaying) {
          return
        }
        if (this.isExercise) {
          return
        }
        let answerResult = data[0]
        if (answerResult === 'true') {
          this.playerB.currWordTop = 0
        } else if (answerResult === 'false') {
          this.dropWord2Bottom(this.playerB)
        }
        this.playerB.currWord = {spell: data[1]}
      },
      loser: function (user) {
        this.isPlaying = false
        this.isShowingResult = true
        setTimeout(() => { this.isShowingResult = false }, 4000)

        if (user === this.getLoggedInUser.id) {
          if (this.isExercise) {
            this.isExercise = false
            this.gameResultHint1 = '游戏结束！'
            this.gameResultHint2 = '回答错误的单词，已被自动加入到生词本'
          } else {
            this.gameResultHint1 = '失败了，别灰心，继续努力！'
            this.gameResultHint2 = '回答错误的单词，已被自动加入到生词本'
            this.appendMsg(0, '牛牛', '失败了，别灰心，继续努力！')
          }
          this.$nextTick(() => {
            this.playSounds([this.$refs.failedSound])
          })
        } else {
          this.gameResultHint1 = '胜利啦！'
          this.gameResultHint2 = '回答错误的单词，已被自动加入到生词本'
          this.appendMsg(0, '牛牛', '胜利啦！')
          this.playSounds([this.$refs.victorySound])
        }

        // 游戏已经分出胜负，允许查询单词的意思了
        this.setForbiddenPopupDetailForAllWords(false)
        this.setForbiddenWordForDetail('')
      },
      enterWait: function (data) {
        this.gameState = 'waiting'
        this.appendMsg(0, '牛牛', '等待对手进入...')
      },
      enterReady: function (data) {
        this.gameState = 'ready'
      },
      scoreAdjust (data) {
        let msg
        if (data > 0) {
          msg = '您的积分 +' + data
        } else {
          msg = '您的积分 -' + data * (-1)
        }
        this.appendMsg(0, '牛牛', msg)
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
      inviteUser (targetUserIndex) {
        let targetUser = this.idleUsers[targetUserIndex]

        if (!targetUser.invited) {
          this.sendUserCmd('inviteUser', [targetUser.id, 'russia', this.roomId, this.$route.query.hallName])
          targetUser.invited = true
          this.$set(this.idleUsers, targetUserIndex, targetUser) // 数组元素需要主动触发Vue更新视图
        }
      },
      useProps (propsType) {
        if (propsType === 0) { // 加一行
          this.sendUserCmd('USE_PROPS', [propsType])
        } else { // 减一行
          if (this.playerA.bottomHeight > 0 || this.playerA.deadWords.length > 0) { // 避免浪费道具
            this.sendUserCmd('USE_PROPS', [propsType])
          }
        }
      },
      startMatch () {
        this.sendUserCmd('START_GAME', [])
      },
      exitGame () {
        this.$router.push({path: '/main', query: {}})
      },
      liftDeadWords (player, delta) {
        if (delta >= 0) {
          player.bottomHeight += delta
        } else {
          if (player.bottomHeight > 0) {
            player.bottomHeight += delta
          } else if (player.deadWords.length > 0) {
            player.deadWords.splice(0, 1)
          }
        }
      },
      onClickAnswer (btnIndex) {
        if (!this.isPlaying) {
          return
        }

        if (btnIndex === 5) {
          this.isPlaying = false
          this.sendGameOverCmd('A')
        } else if (btnIndex === this.playerA.correctIndex) { // 选对了
          this.playerA.currWordTop = 0
          this.sendUserCmd('GET_NEXT_WORD', [this.playerA.wordIndex++, 'true', this.playerA.currWord.spell])
        } else { // 选错了
          this.dropWord2Bottom(this.playerA)
          this.sendUserCmd('GET_NEXT_WORD', [this.playerA.wordIndex++, 'false', this.playerA.currWord.spell])
        }
      },
      sendUserCmd (cmd, args) {
        if (!this.getLoggedInUser.id) {
          this.warn('您尚未登录，请先登录')
          return
        }
        this.$socket.emit('userCmd', {
          userId: this.getLoggedInUser.id,
          cmd: cmd,
          args: args
        })
      },
      /** 道具清零 */
      resetProps () {
        this.playerA.props = [0, 0]
      },
      /** 申请进入游戏大厅 */
      tryEnterGameHall () {
        if (this.isUserReportedToSocketServer) {
          this.sendUserCmd('ENTER_GAME_HALL', [this.$route.query.hallName, this.$route.query.exceptRoom])
        }
      },
      start () {
        this.sendUserCmd('START_GAME', [])
      },
      exercise () {
        this.sendUserCmd('START_EXERCISE', [])
      },
      appendMsg (senderId /* 发送者ID，为0表示系统 */, senderNickName, msg) {
        this.msgs.push({senderId: senderId, senderNickName: senderNickName, msg: msg})
        this.$nextTick(() => {
          this.$refs.msgsDiv.scrollTop = this.$refs.msgsDiv.scrollHeight
        })
      },
      getWinHeight () {
        return (window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight))
      },
      adjustInfoAreaSize () {
        this.infoAreaHeight = this.getWinHeight() - 180
      },
      sendMsg () {
        this.sendUserCmd('CHAT', [this.msgToSend])
        this.msgToSend = ''
        this.$refs.chatContent.focus()
      },
      initGame () {
        this.gameTimer = setInterval(this.gameloop, this.timeInterval)
      },
      gameloop () {
        if (this.isPlaying) {
          this.moveWord(this.playerA)
          this.moveWord(this.playerB)
        }
      },
      moveWord (player) {
        if (!player.currWord.spell) {
          return
        }

        // 下落
        let wordBottom = player.currWordTop + player.wordDivHeight
        let gap = this.deadTopOfPlayer(player) - wordBottom
        let delta = Math.min(player.dropSpeed, gap)
        player.currWordTop += delta
        wordBottom = player.currWordTop + player.wordDivHeight

        // 碰撞检测
        if (wordBottom >= this.deadTopOfPlayer(player)) {
          if (player === this.playerA) {
            // 触到底部则单词死亡
            this.dropWord2Bottom(player)

            // 达到顶部则游戏结束(己方窗口达到顶部)
            if (this.deadTopOfPlayer(player) <= 15) {
              this.isPlaying = false
              this.sendGameOverCmd('A')
              return
            }

            // 取下一个单词
            this.sendUserCmd('GET_NEXT_WORD', [player.wordIndex++, 'false', player.currWord.spell])
          } else {
            // 达到顶部则游戏结束(对方窗口达到顶部)
            if (this.deadTopOfPlayer(player) <= 15) {
              this.isPlaying = false
              this.sendGameOverCmd('B')
              return
            }
          }
        }
      },
      sendGameOverCmd (overUser) {
        this.sendUserCmd('GAME_OVER', [overUser])
      },
      dropWord2Bottom (player) {
        player.deadWords.push(player.currWord)
        player.currWordTop = 0
      },
      deadTopOfPlayer (player) {
        return player.playGroundHeight - player.bottomHeight - player.wordDivHeight * player.deadWords.length
      },
      startGame () {
        this.isPlaying = true
        this.resetProps()
        this.initGameForPlayer(this.playerA)
        this.initGameForPlayer(this.playerB)
        this.sendUserCmd('GET_NEXT_WORD', [this.playerA.wordIndex++, '', ''])
      },
      playSounds (audios) {
        // 停止当前的播放
        if (this.soundsToPlay.length > 0) {
          this.soundsToPlay[0].pause()
        }

        // 播放指定的声音列表，从第一个开始，播放完后自动播放下一个
        this.soundsToPlay = audios
        if (this.soundsToPlay.length > 0) {
          this.soundsToPlay[0].load()
          this.soundsToPlay[0].play()
        }
      },
      initGameForPlayer (player) {
        player.deadWords = []
        player.wordIndex = 0
        player.correctCount = 0
        player.currWordTop = 0
        player.bottomTop = player.playGroundHeight
        player.bottomHeight = 0
        player.started = false
      },
      changeRoom () {
        this.$router.push({path: '/russia', query: {hallName: this.$route.query.hallName, exceptRoom: this.roomId}})
      },
      showIdleUsers () {
        this.isInviting = !this.isInviting
        if (this.isInviting) {
          this.$socket.emit('getIdleUsers', 5)
        }
      }
    }
  }
</script>
