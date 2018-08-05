<template>
  <div>

    <div id="roomArea">
      <div v-for="(hallGroup, groupIndex) in hallGroups" class="hallGroup">
        <div class="hallGroupName">{{hallGroup.groupName}}(<span
          style="color: red;">{{hallGroup.userCount}} </span>人)
        </div>

        <div>
          <ul data-role="listview" data-inset="false" data-theme="a">
            <li v-for="gameHall in hallGroup.gameHalls">
              <x-button type="primary"
                        @click.native="showRussiaPage(gameHall.hallName)">{{gameHall.hallName}} (<span
                style="color: red;">{{gameHall.userCount}}</span>人)
              </x-button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div id="desc">
      <div style="font-weight: bold;">比赛英雄榜</div>
      <div>
        <table>
          <tr style="font-weight: bold;">
            <td>名次</td>
            <td>昵称</td>
            <td>积分</td>
            <td>胜</td>
            <td>负</td>
            <td>胜率</td>
          </tr>
          <tr v-for="(userGame,index) in topUserGames">
            <td>{{index + 1}}</td>
            <td><img alt="QQ头像" style="height: 20px; width: 20px;"
                     v-if="userGame.user.figureUrl" :src="userGame.user.figureUrl"/> {{userGame.user.displayNickName}}
            </td>
            <td>{{userGame.score}}</td>
            <td>{{userGame.winCount}}</td>
            <td>{{userGame.loseCount}}</td>
            <td>{{userGame.winCount / (userGame.winCount + userGame.loseCount) * 100 | toFixed(2)}}%</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
<style scoped>
  * {
    font-size: 13px;
  }

  ul {
    list-style: none;
  }

  .hallGroupName {
    text-align: center;
  }

  #roomArea {
    margin: 16px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  .hallGroup li {
    margin-top: 4px;
  }

  .hallGroup {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 4px;
  }

  #desc {
    font-size: 13px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  td {
    padding-right: 1em;
  }
</style>
<script>
  import { mapActions } from 'vuex'
  import { XButton, XInput, XTextarea, Group, Flexbox, FlexboxItem } from 'vux'
  import api from './api'

  export default {
    data () {
      return {
        hallGroups: [], // 系统定义的游戏大厅分组
        halls: [], // 实际运行中的所有游戏大厅实例
        topUserGames: [] // 游戏排名靠前的用户
      }
    },
    components: {XButton, XInput, XTextarea, Group, Flexbox, FlexboxItem},
    mounted () {
      this.setNavVisible(true)
      this.setCurrMenuItem('游戏')
      this.getHallGroups()
    },
    methods: {
      ...mapActions([
        'setNavVisible',
        'setCurrMenuItem'
      ]),
      getHallGroups () {
        api.getGameHallData().then((res) => {
          this.hallGroups = res.data.hallGroups
          this.halls = res.data.halls
          this.topUserGames = res.data.topUserGames

          // 计算大厅分组及每个大厅中的在线人数
          for (let i in this.hallGroups) {
            let hallGroup = this.hallGroups[i]
            hallGroup.userCount = 0
            for (let j in hallGroup.gameHalls) {
              let gameHall = hallGroup.gameHalls[j]
              let hall = this.halls[gameHall.hallName]
              gameHall.userCount = hall ? hall.userCount : 0
              hallGroup.userCount += gameHall.userCount
            }
          }
        })
      },
      showRussiaPage (hallName) {
        this.$router.push({path: '/russia', query: {hallName: hallName}})
      }
    }
  }
</script>
