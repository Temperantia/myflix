<template lang="pug">
v-container(v-if='preview', fluid)
  v-row.mt-5.title-border
    v-col(cols='10')
      h3 PREVIEW
    v-col(cols='2')
      h4.text-right {{ title.summary.type === "show" ? "TV SHOW" : "FILM" + " REVIEW" }}
  review(:review='review', :title='title', :preview='true')
  v-row
    v-col.text-right
      button.red-netflix--text.mr-5(@click='preview = false; edition = false') CANCEL
      button.button-action.mr-5.preview(@click='preview = false') BACK TO EDIT
      button.button-action(@click='submit') SUBMIT REVIEW
v-container(v-else-if='edition', fluid)
  v-row.mt-5.title-border
    v-col(cols='10')
      h3 {{ title.title.toUpperCase() }}
    v-col(cols='2')
      h4.text-right {{ title.summary.type === "show" ? "TV SHOW" : "FILM" + " REVIEW" }}
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
    v-col.text-right(offset='10' cols='2')
      button.red-netflix--text(@click='edition = false') CANCEL
  v-row.section-border.py-5
    v-col(cols='12')
      h4.mb-5 How would you rate this {{ title.summary.type === "show" ? "show" : "film" }} ?
    v-col(
      align='center',
      v-for='(rating, name) in review.ratings',
      cols='2',
      :key='name'
    )
      h3 {{ name.toUpperCase() }}
      card(:content='rating', :subtitle='$ratings[rating]')
      v-rating.pa-0(
        :value='review.ratings[name]',
        length='10',
        size='15',
        color='white',
        background-color='white',
        @input='(value) => { review.ratings[name] = value; }'
      )
  v-row.section-border.py-5
    v-col(cols='12')
      h4.mb-5 Write your review
    v-col(cols='12')
      textarea(v-model='review.content')
    v-col.text-right(cols='12')
      button.button-action.preview.mr-5(@click='preview = true') PREVIEW
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
v-container(v-else, fluid)
  v-row.mt-5.title-border
    v-col(cols='8')
      h3 "{{ title.title.toUpperCase() }}" REVIEWS
    v-col.text-right(cols='4')
      client-only
        button(v-if='$store.state.localStorage.connected', @click='edition = true') WRITE A REVIEW
        div(v-else) SIGN IN TO WRITE A REVIEW
  review(
    :review='review',
    :title='title',
    v-for='review in reviews',
    :key='review.id'
  )
</template>
<script>
export default {
  data: () => ({
    edition: false,
    preview: false,
    review: {
      content: '',
      episodes: 0,
      ratings: {
        Plot: 10,
        Visuals: 10,
        Sound: 10,
        Acting: 10,
        Enjoyment: 10,
        Overall: 10,
      },
    },
  }),
  methods: {
    updateEpisodes(event) {
      const value = event.target.value;
      if (value < 0) {
        this.review.episodes = 0;
      } else if (value > this.title.episodeCount) {
        this.review.episodes = this.title.episodeCount;
      }
    },
    submit() {
      if (
        this.review.content.length < 200 ||
        this.review.content.length > 1000
      ) {
        this.$toasted.error(
          'Your review needs between 200 and 1000 characters.'
        );
        return;
      }
      this.$createReview(
        this.title,
        this.review,
        this.$store.state.localStorage.user
      );

      this.preview = false;
      this.edition = false;
    },
  },
  computed: {
    title() {
      return this.$store.state.title.data;
    },
    reviews() {
      return this.$store.state.title.reviews;
    },
  },
};
</script>
<style lang="scss" scoped>
.section-border {
  border-bottom: 1px solid white;
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
.preview {
  color: $white-font;
  border: 1px solid $white-font;
}
textarea {
  background-color: $black-subheader;
  width: 100%;
  height: 200px;
  padding: 10px;
  border-radius: 5px;
  resize: none;
}
</style>
