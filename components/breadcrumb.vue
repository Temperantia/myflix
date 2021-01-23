<template lang="pug">
.pa-2
  nuxt-link(:to='typeRoute') {{ typeName + " " }}
  nuxt-link(:to='titleRoute') > {{ titleName + " " }}
  nuxt-link(:to='tabRoute') > {{ tabName }}
</template>

<script>
export default {
  props: ['titleName'],
  data: () => ({
    typeRoute: '',
    titleRoute: '',
    tabRoute: '',
    typeName: '',
    tabName: '',
  }),
  methods: {
    update() {
      this.tabRoute = this.$route.path;
      const parts = this.tabRoute.split('/');
      this.typeRoute = '/' + parts[1];
      this.titleRoute = '/' + parts[1] + '/' + parts[2] + '/overview';
      this.typeName = parts[1] == 'tvshows' ? 'TV Shows' : 'Films';
      this.tabName = parts[3].charAt(0).toUpperCase() + parts[3].slice(1);
    },
  },
  created() {
    this.update();
  },
  watch: {
    $route() {
      this.update();
    },
  },
};
</script>
<style>
.pa-2 {
  padding-top: 0;
  margin-top: 12px;
}
</style>