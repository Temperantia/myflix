<template lang="pug">
.score
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
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    position: absolute;
  }
}
</style>
