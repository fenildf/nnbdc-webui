<template>
  <div style="padding:16px">

    <!--学习进度信息 -->
    <div id="progressInfo">
      <div class="welcome"><img id="cow" title="我会一天天长大，但要记得打卡哦！"
                                src="../assets/cow.png"/>
        <div style="display:inline-block;">
          <div>{{getLoggedInUser.displayNickName}}</div>
          <div> 第 <span
            class="number">{{studyProgress.existDays}}</span>
            天学习，继续加油！<br/></div>
          <br/>
        </div>
      </div>

      <div>
        <br/>
        <div class="userLevel">
						<span>等级： {{studyProgress.level.name}}
						</span>
        </div>
        <table class="progressSummary">
          <tr>
            <td class='title'>积分:</td>
            <td><span class="number">{{studyProgress.totalScore}} </span></td>
            <td class='title'>排名:</td>
            <td><span class="number">{{studyProgress.userOrder == -1 ? '(暂无)' : studyProgress.userOrder}} </span></td>
            <td class='title'/>
            <td/>
          </tr>

          <tr>
            <td class='title'>打卡天数:</td>
            <td><span class="number">{{studyProgress.dakaDayCount}} </span></td>
            <td class='title'>打卡率:</td>
            <td><span class="number">{{studyProgress.dakaRatio * 100 | toFixed(2)}}%
							</span></td>
            <td class='title'/>
            <td/>
          </tr>

          <tr>
            <td class='title'>连续打卡:</td>
            <td><span class="number">{{studyProgress.continuousDakaDayCount}} </span></td>
            <td class='title'>打卡积分加成:</td>
            <td><span class="number">{{studyProgress.continuousDakaDayCount}}</span></td>
            <td class='title'/>
            <td/>
          </tr>

          <tr>
            <td class='title'>牛粪:</td>
            <td><span class="number">{{studyProgress.cowDung}} </span></td>
            <td class='title'>已掌握:</td>
            <td><span class="number">{{studyProgress.masteredWordsCount}} </span></td>
            <td class='title'>学习中:</td>
            <td><span class="number">{{studyProgress.learningWordsCount}}</span></td>
          </tr>
        </table>
      </div>

      <div v:if='studyProgress.masteredWordsCount == 0'>
        <div style="color: gray; font-size: 0.7em;">(看到掌握的单词数为零，是不是很没有成就感？别急，学习10天后它就开始增长了！)</div>
      </div>

      <!-- 所有正在学习的单词书（包括生词本） -->
      <table style='margin: 24px 0;'>

        <!-- 生词本 -->
        <tr>
          <td width=350>
            <div id="rawWordBook" @click="gotoRawWordPage()"
                 style="border: solid 1px gray; width: 5em; height: 3em; background-color: lightgreen; cursor: pointer; float: left;">
              <div style="text-align: center;">生词本</div>
              <div style="text-align: center;">
                {{studyProgress.rawWordCount }}词
              </div>
            </div>
          </td>
          <td>
            <img v-if="studyProgress.isRawWordBookPrivileged == true"
                 src="../assets/highPriority.png"
                 width="32" height="32" title="是否优先从本单词书取词（绿色:是  灰色:否）"
                 @click="privilegeDict('rawWordBook')"/>
            <img v-if="studyProgress.isRawWordBookPrivileged == false"
                 src="../assets/normalPriority.png"
                 width="32" height="32" title="是否优先从本单词书取词（绿色:是  灰色:否）"
                 @click="privilegeDict('rawWordBook')"/>
          </td>
        </tr>

        <!-- 普通单词书-->
        <tr v-for="learningDict in studyProgress.selectedLearningDicts">
          <td style="min-width: 250px;">

            <div style="font-size: 13px;">
              {{learningDict.dict.shortName}}
            </div>

            <progress-bar :max="learningDict.dict.wordCount" :progress="learningDict.currentWordOrder" precision="2"
                          height="18px"></progress-bar>
          </td>
          <td>
            <img v-if="learningDict.isPrivileged == true"
                 src="../assets/highPriority.png"
                 width="32" height="32" title="是否优先从本单词书取词（绿色:是  灰色:否）"
                 @click="privilegeDict(learningDict.dict.name)"/>

            <img v-if="learningDict.isPrivileged == false"
                 src="../assets/normalPriority.png"
                 width="32" height="32" title="是否优先从本单词书取词（绿色:是  灰色:否）"
                 @click="privilegeDict(learningDict.dict.name)"/>


            <img src="../assets/trash.png" width="32"
                 height="32" title="删除单词书"
                 @click="deleteDict(learningDict.dict.name, learningDict.dict.shortName)"/>
          </td>
        </tr>
      </table>


      <!-- 如果所有单词书都已学完， 提示用户选择新的单词书 -->
      <div class="selectDictHint" v-if="studyProgress.allDictsFinished">
        <flexbox orient="horizontal">
          <flexbox-item>
            单词书中已没有新词了，请
          </flexbox-item>
          <flexbox-item>
            <x-button type="warn" @click.native="selectDict()">选择新的单词书
            </x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>

    <!--学习进步曲线 -->
    <div id="progressCurve">
      <div class="echarts">
        <IEcharts :option="chart" :loading="loading"></IEcharts>
      </div>
      <div id="explain"
           style="font-size: 0.7em; color: gray; margin-left: 16px;">
        <div>
          <span style="color: #777;">[应掌握]</span> -
          如果每天学习{{studyProgress.wordsPerDay}}个单词，从不旷课，实际掌握的单词量就将按照该曲线上升
        </div>
        <div>
          <span style="color: green;">[已学习]</span> - 包括正在学习的单词和已经掌握的单词
        </div>
        <div>
          <span style="color: red;">[已掌握]</span> -
          已完成整个艾宾浩斯学习过程，被真正掌握的单词
        </div>
      </div>

      <flexbox orient="horizontal" style="width:400px;margin-left:16px">
        <flexbox-item>
          <group>
            <selector v-model="studyProgress.wordsPerDay" title="每日单词数" :options="wordsPerDayList"
                      @on-change="onWordsPerDayChange"></selector>
          </group>
        </flexbox-item>
        <flexbox-item>
          <group>
            <x-button v-if="!studyProgress.todayLearningFinished" type="primary" @click.native="startStudy()">开始学习
            </x-button>
            <span v-if="studyProgress.todayLearningFinished">今日任务已完成！</span>
          </group>
        </flexbox-item>
      </flexbox>


      <div class="okcancel" style="display: inline-block">


        <div v-if="studyProgress.throwDiceChance>0">
							<span style="color:red;font-size:12px;padding-left:16px">您还有 {{studyProgress.throwDiceChance}} 次掷骰子机会赢取牛粪(对以前打卡送牛粪失败的补偿)
							</span>
          <button
            @click.native="throwDice()">掷骰子
          </button>
        </div>


      </div>

    </div>


    <div id="app" style="font-size: 12px; margin-left:16px">
      <div style="float: left;">
        <img width="80" height="80" src="../assets/nnbdc-android-2dma.png"/>
      </div>
      <div style="float: left; padding-left: 8px;">
        <div>Android版</div>
        <br>
        <div>本二维码不支持微信扫描，请使用其他扫码软件扫描。或者直接用手机浏览器打开：http://211.149.235.208/app/nnbdc.apk</div>
        <div>有任何问题可直接联系QQ34672691,或QQ群292533781</div>
      </div>

    </div>


  </div>
