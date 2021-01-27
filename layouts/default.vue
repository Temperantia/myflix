<template lang="pug">
v-app(app)
  v-container(fluid)
    v-row.pa-0.blackHeader(align='center')
      v-col.pr-0(cols='2', lg='1')
        nuxt-link(to='/')
          img(src='/logo.png')
      v-col(cols='9', offset-lg='3', lg='4')
        search(nav)
      template(v-if='$vuetify.breakpoint.mdAndUp')
        client-only
          v-col.d-flex.justify-end(md='4')
            v-menu(v-if='$store.state.localStorage.connected')
              template(v-slot:activator='{ on, attrs }')
                div(v-bind='attrs', v-on='on') {{ user.username }}
              v-list
                v-list-item(
                  v-for='item in items',
                  :key='item.name',
                  @click='item.hook'
                )
                  v-list-item-title {{ item.name }}
            div(v-else)
              nuxt-link(to='/sign-in')
                button.button.button-red.mr-5 SIGN IN
              nuxt-link(to='/register')
                button.button REGISTER
        v-col.subHeader
          span.px-5.text-center(
            v-for='tab of tabs',
            :key='tab.name',
            :class='{ "red-netflix--text": tab.route === currentTab, tab: true }',
            @click='tab.hook'
          ) {{ tab.name }}
        //-v-col.py-0.text-right
          a.mr-3(href='')
            img.logo-social(src='/facebook.png')
          a.mr-3(href='')
            img.logo-social(src='/twitter.png')
          a.mr-3(href='')
            img.logo-social(src='/rss.png')
      v-col.pl-0(v-else, cols='1')
        v-menu
          template(v-slot:activator='{ on, attrs }')
            v-btn(icon, v-bind='attrs', v-on='on')
              v-icon mdi-dots-vertical
          v-list
            v-list-item(
              v-for='item of itemsMobile',
              :key='item.name',
              @click='item.hook'
            )
              v-list-item-title(
                :class='{ "red-netflix--text": item.route === currentTab }'
              ) {{ item.name }}
  v-main.blackBody
    nuxt(v-if='!$slots.default')
    slot
  v-container.pa-0(fluid)
    footer
      .top
        v-row(align='center')
          //-v-col(cols='12', md='3', lg='2')
            nuxt-link(to='/faq')
              span FAQ
          //-v-col(cols='12', lg='2')
            span ADVERTISING
          //-v-col(cols='12', md='3', lg='2')
            nuxt-link(to='/privacy-policy')
              span PRIVACY POLICY
          //-v-col(cols='12', md='3', lg='2')
            nuxt-link(to='/terms-and-conditions')
              span TERMS &amp; CONDITIONS
          v-col(cols='12')
            ul
              li 
                nuxt-link(to='/faq')
                  span FAQ
              li 
                nuxt-link(to='/privacy-policy')
                  span PRIVACY POLICY
              li 
                nuxt-link(to='/terms-and-conditions')
                  span TERMS &amp; CONDITIONS
      .middle
        v-row(align='center')
          v-col.pa-5(cols='6', lg='1')
            img(src='/logo.png')
          v-col.pa-5(cols='6', lg='1')
            img(src='/inclusive.png')
          v-col(lg='10')
            p MyFlix is not endorsed, moderated, owned by or affiliated with Netflix or any of its partners in any capacity. The authors of this site also have no affiliation with Netflix. MyFlix is a unofficial fansite for Netflix. All promotional material including but not limited to trailers, images and videos are all copyright to their respective owners. Netflix is a registered trademark of Netflix, Inc.
        v-row.bottom
          v-col.pb-0(cols='12')
            p.mb-0.text-center All Rights Reserved. Copyright MyFlix {{ new Date().getFullYear() }}. MyFlix is a website of Inclusive Corp.
</template>
<script>
export default {
  data: () => ({
    currentTab: 'index',
    tabs: [],
    items: [],
    itemsMobileConnected: [],
    itemsMobileDisconnected: [],
  }),
  computed: {
    user() {
      return this.$store.state.localStorage.user;
    },
    itemsMobile() {
      return this.$store.getters['localStorage/CONNECTED']
        ? this.itemsMobileConnected
        : this.itemsMobileDisconnected;
    },
  },
  methods: {
    async signOut() {
      await this.$fire.auth.signOut();
      this.$store.commit('localStorage/USER_LOGOUT');
      this.$router.push('/');
    },
  },
  mounted() {
    if (this.$route.params.path) {
      this.currentTab = this.$route.params.path;
    } else {
      this.currentTab = this.$route.name;
    }
    this.tabs = [
      {
        name: 'HOME',
        route: 'index',
        hook: () => {
          this.$router.push({ name: 'index', params: { name: 'HOME' } });
        },
      },
      {
        name: 'FILMS',
        route: 'films',
        hook: () => {
          this.$router.push({ name: 'films', params: { name: 'FILMS' } });
        },
      },
      {
        name: 'TV SHOWS',
        route: 'tvshows',
        hook: () => {
          this.$router.push({ name: 'tvshows', params: { name: 'TV SHOWS' } });
        },
      },
      /*         {
          name: 'NEWS',
          route: 'news',
        }, */
      {
        name: 'NEW RELEASES',
        route: 'new-releases',
        hook: () => {
          this.$router.push({
            name: 'new-releases',
            params: { name: 'NEW RELEASES' },
          });
        },
      },
    ];
    this.items = [
      {
        name: 'PROFILE',
        hook: () => {
          this.$router.push(
            '/profile/' + this.$store.state.localStorage.user.username
          );
        },
      },
      {
        name: 'REVIEWS',
        hook: () => {
          this.$router.push(
            '/profile/' +
              this.$store.state.localStorage.user.username +
              '/reviews'
          );
        },
      },
      {
        name: 'SUGGESTIONS',
        hook: () => {
          this.$router.push(
            '/profile/' +
              this.$store.state.localStorage.user.username +
              '/suggestions'
          );
        },
      },
      {
        name: 'ACCOUNT SETTINGS',
        hook: () => {
          this.$router.push('/account-settings');
        },
      },
      {
        name: 'LOGOUT',
        hook: () => this.signOut(),
      },
    ];
    this.itemsMobileConnected = [...this.tabs, ...this.items];
    this.itemsMobileDisconnected = [
      ...this.tabs,
      ...[
        {
          name: 'SIGN IN',
          hook: () => {
            this.$router.push('/sign-in');
          },
        },
        {
          name: 'REGISTER',
          hook: () => {
            this.$router.push('/register');
          },
        },
      ],
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
  background-color: $black-header;
  //height: 60px;
}
.subHeader {
  background-color: $black-subheader;
  border-top: 3px solid $red-netflix;
  padding: 5px 20px;
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
footer {
  width: 100%;
  .top {
    padding: 10px 20px;

    background-color: $black-subheader;
    border-bottom: 2px solid $red-netflix;

    ul li {
      display: inline;
      list-style: none;
      margin-right: 60px;
    }
  }
  .middle {
    padding: 10px 20px;
    font-size: 12px;

    p {
      color: rgba(255,255,255,0.3);
    }

    .bottom {
      margin: 0px;
    }
  }
}
</style>
