<template>
  <div>

    <div class="review" v-if="rawWords.length>0">
      <table id="wordTable" style="TABLE-LAYOUT: fixed; width: 100%;">
        <tr>
          <th style='width:35%; word-break:break-all;'>拼写</th>
          <th style='width:55%;'>释义</th>
        </tr>

        <tr v-for="(rawWord, i) in rawWords" @click='playSounds([$refs.wordSound[i]])' :class="i%2?'odd':'even'">
          <td style='padding:0'>
            <audio ref="wordSound" v-if="rawWord.soundUrl" :src="soundBaseUrl + '/'+rawWord.soundUrl+'.mp3'">
            </audio>
            <input type='text'
                   v-model="mode=='browse'||(hasBeenFocused[i]&&currWordIndex!=i)?rawWord.word.spell:spellInputs[i]"
                   v-focus="currWordIndex==i" @focus="currWordIndex=i; hasBeenFocused[i]=true;"
                   :class="mode=='browse'?'normal':spellInputs[i]&&(spellInputs[i].toLowerCase()==rawWord.word.spell.toLowerCase())?'correct':(currWordIndex==i?'wrong':'wrong2')"
                   @keyup="checkSpell($event, i,rawWord.word.spell)"
                   @blur="onInputBlur(i, rawWord.word.spell)"
                   :disabled="mode=='browse'" @click.stop=""/>
          </td>
          <td @mouseover="playSounds([$refs.wordSound[i]])">{{rawWord.word.meaningStr.replace(/'/g, "’")}}</td>
        </tr>
      </table>

      <mo-paging style="float:right; margin:3px 0 0 0;"
                 :page-index="currentPage"
                 :total="total"
                 :page-size="pageSize"
                 @change="pageChange">
      </mo-paging>
      <x-button type="primary" style="width:150px; float:left;" id="doSpell" v-shortkey="['x']"
                @shortkey.native="startSpellExercise()" @click.native="startSpellExercise()">拼写练习(X)
      </x-button>
    </div>

    <div v-if="rawWords.length==0" style="width:100%;text-align: center; margin-top:200px;">暂时没有任何生词</div>

  </div>
</template>
<style scoped>

  table {
    border-collapse: collapse;
    border: none;
  }

  th {
    background-color: #335588;
    color: #fff;
  }

  tr:hover {
    background-color: #9999ff;
  }

  .odd {
    background-color: #e5e5e5;
  }

  .even {
    background-color: #cdc;
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
  import MoPaging from '../components/paging.vue'
  import config from '../config'

  export default {
    directives: {focus: focus},
    components: {
      Tab,
      TabItem,
      XButton,
      Flexbox,
      FlexboxItem,
      MoPaging
    },
    data () {
      return {
        pageSize: 20, // 每页显示20条数据
        currentPage: 1, // 当前页码
        total: 0, // 总记录数
        items: [],

        rawWords: [],
        soundsToPlay: [],
        spellInputs: [], // 拼写练习时为每个单词输入的内容
        hasBeenFocused: [], // 记录每个输入框是否获得过焦点
        currWordIndex: -1,
        mode: 'browse',
        soundBaseUrl: config.soundBaseUrl
      }
    },
    mounted () {
      this.setNavVisible(true)
      this.setCurrMenuItem('生词本')

      this.getRawWordsForAPage()
    },
    methods: {
      ...mapActions([
        'setNavVisible',
        'setCurrMenuItem'
      ]),
      // 从page组件传递过来的当前page
      pageChange (page) {
        this.currentPage = page
        this.getRawWordsForAPage()
      },
      getRawWordsForAPage () {
        api.getRawWordsForAPage(this.currentPage, this.pageSize).then((res) => {
          this.total = res.data.total
          this.rawWords = res.data.rows
        })
      },
      startSpellExercise () {
        this.mode = 'spell'
        this.spellInputs = []
        this.hasBeenFocused = []
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
      }
    },
    computed: mapGetters([
      'getLoggedInUser'
    ])
  }
</script>
