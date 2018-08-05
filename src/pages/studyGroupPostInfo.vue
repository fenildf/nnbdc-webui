<template>
  <div>
    <div class="post">
      <div class="userInfo">
        <img v-if="post.user.figureUrl" alt="QQ头像" style="height: 30px; width: 30px;"
             :src="post.user.figureUrl"/>

        <div class="nickName">{{post.user.displayNickName}}
        </div>

        <div>
          等级:
          {{post.user.level.name}}
        </div>
        <div>
          积分: <strong>{{post.user.totalScore}} </strong>
        </div>
        <div>
          打卡率: <strong>{{post.user.dakaRatio*100|toFixed(2)}}% </strong>
        </div>
      </div>
      <div class="postContent">
        <div style="font-weight: bold;">
          <h3>
            {{post.postTitle}}
          </h3>
        </div>
        <div style="margin-top: 1em;" v-html="post.postContent">
        </div>
        <div class="createTime">
          发表于：
          {{post.createTime | formatLongDate("MM/dd HH:mm")}}
        </div>
        <div class="btnArea">
          <div v-if="containsUser(post.studyGroup.managers, getLoggedInUser())" id="showDetail"
               @click="deletePost(post.id)" class="btn"
               style="width: 60%;">删除整个帖子
          </div>
        </div>
      </div>
    </div>

    <div v-for="reply in post.studyGroupPostReplies" class="post">
      <div class="userInfo">
        <img v-if="reply.user.figureUrl" alt="QQ头像" style="height: 30px; width: 30px;"
             :src="reply.user.figureUrl"/>

        <div class="nickName">
          {{reply.user.displayNickName}}
        </div>

        <div>
          等级:
          {{reply.user.level.name}}
        </div>
        <div>
          积分: <strong>{{reply.user.totalScore}} </strong>
        </div>
        <div>
          打卡率: <strong>{{reply.user.dakaRatio*100|toFixed(2)}}% </strong>
        </div>

      </div>
      <div class="postContent">
        <div v-html="reply.content">
        </div>
        <div class="createTime">
          发表于：
          {{reply.createTime | formatLongDate("MM-dd HH:mm")}}
        </div>
        <div class="btnArea">
          <div v-if="containsUser(post.studyGroup.managers, getLoggedInUser())" id="showDetail"
               @click="deleteReply(reply.id)"
               class="btn" style="width: 60%;">删除回复
          </div>
        </div>
      </div>
    </div>

    <div class="replyArea">
      <x-textarea v-model="replyContent" title="回复内容" placeholder="请输入回复内容" :max="8000"
                  style="border:1px solid #ddd;"></x-textarea>

      <div style="display:flex; justify-content: center">
        <div style="float: left; width: 8em;">
          <x-button type="primary" @click.native="saveReply()">提交</x-button>
        </div>
        <div style="float: left; width: 8em; margin-left: 0.5em;">
          <x-button type="primary" @click.native="$router.go(-1)">返回小组</x-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  @media only screen and (max-width: 650px) {
    .nickName {
      display: block;
    }
  }

  @media only screen and (min-width: 651px) {
    .nickName {
      display: inline-block;
    }
  }

  .createTime {
    margin-top: 0.5em;
    color: gray;
    font-size: small;
  }

  .replyArea {
    clear: left;
    padding-top: 1em;
  }

  .btnArea {
    float: right;
    width: 20%;
  }

  .btn {
    float: right;
    background-color: lightgreen;
    text-align: center;
    padding: 1em 0 1em 0;
    display: inline-block;
    margin-left: 1%;
  }

  .btn:hover {
    background-color: lightblue;
  }

  .post {
    width: 100%;
    margin-bottom: .5em;
    padding: 16px;
    position: relative;
    overflow: auto;
    display: flex;
    align-content: stretch;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
  }

  .userInfo {
    padding: 4px;
    width: 150px;
  }

  .postContent {
    flex-grow: 1;
    height: 100%;
    box-sizing: border-box;
    padding: 16px;
    background-color: #F5F5F5;
    border: solid 1px #E3E3E3;
    border-radius: 3px;
    font-size: 14px
  }
</style>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import { XButton, XInput, XTextarea, Group, Flexbox, FlexboxItem } from 'vux'
  import api from './api'
  import util from './util'

  export default {
    data () {
      return {
        post: {user: {level: {}}, studyGroup: {}},
        replyContent: ''
      }
    },
    components: {XButton, XInput, XTextarea, Group, Flexbox, FlexboxItem},
    mounted () {
      this.setNavVisible(true)
      this.setCurrMenuItem('小组')

      this.getPostInfo()
    },
    methods: {
      ...mapActions([
        'setNavVisible',
        'setCurrMenuItem'
      ]),
      ...mapGetters([
        'getLoggedInUser'
      ]),
      saveStudyGroupPost () {
        api.createStudyGroupPost(this.groupId, this.postTitle, this.postContent).then((res) => {
          if (res.data.success) {
            this.info('发帖成功')
            this.$router.go(-1)
          } else {
            this.warn(res.data.msg)
          }
        })
      },
      containsUser (users, user) {
        return util.containsUser(users, user)
      },
      getPostInfo () {
        api.getStudyGroupPostById(this.$route.query.postId).then((res) => {
          this.post = res.data
        })
      },
      saveReply () {
        if (!this.replyContent) {
          this.warn('回复内容不能为空')
          return
        }
        api.replyStudyGroupPost(this.post.id, this.replyContent).then((res) => {
          if (res.data.success) {
            this.info('回复成功')
            this.replyContent = ''
            this.getPostInfo()
          } else {
            this.warn(res.data.msg)
          }
        })
      }
    }
  }
</script>
