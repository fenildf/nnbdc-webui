import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  isNavVisible: false,
  loggedInUser: {},
  currMenuItem: '进度',
  onlineUserCount: 0, // socket server在线用户数量
  isConnectedToSocketServer: false,
  isUserReportedToSocketServer: false,
  newMsgCount: 0,
  msgs: [],
  forbiddenPopupDetailForAllWords: false, // 禁止弹出所有单词的详情
  forbiddenWordForDetail: '' // 要禁止弹出详情的那个单词
}

const mutations = {
  setNavVisible (state, visible) {
    state.isNavVisible = visible
  },
  setLoggedInUser (state, user) {
    state.loggedInUser = user
  },
  setCurrMenuItem (state, menuItem) {
    state.currMenuItem = menuItem
  },
  setForbiddenPopupDetailForAllWords (state, forbiddenPopupDetailForAllWords) {
    state.forbiddenPopupDetailForAllWords = forbiddenPopupDetailForAllWords
  },
  setForbiddenWordForDetail (state, forbiddenWordForDetail) {
    state.forbiddenWordForDetail = forbiddenWordForDetail
  },
  setIsUserReportedToSocketServer (state, value) {
    state.isUserReportedToSocketServer = value
  },
  setIsConnectedToSocketServer (state, value) {
    state.isConnectedToSocketServer = value
  },
  setOnlineUserCount (state, value) {
    state.onlineUserCount = value
  },
  addNewMsg (state, msg) {
    if (state.msgs.length === 10) {
      let removedMsg = state.msgs.splice(0, 1)
      if (!removedMsg.viewed) {
        state.newMsgCount--
      }
    }
    msg.time = new Date()
    state.msgs.push(msg)
    state.newMsgCount++
  },
  setMsgsAsViewed (state) {
    for (let i = 0; i < state.msgs.length; i++) {
      state.msgs[i].viewed = true
    }
    state.newMsgCount = 0
  }
}

const actions = {
  setNavVisible: ({commit}, visible) => commit('setNavVisible', visible),
  setLoggedInUser: ({commit}, user) => commit('setLoggedInUser', user),
  setCurrMenuItem: ({commit}, menuItem) => commit('setCurrMenuItem', menuItem),
  setForbiddenPopupDetailForAllWords: ({commit}, forbiddenPopupDetailForAllWords) => commit('setForbiddenPopupDetailForAllWords', forbiddenPopupDetailForAllWords),
  setForbiddenWordForDetail: ({commit}, forbiddenWordForDetail) => commit('setForbiddenWordForDetail', forbiddenWordForDetail),
  setIsUserReportedToSocketServer: ({commit}, value) => commit('setIsUserReportedToSocketServer', value),
  setIsConnectedToSocketServer: ({commit}, value) => commit('setIsConnectedToSocketServer', value),
  setOnlineUserCount: ({commit}, value) => commit('setOnlineUserCount', value),
  addNewMsg: ({commit}, msg) => commit('addNewMsg', msg),
  setMsgsAsViewed: ({commit}) => commit('setMsgsAsViewed')
}

const getters = {
  getLoggedInUser: state => state.loggedInUser,
  isNavVisible: state => state.isNavVisible,
  getCurrMenuItem: state => state.currMenuItem,
  isUserReportedToSocketServer: state => state.isUserReportedToSocketServer,
  isConnectedToSocketServer: state => state.isConnectedToSocketServer,
  getOnlineUserCount: state => state.onlineUserCount,
  getNewMsgCount: state => state.newMsgCount,
  getMsgs: stage => state.msgs,

  /**
   * 是否禁止所有单词的详情弹出框？
   * @param state
   */
  getForbiddenPopupDetailForAllWords: state => state.forbiddenPopupDetailForAllWords,

  /**
   * 禁止弹出详情的那个单词
   * @param stage
   */
  getForbiddenWordForDetail: stage => state.forbiddenWordForDetail
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})

