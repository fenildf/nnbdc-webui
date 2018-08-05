<template>
  <div class="progressBar" :style="{height:height}">
    <div class="base">
      <div class="bar" :style="{width:(progress==null?0:progress)*100/max+'%'}"></div>
    </div>
    <div class="progresstext" :style="{fontSize:fontSize, height:height, lineHeight:height}">
        <span>{{progress==null?0:progress}}/{{max}}
         ({{(progress==null?0:progress)*100/max | toFixed(precision)}}%)
        </span>
    </div>
  </div>
</template>
<style scoped>
  .progressBar {
    magin: 0px;
    padding: 0px;
    position: relative;
    display: inline-block;
    width: 100%;
    background-color: transparent
  }

  .progressBar .base {
    position: absolute;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: transparent;
    border: 1px solid #7F8CC1;
  }

  .progressBar .bar {
    float: left;
    height: 100%;
    background-color: #7F8CC1
  }

  .progresstext {
    position: absolute;
    width: 100%;
    font-size: small;
    text-align: center;
  }

  .progresstext span {
    background-color: transparent;
  }
</style>
<script>
  export default{
    data () {
      return {}
    },
    components: {},
    props: ['max', 'progress', 'height', 'fontSize', 'precision']
  }
</script>
