<template>
  <div style="width:70%; margin-left:15%; background-color:#B1DDF8; padding:0px;margin-top:50px;">
    <div
      style="font-sie: 1.5em; font-weight: bold; margin-bottom: 0.5em; padding:16px 0; background-color:#214778; color:#fff; text-align:center;">
      今日学习计划：
    </div>
    <div style="padding:16px;">
      <div>
        新词： <span class="number">{{newWordCount}}</span> 个
      </div>
      <div>
        老词： <span class="number">{{oldWordCount}} </span> 个
      </div>
      <div style="margin-top: 1em;">
        学习建议：
        <ul style="margin-left: 2em;">
          <li>请模仿单词标准发音大声朗读出来</li>
          <li>对于有多个中文意思的单词，鼓励把所有意思都看一遍</li>
          <li>对于印象模糊的单词，不要猜测</li>
          <li>不需要强迫自己一次记住所学单词，因为每个单词都会按照遗忘规律在今后重复出现多次，达到最佳记忆效果</li>
          <li>建议首先完成当日学习任务，再参加游戏</li>
          <li>建议经常参加游戏比赛，强化记忆， 检验学习成果，激励自己不断进步</li>
        </ul>
      </div>
    </div>

    <x-button type="primary" v-show="prepared" @click.native="start()">开始学习</x-button>
  </div>
</template>
<style scoped>
  .number {
    color: indigo;
    font-weight: bold;
  }
</style>
<script>
  import { mapActions } from 'vuex'
  import { XButton } from 'vux'
  import api from './api'

  export default {
    data () {
      return {
        newWordCount: 0,
        oldWordCount: 0,
        prepared: false
      }
    },
    components: {XButton},
    mounted () {
      this.setNavVisible(true)
      this.setCurrMenuItem('学习')
      this.prepareForStudy()
    },
    methods: {
      ...mapActions([
        'setNavVisible',
        'setCurrMenuItem'
      ]),
      prepareForStudy () {
        api.prepareForStudy().then((res) => {
          this.newWordCount = res.data.data[0]
          this.oldWordCount = res.data.data[1]
          this.prepared = true
        })
      },
      start () {
        this.$router.push({path: '/bdc', query: {fromPage: 'beforeStudy'}})
      }
    }
  }
</script>
