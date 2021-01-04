<template lang="pug">
v-container(fluid, style='margin: 0 20px')
  v-row
    v-col(cols='7')
      h1.title-border TOP UPCOMING PREMIERES OF {{ new Date().getFullYear() }}
      h2.subtitle.pa-5 {{ $dateFns.format(new Date(), "MMMM").toUpperCase() }}
    v-col(cols='5')
  v-row
    v-col
</template>
<script>
export default {
};
</script>
