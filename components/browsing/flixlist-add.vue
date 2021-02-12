<template lang="pug">
.click(v-if='flixlist[t.id]', @click='removeFromFlixlist(t.id)')
  v-icon.mr-2 mdi-minus
  span Remove from Flixlist
.click(v-else, @click='addToFlixlist(t)')
  v-icon.mr-2 mdi-plus
  span Add to Flixlist
</template>
<script lang="ts">
import { Vue, Component, namespace, Prop } from 'nuxt-property-decorator';

const localStorageModule = namespace('localStorage');
const browseModule = namespace('browse');

@Component
export default class PopularTop extends Vue {
  @Prop({ type: Object }) title!: any;
  @Prop({ type: Number }) id!: number;
  @browseModule.State('titles') titles!: any;
  @localStorageModule.Getter('flixlist') flixlist!: any;
  @localStorageModule.Action('addToFlixlist') addToFlixlist!: Function;
  @localStorageModule.Action('removeFromFlixlist')
  removeFromFlixlist!: Function;
  t: any;

  created() {
    if (this.id) {
      this.t = this.titles.find((title: any) => title.id === String(this.id));
    } else {
      this.t = this.title;
    }
  }
}
</script>