</template>

<style scoped>
  .echarts {
    width: 800px;
    height: 400px;
  }

  #progressInfo {
    float: left;
  }

  #progressCurve {
    float: left;
    padding: 0 0 0 32px;
  }

  #app {
    float: left;
    padding: 0 0 0 32px;
  }

  .number {
    color: #2c3e50;
    font-weight: bold;
  }

  table {
    border-collapse: collapse;
    border: solid #ddd 5px;
    width: 460px;
    table-layout: fixed;
  }

  td {
    border: solid #ddd 1px;
    padding: 4px 4px
  }

  table.progressSummary {
    font-size: 14px;
  }

  td.title {
    width: 60px;
    background-color: #f5f5f5;
  }

</style>

<script>
  import {
    XHeader, Actionsheet, TransferDom,
    FlexboxItem,
    Flexbox,
    Group,
    Selector,
    XButton
  } from 'vux'
  import { mapActions, mapGetters } from 'vuex'
  import IEcharts from 'vue-echarts-v3'
  import api from './api'
  import util from './util'

  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Actionsheet,
      IEcharts,
      FlexboxItem,
      Flexbox,
      Group,
      Selector,
      XButton
    },
    data () {
      return {
        wordsPerDayList: [10, 20, 30, 50, 75, 100, 150, 200],
        studyProgress: {
          level: {},
          wordsPerDay: null,
          selectedLearningDicts: []
        },
        snapshotDailys: [],
        loading: true,
        chart: {
          title: {
            text: '进步曲线'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              show: true,
              type: 'cross',
              lineStyle: {
                type: 'dashed',
                width: 1
              }
            },
            formatter: function (params) {
              return '至第<span style="color:orange">' + params[0].value[0] + '</span>天<br/>' +
                (params[0] == null ? '' : params[0].seriesName + '<span style="color:orange">' + params[0].value[1] + '</span>词<br/>') +
                (params[1] == null ? '' : params[1].seriesName + '<span style="color:orange">' + params[1].value[1] + '</span>词<br/>') +
                (params[2] == null ? '' : params[2].seriesName + '<span style="color:orange">' + params[2].value[1] + '</span>词<br/>')
            }
          },
          legend: {
            data: []
          },
          xAxis: [
            {
              type: 'value'
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: []
        }
      }
    },
    mounted () {
      this.setNavVisible(true)
      this.setCurrMenuItem('进度')
      api.getStudyProgress().then((res) => {
        this.studyProgress = res.data
        if (this.snapshotDailys != null) {
          this.drawCurve(this.snapshotDailys, this.studyProgress.wordsPerDay)
        }
      })
      api.getSnapshotDailys().then((res) => {
        this.snapshotDailys = res.data
        if (this.studyProgress.wordsPerDay != null) {
          this.drawCurve(this.snapshotDailys, this.studyProgress.wordsPerDay)
        }
      })
    },
    methods: {
      gotoRawWordPage () {
        this.$router.push({path: '/rawWord', query: {}})
      },
      selectDict () {
        this.$router.push({path: '/selectDict', query: {}})
      },
      onWordsPerDayChange () {
        if (this.studyProgress.wordsPerDay == null) {
          return
        }
        api.saveWordsPerDay(this.studyProgress.wordsPerDay).then((res) => {
          if (res.data.success) {
            this.drawCurve(this.snapshotDailys, this.studyProgress.wordsPerDay)
          } else {
            this.warn(res.data.msg)
          }
        })
      },
      drawCurve (snapshotDailys, wordsPerDay) {
        // 准备实际进步曲线（原始数据）
        let topWordsCount = 0
        let rawLearned = []
        let rawMastered = []
        for (let i = 0; i < snapshotDailys.length; i++) {
          let snapshot = snapshotDailys[i]
          let theDate = util.formatDate(new Date(snapshot.theDate), 'yyyy-MM-dd')
          rawLearned.push([theDate, snapshot.learnedWords])
          rawMastered.push([theDate, snapshot.masteredWords])

          let count = snapshot.learnedWords
          if (count > topWordsCount) {
            topWordsCount = count
          }
        }

        // 处理实际进步曲线的原始数据，补全缺少的天数，并将日期换算成序号
        let learned = []
        let mastered = []
        if (rawLearned.length > 0) {
          let index = 0
          learned[index] = [index + 1, rawLearned[0][1]]
          mastered[index] = [index + 1, rawMastered[0][1]]
          for (let i = 1; i < rawLearned.length; i++) {
            var dSpan = util.daySpan(rawLearned[i - 1][0], rawLearned[i][0])

            // 补全缺失天数
            for (let j = 1; j < dSpan; j++) {
              index++
              learned[index] = [index + 1, learned[index - 1][1]]
              mastered[index] = [index + 1, mastered[index - 1][1]]
            }

            index++
            learned[index] = [index + 1, rawLearned[i][1]]
            mastered[index] = [index + 1, rawMastered[i][1]]
          }
        }

        // 理想进步曲线
        let idealMastered = []
        for (let i = 1; i <= 9; i++) {
          idealMastered.push([i, 0])
        }
        let days = Math.max(30, learned.length)
        for (let i = 10; i <= days; i += 1) {
          let wordCount = (i - 9) * (wordsPerDay / 5)
          idealMastered.push([i, wordCount])

          if (wordCount > topWordsCount) {
            topWordsCount = wordCount
          }
        }
        this.chart.series = []
        this.chart.series.push({
          name: '应掌握',
          type: 'line',
          showSymbol: false,
          color: ['#777'],
          data: idealMastered
        })
        this.chart.series.push({
          name: '已学习',
          type: 'line',
          showSymbol: false,
          color: ['green'],
          data: learned
        })
        this.chart.series.push({
          name: '已掌握',
          type: 'line',
          showSymbol: false,
          color: ['red'],
          data: mastered
        })

        // 添加图例
        this.chart.legend.data = ['应掌握', '已学习', '已掌握']

        this.loading = false
      },
      privilegeDict (dictName) {
        api.privilegeSelectedDict(dictName).then((res) => {
          if (dictName === 'rawWordBook') {
            this.studyProgress.isRawWordBookPrivileged = !this.studyProgress.isRawWordBookPrivileged
          } else {
            for (let i = 0; i < this.studyProgress.selectedLearningDicts.length; i++) {
              let learningDict = this.studyProgress.selectedLearningDicts[i]
              if (learningDict.dict.name === dictName) {
                learningDict.isPrivileged = !learningDict.isPrivileged
              }
            }
          }
        })
      },
      ...mapActions([
        'setNavVisible',
        'setCurrMenuItem'
      ]),
      deleteDict (dictName, shortName) {
        let that = this
        this.$vux.confirm.show({
          title: '确认',
          content: '确定要停止学习 ' + shortName + ' ？',
          onConfirm () {
            api.deleteSelectedDict(dictName).then((res) => {
              if (res.data.success) {
                for (let i = 0; i < that.studyProgress.selectedLearningDicts.length; i++) {
                  let learningDict = that.studyProgress.selectedLearningDicts[i]
                  if (learningDict.dict.name === dictName) {
                    that.studyProgress.selectedLearningDicts.splice(i, 1)
                    return
                  }
                }
              } else {
                this.warn(res.data.msg)
              }
            })
          }
        })
      },
      startStudy () {
        this.$router.push({path: '/beforeStudy', query: {}})
      }
    },
    computed: mapGetters([
      'getLoggedInUser'
    ])
  }
</script>
