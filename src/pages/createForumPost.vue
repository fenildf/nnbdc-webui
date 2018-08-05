<template>
  <div>
    <div data-role="page" class="type-interior">
      <div data-role="content">
        <group label-width="5em" title-color="#00f">
          <x-input title="帖子标题: " placeholder="请输入帖子标题" v-model="postTitle" :max="100"></x-input>
          <x-textarea title="帖子内容:" placeholder="请输入帖子内容" v-model="postContent" :max="8000"
          ></x-textarea>
        </group>

        <div style="display:flex;justify-content: center; margin-top:16px;">
          <flexbox orient="horizontal" style="width:300px;">
            <flexbox-item>
              <x-button type="primary" @click.native="saveStudyGroupPost()">确定</x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button type="primary" @click.native="$router.go(-1)">取消</x-button>
            </flexbox-item>
          </flexbox>
        </div>
      </div>

    </div>
  </div>
</template>
<style scoped>

</style>
<script>
  import { mapActions } from 'vuex'
  import { XButton, XInput, XTextarea, Group, Flexbox, FlexboxItem } from 'vux'
  import api from './api'

  export default {
    data () {
      return {
        forumId: this.$route.query.forumId,
        postTitle: '',
        postContent: ''
      }
    },
    components: {XButton, XInput, XTextarea, Group, Flexbox, FlexboxItem},
    mounted () {
      this.setNavVisible(true)
      this.setCurrMenuItem('小组')
    },
    methods: {
      ...mapActions([
        'setNavVisible',
        'setCurrMenuItem'
      ]),
      saveStudyGroupPost () {
        api.createForumPost(this.forumId, this.postTitle, this.postContent).then((res) => {
          if (res.data.success) {
            this.info('发帖成功')
            this.$router.go(-1)
          } else {
            this.warn(res.data.msg)
          }
        })
      }
    }
  }
</script>
