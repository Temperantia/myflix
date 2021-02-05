<template lang="pug">
DefaultLayout
  profile-edition(v-if='edition')
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
  @profileModule.State('edition') edition!: boolean;
}
</script>
