<template>
  <div style="padding:0px 8px;font-size:14px;">
    <div class="studyGroupNav">
      <x-button type="primary" @click.native="$router.push({path:'/studyGroupList'})">所有小组</x-button>
    </div>


    <div style="display:flex; justify-content: center; font-weight: bold; font-size: 2em; ">
      <div>{{studyGroup.groupName}}</div>
    </div>

    <div class="groupSummary">
      <div>
        排名:<strong v-if="studyGroup.groupSummary.groupOrder == 1000000">(暂无)</strong>
        <strong v-if="studyGroup.groupSummary.groupOrder != 1000000">{{studyGroup.groupSummary.groupOrder}}</strong>
        &nbsp;总分:<strong>{{studyGroup.groupSummary.groupScore}} </strong>&nbsp;打卡分:<strong>{{studyGroup.groupSummary.dakaScore}}
      </strong>&nbsp;游戏分:<strong>{{studyGroup.groupSummary.gameScore}}</strong>&nbsp;打卡率:<strong>{{studyGroup.groupSummary.dakaRatio * 100 | toFixed(2)}}% </strong>
        &nbsp;人数:<strong>{{studyGroup.groupSummary.memberCount}}</strong>&nbsp;创建者:<strong>{{studyGroup.creator.displayNickName}} </strong>
      </div>
      <div>
					<span>今日打卡人数:<strong>{{studyGroup.todaysDakaCount}}</strong>
					</span><span>&nbsp;&nbsp;今日打卡率:<strong>{{studyGroup.todaysDakaCount / studyGroup.users.length}}</strong>
					</span>
      </div>
      <span> 今日排名变化:
                    <span v-if="studyGroup.groupSummary.dayOrderRise == 0">无变化</span>
        <span v-if="studyGroup.groupSummary.dayOrderRise > 0">下降{{studyGroup.groupSummary.dayOrderRise}}</span>
        <span v-if="studyGroup.groupSummary.dayOrderRise < 0">上升{{studyGroup.groupSummary.dayOrderRise * (-1)}}</span>
				</span> <span> &nbsp;&nbsp;本周排名变化:
      <span v-if="studyGroup.groupSummary.weekOrderRise == 0">无变化</span>
      <span v-if="studyGroup.groupSummary.weekOrderRise > 0">下降{{studyGroup.groupSummary.weekOrderRise}}</span>
      <span v-if="studyGroup.groupSummary.weekOrderRise < 0">上升{{studyGroup.groupSummary.weekOrderRise * (-1)}}</span>

				</span> <span> &nbsp;&nbsp;本月排名变化:
      <span v-if="studyGroup.groupSummary.monthOrderRise == 0">无变化</span>
      <span v-if="studyGroup.groupSummary.monthOrderRise > 0">下降{{studyGroup.groupSummary.monthOrderRise}}</span>
      <span v-if="studyGroup.groupSummary.monthOrderRise < 0">上升{{studyGroup.groupSummary.monthOrderRise * (-1)}}</span>

				</span>
    </div>


    <div class="groupEvents">
      <div class="centerContainer"
           style="font-weight: bold; font-size: 1.5em;">小组动态
      </div>
      <table style="width:100%;">
        <tr>
          <th style="width: 40%; word-break: break-all;">
            标题
          </th>
          <th>
            发帖人
          </th>
          <th>
            更新时间
          </th>
          <th>
            回复/浏览
          </th>
          <th>
            操作
          </th>
        </tr>
        <tr v-for="post in studyGroup.studyGroupPosts">
          <td @click="showPostInfo(post.id)"
              style="width: 40%; word-break: break-all;">
            {{post.postTitle}}
          </td>
          <td @click="showPostInfo(post.id)">
            <img v-if="post.user.figureUrl" alt="QQ头像" style="height: 30px; width: 30px;" :src="post.user.figureUrl"/>
            {{post.user.displayNickName}}
          </td>
          <td @click="showPostInfo(post.id)">
            {{post.updateTime | formatLongDate("yyyy-MM-dd HH:mm")}}
          </td>
          <td @click="showPostInfo(post.id)">
            {{post.replyCount}}
            /
            {{post.browseCount}}
          </td>
          <td><span> <a
            href="javascript:;" @click="showPostInfo(post.id)">查看</a>
							</span>

            <span v-if="containsUser(studyGroup.managers, getLoggedInUser())">
                <a href="javascript:;" @click="deletePost(post.id)">删除</a>
									</span>
          </td>
        </tr>
      </table>

      <flexbox orient="horizontal" style="margin-top:24px;">
        <flexbox-item>
          <x-button type="primary" @click.native="createPost()">发帖</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="warn" @click.native="exitGroup()">退出小组</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="warn" v-if="studyGroup.creator.id==getLoggedInUser().id" @click.native="dismissGroup()">解散小组</x-button>
        </flexbox-item>
      </flexbox>
    </div>

    <div class="memberContribute">
      <div class="centerContainer" style="font-weight: bold;">组员贡献度</div>
      <table style="clear: both; width: 100%; table-layout: fixed;">
        <tr>
          <td style="width: 100px;">昵称</td>
          <td>等级</td>
          <td>积分</td>
          <td>打卡率</td>
          <td>今日打卡</td>
          <td v-if="containsUser(studyGroup.managers, getLoggedInUser())">
            操作
          </td>
        </tr>
        <tr v-for="member in studyGroup.users">
          <td>
            <img v-if="member.figureUrl" alt="QQ头像" style="height: 20px; width: 20px;" :src="member.figureUrl"/>
            {{member.displayNickName}}
            <span v-if="member.id==studyGroup.creator.id">(组长)</span>
            <span
              v-if="member.id != studyGroup.creator.id && containsUser(studyGroup.managers, member)">(管理员)</span>

          </td>
          <td :style="member.level.style">{{member.level.name}}</td>
          <td><strong>
            {{member.totalScore}}
          </strong>分
          </td>
          <td><strong>
            {{member.dakaRatio * 100 | toFixed(2)}}%
          </strong></td>
          <td>
            <span v-if="member.hasDakaToday" style="color: green;">已打卡</span>
            <span v-if="!member.hasDakaToday" style="color: red;">未打卡</span>
          </td>
          <td v-if="containsUser(studyGroup.managers, getLoggedInUser())">
            <span
              v-if="getLoggedInUser().id!=member.id && (!containsUser(studyGroup.managers, member||getLoggedInUser().id==studyGroup.creator.id))">
              <a href="javascript:;" onclick="kickoutUserFromGroup(studyGroup.id, member.id)">开除</a>
            </span>
            <span
              v-if="getLoggedInUser().id!=member.id && getLoggedInUser().id == studyGroup.creator.id && !containsUser(studyGroup.managers, member)">
              <a href="javascript:;" @click="addManager(studyGroup.id, member.id)">设为管理员</a>
            </span>
            <span
              v-if="getLoggedInUser().id!=member.id && getLoggedInUser().id == studyGroup.creator.id&& containsUser(studyGroup.managers, member)"> <a
              href="javascript:;"
              @click="deposeManager(studyGroup.id, member.id)">罢免管理员</a>
            </span>
          </td>
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

  @media only screen and (min-width: 651px) {
    .groupEvents {
      float: left;
      width: 56%;
      margin-top: 0.5em;
      background-color: #f9f9f9;
      padding: 0px;
    }

    .memberContribute {
      float: left;
      width: 38%;
      margin: 0.5em 0 0 24px;
      background-color: #f9f9f9;
      padding: 16px 8px;
    }
  }

  @media only screen and (max-width: 650px) {
    .groupEvents {
      float: left;
      width: 100%;
      margin-top: 0.5em;
    }

    .memberContribute {
      clear: both;
      width: 100%;
      margin-top: 0.5em;
      background-color: #eeeeee;
      padding: 8px;
    }
  }

  .groupSummary {
    margin-top: 0.5em;
  }

  table {
    background-color: #fff;
    padding: 8px;
    border-collapse: collapse;
  }

  th {
    background-color: #eee;
    padding: 8px;
  }

  td {
    padding: 8px;
  }

  tr {
    border-bottom: 1px solid #ccc;
  }

  a {
    text-decoration: none;
    font-size: 0.95em;
  }

  strong {
    color: olive;
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
        groupId: this.$route.query.groupId,
        studyGroup: {groupSummary: {}, creator: {}, users: []}
      }
    },
    components: {XButton, Flexbox, FlexboxItem},
    mounted () {
      this.setNavVisible(true)
      this.setCurrMenuItem('小组')
      this.getStudyGroupInfo()
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
      containsUser (users, user) {
        return util.containsUser(users, user)
      },
      getStudyGroupInfo () {
        api.getStudyGroupById(this.groupId).then((res) => {
          this.studyGroup = res.data
        })
      },
      createPost () {
        this.$router.push({path: '/createStudyGroupPost', query: {groupId: this.groupId}})
      },
      deletePost (postId) {
        api.deleteStudyGroupPost(postId).then((res) => {
          this.getStudyGroupInfo()
        })
      },
      showPostInfo (postId) {
        this.$router.push({path: '/studyGroupPostInfo', query: {postId: postId}})
      },
      exitGroup () {
        let that = this
        this.$vux.confirm.show({
          title: '确认',
          content: '确定要退出本小组吗？',
          onConfirm () {
            api.exitStudyGroup(that.groupId, that.getLoggedInUser().id).then((res) => {
              if (res.data.success) {
                api.getLoggedInUser().then((res) => {
                  that.setLoggedInUser(res.data)
                  that.$router.go(-1)
                })
              } else {
                that.warn(res.data.msg)
              }
            })
          }
        })
      },
      dismissGroup () {
        let that = this
        this.$vux.confirm.show({
          title: '确认',
          content: '确定要解散本小组吗？',
          onConfirm () {
            api.dismissStudyGroup(that.groupId, that.getLoggedInUser().id).then((res) => {
              if (res.data.success) {
                api.getLoggedInUser().then((res) => {
                  that.setLoggedInUser(res.data)
                  that.$router.go(-1)
                })
              } else {
                that.warn(res.data.msg)
              }
            })
          }
        })
      }
    }
  }

</script>
