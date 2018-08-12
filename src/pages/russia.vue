<template>
  <div class="pageContent">

    <div id="playPanel" style="width: 59.5%; margin: 0 0.5%;">

      <div class="playGrounds">

        <div id="playgroundA" class="playground" :style="{height:playerA.playGroundHeight+'px'}">
          <div id="wordA" class="word"
               :style="{top:playerA.currWordTop+'px', height:playerA.wordDivHeight+'px', lineHeight:playerA.wordDivHeight+'px'}">
            {{playerA.currWord.spell}}
          </div>
          <div id="word_A" class="word"></div>
          <div v-for="(deadWord,i) in playerA.deadWords" class="deadWordA"
               :style="{bottom:(playerA.bottomHeight + i*playerA.wordDivHeight)+'px', height:playerA.wordDivHeight+'px', lineHeight:playerA.wordDivHeight+'px'}">
            {{deadWord.spell}}
          </div>
          <div id="bottomA" class="playGroundBottom" :style="{height:playerA.bottomHeight+'px'}"></div>
        </div>

        <div id="playgroundB" class="playground" :style="{height:playerB.playGroundHeight+'px'}">
          <div id="wordB" class="word"
               :style="{top:playerB.currWordTop+'px', height:playerB.wordDivHeight+'px', lineHeight:playerB.wordDivHeight+'px'}">
            {{playerB.currWord.spell}}
          </div>
          <div v-for="(deadWord,i) in playerB.deadWords" class="deadWordB"
               :style="{bottom:(playerB.bottomHeight + i*playerB.wordDivHeight)+'px', height:playerB.wordDivHeight+'px', lineHeight:playerB.wordDivHeight+'px'}">
            {{deadWord.spell}}
          </div>
          <div id="bottomB" class="playGroundBottom" :style="{height:playerB.bottomHeight+'px'}"></div>
        </div>

      </div>

      <div style="width: 100%;">
        <div>
          <div id="propsArea" style="height: 36px;">

            <div id="props0" class="props" v-if="playerA.props[0]>0">
              <a href="javascript:;" class="incBtn" @click="useProps(0)"></a><span
              id="props0Num" @click="useProps(0)">{{playerA.props[0]}}</span>
            </div>
            <div id="props1" class="props" v-if="playerA.props[1]>0">
              <a href="javascript:;" class="decBtn" @click="useProps(1)"></a><span
              id="props1Num" @click="useProps(1)">{{playerA.props[1]}}</span>
            </div>

          </div>

          <div v-if="!isPlaying&!isShowingResult" id="cmdBtns">
            <div class="btnDiv" @click="startMatch()" v-if="gameState=='ready' && !playerA.started">开始比赛</div>
            <div class="btnDiv" @click="showIdleUsers()" v-if="gameState=='waiting'">邀请对手</div>
            <div v-if="isInviting" id="idleUsersDiv">
              <div class="userToInvite" v-for="(user,i) in idleUsers" @mouseup.stop="">
                <span>{{user.displayNickName}}</span><span class="btnDiv2" v-if="!user.invited" @click="inviteUser(i)">邀请</span><span
                v-if="user.invited"> (已发送邀请)</span>
              </div>
            </div>
            <div class="btnDiv" @click="changeRoom()">换房间</div>
            <div class="btnDiv" @click="exercise()">单人练习</div>
            <div class="btnDiv" @click="stopExcercise()" v-if="isExercise">停止练习</div>
            <div class="btnDiv" @click="exitGame()">退出游戏</div>
          </div>

          <div v-if="isPlaying" id="answerBtns">
            <div class="btnDiv" @click="onClickAnswer(1)" @mouseup.stop="" >
              {{playerA.correctIndex == 1 ? playerA.currWord.meaningStr : playerA.otherWordMeanings[0]}}
            </div>
            <div class="btnDiv" @click="onClickAnswer(2)" @mouseup.stop="">
              {{playerA.correctIndex == 2 ? playerA.currWord.meaningStr : (playerA.correctIndex == 1 ? playerA.otherWordMeanings[0] : playerA.otherWordMeanings[1])}}
            </div>
            <div class="btnDiv" @click="onClickAnswer(3)" @mouseup.stop="">
              {{playerA.correctIndex == 3 ? playerA.currWord.meaningStr : playerA.otherWordMeanings[1]}}
            </div>
            <div class="btnDiv" @click="onClickAnswer(4)" v-if="isExercise" style="color:red;">不认识</div>
            <div class="btnDiv" @click="onClickAnswer(5)" v-if="isExercise" style="color:blue;">结束练习</div>
          </div>

          <div id="gameResult" v-if="isShowingResult">
            <div>{{gameResultHint1}}</div>
            <div>{{gameResultHint2}}</div>
            <div>{{gameResultHint3}}</div>
          </div>

          <div id="howToPlay" style="margin-top:16px; color: #777;font-size:12px;">
            <p>玩法：本游戏需要两人才可进行，当两人都进入本房间后，点击【开始】即可开始游戏。</p>

            <p>游戏开始后，单词在窗口中下落，下面会出现单词的解释，请点击正确的那个。如果选对了，单词就被销毁，否则就会落到窗口底部。</p>

            <p>窗口首先被堆满的一方会被判为失利。</p>

            <p>如果连续答对5个单词，则会随机得到一个道具，可用于进攻对方或保护己方。</p>

            <p>右边的单词窗口可观察对方当前的游戏状态。</p>
            <p>比赛过程中如果离开游戏或者网络中断，直接判为失利。</p>
          </div>

        </div>


      </div>
    </div>

    <div id="infoArea" :style="{height:infoAreaHeight+'px'}">
      <div class="gameInfo" style="flex-grow:0">
        <div style="display: flex;justify-content: center">
          <span id="hall">{{$route.query.hallName}}</span><span id="roomId"
                                                                style="margin-left: 1em;">房间号:{{roomId}}</span>
        </div>

        <div style="display:flex; flex-direction:row; justify-content: space-around">
          <!--用户A-->
          <div id="myInfo" class="userInfo" v-if="playerA.userId">
            <div id="myNickName"><span class="userInfoTitle">玩家</span>：{{playerA.nickName}}</div>
            <div id="myScore"><span class="userInfoTitle">游戏分：</span>{{playerA.score}}</div>
            <div id="myCowDung"><span class="userInfoTitle">牛粪：</span>{{playerA.cowDung}}</div>
            <div id="myContest"><span class="userInfoTitle">胜负：</span>{{playerA.winCount}}胜{{playerA.lostCount}}负</div>
            <div id="myWinRatio">
              <span
                class="userInfoTitle">胜率：</span>{{(playerA.winCount * 100.0 / (playerA.winCount + playerA.lostCount)) | toFixed(2)}}%
            </div>
            <div v-if="playerA.started">已开始...</div>
          </div>

          <!--用户B-->
          <div id="hisInfo" class="userInfo" v-if="playerB.userId">
            <div id="myNickName"><span class="userInfoTitle">昵称：</span>{{playerB.nickName}}</div>
            <div id="myScore"><span class="userInfoTitle">游戏分：</span>{{playerB.score}}</div>
            <div id="myCowDung"><span class="userInfoTitle">牛粪：</span>{{playerB.cowDung}}</div>
            <div id="myContest"><span class="userInfoTitle">胜负：</span>{{playerB.winCount}}胜{{playerB.lostCount}}负</div>
            <div id="myWinRatio">
              <span
                class="userInfoTitle">胜率：</span>{{(playerB.winCount * 100.0 / (playerB.winCount + playerB.lostCount)) | toFixed(2)}}%
            </div>
            <div v-if="playerB.started">已开始...</div>
          </div>
        </div>
      </div>

      <div class="msgs" style="flex-grow:1;">
        <div id="wrapper" ref="msgsDiv" style="overflow-y: auto;flex-grow:1;">
          <div id="content">
            <div v-for="msg in msgs"
                 :class="{sysMsg:msg.senderId==0, myMsg:msg.senderId==getLoggedInUser.id, hisMsg:msg.senderId!==0&&msg.senderId!=getLoggedInUser.id}">
              <span>{{msg.senderNickName}}：</span>{{msg.msg}}
            </div>
          </div>
        </div>
        <x-input title="聊天：" ref="chatContent" v-model="msgToSend" placeholder="在这里输入聊天内容，回车发送"
                 @keyup.native.enter="sendMsg()"
                 type="text"/>
      </div>
    </div>

    <!--单词发音-->
    <audio ref="wordSound" v-if="wordSoundFile" :src="wordSoundFile">
    </audio>

    <!--游戏音效-->
    <audio ref="victorySound" src="../assets/victory.mp3">
    </audio>
    <audio ref="failedSound" src="../assets/failed.mp3">
    </audio>
    <audio ref="enterRoomSound" src="../assets/door.mp3">
    </audio>
    <audio ref="leaveRoomSound" src="../assets/door.mp3">
    </audio>
  </div>
