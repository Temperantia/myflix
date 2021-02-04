<template lang="pug">
nuxt-child
</template>
<script lang='ts'>
import { Vue, Component, namespace } from 'nuxt-property-decorator';

const titleModule = namespace('title');

@Component({ layout: 'title' })
export default class Show extends Vue {
  @titleModule.Action('id') getTitle!: any;

  created() {
    this.getTitle(this.$route.params.id);
  }
}
</script>
