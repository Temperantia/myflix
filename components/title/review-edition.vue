<template lang="pug">
v-container(fluid)
  v-row.mt-5.title-border
    v-col(cols='12', lg='10')
      h3 {{ title.title.toUpperCase() }}
    v-col(cols='12', lg='2')
      h4.text-lg-right {{ title.summary.type === "show" ? "TV SHOW" : "FILM" + " REVIEW" }}
  v-row.section-border
    //-v-col(cols='10', v-if='title.summary.type === "show"')
      span.mr-2 At the time of writing this, how many episodes of {{ title.title }} have you seen?
      input.mr-2(
        type='number',
        v-model='review.episodes',
        @input='updateEpisodes'
      )
      button.red-netflix--text(@click='review.episodes = title.episodeCount') ALL
    //-v-col(offset='10', v-else)
    v-col.text-lg-right(cols='12', offset-lg='10', lg='2')
      button.red-netflix--text(@click='edition = false') CANCEL
  v-row.section-border.py-5
    v-col(cols='12')
      h4.mb-5 How would you rate this {{ title.summary.type === "show" ? "show" : "film" }} ?
    v-col(
      align='center',
      v-for='(rating, name) in review.ratings',
      cols='10',
      offset='1',
      lg='4',
      xl='2',
      :key='name'
    )
      h3 {{ name.toUpperCase() }}
      card(:content='rating', :subtitle='$ratings[rating]')
      v-rating.pa-0(
        v-if='name !== "Overall"',
        :value='rating',
        length='10',
        size='15',
        color='white',
        background-color='white',
        @input='(value) => updateRating(name, value)'
      )
  v-row.section-border.py-5
    v-col(cols='12')
      h4.mb-5 Write your review
    v-col(cols='12')
      textarea(v-model='review.content')
    v-col.text-center.text-lg-right(cols='12')
      button.button-action.preview.mr-lg-5(@click='preview = true') PREVIEW
      button.button-action(@click='submit') SUBMIT REVIEW
  v-row
    v-col
      h4.mb-5 Review Tips and Guidelines
      p
        .white-font--text - Don't steal anyone elses work, this review should be all in your own writing.
        .white-font--text - Don't include story summaries, users already have the synopsis written for them.
        .white-font--text - Be sure to tell us the reasons for WHY you liked or disliked this film/series.
        .white-font--text - Try your very best to not write any spoilers.
        .white-font--text - Don't comment on other reviews or reviewers, focus only on the film or series.
        .white-font--text - BBCode is disabled.
        .white-font--text - This review is public.
        .white-font--text.mt-5 Note: this area is only to be used for posting a review of the series after you have seen it. This is not discussion area.
</template>
<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class extends Vue {
  @Prop({ type: Object }) title!: any;
  @Prop({ type: Object }) review!: any;
  @Prop({ type: Function }) updateEpisodes!: any;
  @Prop({ type: Function }) updateRating!: any;
  @Prop({ type: Function }) submit!: any;
}
</script>
<style lang="scss" scoped>
textarea {
  background-color: $black-subheader;
  width: 100%;
  height: 200px;
  padding: 10px;
  border-radius: 5px;
  resize: none;
}
input {
  padding-left: 5px;
  color: white;
  border: 1px solid white;
  width: 50px;
  border-radius: 5px;
}
.button-action {
  width: 200px;
  padding: 5px 20px;
  border-radius: 5px;
  border: 1px solid white;
}
.section-border {
  border-bottom: 1px solid white;
}
</style>
