<template>
  <div style="padding:4px">
    <div style="width:100%;margin-top:8px">
      <flexbox orient="horizontal">
        <flexbox-item :span="10">
          <span>请选择要学习的单词书：</span>
        </flexbox-item>
        <flexbox-item>
          <x-button type="primary" @click.native="saveSelectedDicts()">保存</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="primary" @click.native="cancel()">取消</x-button>
        </flexbox-item>
      </flexbox>
    </div>

    <!--tab选项卡-->
    <tab :scroll-threshold="30" :animate="false">
      <tab-item v-for="group in dictGroups" :key="group.name"
                v-if="group.name!='root'&&group.dictGroup.name=='root'" @click.native="tabItemClicked(group.name)"
                :selected="currDictGroup==group.name" style="cursor:pointer;">{{group.name}}
      </tab-item>
      <tab-item @click.native="tabItemClicked('自定义')" v-show="true"
                :selected="currDictGroup=='自定义'">自定义
      </tab-item>
    </tab>

    <!--系统单词书-->
    <div class="tabContent" v-for="(group, index) in dictGroups" v-if="group.name!='root'&&group.dictGroup.name=='root'"
         :key="group.name" v-show="currDictGroup==group.name">
      <div v-for="dict in group.dicts" class="book">
        <a href="javascript:void(0)" :class='{selectedBook: isDictSelected(dict)}' @click="bookClicked(dict)"><span
          class="bookName">{{dict.shortName}}</span>

          <div class="wordCountDesc">
            <span class="wordCount">{{dict.wordCount}}</span>词
          </div>
          <span class="operHint">{{isDictSelected(dict) ? '已选中' : '点击可选中本书'}}</span>
          <img v-if="isDictSelected(dict)" src="../assets/selectedBook.png" alt="" border="0">
          <img v-if="!isDictSelected(dict)" src="../assets/book.png" alt="" border="0">
          <input type="hidden" class="bookFullName" :value="dict.name"/></a>
      </div>
    </div>

    <!--自定义单词书-->
    <div class="tabContent" v-show="currDictGroup=='自定义'">
      <div v-for="dict in myDicts" class="book">
        <a href="javascript:void(0)" :class='{selectedBook: isDictSelected(dict)}' @click="bookClicked(dict)"><span
          class="bookName">{{dict.shortName}}</span>

          <div class="wordCountDesc">
            <span class="wordCount">{{dict.wordCount}}</span>词
          </div>
          <span class="operHint">{{dict.isReady ? (isDictSelected(dict) ? '已选中' : '点击可选中本书') : '尚未完成编辑'}}</span>
          <img v-if="isDictSelected(dict)" src="../assets/selectedBook.png" alt="" border="0">
          <img v-if="dict.isReady&&!isDictSelected(dict)" src="../assets/book.png" alt="" border="0">
          <img v-if="!dict.isReady" src="../assets/editingBook.png" alt="" border="0">
          <input type="hidden" class="bookFullName" :value="dict.name"/></a>
      </div>
      <x-button type="warn" @click.native="showInputNewDictNameDlg()"
                style="float: right; width:150px; margin-top: 16px;">创建新单词书
      </x-button>
    </div>

  </div>
</template>
<style scoped>
  .selectedBook {
    border: 1px solid #000;
    background-color: #7777ff ! important;
    text-decoration: none;
    color: #000
  }

  .selectedBook span.operHint {
    color: #FFF;
    display: block;
    background-color: #7777ff;
    width: 134px;
    position: absolute;
    top: 134px;
    left: 0;
    line-height: 20px
  }

  .book {
    width: 134px;
    height: 154px;
    position: relative;
    float: left
  }

  .book a {
    border: 1px solid #F0F0E8;
    background-color: #FFF;
    padding: 6px;
    display: block;
    color: #000
  }

  .book a .bookName {
    display: block;
    color: #000;
    width: 100px;
    position: absolute;
    top: 16px;
    left: 16;
    line-height: 20px;
    background-color: transparent ! important;
    font-size: 14px
  }

  .book a .wordCountDesc {
    position: absolute;
    right: 32px;
    bottom: 40px;
    background-color: transparent ! important
  }

  .book a .wordCountDesc .wordCount {
    color: blue;
    margin-right: 8px;
    background-color: transparent ! important
  }

  .book a span.operHint {
    display: none;
    text-align: center;
    font-size: 12px;
    background-color: #7777ff ! important;
    color: #fff ! important
  }

  .book a img {
    width: 120px;
    height: 140px
  }

  .book a:hover {
    border: 1px solid #000;
    background-color: #7777ff ! important;
    text-decoration: none;
    color: #000
  }

  .book a:hover span.operHint {
    color: #FFF;
    display: block;
    background-color: #7777ff;
    width: 134px;
    position: absolute;
    top: 134px;
    left: 0;
    line-height: 20px
  }
</style>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import { Tab, TabItem, XButton, Flexbox, FlexboxItem } from 'vux'
  import api from '../pages/api'

  export default {
    data () {
      return {
        dictGroups: [],
        currDictGroup: '考级',
        selectedDicts: [],
        myDicts: []
      }
    },
    components: {
      Tab,
      TabItem,
      XButton,
      Flexbox,
      FlexboxItem
    },
    mounted () {
      this.setNavVisible(true)
      this.setCurrMenuItem('单词书')

      this.getDictGroups()
      this.getSelectedDicts()
      this.getMyDicts()
      if (this.$route.query.defaultDictGroup) {
        this.currDictGroup = this.$route.query.defaultDictGroup
      }
    },
    methods: {
      ...mapActions([
        'setCurrMenuItem',
        'setNavVisible'
      ]),
      getDictGroups () {
        api.getDictGroups().then((res) => {
          this.dictGroups = res.data
        })
      },
      getSelectedDicts () {
        api.getSelectedDicts().then((res) => {
          this.selectedDicts = res.data
        })
      },
      getMyDicts () {
        api.getMyDicts().then((res) => {
          this.myDicts = res.data
        })
      },
      tabItemClicked (groupName) {
        this.currDictGroup = groupName
      },
      isDictSelected (dict) {
        for (let i = 0; i < this.selectedDicts.length; i++) {
          if (this.selectedDicts[i].dict.name === dict.name) {
            return true
          }
        }
        return false
      },
      bookClicked (dict) {
        if (this.isDictSelected(dict)) {
          for (let i = 0; i < this.selectedDicts.length; i++) {
            if (this.selectedDicts[i].dict.name === dict.name) {
              this.selectedDicts.splice(i, 1)
            }
          }
        } else if (dict.isReady) {
          this.selectedDicts.push({dict: dict})
        } else { // 单词书尚未完成编辑
          this.$router.push({path: '/dictEdit', query: {dictId: dict.id}})
        }
      },
      saveSelectedDicts () {
        api.saveSelectedDicts(this.selectedDicts).then((res) => {
          if (res.data.success) {
            this.$router.push({path: '/main', query: {}})
          } else {
            this.warn(res.data.msg)
          }
        })
      },
      cancel () {
        this.$router.push({path: '/main', query: {}})
      },
      showInputNewDictNameDlg () {
        let dictName = prompt('请输入单词书名', '')
        if (dictName.trim() === '') {
          alert('书名不能为空')
          return
        }
        api.createNewDict(dictName).then((res) => {
          if (res.data.success) {
            this.myDicts.push(res.data.data)
          } else {
            this.warn(res.data.msg)
          }
        })
      }
    },
    computed: mapGetters([
      'getLoggedInUser'
    ])
  }
</script>
