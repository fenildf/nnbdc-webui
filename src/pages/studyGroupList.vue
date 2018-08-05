<template>
  <div>
    <div class="studyGroupNav">
      <x-button type="primary" v-if="getLoggedInUser().studyGroups.length>0" @click.native="gotoMyGroup()">前往我的小组
      </x-button>
      <x-button type="primary" v-if="getLoggedInUser().studyGroups.length==0"
                @click.native="showCreateStudyGroupPage()">创建小组
      </x-button>
    </div>


    <div class="groups">

      <div v-for="studyGroup in allStudyGroups" class="group"
           style="background-color:#f9f9f9;">

        <div class="groupHeader">
          <div class="groupName">
            {{studyGroup.groupName}}
          </div>
          <div style="float: right;">
            <div>
              排名:
              <strong v-if="studyGroup.groupSummary.groupOrder == 1000000">(暂无)</strong>
              <strong
                v-if="studyGroup.groupSummary.groupOrder != 1000000">{{studyGroup.groupSummary.groupOrder}}
              </strong>
              总分:
              <strong>
                {{studyGroup.groupSummary.groupScore}}
              </strong>&nbsp;
              <span>打卡分:</span>
              <strong>
                {{studyGroup.groupSummary.dakaScore}}
              </strong>&nbsp;
              游戏分:
              <strong>
                {{studyGroup.groupSummary.gameScore}}
              </strong>&nbsp;
              打卡率:
              <strong>
                {{studyGroup.groupSummary.dakaRatio * 100 | toFixed(2)}}%
              </strong>&nbsp;
              人数:
              <strong>
                {{studyGroup.groupSummary.memberCount}}
                /
                {{studyGroup.studyGroupGrade.maxUserCount}}
              </strong>&nbsp;
              组长:
              <strong>
                {{studyGroup.creator.displayNickName}}
              </strong>
            </div>
            <div>
									<span>今日打卡人数:<strong>{{studyGroup.todaysDakaCount}} </strong>
									</span><span>&nbsp;&nbsp;今日打卡率:<strong>{{studyGroup.todaysDakaCount / (studyGroup.users.length)}}</strong>
									</span>
            </div>
            <div>
              今日排名变化:
              <span v-if="studyGroup.groupSummary.dayOrderRise == 0">无变化</span>
              <span
                v-if="studyGroup.groupSummary.dayOrderRise > 0">下降<strong>{{studyGroup.groupSummary.dayOrderRise}}</strong></span>
              <span
                v-if="studyGroup.groupSummary.dayOrderRise < 0">上升<strong>{{studyGroup.groupSummary.dayOrderRise * (-1)}}</strong></span>
            </div>
            <div>
              本周排名变化:
              <span v-if="studyGroup.groupSummary.weekOrderRise == 0">无变化</span>
              <span
                v-if="studyGroup.groupSummary.weekOrderRise > 0">下降<strong>{{studyGroup.groupSummary.weekOrderRise}}</strong></span>
              <span
                v-if="studyGroup.groupSummary.weekOrderRise < 0">上升<strong>{{studyGroup.groupSummary.weekOrderRise * (-1)}}</strong></span>
            </div>
            <div>
              本月排名变化:
              <span v-if="studyGroup.groupSummary.monthOrderRise == 0">无变化</span>
              <span
                v-if="studyGroup.groupSummary.monthOrderRise > 0">下降<strong>{{studyGroup.groupSummary.monthOrderRise}}</strong></span>
              <span
                v-if="studyGroup.groupSummary.monthOrderRise < 0">上升<strong>{{studyGroup.groupSummary.monthOrderRise * (-1)}}</strong></span>
            </div>
          </div>
        </div>

        <div class="groupInfo">
          <div style="float: left; width: 80%;">
            <div class="groupTitle">
              {{studyGroup.groupTitle}}
            </div>
            <div class="groupRemark" v-html="studyGroup.groupRemark">
            </div>
          </div>
          <flexbox orient="horizontal" align="right" style="width:50%;float:right;">
            <flexbox-item>
              <x-button type="primary" v-if="containsUser(studyGroup.managers, getLoggedInUser())"
                        @click.native="showEditStudyGroupPage(studyGroup.id)">编辑
              </x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button type="primary" v-if="getLoggedInUser().studyGroups.length==0"
                        @click.native="joinStudyGroup(studyGroup.id)">加入
              </x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button type="primary" @click.native="showStudyGroupInfoPage(studyGroup.id)">详情</x-button>
            </flexbox-item>

          </flexbox>
        </div>

      </div>

    </div>

    <div class="otherInfo">
      <div class="centerContainer"
           style="margin-top: 16px;">小组排名榜
      </div>

      <table style="clear: both; width: 100%;">
        <tr>
          <td>名次</td>
          <td>小组名</td>
          <td>积分</td>
          <td>打卡率</td>
          <td>人数</td>
        </tr>
        <tr v-for="studyGroup in allStudyGroups">
          <td>
            <strong v-if="studyGroup.groupSummary.groupOrder == 1000000">(暂无)</strong>
            <strong v-if="studyGroup.groupSummary.groupOrder != 1000000">{{studyGroup.groupSummary.groupOrder}}</strong>
          </td>
          <td>
            {{studyGroup.groupName}}
          </td>
          <td><strong>
            {{studyGroup.groupSummary.groupScore}}
          </strong></td>
          <td><strong>
            {{studyGroup.groupSummary.dakaRatio * 100 | toFixed(2)}}%
          </strong></td>
          <td><strong>
            {{studyGroup.groupSummary.memberCount}}
            /
            {{studyGroup.studyGroupGrade.maxUserCount}}
          </strong></td>
        </tr>
      </table>
    </div>


  </div>
