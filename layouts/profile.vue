<template lang="pug">
DefaultLayout
  profile-edition(v-if='edition', :user='user', :save='save')
  v-container(v-else, fluid)
    v-row
      profile-information(:user='user', :tvShows='tvShows', :films='films')
      nuxt
</template>
<script>
import DefaultLayout from '~/layouts/default.vue';
export default {
  components: { DefaultLayout },
  data: () => ({
    edition: false,
  }),
  methods: {
    async save(copy, passwordNew, passwordCurrent, email, username) {
      if (
        await this.$updateUser(
          copy,
          passwordNew,
          passwordCurrent,
          email,
          username
        )
      ) {
        this.edition = false;
      }
    },
  },
  created() {
    this.$nuxt.$on('edit', (edition) => {
      this.edition = edition;
    });
  },
  beforeDestroy() {
    this.$nuxt.$off('edit');
  },
  computed: {
    user() {
      return this.$store.getters['profile/PROFILE'];
    },
    tvShows() {
      return this.$store.getters['profile/TVSHOWS'];
    },
    films() {
      return this.$store.getters['profile/FILMS'];
    },
  },
};
</script>
