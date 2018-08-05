<template>
  <div class="review">
    <table id="wordTable" style="TABLE-LAYOUT: fixed; width: 100%;">
      <tr>
        <th style='width:35%; word-break:break-all;'>拼写</th>
        <th style='width:50%;'>释义</th>
        <th style='width:5%;'>操作</th>
      </tr>

      <tr v-for="(rawWord, i) in dictWords" @click='playSounds([$refs.wordSound[i]])' :class="i%2?'odd':'even'">
        <td style='padding:0'>
          <audio ref="wordSound" v-if="rawWord.word.sound" :src="'/sound/'+rawWord.word.sound+'.mp3'">
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
        <td>
          <div class="btnDiv" @click="removeWordFromDict(rawWord.word.id)">删除</div>
        </td>
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

    <div style="clear:both;">
      <x-input title="输入要加入的单词：" label-width="150px" v-model="spell" placeholder="此处输入要加入的单词，回车添加到单词书"
               @keydown.native="onSpellKeyDown($event)" ref="spell"></x-input>
      <flexbox>
        <flexbox-item>
          <group label-width="150px" style="margin-top:-20px;">
            <selector v-model="dictIdToImportFrom" title="选择单词书导入：" label-width="150px" placeholder="请选择要从其导入的单词书"
                      :options="sysDicts"
                      style="background-color:#ddddee; "></selector>

          </group>
        </flexbox-item>
        <flexbox-item>
          <x-button @click.native="startImport()" v-show="dictIdToImportFrom!=-1"
                    style="display:inline-block;width:100px;">开始导入
          </x-button>
        </flexbox-item>
      </flexbox>

      <flexbox>
        <flexbox-item>
          <x-button type="warn" @click.native="clearWordsOfDict()"
                    style="width:150px;margin-top:4px">
            清空所有单词
          </x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="primary" @click.native="back()"
                    style="width:150px;margin-top:4px">
            返回
          </x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="primary" @click.native="finishEdit()"
                    style="width:150px;margin-top:4px">
            完成编辑
          </x-button>
        </flexbox-item>
      </flexbox>

    </div>

  </div>
</template>
<style scoped>
  .btnDiv {
    min-height: 48px;
    line-height: 48px;
    width: 100%;
    text-align: center;
    font-size: 18px;
    border: none;
    margin-bottom: 1px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #fff;
    background-color: forestgreen;
  }

  .btnDiv:hover {
    background-color: #2b5360;
    cursor: pointer;
  }

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
  import { Tab, TabItem, XButton, Flexbox, FlexboxItem, XInput, Selector, Group } from 'vux'
  import { focus } from 'vue-focus'
  import api from '../pages/api'
  import MoPaging from '../components/paging.vue'

  export default {
    directives: {focus: focus},
    components: {
      Tab,
      TabItem,
      XButton,
      Flexbox,
      FlexboxItem,
      MoPaging,
      XInput,
      Selector,
      Group
    },
    data () {
      return {
        dict: {name: ''},
        dictWords: [],
        spell: '',

        pageSize: 10, // 每页显示20条数据
        currentPage: 1, // 当前页码
        total: 0, // 总记录数
        items: [],

        soundsToPlay: [],
        spellInputs: [], // 拼写练习时为每个单词输入的内容
        hasBeenFocused: [], // 记录每个输入框是否获得过焦点
        currWordIndex: -1,
        mode: 'browse',

        dictIdToImportFrom: -1, // 从该单词书导入单词
        sysDicts: [{key: 1, value: 'aa'}, {key: 2, value: 'bb'}]
      }
    },
    mounted () {
      this.setNavVisible(true)
      this.setCurrMenuItem('单词书')

      this.getDict()
      this.getDictWordsForAPage()

      api.getAllSysDicts().then((res) => {
        this.sysDicts = []
        for (let i = 0; i < res.data.length; i++) {
          let dict = res.data[i]
          this.sysDicts.push({key: dict.id, value: dict.shortName})
        }
      })
    },
    methods: {
      ...mapActions([
        'setNavVisible',
        'setCurrMenuItem',
        'setLoggedInUser'
      ]),
      finishEdit () {
        let that = this
        this.$vux.confirm.show({
          title: '确认',
          content: '单词书完成编辑后，就不能再编辑了，确定要完成编辑吗？',
          onConfirm () {
            api.finishEditingDict(that.$route.query.dictId).then((res) => {
              if (res.data.success) {
                that.info('单词书成功完成了编辑，可以开始使用了')
                that.back()
              } else {
                that.warn(res.data.msg)
              }
            })
          }
        })
      },
      back () {
        this.$router.push({path: '/selectDict', query: {defaultDictGroup: '自定义'}})
      },
      clearWordsOfDict () {
        let that = this
        this.$vux.confirm.show({
          title: '确认',
          content: '确定要清空本单词书中的所有单词吗？',
          onConfirm () {
            api.clearWordsOfDict(that.$route.query.dictId).then((res) => {
              if (res.data.success) {
                that.getDictWordsForAPage()
              } else {
                that.warn(res.data.msg)
              }
            })
          }
        })
      },
      startImport () {
        api.importFromDict(this.dictIdToImportFrom, this.$route.query.dictId).then((res) => {
          if (res.data.success) {
            this.getDictWordsForAPage()
            this.info(res.data.msg)
          } else {
            this.warn(res.data.msg)
          }
        })
      },
      removeWordFromDict (wordId) {
        api.removeWordFromDict(this.$route.query.dictId, wordId).then((res) => {
          if (res.data.success) {
            this.getDictWordsForAPage()
          } else {
            this.warn(res.data.msg)
          }
        })
      },
      onSpellKeyDown (event) {
        if (event.key === 'Enter') {
          api.searchWord(this.spell).then((res) => {
            if (res.data.word) {
              this.addWordToDict(this.$route.query.dictId, res.data.word)
            } else {
              this.warn('单词：' + this.spell + '不存在')
            }
          })
        }
      },
      addWordToDict (dictId, word) {
        api.addWordToDict(dictId, word.id).then((res) => {
          if (res.data.success) {
            this.getDictWordsForAPage()
            this.spell = ''
            this.$refs.spell.focus()
            this.info(word.spell + '成功加入到单词书')
          } else {
            this.warn(res.data.msg)
          }
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
      },
      getDict () {
        api.getDictById(this.$route.query.dictId).then((res) => {
          this.dict = res.data
        })
      },
      // 从page组件传递过来的当前page
      pageChange (page) {
        this.currentPage = page
        this.getDictWordsForAPage()
      },
      getDictWordsForAPage () {
        api.getDictWordsForAPage(this.$route.query.dictId, this.currentPage, this.pageSize).then((res) => {
          this.total = res.data.total
          this.dictWords = res.data.rows
        })
      }
    },
    computed: mapGetters([
      'getLoggedInUser'
    ])
  }
</script>
