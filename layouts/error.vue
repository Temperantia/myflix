<template>
  <v-app dark>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ error }}
    </h1>
    <NuxtLink to="/"> Home page </NuxtLink>
  </v-app>
</template>
<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component({ layout: 'empty' })
export default class Error extends Vue {
  @Prop({ type: Object, default: null }) error: any;
  pageNotFound = '404 Not Found';
  otherError = 'An error occurred';

  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title,
    };
  }
}
</script>
<style scoped>
h1 {
  font-size: 20px;
}
</style>
