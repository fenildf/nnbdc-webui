<template>
  <div class="container" v-shortkey="['enter']" @shortkey="getPwd()">

    <group label-width="12em" title-color="#eee">
      <x-input title="Email: " placeholder="请输入邮箱地址，密码将发送到该邮箱" v-model="email" is-type="email"></x-input>
    </group>

    <flexbox orient="horizontal">
      <flexbox-item>
        <x-button type="primary" @click.native="getPwd()">确定</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button type="warn" @click.native="cancel()">取消</x-button>
      </flexbox-item>
    </flexbox>
  </div>
</template>
<style scoped>
  @media only screen and (min-width: 651px) {
    .container {
      width: 50%;
      margin: auto;
    }
  }
</style>
<script>
  import {
    FlexboxItem,
    Flexbox,
    XInput,
    XButton,
    Group
  } from 'vux'
  import api from './api'
  export default{
    components: {
      Group,
      XInput,
      XButton,
      Flexbox,
      FlexboxItem
    },
    data () {
      return {
        email: null
      }
    },
    mounted () {
      this.$emit('hideNav')
    },
    methods: {
      cancel () {
        ``
      },
      getPwd () {
        this.$vux.loading.show({
          text: '正在为您找回密码，请稍候 ...'
        })
        api.getPwd(this.email).then((res) => {
          this.$vux.loading.hide()
          if (res.data.success) {
            this.$vux.toast.show({text: '密码已发送到：' + res.data.msg + '，请查收 ', time: 5000})
            this.$router.push({path: '/', query: {}})
          } else {
            this.$vux.toast.show({type: 'warn', text: res.data.msg})
          }
        })
      }
    }
  }
</script>
