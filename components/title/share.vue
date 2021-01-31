<template lang="pug">
v-menu
  template(v-slot:activator='{ on, attrs }')
    v-btn(v-if='isButton', color='black-search', v-bind='attrs', v-on='on')
      v-icon.mr-5 mdi-share-variant
      span Share this page
    span.white-font--text.click(v-else, v-bind='attrs', v-on='on') share
  v-list
    v-list-item
      share-network(network='twitter', :url='url', title='')
        .d-flex.align-center
          img.mr-5(src='/twitter-logo.png')
          span Twitter
    v-list-item
      share-network(network='reddit', :url='url', title='')
        .d-flex.align-center
          img.mr-5(src='/reddit-logo.png')
          span Reddit
    v-list-item
      share-network(network='facebook', :url='url', title='')
        .d-flex.align-center
          img.mr-5(src='/fb.png')
          span Facebook
</template>
<script>
export default {
  props: { isButton: Boolean, url: String },
};
</script>
<style lang="scss" scoped>
img {
  width: 30px;
}
</style>
