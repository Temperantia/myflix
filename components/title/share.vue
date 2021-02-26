<template lang="pug">
v-menu
  template(v-slot:activator='{ on, attrs }')
    v-btn(v-if='isButton', color='black-search', v-bind='attrs', v-on='on')
      v-icon.mr-5 mdi-share-variant
      span Share this page
    span.white-font--text.click(v-else, v-bind='attrs', v-on='on') share
  v-list
    v-list-item
      share-network(
        network='twitter',
        :url='url',
        :title='titleTwitter',
        :hashtags='hashtags'
      )
        .d-flex.align-center
          img.mr-5(src='/twitter-logo.png')
          span Twitter
    v-list-item
      share-network(network='reddit', :url='url', :title='titleReddit')
        .d-flex.align-center
          img.mr-5(src='/reddit-logo.png')
          span Reddit
    v-list-item
      share-network(
        network='facebook',
        :url='url',
        :title='titleFacebook',
        :description='descriptionFacebook'
      )
        .d-flex.align-center
          img.mr-5(src='/fb.png')
          span Facebook
</template>
<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class Share extends Vue {
  @Prop({ type: Boolean }) isButton!: boolean;
  @Prop({ type: String }) url!: string;
  @Prop({ type: String, default: '' }) titleTwitter!: string;
  @Prop({ type: String, default: '' }) titleReddit!: string;
  @Prop({ type: String, default: '' }) titleFacebook!: string;
  @Prop({ type: String, default: '' }) descriptionFacebook!: string;
  @Prop({ type: String, default: '' }) hashtags!: string;
}
</script>
<style lang="scss" scoped>
img {
  width: 30px;
}
</style>
