<template lang="pug">
v-container(fluid)
  v-row
    v-col
      nuxt-link(:to='typeRoute') {{ typeName + " " }}
      nuxt-link(:to='titleRoute') > {{ titleName + " " }}
      nuxt-link(:to='tabRoute') > {{ tabName }}
</template>

<script lang='ts'>
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator';

@Component
export default class Title extends Vue {
  @Prop({ type: String }) titleName!: string;
  typeRoute = '';
  titleRoute = '';
  tabRoute = '';
  typeName = '';
  tabName = '';

  created() {
    this.update();
  }

  update() {
    this.tabRoute = this.$route.path;
    const parts = this.tabRoute.split('/');
    this.typeRoute = '/' + parts[1];
    this.titleRoute = '/' + parts[1] + '/' + parts[2] + '/overview';
    this.typeName = parts[1] == 'tvshows' ? 'TV Shows' : 'Films';
    this.tabName = parts[3].charAt(0).toUpperCase() + parts[3].slice(1);
  }

  @Watch('$route')
  onRouteChanged() {
    this.update();
  }
}
</script>
<style>
.pa-2 {
  padding-top: 0;
  margin-top: 12px;
}
</style>
