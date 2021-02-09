<template lang="pug">
video-player(v-if='title && title.trailer', :src='title.trailer')
</template>
<script lang="ts">
import { Vue, Component, namespace } from 'nuxt-property-decorator';
import VideoPlayer from 'nuxt-video-player';

const titleModule = namespace('title');

import '~/node_modules/nuxt-video-player/src/assets/css/main.css';

@Component({ components: { VideoPlayer } })
export default class Media extends Vue {
  @titleModule.State('title') title!: any;
}
</script>
