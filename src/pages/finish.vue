<template>
  <div>


    <flexbox orient="horizontal" style="margin:auto;width:600px;margin-top:4px;">
      <flexbox-item :span="2"><img src="../assets/cow.png" width="64px" height="64px"/></flexbox-item>
      <flexbox-item>
        <div>恭喜你完成了今天的学习任务！</div>
        <div>
          <div v-if="dakaFinished">
            <div>获得打卡积分：<strong>{{dakaScore}}</strong></div>
            <div>
              您已连续打卡<strong>{{getLoggedInUser.continuousDakaDayCount}}</strong>天，如果明天继续打卡，将获得<strong>{{getLoggedInUser.continuousDakaDayCount}}</strong>点积分加成
            </div>
          </div>
          <div v-if="cowdung!=20&&cowdung!=-1">恭喜！你得到<strong>{{cowdung}}</strong>个牛粪</div>
          <div v-if="cowdung==20">运气太好了,你得到<strong>20</strong>个牛粪！翻倍，你实际得到<strong>40</strong>个牛粪！</div>

          <div v-if="errMsg" style="color:red;">{{errMsg}}</div>

          <audio ref="cheer" src="../assets/cheer.mp3">
          </audio>
        </div>
        <div>下面是今天出错的词，再学习一下吧～</div>
      </flexbox-item>
    </flexbox>
    <div class="review" v-if="wrongWords.length>0">
      <table id="wordTable" style="TABLE-LAYOUT: fixed; width: 100%;">
        <tr>
          <th style='width:35%; word-break:break-all;'>拼写</th>
          <th style='width:55%;'>释义</th>
        </tr>

        <tr v-for="(wrongWord, i) in wrongWords" @click='playSounds([$refs.wordSound[i]])' :class="i%2?'odd':'even'">
          <td style='padding:0'>
            <audio ref="wordSound" v-if="wrongWord.sound" :src="'/sound/'+wrongWord.sound+'.mp3'">
            </audio>
            <input type='text'
                   v-model="mode=='browse'||(focusedWords[i]&&currWordIndex!=i)?wrongWord.spell:spellInputs[i]"
                   v-focus="currWordIndex==i"
                   :class="mode=='browse'?'normal':spellInputs[i]&&(spellInputs[i].toLowerCase()==wrongWord.spell.toLowerCase())?'correct':(currWordIndex==i?'wrong':'wrong2')"
                   @keyup="checkSpell($event, i,wrongWord.spell)"
                   @blur="onInputBlur(i, wrongWord.spell)"
                   @focus="currWordIndex=i; focusedWords[i]=true;"
                   :disabled="mode=='browse'" @click.stop=""/>
          </td>
          <td @mouseover="playSounds([$refs.wordSound[i]])">{{wrongWord.meaningStr.replace(/'/g, "’")}}</td>
        </tr>
      </table>
      <x-button type="primary" style="width:150px; float:left;" id="doSpell" v-shortkey="['x']"
                @shortkey.native="startSpellExercise()" @click.native="startSpellExercise()">拼写练习(X)
      </x-button>
    </div>
  </div>
</template>
<style scoped>
  #nextBtn {
    position: fixed;
    top: 300px;
    right: 0px;
    height: 50px;
    line-height: 50px;
    padding: 0px 16px;
    border: 1px solid lightgray;
    cursor: pointer;
    background-color: #3BA776;
    color: #eee;
  }

  #nextBtn:hover {
    background-color: #4BB786;
  }

  table {
    border-collapse: collapse;
    border: solid #ddd 1px;
  }

  th {
    background-color: #9ed99d;
    color: #fff;
  }

  tr:hover {
    background-color: #9999ff;
  }

  .odd {
    background-color: #ddd;
  }

  .even {
    background-color: #ccf;
  }

  div.review {
    width: 75%;
    margin: auto;
  }

  input {
    font-size: 24px;
    font-weight: bold;
    height: 48px;
    width: 90%;
    padding-left: 16px;
    background-color: transparent;
    border: none;
  }

  input.normal {
    color: #000;
  }

  input.correct {
    color: green;
  }

  input.wrong {
    color: red;
  }

  input.wrong2 {
    color: blue;
  }
</style>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import { Tab, TabItem, XButton, Flexbox, FlexboxItem } from 'vux'
  import { focus } from 'vue-focus'
  import api from '../pages/api'

  export default {
    directives: {focus: focus},
    components: {
      Tab,
      TabItem,
      XButton,
      Flexbox,
      FlexboxItem
    },
    data () {
      return {
        wrongWords: [],
        soundsToPlay: [],
        spellInputs: [], // 拼写练习时为每个单词输入的内容
        focusedWords: [], // 记录每个输入框是否获得过焦点
        currWordIndex: -1,
        mode: 'browse',

        dakaFinished: false,
        dakaScore: -1,
        cowdung: -1,
        errMsg: ''
      }
    },
    mounted () {
      this.setNavVisible(true)
      this.setCurrMenuItem('学习')

      this.getAnswerWrongWords()
      this.daka()
    },
    methods: {
      ...mapActions([
        'setNavVisible',
        'setCurrMenuItem',
        'setLoggedInUser'
      ]),
      startSpellExercise () {
        this.mode = 'spell'
        this.spellInputs = []
        this.focusedWords = []
        this.currWordIndex = 0
      },
      /**
       * 拼写正确性检查
       */
      checkSpell (event, wordIndex, expectedSpell) {
        let nextID = wordIndex + 1
        let prevID = wordIndex - 1
        if (event.keyCode === 40 || event.keyCode === 13) { // 向下键或回车键
          this.currWordIndex = nextID
        } else if (event.keyCode === 38) { // 向上键
          this.currWordIndex = prevID >= 0 ? prevID : 0
        } else {
          let inputText = this.spellInputs[wordIndex]
          if (!inputText) {
            return
          }
          inputText = inputText.replace(/'/g, '’')
          if (inputText.toLowerCase() === expectedSpell.toLowerCase()) { // 拼写正确了
            this.playSounds([this.$refs.wordSound[wordIndex]])
            this.currWordIndex = nextID
          }
        }
      },
      onInputBlur (wordIndex, expectText) {
        this.playSounds([this.$refs.wordSound[wordIndex]])
      },
      getAnswerWrongWords () {
        api.getAnswerWrongWords().then((res) => {
          this.wrongWords = res.data
        })
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
      daka () {
        api.saveDakaRecord().then((res) => {
          if (res.data.success) {
            this.dakaFinished = true
            this.dakaScore = res.data.data

            // 更新用户信息
            api.getLoggedInUser().then((res2) => {
              this.setLoggedInUser(res2.data)
            })

            api.throwDiceAndSave().then((res3) => {
              if (res3.data.success) {
                this.cowdung = res3.data.data
                if (this.cowdung === 20) {
                  this.$refs.cheer.play()
                }
              } else {
                this.warn(res3.data.msg)
              }
            })
          } else {
            this.errMsg = res.data.msg
          }
        })
      }
    },
    computed: mapGetters([
      'getLoggedInUser'
    ])
  }
</script>
