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

  .content {
    position: absolute;
  }
}
</style>
