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


        <div style="display:flex;justify-content: center;margin-top:16px;">
          <flexbox orient="horizontal" style="width:300px;">
            <flexbox-item>
              <x-button type="primary" @click.native="createStudyGroup()">确定</x-button>
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
        groupName: '',
        groupTitle: '',
        groupRemark: ''
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
      createStudyGroup () {
        api.createStudyGroup(this.groupName, this.groupTitle, this.groupRemark).then((res) => {
          if (res.data.success) {
            this.info('小组创建成功')
            this.$router.go(-1)
          } else {
            this.warn(res.data.msg)
          }
        })
      }
    }
  }
</script>
