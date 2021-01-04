<template lang="pug">
v-app
  v-container.pa-0(fluid)
    .blackHeader(app)
      v-row(align='center')
        v-col(cols='1')
          img(src='/logo.png')
        v-col(offset='3', cols='4')
          search(:nav='true')
        client-only
          v-col.d-flex.justify-end(cols='4')
            div(v-if='!$store.state.localStorage.connected')
              nuxt-link(to='/sign-in')
                button.button.button-red.mr-5 SIGN IN
              nuxt-link(to='/register')
                button.button REGISTER
            div(v-else)
              v-menu
                template(v-slot:activator='{ on, attrs }')
                  div(v-bind='attrs', v-on='on') {{ user.username || "username" }}
                v-list
                  v-list-item(
                    v-for='(item, index) in items',
                    :key='index',
                    @click='item.hook'
                  )
                    v-list-item-title {{ item.title }}
    .subHeader
      v-row(align='center', style='height: inherit')
        v-col.pa-0.text-center(
          cols='1',
          v-for='tab of tabs',
          :key='tab.name',
        )
          h3(
            :class='{ "tab-active": tab.route === currentTab, tab: true }',
            @click='go(tab.name, tab.route)'
          )
            | {{ tab.name }}
        v-col.text-right(offset='7', cols='2')
          a.mr-3(href='')
            img.logo-social(src='/facebook.png')
          a.mr-3(href='')
            img.logo-social(src='/twitter.png')
          a.mr-3(href='')
            img.logo-social(src='/rss.png')
  v-main.blackBody(app)
    nuxt(v-if='!$slots.default')
    slot
  v-container.pa-0(fluid)
    footer
      .top
        v-row(align='center')
          v-col(cols='1')
            h4 CONTACT
          v-col(cols='1')
            h4 ADVERTISING
          v-col(cols='1')
            h4 PRIVACY POLICY
          v-col(cols='1')
            h4 TERMS & CONDITIONS
          v-col(cols='1')
            h4 EN
      .middle
        v-row(align='center')
          v-col(cols='1')
            img(src='/myflix.png')
          v-col(cols='1')
            img(src='/inclusive.png')
          v-col(cols='10')
            p MyFlix is not endorsed, moderated, owned by or affiliated with Netflix or any of its partners in any capacity. The authors of this site also have no affiliation with Netflix. MyFlix is a unofficial fansite for Netflix. All promotional material including but not limited to trailers, images and videos are all copyright to their respective owners. Netflix is a registered trademark of Netflix, Inc.
        v-row.bottom(justify='center')
          p All Rights Reserved. Copyright MyFlix {{ new Date().getFullYear() }}. MyFlix is a website of Inclusive Corp.
</template>

<script>
export default {
  data: () => ({
    currentTab: 'index',
    tabs: [
      {
        name: 'HOME',
        route: 'index',
      },
      {
        name: 'FILMS',
        route: 'films',
      },
      {
        name: 'TV SHOWS',
        route: 'tvshows',
      },
      /*         {
          name: 'NEWS',
          route: 'news',
        }, */
      {
        name: 'NEW RELEASES',
        route: 'new-releases',
      },
    ],
    items: [],
  }),
  computed: {
    user() {
      return this.$store.state.localStorage.user;
    },
  },
  methods: {
    go(path, name) {
      this.$router.push({ name, params: { name } });
    },
    async signOut() {
      await this.$fire.auth.signOut();
      this.$store.commit('localStorage/USER_LOGOUT');
      this.$router.push('/');
    },
  },
  created() {
    if (this.$route.params.path) {
      this.currentTab = this.$route.params.path;
    } else {
      this.currentTab = this.$route.name;
    }
    this.items = [
      {
        title: 'PROFILE',
        hook: () => {
          this.$router.push(
            '/profile/' + this.$store.state.localStorage.user.username
          );
        },
      },
      {
        title: 'REVIEWS',
        hook: () => {
          this.$router.push('/reviews');
        },
      },
      {
        title: 'RECOMMENDATIONS',
        hook: () => {
          this.$router.push('/recommendations');
        },
      },
      {
        title: 'ACCOUNT SETTINGS',
        hook: () => {
          this.$router.push('/account-settings');
        },
      },
      {
        title: 'LOGOUT',
        hook: () => this.signOut(),
      },
    ];
  },
  watch: {
    $route() {
      if (this.$route.params.path) {
        this.currentTab = this.$route.params.path;
      } else {
        this.currentTab = this.$route.matched[0].name;
      }
    },
  },
};
</script>

<style lang="scss">
.blackHeader {
  display: flex;
  align-items: center;
  padding: 5px 15px;
  height: 60px;
}
.subHeader {
  background-color: $black-subheader;
  border-top: 3px solid $red-netflix;
  height: 60px;
  width: 100%;
}
.v-toolbar__content {
  height: 100px;
}
.logo-social {
  width: 25px;
  height: 25px;
}
.v-list-item {
  cursor: pointer;
}
.tab {
  cursor: pointer;
}
.tab-active {
  color: $red-netflix;
}
footer {
  width: 100%;
  .top {
    padding: 10px 20px;

    background-color: $black-subheader;
    border-bottom: 3px solid $red-netflix;
  }
  .middle {
    padding: 10px 20px;
  }
}
</style>
