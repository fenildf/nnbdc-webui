<template>
  <div class="container" v-shortkey="['enter']" @shortkey="register()">

    <group label-width="12em" title-color="#eee">
      <x-input title="Email: " placeholder="请输入邮箱地址, 邮箱将用作用户名" v-model="email" is-type="email"></x-input>
      <x-input title="密码: " placeholder="至少含6个字符" v-model="password" type="password" :min="6"></x-input>
      <x-input title="再输入一次密码:" v-model="password2" type="password" :min="6"></x-input>
      <x-input title="昵称:" v-model="nickName"></x-input>
    </group>

    <flexbox orient="horizontal">
      <flexbox-item>
        <x-button type="primary" @click.native="register()">注册</x-button>
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
  import {mapActions} from 'vuex'
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
        email: null,
        password: null,
        password2: null,
        nickName: null
      }
    },
    mounted () {
      this.setNavVisible(false)
    },
    methods: {
      cancel () {
        this.$router.push({path: '/', query: {}})
      },
      register () {
        api.register(this.email, this.password, this.password2, this.nickName).then((res) => {
          if (res.data.success) {
            this.$vux.toast.show({text: '注册成功'})
            this.$localStorage.set('rememberPwd', true)
            this.$localStorage.set('password', this.password)
            this.$localStorage.set('email', this.email)
            this.$router.push({path: '/', query: {}})
          } else {
            this.$vux.toast.show({type: 'warn', text: res.data.msg})
          }
        })
      },
      ...mapActions([
        'setNavVisible'
      ])
    }
  }
</script>
