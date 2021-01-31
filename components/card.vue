<template lang="pug">
.score.d-flex.align-center.justify-center
  img(src='/Layer 25.png')
  .content.text-center
    h2(v-if='title') {{ title }}
    h1 {{ content }}
    h4 {{ subtitle }}
</template>
<script>
export default {
  props: ['title', 'content', 'subtitle'],
};
</script>
<style lang="scss" scoped>
.score {
  position: relative;

  img {
    height: 130px;
    width: 233px;
    object-fit: cover;
  }

  .content {
    position: absolute;

    h1 {
      font-size: 46px;
      font-weight: 900;
      line-height: 50px;
    }
    h2 {
      font-size: 20px;
      font-weight: 400
    }
    h4 {
      font-size: 16px;
      font-weight: 300
    }
  }
}
</style>
