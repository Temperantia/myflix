<template lang="pug">
client-only(v-if='profile')
  v-container(fluid)
    v-row.title-border
      v-col(cols='12', lg='6')
        h4 {{ profile.username.toUpperCase() }}'S FLIXLIST
      v-col.text-lg-right(cols='12', lg='6')
        a(@click='$router.push("/profile/" + profile.username)') BACK TO PROFILE
    v-row.border
      v-col.text-center(cols='6', lg='1')
        h5.white-font--text #
      v-col.text-center(cols='6', lg='1')
        h5.white-font--text BOX ART
      v-col.text-center(cols='6', lg='3')
        h5 TITLE
      v-col.text-center(cols='3', lg='1')
        h5 YEAR
      v-col.text-center(cols='3', lg='1')
        h5 RATING
      v-col.text-center(cols='6', lg='1')
        h5 SCORE
      v-col.text-center(cols='6', lg='2')
        h5 PROGRESS
    v-row(
      align='center',
      v-for='(element, index) in flixlist',
      :key='element.id',
      :class='{ odd: index % 2 === 0 }'
    )
      v-col.text-center(cols='6', lg='1')
        h4 {{ index + 1 }}
      v-col(cols='6', lg='1')
        img(
          :class='[borderColor(element.title.summary.type, element.status), "box-art"]',
          :src='element.title.tallBoxArt'
        )
      v-col(cols='6', lg='3') {{ element.title.title }}
      v-col.text-center(cols='3', lg='1') {{ element.title.releaseYear }}
      v-col.text-center(cols='3', lg='1') {{ element.title.maturity }}
      v-col.text-center(cols='6', lg='1') {{ element.score || "-" }}
      v-col.text-center(
        cols='6',
        lg='2',
        v-if='element.title.summary.type === "show"'
      )
        b(:class='textColor(element.title.summary.type, element.status)') {{ element.episodes }}
        span.white-font--text {{ " / " + element.title.episodeCount }}
</template>
<script lang='ts'>
import { Vue, Component, namespace } from 'nuxt-property-decorator';

const profileModule = namespace('profile');

@Component
export default class Flixlist extends Vue {
  @profileModule.State('profile') profile!: any;
  @profileModule.Getter('flixlist') flixlist!: any;
  @profileModule.Action('loadUsername') loadUsername!: any;

  created() {
    this.loadUsername(this.$route.params.username);
  }

  borderColor(status: string): string {
    if (status === 'Watching') {
      return 'green-watching--border';
    } else if (status === 'Completed') {
      return 'blue-completed--border';
    } else if (status === 'On-Hold') {
      return 'yellow-on-hold--border';
    } else if (status === 'Dropped') {
      return 'red-dropped--border';
    } else if (status === 'Save for Later') {
      return 'grey-save-for-later--border';
    }
    return '';
  }

  textColor(status: string): string {
    if (status === 'Watching') {
      return 'green-watching--text';
    } else if (status === 'Completed') {
      return 'blue-completed--text';
    } else if (status === 'On-Hold') {
      return 'yellow-on-hold--text';
    } else if (status === 'Dropped') {
      return 'red-dropped--text';
    } else if (status === 'Save for Later') {
      return 'grey-save-for-later--text';
    }
    return '';
  }
}
</script>
<style lang="scss" scoped>
.border {
  border-bottom: 1px solid $white-font;
}
.odd {
  background-color: $grey-flixlist;
}
.box-art {
  border-width: 3px;
  border-style: solid;
}
</style>
