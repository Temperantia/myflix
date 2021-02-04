<template lang="pug">
DefaultLayout
  profile-edition(v-if='edition', :user='user', :save='save')
  v-container(v-else, fluid)
    v-row
      profile-information
      nuxt
</template>
<script lang='ts'>
import { Vue, Component, namespace } from 'nuxt-property-decorator';
import DefaultLayout from '~/layouts/default.vue';

const profileModule = namespace('profile');

@Component({ components: { DefaultLayout } })
export default class Profile extends Vue {
  edition = false;
  @profileModule.Action('update') update!: any;

  async save(
    copy: any,
    passwordNew: string,
    passwordCurrent: string,
    email: string,
    username: string
  ) {
    if (
      await this.update(
        copy,
        passwordNew,
        passwordCurrent,
        email,
        username
      )
    ) {
      this.edition = false;
    }
  }

  created() {
    this.$nuxt.$on('edit', (edition: boolean) => {
      this.edition = edition;
    });
  }

  beforeDestroy() {
    this.$nuxt.$off('edit');
  }
}
</script>
