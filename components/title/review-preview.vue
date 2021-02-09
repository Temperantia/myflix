<template lang="pug">
v-container(fluid)
  v-row.title-border
    v-col(cols='12', lg='10')
      h3 PREVIEW
    v-col.text-lg-right(cols='12', lg='2')
      h4 {{ title.summary.type === "show" ? "TV SHOW" : "FILM" + " REVIEW" }}
  v-row
    v-col
      review(:review='review', :title='title', preview)
  v-row
    v-col.text-center.text-lg-right
      v-container(fluid)
        button.red-netflix--text.mr-lg-5(
          @click='$emit("preview", false); $emit("cancel")'
        ) CANCEL
        button.button-action.mr-lg-5.preview(@click='$emit("preview", false)') BACK TO EDIT
        button.button-action(@click='submit') SUBMIT REVIEW
</template>
<script lang='ts'>
import { Vue, Component, Prop, namespace } from 'nuxt-property-decorator';

const titleModule = namespace('title');

@Component
export default class ReviewPreview extends Vue {
  @Prop({ type: Object }) review!: any;
  @Prop({ type: Function }) submit!: any;

  @titleModule.State('title') title!: any;
}
</script>
<style lang="scss" scoped>
.button-action {
  width: 200px;
  padding: 5px 20px;
  border-radius: 5px;
  border: 1px solid white;
}
.preview {
  color: $white-font;
  border: 1px solid $white-font;
}
</style>
