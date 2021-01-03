<template lang="pug">
v-container.section-border(fluid)
  v-row(align='center')
    v-col( cols='2')
      img(:src='recommendation.similar.image')
    v-col(cols='10')
      h4.mb-5 {{ recommendation.similar.title }}
      p {{ recommendation.content }}
      div Recommended by
        span.red-netflix--text.ml-1 {{ recommendation.author.username }}
</template>
<script>
export default {
  props: ['recommendation'],
};
</script>
<style lang="scss" scoped>
.section-border {
  border-bottom: 1px solid $white-font;
}
</style>
