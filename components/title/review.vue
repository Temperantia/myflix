<template lang='pug'>
v-container(fluid, :id='"review-" + review.id')
  v-row.header-border
    v-col(lg='2')
      img(:src='image')
    v-col(cols='10', lg='7')
      client-only
        nuxt-link(:to='"/profile/" + profile.username')
          a.red-netflix--text {{ profile.username }}
      div(v-if='!preview')
        b {{ review.likes.length + " " }}
        span people found this review helpful
    v-col.text-lg-right(cols='12', lg='3')
      div {{ postedOn }}
      //-div(v-if='title.summary.type === "show"') {{ review.episodes }} of {{ title.episodeCount }} episodes seen
      div Overall Rating: {{ review.ratings.Overall }}
  v-row
    v-col(cols='12', lg='3')
      v-container(fluid)
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
      v-container(fluid)
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
      v-col(cols='9', lg='5', offset-lg='3')
        template(v-if='!preview && connected && !self')
          button.button-action.activated(
            v-if='!connected || review.likes.includes(id)',
            @click='unlike(review.id)'
          ) I found this review helpful
          button.button-action(v-else, @click='like(review.id)') I found this review helpful
      v-col.text-lg-right(cols='3', lg='4')
        span.white-font--text.click(
          @click='$copyText($config.baseUrl + $route.path + "#review-" + review.id); $toast.success("Copied to clipboard")'
        ) permalink
        span.white-font--text {{ " | " }}
        share(:url='$config.baseUrl + $route.path + "#review-" + review.id')
        template(v-if='connected && !self && !review.reports.includes(id)')
          span.white-font--text {{ " | " }}
          span.white-font--text.click(@click='overlay = true') report
  report(
    :display='overlay',
    type='review',
    :username='review.author.username',
    :title='review.title.title',
    :confirm='check',
    :cancel='() => (overlay = false)'
  )
</template>
<script lang='ts'>
import { Vue, Component, Prop, namespace } from 'nuxt-property-decorator';

const reviewsModule = namespace('reviews');
const localStorageModule = namespace('localStorage');
const profileModule = namespace('profile');

@Component
export default class Review extends Vue {
  @Prop({ type: Object }) review!: any;
  @Prop({ type: Object }) title!: any;
  @Prop({ type: Boolean }) preview!: boolean;

  @localStorageModule.State('user') user!: any;
  @localStorageModule.State('connected') connected!: boolean;
  @localStorageModule.Getter('id') id!: string;
  @profileModule.Getter('self') self!: boolean;
  @reviewsModule.Action('report') report!: any;
  @reviewsModule.Action('like') like!: any;
  @reviewsModule.Action('unlike') unlike!: any;

  expanded = false;
  overlay = false;

  get image() {
    return this.profile?.image ?? '/defaultUser.png';
  }

  get content() {
    return !this.expanded && this.review.content.length > 500
      ? this.review.content.substring(0, 500) + ' ...'
      : this.review.content;
  }

  get profile() {
    return this.preview ? this.user : this.review.author;
  }

  get postedOn() {
    return this.$moment(
      this.preview ? new Date() : new Date(this.review.postedOn.seconds * 1000)
    ).format('MMM D, yyyy');
  }

  check() {
    this.report(this.review.id);
    this.overlay = false;
  }
}
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
</style>
