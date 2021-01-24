<template lang="pug">
v-menu
  template(v-slot:activator='{ on, attrs }')
    v-btn(color='black-search', v-bind='attrs', v-on='on')
      v-icon.mr-5 mdi-share-variant
      span Share this page
  v-list
    v-list-item
      share-network(
        network='twitter',
        :url='"https://my-flix.net" + $route.path',
        title=''
      )
        .d-flex.align-center
          img.mr-5(src='/twitter-logo.png')
          span Twitter
    v-list-item
      share-network(
        network='reddit',
        :url='"https://my-flix.net" + $route.path',
        title=''
      )
        .d-flex.align-center
          img.mr-5(src='/reddit-logo.png')
          span Reddit
    v-list-item
      share-network(
        network='facebook',
        :url='"https://my-flix.net" + $route.path',
        title=''
      )
        .d-flex.align-center
          img.mr-5(src='/fb.png')
          span Facebook
</template>
<style lang="scss" scoped>
img {
  width: 30px;
}
</style>