</template>
<style scoped>
  .studyGroupNav {
    padding: 8px;
    width: 150px;
    float: right;
  }

  @media only screen and (max-width: 650px) {
    .groups {
      width: 100%;
      float: left;
    }

    .otherInfo {
      clear: left;
      background-color: #eeeeee;
      width: 100%;
      padding: 8px;
    }

    .btnArea {
      float: right;
      width: 100%;
    }
  }

  @media only screen and (min-width: 651px) {
    .groups {
      width: 58%;
      float: left;
    }

    .otherInfo {
      float: right;
      background-color: #F9F9F9;
      width: 37%;
      padding: 8px;
      margin-right: 24px;
    }

    .btnArea {
      float: right;
      width: 30%;
    }
  }

  .spliter {
    height: 0px;
    border: 1px solid #eeeeee;
    clear: both;
    width: 80%;
    padding: 0 7px 0 7px;
  }

  .group {
    background-color: #F9F9F9;
    font-size: small;
    padding: 32px;
    float: left;
    width: 90%;
    border-bottom: 1px solid gray;
  }

  .groupHeader {
    background-color: #F9F9F9;
    font-size: 1em;
    float: left;
    width: 100%;
  }

  .groupInfo {
    background-color: #F9F9F9;
    clear: both;
  }

  .groupName {
    font-size: 24px;
    font-weight: bold;
    background-color: #F9F9F9;
    color: olive;
    height: 1.5em;
    padding-top: 0.5em;
    float: left;
  }

  .groupTitle {
    font-weight: bold;
  }

  .groupRemark {
    color: gray;
  }

  .btn {
    float: right;
    background-color: #eef7e1;
    text-align: center;
    padding: 1em 0 1em 0;
    display: inline-block;
    margin-left: 1%;
    margin-top: 1%;
    border: 1px solid lightgray;
    border-radius: 16px;
  }

  .btn:hover {
    background-color: lightblue;
  }

  td {
    padding-left: 1em;
  }

  strong {
    color: #358;
  }
</style>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import { XButton, Flexbox, FlexboxItem } from 'vux'
  import api from './api'
  import util from './util'

  export default {
    data () {
      return {
        allStudyGroups: []
      }
    },
    components: {XButton, Flexbox, FlexboxItem},
    mounted () {
      this.setNavVisible(true)
      this.setCurrMenuItem('小组')
      this.getAllStudyGroups()
    },
    methods: {
      ...mapGetters([
        'getLoggedInUser'
      ]),
      ...mapActions([
        'setNavVisible',
        'setCurrMenuItem',
        'setLoggedInUser'
      ]),
      getAllStudyGroups () {
        api.getAllStudyGroups().then((res) => {
          this.allStudyGroups = res.data
        })
      },
      showCreateStudyGroupPage () {
        this.$router.push({path: '/createStudyGroup', query: {}})
      },
      showEditStudyGroupPage (groupId) {
        this.$router.push({path: '/editStudyGroup', query: {groupId: groupId}})
      },
      showStudyGroupInfoPage (groupId) {
        this.$router.push({path: '/studyGroupInfo', query: {groupId: groupId}})
      },
      containsUser (users, user) {
        return util.containsUser(users, user)
      },
      joinStudyGroup (groupId) {
        api.joinStudyGroup(groupId).then((res) => {
          if (res.data.success) {
            api.getLoggedInUser().then((res) => {
              this.setLoggedInUser(res.data)
              this.$router.push({path: '/studyGroupInfo', query: {groupId: groupId}})
            })
          } else {
            this.warn(res.data.msg)
          }
        })
      },
      gotoMyGroup () {
        let myGroupId = this.getLoggedInUser().studyGroups[0].id
        this.$router.push({path: '/studyGroupInfo', query: {groupId: myGroupId}})
      }
    }
  }
</script>