</template>
<style scoped>


  .sysMsg {
    color: blue;
  }

  .userInfoTitle {
    color: lightblue;
  }

  .hisMsg {
    color: red;
  }

  .myMsg {
    color: gray;
  }

  .pageContent {
    display: flex;
    justify-content: center;
    align-items: stretch;
    background-color: #2b435b;
    color: lightblue;
  }

  #infoArea {
    background-color: #2b435b;
    width: 40%;
    display: flex;
    flex-direction: column;
  }

  .gameInfo {
  }

  .msgs {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .incBtn {
    background: transparent url('../assets/inc.ico') no-repeat;
  }

  .decBtn {
    background: transparent url('../assets/dec.ico') no-repeat;
  }

  .props span {
    cursor: pointer;
  }

  .playGrounds {
    display: flex;
    justify-content: space-between;
  }

  .playground {
    width: 49%;
    border: 1px solid #3b536b;
    position: relative;
    background-image: url('../assets/field.png')
  }

  .answerBtn {
    text-align: left;
    padding: 8px 16px 8px 16px;
    font-weight: normal;
    word-wrap: break-word !important;
    white-space: normal !important;
    color: #777777 !important
  }

  #answersDiv {
    margin-top: 32px
  }

  .startBtn {
    width: 35%;
    clear: both
  }

  .word {
    position: absolute;
    color: #bbbbbb;
    font-size: 20px;
    padding: 0 4px;
    box-sizing: border-box;
    width: 100%;
    text-align: center;
  }

  .deadWordA {
    color: red;
    font-size: 20px;
    padding: 0 4px;
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    text-align: center;
  }

  .deadWordB {
    color: red;
    font-size: 20px;
    padding: 0 4px;
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    text-align: center;
  }

  #wrapper {
    position: relative;
    border-radius: 2px;
    z-index: 1;
    overflow: hidden;
    border: 1px solid #3b536b;
  }

  #content {
    word-wrap: break-word;
    overflow: auto;
    line-height: 1.2em;
    color: lightblue
  }

  .userInfo {
    margin-top: 8px;
    color: lightgreen;
    border-radius: 10px
  }

  .props {
    position: relative;
    display: inline-block;
    border: 1px solid lightgray
  }

  .props a {
    display: block;
    height: 32px;
    width: 32px
  }

  .props span {
    position: absolute;
    left: 0;
    top: -3px;
    color: yellow
  }

  .playGroundBottom {
    position: absolute;
    background-color: darkred;
    width: 100%;
    bottom: 0px;
    border-top: 1px solid #3b536b;
    border-bottom: 1px solid #3b536b;
    box-sizing: border-box;
  }

  #gameResult {
    width: 100%;
    text-align: center;
    font-size: 2em;
    color: red;
    margin-top: 3em
  }

  .btnDiv {
    min-height: 56px;
    line-height: 56px;
    width: 100%;
    text-align: center;
    font-size: 18px;
    border: 1px solid #2b5360;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    user-select:none;
  }

  .btnDiv:hover {
    background-color: #2b5360;
    cursor: pointer;
  }

  .btnDiv2 {
    min-height: 24px;
    line-height: 24px;
    font-size: inherit;
    padding: 1px 16px;
    width: 100%;
    text-align: center;
    border: 1px solid #2b5360;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: #3b536b;
    margin: 0px 8px;
  }

  .btnDiv2:hover {
    background-color: #4b7380;
    cursor: pointer;
  }

  #idleUsersDiv .userToInvite {
    background-color: #4b637b;
    border: 1px solid #3b536b;
    border-bottom: none;
    width: 100%;
    text-align: center;
    font-size: 15px;
    height: 32px;
    line-height: 32px;
  }

  #cmdBtns div:not(:last-child) {
    border-bottom: none;
  }

  #answerBtns div:not(:last-child) {
    border-bottom: none;
  }

  #stopExercise {
    color: #777777
  }

  .weui-cell:before {
    border-top: none;
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
          system: 'russia',
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
        this.infoAreaHeight = this.getWinHeight() - 56
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
