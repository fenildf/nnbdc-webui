<template>
  <div data-role="content" style="background-color: #e4e4e4; font-size:14px;">


    <div class="paiMing">
      <div class="centerContainer title" style="font-weight: bold;">总积分TOP 20
      </div>

      <table style="clear: both; width: 100%;">
        <tr>
          <td>名次</td>
          <td>昵称</td>
          <td>等级</td>
          <td class="right">积分</td>
        </tr>
        <tr v-for="(user2, index) in usersByTotalScore" v-if="user2.totalScore > 0 && index < 20"
            v-bind:class="{highlight:getLoggedInUser().id == user2.userId}">
          <td><strong>
            {{index + 1}}
          </strong></td>
          <td>
            {{user2.displayNickName}}
          </td>
          <td :style="user2.level.style">
            {{user2.level.name}}
          </td>
          <td class="strong2 right">
            {{user2.totalScore}}
          </td>
        </tr>
      </table>
    </div>

    <div class="paiMing">
      <div class="title" style="font-weight: bold;">打卡天数TOP
        20
      </div>

      <table style="clear: both; width: 100%;">
        <tr>
          <td>名次</td>
          <td>昵称</td>
          <td>等级</td>
          <td class="right">打卡天数</td>
        </tr>
        <tr v-for="(user2, index) in usersByDakaCount" v-if="user2.dakaDayCount > 0 && index < 20"
            :class="{highlight:getLoggedInUser().id == user2.userId}">
          <td><strong>
            {{index + 1}}
          </strong></td>
          <td>
            {{user2.displayNickName}}
          </td>
          <td :style="user2.level.style">
            {{user2.level.name}}
          </td>
          <td class="strong2 right">
            {{user2.dakaDayCount}}
          </td>

        </tr>
      </table>
    </div>

    <div class="paiMing">
      <div class="centerContainer title" style="font-weight: bold;">打卡率TOP 20</div>

      <table style="clear: both; width: 100%;">
        <tr>
          <td>名次</td>
          <td>昵称</td>
          <td>等级</td>
          <td class="right">打卡率</td>

        </tr>
        <tr v-for="(user2, index) in usersByDakaRatio" v-if="user2.dakaRatio > 0 && index < 20"
            :class="{highlight:getLoggedInUser().id == user2.userId}">
          <td><strong>
            {{index + 1}}
          </strong></td>
          <td>
            {{user2.displayNickName}}
          </td>
          <td :style="user2.level.style">
            {{user2.level.name}}
          </td>
          <td class="strong2 right">
            {{user2.dakaRatio*100 | toFixed(2)}}%
          </td>

        </tr>
      </table>
    </div>

    <div class="paiMing">
      <div class="centerContainer title" style="font-weight: bold;">连续打卡天数记录TOP 20</div>
      <div class="centerContainer" style="font-size: 12px; color:#777">(天数为绿色，说明该数值仍在增长中)</div>
      <table style="clear: both; width: 100%;">
        <tr>
          <td>名次</td>
          <td>昵称</td>
          <td>等级</td>
          <td class="right">连续打卡天数</td>
        </tr>
        <tr v-for="(user2, index) in usersByMaxContinuousDakaDayCount" v-if="index < 20"
            :class="{highlight:getLoggedInUser().id == user2.userId}">
          <td><strong>{{index + 1}} </strong></td>
          <td>
            {{user2.displayNickName}}
          </td>
          <td :style="user2.level.style">{{user2.level.name}} </td>
          <td
            v-if="user2.maxContinuousDakaDayCount == user2.continuousDakaDayCount && user2.isLastDakaInTodayOrYesterday"
            class="strong2 right"
            style="color:green">{{user2.maxContinuousDakaDayCount}}
          </td>
          <td
            v-if="user2.maxContinuousDakaDayCount != user2.continuousDakaDayCount || !user2.isLastDakaInTodayOrYesterday"
            class="strong2 right">{{user2.maxContinuousDakaDayCount}}
          </td>
        </tr>
      </table>
    </div>

    <div class="paiMing">
      <div class="centerContainer title" style="font-weight: bold;">当前连续打卡天数TOP 20</div>
      <div class="centerContainer" style="font-size: 12px; color:#777">(天数为绿色，说明该数值仍在增长中)</div>
      <table style="clear: both; width: 100%;">
        <tr>
          <td>名次</td>
          <td>昵称</td>
          <td>等级</td>
          <td class="right">连续打卡天数</td>
        </tr>

        <tr v-for="(user2, index) in usersByContinuousDakaDayCount" v-if="index < 20"
            :class="{highlight:getLoggedInUser().id == user2.userId}">
          <td><strong>{{index + 1}} </strong></td>
          <td>
            {{user2.displayNickName}}
          </td>
          <td :style="user2.level.style">{{user2.level.name}} </td>
          <td v-if="user2.isLastDakaInTodayOrYesterday" class="strong2 right" style="color:green">
            {{user2.continuousDakaDayCount}}
          </td>
          <td v-if="!user2.isLastDakaInTodayOrYesterday" class="strong2 right">{{user2.continuousDakaDayCount}}</td>
        </tr>
      </table>
    </div>

    <div class="paiMing">
      <div class="centerContainer title" style="font-weight: bold;">已掌握单词数TOP 20</div>
      <table style="clear: both; width: 100%;">
        <tr>
          <td>名次</td>
          <td>昵称</td>
          <td>等级</td>
          <td class="right">已掌握单词数</td>
        </tr>
        <tr v-for="(user2, index) in usersByMasteredWordCount" v-if="index < 20"
            :class="{highlight:getLoggedInUser().id == user2.userId}">
          <td><strong>{{index + 1}} </strong></td>
          <td>
            {{user2.displayNickName}}
          </td>
          <td :style="user2.level.style">{{user2.level.name}} </td>
          <td class="strong2 right">{{user2.masteredWordCount}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<style scoped>
  table {
    border-collapse: collapse;
    border: none;
  }

  td {
    border: solid #f0f0f0;
    border-width: 0px 0px 1px 0px;
    padding: 6px 6px;
  }

  /*小屏*/
  @media only screen and (max-width: 650px) {
    .paiMing {
      clear: left;
      background-color: #f9f9f9;
      width: 100%;
      padding: 8px;
      border: solid 1px #E3E3E3;
      border-radius: 3px;
    }
  }

  /*大屏*/
  @media only screen and (min-width: 651px) {
    .paiMing {
      float: left;
      background-color: #f9f9f9;
      width: 30%;
      margin-left: 1%;
      margin-top: 8px;
      padding: 32px 16px 16px 8px;
      border: solid 1px orange;
      border-radius: 3px;
    }

    .paiMing .title {
      color: orange;
      padding-bottom: 16px;
    }
  }

  .strong2 {
    font-weight: bold;
  }

  .right {
    text-align: right;
  }

  td {
    padding-left: 1em;
  }

  .highlight {
    background-color: lightblue;
  }

  .title{
    width:100%;
    text-align: center;
  }
</style>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import { XButton, Flexbox, FlexboxItem } from 'vux'
  import api from './api'

  export default {
    data () {
      return {
        usersByTotalScore: [],
        usersByDakaCount: [],
        usersByDakaRatio: [],
        usersByMaxContinuousDakaDayCount: [],
        usersByContinuousDakaDayCount: [],
        usersByMasteredWordCount: []
      }
    },
    components: {XButton, Flexbox, FlexboxItem},
    mounted () {
      this.setNavVisible(true)
      this.setCurrMenuItem('排行')
      this.getUserPaihangDatas()
    },
    methods: {
      ...mapGetters([
        'getLoggedInUser'
      ]),
      ...mapActions([
        'setNavVisible',
        'setCurrMenuItem'
      ]),
      getUserPaihangDatas () {
        api.getUserPaihangDatas().then((res) => {
          this.usersByTotalScore = res.data.usersByTotalScore
          this.usersByDakaCount = res.data.usersByDakaCount
          this.usersByDakaRatio = res.data.usersByDakaRatio
          this.usersByMaxContinuousDakaDayCount = res.data.usersByMaxContinuousDakaDayCount
          this.usersByContinuousDakaDayCount = res.data.usersByContinuousDakaDayCount
          this.usersByMasteredWordCount = res.data.usersByMasteredWordCount
        })
      }
    }
  }

</script>
