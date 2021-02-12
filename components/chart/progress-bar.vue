<template lang="pug">
div(style='height: 6px')
  div(
    :class='$statusColor(status)',
    :style='{ height: "5px", width: (episodes * 100) / episodeCount + "%" }'
  )
  div(
    :style='{ "background-color": "black", width: (episodes * 100) / episodeCount + "%", height: "1px" }'
  )
</template>
<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class ProgressBar extends Vue {
  @Prop({ type: String }) status!: string;
  @Prop() episodes!: number | string;
  @Prop({ type: Number }) episodeCount!: number;
}
</script>
