<template lang="pug">
nuxt-child
</template>
<script lang='ts'>
import { Vue, Component } from 'nuxt-property-decorator';

@Component({ layout: 'title' })
export default class Film extends Vue {}
</script>
