<template>
  <div>
    <div data-role="page" class="type-interior">
      <div data-role="content">
        <group label-width="5em" title-color="#00f">
          <x-input title="小组名称: " placeholder="请输入小组名称" v-model="groupName" :max="20"></x-input>
          <x-input title="战斗口号: " placeholder="请输入战斗口号" v-model="groupTitle" :max="100"></x-input>
          <x-textarea title="战斗宣言:" placeholder="请输入战斗宣言" v-model="groupRemark" :max="8000"
          ></x-textarea>
        </group>

        <div class="centerContainer">
          <div class="okcancel">
            <x-button type="primary" @click.native="saveStudyGroup()">确定</x-button>
            <x-button type="primary" @click.native="$router.go(-1)">取消</x-button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
<style scoped>

</style>
<script>
  import { mapActions } from 'vuex'
  import { XButton, XInput, XTextarea, Group } from 'vux'
  import api from './api'

  export default {
    data () {
      return {
        groupId: this.$route.query.groupId,
        groupName: '',
        groupTitle: '',
        groupRemark: ''
      }
    },
    components: {XButton, XInput, XTextarea, Group},
    mounted () {
      this.setNavVisible(true)
      this.setCurrMenuItem('小组')
      this.getStudyGroupInfo()
    },
    methods: {
      ...mapActions([
        'setNavVisible',
        'setCurrMenuItem'
      ]),
      saveStudyGroup () {
        api.editStudyGroup(this.groupId, this.groupName, this.groupTitle, this.groupRemark).then((res) => {
          if (res.data.success) {
            this.info('小组修改成功')
            this.$router.go(-1)
          } else {
            this.warn(res.data.msg)
          }
        })
      },
      getStudyGroupInfo () {
        api.getStudyGroupById(this.groupId).then((res) => {
          let group = res.data
          this.groupName = group.groupName
          this.groupTitle = group.groupTitle
          this.groupRemark = group.groupRemark
        })
      }
    }
  }
</script>
