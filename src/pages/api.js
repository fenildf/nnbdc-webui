import Vue from 'vue'

export default {
  serverAddr: 'http://www.nnbdc.com/service',
  // serverAddr: 'http://localhost:8181',
  updateWord (word) {
    return Vue.http.post(this.serverAddr + '/nnbdc-service/updateWord.do', word, {params: {}})
  },
  updateUserInfo (email, nickName, password, password2) {
    let params = {'email': email, 'nickName': nickName, 'password': password, 'password2': password2}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/updateUserInfo.do', {emulateJSON: true}, {params: params})
  },
  getGameHallData () {
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getGameHallData.do', {})
  },
  getUserPaihangDatas () {
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getUserPaihangData.do', {})
  },
  createForumPost (forumId, postTitle, postContent) {
    let params = {'forumId': forumId, 'postTitle': postTitle, 'postContent': postContent}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/createForumPost.do', {emulateJSON: true}, {params: params})
  },
  replyForumPost (postId, content) {
    let params = {'postId': postId, 'content': content}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/replyForumPost.do', {emulateJSON: true}, {params: params})
  },
  getForumPostById (postId) {
    let params = {'postId': postId}
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getForumPostById.do', {params: params})
  },
  getForumByName (name) {
    let params = {'name': name}
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getForumByName.do', {params: params})
  },
  getForumPosts (page, rows, sort, order) {
    let params = {'page': page, 'rows': rows, 'sort': sort, 'order': order}
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getForumPosts.do', {params: params})
  },
  dismissStudyGroup (groupId, userId) {
    let params = {'groupId': groupId, 'userId': userId}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/dismissStudyGroup.do', {emulateJSON: true}, {params: params})
  },
  joinStudyGroup (groupId) {
    let params = {'groupId': groupId}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/joinStudyGroup.do', {emulateJSON: true}, {params: params})
  },
  exitStudyGroup (groupId, userId) {
    let params = {'groupId': groupId, 'userId': userId}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/exitStudyGroup.do', {emulateJSON: true}, {params: params})
  },
  replyStudyGroupPost (postId, content) {
    let params = {'postId': postId, 'content': content}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/replyStudyGroupPost.do', {emulateJSON: true}, {params: params})
  },
  getStudyGroupPostById (postId) {
    let params = {'postId': postId}
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getStudyGroupPostById.do', {params: params})
  },
  deleteStudyGroupPost (postId) {
    let params = {'postId': postId}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/deleteStudyGroupPost.do', {emulateJSON: true}, {params: params})
  },
  createStudyGroupPost (groupId, postTitle, postContent) {
    let params = {'groupId': groupId, 'postTitle': postTitle, 'postContent': postContent}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/createStudyGroupPost.do', {emulateJSON: true}, {params: params})
  },
  editStudyGroup (groupId, groupName, groupTitle, groupRemark) {
    let params = {'groupId': groupId, 'groupName': groupName, 'groupTitle': groupTitle, 'groupRemark': groupRemark}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/editStudyGroup.do', {emulateJSON: true}, {params: params})
  },
  createStudyGroup (groupName, groupTitle, groupRemark) {
    let params = {'groupName': groupName, 'groupTitle': groupTitle, 'groupRemark': groupRemark}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/createStudyGroup.do', {emulateJSON: true}, {params: params})
  },
  getStudyGroupById (groupId) {
    let params = {'groupId': groupId}
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getStudyGroupById.do', {params: params})
  },
  getMyStudyGroups () {
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getMyStudyGroups.do', {})
  },
  getAllStudyGroups () {
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getAllStudyGroups.do', {})
  },
  getWordsList () {
    return Vue.http.get(this.serverAddr + '/nnbdc-service/words.json', {})
  },
  addRawWord (spell, addManner) {
    let params = {'spell': spell, 'addManner': addManner}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/addRawWord.do', {emulateJSON: true}, {params: params})
  },
  getRawWordsForAPage (pageNo, pageSize) {
    let params = {'pageNo': pageNo, 'pageSize': pageSize}
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getRawWordsForAPage.do', {params: params})
  },
  getDictWordsForAPage (dictId, pageNo, pageSize) {
    let params = {'dictId': dictId, 'pageNo': pageNo, 'pageSize': pageSize}
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getDictWordsForAPage.do', {params: params})
  },
  throwDiceAndSave () {
    return Vue.http.post(this.serverAddr + '/nnbdc-service/throwDiceAndSave.do', {emulateJSON: true}, {})
  },
  saveDakaRecord () {
    let params = {'text': '好好学习，天天向上'}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/saveDakaRecord.do', {emulateJSON: true}, {params: params})
  },
  getAnswerWrongWords () {
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getAnswerWrongWords.do', {})
  },
  getReviewWords () {
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getCurrentStageCache.do', {})
  },
  handShortDescChinese (chineseId) {
    let params = {'id': chineseId}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/handShortDescChinese.do', {emulateJSON: true}, {params: params})
  },
  footShortDescChinese (chineseId) {
    let params = {'id': chineseId}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/footShortDescChinese.do', {emulateJSON: true}, {params: params})
  },
  deleteShortDescChinese (chineseId) {
    let params = {'id': chineseId}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/deleteShortDescChinese.do', {emulateJSON: true}, {params: params})
  },
  getWordImages (wordId) {
    let params = {'wordId': wordId}
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getWordImages.do', {params: params})
  },
  deleteImage (imageId) {
    let params = {'id': imageId}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/deleteImage.do', {emulateJSON: true}, {params: params})
  },
  handImage (imageId) {
    let params = {'id': imageId}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/handImage.do', {emulateJSON: true}, {params: params})
  },
  footImage (imageId) {
    let params = {'id': imageId}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/footImage.do', {emulateJSON: true}, {params: params})
  },
  importFromDict (fromDictId, toDictId) {
    let params = {'fromDictId': fromDictId, 'toDictId': toDictId}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/importFromDict.do', {emulateJSON: true}, {params: params})
  },
  getAllSysDicts () {
    return Vue.http.get('/nnbdc-service/getAllSysDicts.do', {})
  },
  getShortDescChinesesOfWord (wordId) {
    let params = {'wordId': wordId}
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getShortDescChinesesOfWord.do', {params: params})
  },
  addWordToDict (dictId, wordId) {
    let params = {'dictId': dictId, 'wordId': wordId}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/addWordToDict.do', {emulateJSON: true}, {params: params})
  },
  saveWordShortDescChinese (wordId, chinese) {
    let params = {'wordId': wordId, 'chinese': chinese}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/saveWordShortDescChinese.do', {emulateJSON: true}, {params: params})
  },
  removeWordFromDict (dictId, wordId) {
    let params = {'wordId': wordId, 'dictId': dictId}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/removeWordFromDict.do', {emulateJSON: true}, {params: params})
  },
  searchWord (spell) {
    let params = {'word': spell}
    return Vue.http.get(this.serverAddr + '/nnbdc-service/searchWord.do', {params: params})
  },
  handInfo (infoId) {
    let params = {'infoID': infoId, 'voteType': 'hand'}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/voteInfo.do', {emulateJSON: true}, {params: params})
  },
  footInfo (infoId) {
    let params = {'infoID': infoId, 'voteType': 'foot'}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/voteInfo.do', {emulateJSON: true}, {params: params})
  },
  deleteInfo (infoId) {
    return Vue.http.post(this.serverAddr + '/nnbdc-service/deleteInfo.do', {emulateJSON: true}, {params: {infoId: infoId}})
  },
  saveErrorReport (spell, content) {
    let params = {'word': spell, 'content': content}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/saveErrorReport.do', {emulateJSON: true}, {params: params})
  },
  addWordAdditionalInfo (wordId, content) {
    let params = {'wordId': wordId, 'content': content}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/addWordAdditionalInfo.do', {emulateJSON: true}, {params: params})
  },
  getLastUpdateLog: function () {
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getLastUpdateLog.do', {})
  },
  login: function (email, password) {
    let params = {'email': email, 'password': password, 'loginType': 'EMAIL'}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/login.do', {emulateJSON: true}, {params: params})
  },
  fastTry: function () {
    let params = {'userName': 'guest', 'password': '', 'loginType': 'USER_NAME'}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/login.do', {emulateJSON: true}, {params: params})
  },
  logout: function () {
    return Vue.http.post(this.serverAddr + '/nnbdc-service/logout.do', {emulateJSON: true}, {params: null})
  },
  register: function (email, password, password2, nickName) {
    let params = {'email': email, 'password': password, 'password2': password2, 'nickName': nickName}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/register.do', {emulateJSON: true}, {params: params})
  },
  getStudyProgress: function () {
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getStudyProgress.do', {})
  },
  getSnapshotDailys: function () {
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getUserSnapshotDailys.do', {})
  },
  getPwd: function (email) {
    let params = {'email': email}
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getPwd.do', {params: params})
  },
  getLoggedInUser: function () {
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getLoggedInUser.do', {})
  },
  privilegeSelectedDict: function (dictName) {
    let params = {'dictName': dictName}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/privilegeSelectedDict.do', {emulateJSON: true}, {params: params})
  },
  deleteSelectedDict: function (dictName) {
    let params = {'dictName': dictName}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/deleteSelectedDict.do', {emulateJSON: true}, {params: params})
  },
  saveWordsPerDay: function (wordsPerday) {
    let params = {'wordsPerDay': wordsPerday}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/saveWordsPerDay.do', {emulateJSON: true}, {params: params})
  },
  getDictGroups: function () {
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getDictGroups.do', {})
  },
  getSelectedDicts: function () {
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getSelectedDicts.do', {})
  },
  getMyDicts: function () {
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getMyDicts.do', {})
  },
  getWordById: function (wordId) {
    let params = {'id': wordId}
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getWordById.do', {params: params})
  },
  getAdditionalInfosOfWord: function (spell) {
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getAdditionalInfosOfWord.do', {params: {spell: spell}})
  },
  getSentenceById: function (sentenceId) {
    let params = {'sentenceId': sentenceId}
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getSentence.do', {params: params})
  },
  getDictById: function (dictId) {
    let params = {'dictId': dictId}
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getDictById.do', {params: params})
  },
  getWordBySpell: function (spell) {
    let params = {'spell': spell}
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getWordBySpell.do', {params: params})
  },
  saveSelectedDicts: function (selectedDicts) {
    let dictIds = []
    for (let i = 0; i < selectedDicts.length; i++) {
      let dict = selectedDicts[i].dict
      dictIds.push(dict.id)
    }
    let params = {'selectedDicts': dictIds}
    return Vue.http.post(this.serverAddr + '/nnbdc-service/saveConfig.do', {emulateJSON: true}, {params: params})
  },
  prepareForStudy: function () {
    return Vue.http.post(this.serverAddr + '/nnbdc-service/prepareForStudy.do', {emulateJSON: true}, {})
  },
  continueAtTheLastBreakPoint: function () {
    return Vue.http.post(this.serverAddr + '/nnbdc-service/continueAtTheLastBreakPoint.do', {emulateJSON: true}, {})
  },
  getNextWord: function (isAnswerCorrect, isWordMastered, shouldEnterNextStage) {
    let params = {
      'isAnswerCorrect': isAnswerCorrect,
      'isWordMastered': isWordMastered,
      'shouldEnterNextStage': shouldEnterNextStage
    }
    return Vue.http.get(this.serverAddr + '/nnbdc-service/getWords.do', {params: params})
  },
  saveUserConfig: function (autoPlayWord, autoPlaySentence, showAnswersDirectly) {
    let params = {
      'autoPlayWord': autoPlayWord,
      'autoPlaySentence': autoPlaySentence,
      'showAnswersDirectly': showAnswersDirectly
    }
    return Vue.http.post(this.serverAddr + '/nnbdc-service/saveUserConfig.do', {emulateJSON: true}, {params: params})
  },
  clearWordsOfDict: function (dictId) {
    return Vue.http.post(this.serverAddr + '/nnbdc-service/clearWordsOfDict.do', {emulateJSON: true}, {params: {dictId: dictId}})
  },
  finishEditingDict: function (dictId) {
    return Vue.http.post(this.serverAddr + '/nnbdc-service/finishEditingDict.do', {emulateJSON: true}, {params: {dictId: dictId}})
  },
  createNewDict: function (dictName) {
    return Vue.http.post(this.serverAddr + '/nnbdc-service/createNewDict.do', {emulateJSON: true}, {params: {dictName: dictName}})
  },
  saveSentenceDiyItem: function (sentenceId, chinese) {
    return Vue.http.post(this.serverAddr + '/nnbdc-service/saveSentenceDiyItem.do',
      {emulateJSON: true}, {params: {sentenceId: sentenceId, chinese: chinese}})
  },
  handSentenceDiyItem: function (diyItemId) {
    return Vue.http.post(this.serverAddr + '/nnbdc-service/handSentenceDiyItem.do',
      {emulateJSON: true}, {params: {id: diyItemId}})
  },
  footSentenceDiyItem: function (diyItemId) {
    return Vue.http.post(this.serverAddr + '/nnbdc-service/footSentenceDiyItem.do',
      {emulateJSON: true}, {params: {id: diyItemId}})
  },
  deleteSentenceDiyItem: function (diyItemId) {
    return Vue.http.post(this.serverAddr + '/nnbdc-service/deleteSentenceDiyItem.do',
      {emulateJSON: true}, {params: {id: diyItemId}})
  }
}
