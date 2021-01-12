<template lang="pug">
client-only(v-if='user')
  v-container(fluid)
    v-row.title-border
      v-col(cols='12', lg='6')
        h4 {{ user.username.toUpperCase() }}'S FLIXLIST
      v-col.text-lg-right(cols='12', lg='6')
        a(@click='$router.push("/profile/" + user.username)') BACK TO PROFILE
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
<script>
export default {
  //middleware: ['auth'],
  async asyncData({ route, $getUser, store }) {
    const username = route.params.username;
    const userOther = await $getUser(username);
    return { userOther };
  },
  computed: {
    user() {
      const username = this.$route.params.username;
      const userCurrent = this.$store.state.localStorage.user;
      let user;
      if (username === userCurrent.username) {
        user = userCurrent;
      } else {
        user = this.userOther;
      }
      return user;
    },
    flixlist() {
      return Object.values(this.user.flixlist)
        .filter((element) => element.status !== 'Unwatched')
        .sort((a, b) => (a.postedOn.seconds > b.postedOn.seconds ? -1 : 1));
    },
  },
  methods: {
    borderColor(type, status) {
      if (type === 'show') {
        if (status === 'Watching') {
          return 'green-watching--border';
        } else if (status === 'Completed') {
          return 'blue-completed--border';
        } else if (status === 'On-Hold') {
          return 'yellow-on-hold--border';
        } else if (status === 'Dropped') {
          return 'red-dropped--border';
        } else if (status === 'Plan to Watch') {
          return 'grey-plan-to-watch--border';
        }
      }
      if (status === 'Completed') {
        return 'blue-completed--border';
      } else if (status === 'Rewatched') {
        return 'yellow-on-hold--border';
      } else if (status === 'Unfinished') {
        return 'red-dropped--border';
      } else if (status === 'Plan to Watch') {
        return 'grey-plan-to-watch--border';
      }
    },
    textColor(type, status) {
      if (type === 'show') {
        if (status === 'Watching') {
          return 'green-watching--text';
        } else if (status === 'Completed') {
          return 'blue-completed--text';
        } else if (status === 'On-Hold') {
          return 'yellow-on-hold--text';
        } else if (status === 'Dropped') {
          return 'red-dropped--text';
        } else if (status === 'Plan to Watch') {
          return 'grey-plan-to-watch--text';
        }
      }
      if (status === 'Completed') {
        return 'blue-completed--text';
      } else if (status === 'Rewatched') {
        return 'yellow-on-hold--text';
      } else if (status === 'Unfinished') {
        return 'red-dropped--text';
      } else if (status === 'Plan to Watch') {
        return 'grey-plan-to-watch--text';
      }
    },
  },
};
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
