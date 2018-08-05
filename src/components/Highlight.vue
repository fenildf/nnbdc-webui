<template>
  <div v-if="text!='' && text!=null">
    <span v-for="span in spans" :style="span.style">{{span.text}}&nbsp;</span>
  </div>
</template>
<style scoped>
  span {
    word-wrap: normal;
    display: inline-block;
  }
</style>
<script>
  export default{
    components: {},
    props: ['text', 'keyWords'],
    computed: {
      spans: function () {
        // 净化关键词，去掉英文字母和数字之外的字符。此外，如果关键词是一个词组，则将其拆分为每个单词作为一个关键词
        let keyWords = this.splitAndWidenKeyWords(this.keyWords)
        let words = this.text.split(' ')
        let spans = []
        for (let i = 0; i < words.length; i++) {
          let purifiedWord = this.purifyWord(words[i])
          let purifiedWord2 = purifiedWord.endsWith('.') ? purifiedWord.substr(0, purifiedWord.length - 1) : purifiedWord
          let style = this.isStrInArray(purifiedWord, keyWords) || this.isStrInArray(purifiedWord2, keyWords) ? 'color:blue;font-weight:bold; ' : ''
          spans.push({text: words[i], style: style})
        }
        return spans
      }
    },
    methods: {
      /**
       * 净化单词拼写，把非 数字/空格/字母 的字符去掉
       */
      purifyWord (spell) {
        return spell.split('').filter((element, index, array) => {
          return this.isStrInArray(element, [' ', '.', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'])
        }).join('')
      },
      isStrInArray (str, array) {
        for (let i = 0; i < array.length; i++) {
          if (str.toLowerCase() === array[i].toLowerCase()) {
            return true
          }
        }
        return false
      },
      widenWord (spell) { // 将单词泛化，比如work泛化为[worked,working]
        if (spell.endsWith('e')) {
          let part = spell.substr(0, spell.length - 1)
          return [spell, part + 'ing', spell + 's', spell + 'd', spell + 'n']
        } else if (spell.endsWith('s')) {
          return [spell, spell + 'ing', spell + 'es', spell + 'ed', spell + 'en']
        } else if (spell.endsWith('y')) {
          let part = spell.substr(0, spell.length - 1)
          return [spell, spell + 'ing', part + 'ies', part + 'ied']
        } else {
          return [spell, spell + 'ing', spell + 's', spell + 'ed']
        }
      },
      splitKeyWords (keyWords) { // 把以^分隔符隔开的多个关键词拆分为数组。（如果关键词是一个词组，则将其拆分为每个单词作为一个关键词）
        let words = []
        let rawWords = keyWords.split('^')
        for (let i = 0; i < rawWords.length; i++) {
          let parts = rawWords[i].split(' ')
          for (let j = 0; j < parts.length; j++) {
            words.push(parts[j])
          }
        }
        return words
      },
      splitAndWidenKeyWords (keyWords) { // 把以^分隔符隔开的多个关键词拆分, 并对每个关键词进行泛化(泛化前进行了净化)
        let allWidenWords = []
        let words = this.splitKeyWords(keyWords)
        for (let i = 0; i < words.length; i++) {
          let puriedWord = this.purifyWord(words[i])
          let widenWords = this.widenWord(puriedWord)
          for (let j = 0; j < widenWords.length; j++) {
            allWidenWords.push(widenWords[j])
          }
        }
        // console.log(allWidenWords)
        return allWidenWords
      }
    }
  }
</script>
