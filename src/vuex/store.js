import Vue from 'vue'
import Vuex from 'vuex'
import bdc from './modules/bdc'
import middlewares from './middlewares'

const debug = process.env.NODE_ENV !== 'production'
Vue.use(Vuex)
Vue.config.debug = debug

export default new Vuex.Store({
  modules: {
    baobei
  },
  strict: debug,
  middlewares
})
