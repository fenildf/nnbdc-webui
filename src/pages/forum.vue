<template>
  <div >
    <div class="posts" style="background-color: #f9f9f9; width: 90%; margin-left: 5%;">
      <table style="width:100%;font-size: 14px; table-layout:fixed">
        <tr>
          <th style="width: 50%; word-break: break-all;">标题</th>
          <th style="width: 15%">发帖人</th>
          <th>更新时间</th>
          <th>回复/浏览</th>
          <th>操作</th>
        </tr>
        <tr v-for="(post,i) in posts" :class="i%2?'odd':'even'">
          <td @click="showPostInfo(post.id);"
              style="width: 40%; word-break: break-all;">{{post.postTitle}}
          </td>
          <td @click="showPostInfo(post.id)"><img v-if="post.user.figureUrl"
                                                  alt="QQ头像" style="height: 30px; width: 30px;"
                                                  :src="post.user.figureUrl"/> {{post.user.displayNickName}}
          </td>
          <td @click="showPostInfo(post.id)">{{post.updateTime | formatLongDate('yyyy-MM-dd HH:mm')}}</td>
          <td @click="showPostInfo(post.id)">{{post.replyCount}}/{{post.browseCount}}</td>
          <td><span> <a
            href="javascript:;" @click="showPostInfo(post.id)">查看</a>
							</span>
            <span v-if="containsUser(forum.managers, getLoggedInUser())"> <a href="javascript:;"
                                                                             @click="deletePost(post.id)">删除</a>
									</span>
          </td>
        </tr>
      </table>
      <mo-paging style="float:right; margin:3px 0 0 0;"
                 :page-index="currentPage"
                 :total="total"
                 :page-size="pageSize"
                 @change="pageChange">
      </mo-paging>

      <x-button type="primary" @click.native="createPost()" style="width:100px">发帖</x-button>


    </div>
  </div>
</template>
<style scoped>
  @media only screen and (min-width: 651px) {
    .posts {
      float: left;
      width: 100%;
      border-radius: 3px;
    }
  }

  @media only screen and (max-width: 650px) {
    .posts {
      float: left;
      width: 100%;
    }
  }

  .groupSummary {
    margin-top: 0.5em;
  }

  a {
    text-decoration: none;
    font-size: 0.95em;
  }

  table {
    border-collapse: collapse;
    border: none;
  }

  th {
    padding: 8px;
    background-color: #335588;
    color: #fff;
    text-align: left;
  }

  td {
    padding: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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


</style>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import { XButton, Flexbox, FlexboxItem } from 'vux'
  import api from './api'
  import util from './util'
  import MoPaging from '../components/paging.vue'

  export default {
    data () {
      return {
        pageSize: 20, // 每页显示20条数据
        currentPage: 1, // 当前页码
        total: 0, // 总记录数
        forum: {},
        posts: []
      }
    },
    components: {XButton, Flexbox, FlexboxItem, MoPaging},
    mounted () {
      this.setNavVisible(true)
      this.setCurrMenuItem('论坛')
      this.getForumInfo()
      this.getForumPostsForAPage()
    },
    methods: {
      ...mapGetters([
        'getLoggedInUser'
      ]),
      ...mapActions([
        'setNavVisible',
        'setCurrMenuItem'
      ]),
      containsUser (users, user) {
        return util.containsUser(users, user)
      },
      getForumInfo () {
        api.getForumByName('总论坛').then((res) => {
          this.forum = res.data
        })
      },
      getForumPostsForAPage () {
        api.getForumPosts(this.currentPage, this.pageSize, 'updateTime', 'desc').then((res) => {
          this.total = res.data.total
          this.posts = res.data.rows
        })
      },
      createPost () {
        this.$router.push({path: '/createForumPost', query: {forumId: this.forum.id}})
      },
      deletePost (postId) {
        api.deleteStudyGroupPost(postId).then((res) => {
          this.getStudyGroupInfo()
        })
      },
      showPostInfo (postId) {
        this.$router.push({path: '/forumPostInfo', query: {postId: postId}})
      },
      pageChange (page) {
        this.currentPage = page
        this.getForumPostsForAPage()
      }
    }
  }

</script>
