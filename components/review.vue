<template lang='pug'>
v-container(fluid)
  v-row.header-border
    v-col(lg='2')
      img(:src='user && user.image ? user.image : "/defaultUser.png"')
    v-col(cols='10', lg='7')
      client-only
        nuxt-link(:to='"/profile/" + user.username')
          a.red-netflix--text {{ user.username }}
      div(v-if='!preview')
        b {{ review.likes.length + " " }}
        span people found this review helpful
    v-col.text-lg-right(cols='12', lg='3')
      div {{ postedOn }}
      //-div(v-if='title.summary.type === "show"') {{ review.episodes }} of {{ title.episodeCount }} episodes seen
      div Overall Rating: {{ review.ratings.Overall }}
  v-row
    v-col(cols='12', lg='3')
      .ratings.pa-1
        .black-subheader.d-flex.justify-space-between
          span.px-3.py-1 Overall
          span.px-3.py-1 {{ review.ratings.Overall }}
        .d-flex.justify-space-between(
          v-for='(rating, name) in review.ratings',
          :key='name'
        )
          span.px-3.py-1 {{ name }}
          span.px-3.py-1 {{ rating }}
    v-col(cols='12', lg='9')
      p(v-html='content')
      span.red-netflix--text.click.ml-1(
        v-if='content.length > 500 && expanded',
        @click='expanded = false'
      ) show less
      span.red-netflix--text.click.ml-1(
        v-else-if='content.length > 500',
        @click='expanded = true'
      ) show more
  client-only
    v-row.section-border
      v-col(cols='9', lg='7', offset-lg='3')
        template(v-if='!preview && !$store.getters["profile/SELF"]')
          button.button-action.activated(
            v-if='!$store.getters["localStorage/CONNECTED"] || review.likes.includes($store.getters["localStorage/USER"].id)',
            @click='$unlike(review.id)'
          ) I found this review helpful
          button.button-action(v-else, @click='$like(review.id)') I found this review helpful
      v-col.text-lg-right(cols='3', lg='2')
        //-span.small-action.click permalink
        //-span.small-action {{ " | " }}
        span.small-action.click(
          v-if='$store.state.localStorage.connected && !$store.getters["profile/SELF"] && !review.reports.includes($store.state.localStorage.user.id)',
          @click='overlay = true'
        ) report
  report(
    :display='overlay',
    type='review',
    :username='review.author.username',
    :title='review.title.title',
    :confirm='report',
    :cancel='() => (overlay = false)'
  )
</template>
<script>
export default {
  data: () => ({
    expanded: false,
    overlay: false,
  }),
  props: ['review', 'title', 'preview'],
  computed: {
    content() {
      return !this.expanded && this.review.content.length > 500
        ? this.review.content.substring(0, 500) + ' ...'
        : this.review.content;
    },
    user() {
      return this.preview
        ? this.$store.state.localStorage.user
        : this.review.author;
    },
    postedOn() {
      return this.$moment(
        this.preview ? new Date() : new Date(this.review.postedOn.seconds)
      ).format('MMM D, yyyy');
    },
  },
  methods: {
    report() {
      this.$report('reviews', this.review.id);
      this.overlay = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.ratings {
  border: 1px solid $black-subheader;
}

.button-action {
  padding: 5px 20px;
  border-radius: 5px;
  border: 1px solid white;
}

.activated {
  background-color: white;
  color: $grey-button;
}
.header-border {
  border-bottom: 1px solid $white-font;
}

.section-border {
  border-bottom: 1px solid white;
}

.small-action {
  color: $white-font;
}

.click {
  cursor: pointer;
}
</style>
