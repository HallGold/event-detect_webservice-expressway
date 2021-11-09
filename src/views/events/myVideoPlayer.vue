<template>
  <div>
    <video-player class="video-player" :playsinline="true" :options="playerOptions"></video-player>
  </div>
</template>
<script>
export default {
  props:{
    src:{
      type:String,
      default:""
    },
  },
  data(){
    return{
      playerOptions: {
        techOrder: ["html5"],
        preload: "auto",
        sourceOrder: true,
        sources: [{
          type: "video/mp4",
          src:this.src
        }],
        aspectRatio: "16:9",
        height: 72,
        autoplay: false,
        controls: false,
        language: "zh-CN",
        fluid: true,
        notSupportedMessage: "此视频暂无法播放，请稍后再试"
      },
    }
  }
}
</script>
