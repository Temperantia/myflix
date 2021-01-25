<template lang="pug">
v-app.app(app)
  v-container.pa-0.h-100(fluid)
    v-row.pa-0.h-100
      v-col.h-100(cols='12', md='7')
        v-container.h-100.d-flex.flex-column.justify-space-between(fluid)
          v-row
            v-col(cols='4', md='2')
              img(src='logo.png')
          v-row(align='center', justify='center')
            v-col(cols='10', md='8')
              h1.font-weight-bold All your favorite Netflix series and movies
              h2.mt-5 Catalog, share, suggest, review, and more all on MyFlix.
              .mt-10 Subscribe to our newsletter to receive updates on features, content releases, and site news.
              .d-flex.mt-5
                v-text-field.mr-5(
                  outlined,
                  dense,
                  color='red',
                  v-model='email',
                  label='Email',
                  :rules='[(v) => !!v || "Required", (v) => /.+@.+\..+/.test(v) || "E-mail must be valid"]',
                  required
                )
                v-btn.px-10(color='white', @click='$subscribe(email)')
                  .font-weight-bold.black--text SUBSCRIBE
          v-row(align='end')
            v-col
              p.white-font--text MyFlix is not endorsed, moderated, owned by or affiliated with Netflix or any of its partners in any capacity. The authors of this site also have no affiliation with Netflix. MyFlix is a unofficial fansite for Netflix. All promotional material including but not limited to trailers, images and videos are all copyright to their respective owners. Netflix is a registered trademark of Netflix, Inc.
      v-col.h-100(cols='12', md='5')
        v-container.h-100(fluid)
          v-row(:class='$vuetify.breakpoint.mdAndUp ? "h-33" : ""')
            v-col.pa-0(cols='12', md='4')
              img(src='/Layer 37.png')
            v-col.pa-0(cols='12', md='4')
              img(src='/Layer 30.png')
            v-col.pa-0(cols='12', md='4')
              img(src='/Layer 33.png')
          v-row(:class='$vuetify.breakpoint.mdAndUp ? "h-33" : ""')
            v-col.pa-0(cols='12', md='4')
              img(src='/Layer 32.png')
            v-col.pa-0(cols='12', md='4')
              img(src='/Layer 36.png')
            v-col.pa-0(cols='12', md='4')
              img(src='/Layer 31.png')
          v-row(:class='$vuetify.breakpoint.mdAndUp ? "h-33" : ""')
            v-col.pa-0(cols='12', md='4')
              img(src='/Layer 35.png')
            v-col.pa-0(cols='12', md='4')
              img(src='/Layer 34.png')
            v-col.pa-0(cols='12', md='4')
              img(src='/Layer 38.png')
</template>
<script>
export default {
  data: () => ({
    email: '',
  })
};
</script>
<style lang="scss" scoped>
.app {
  background-color: $black-body;
  height: 100vh;

  .h-100 {
    height: 100%;
  }

  .h-33 {
    height: 33.33%;
  }

  h1 {
    font-size: 60px;
    line-height: 70px;
  }

  p {
    font-size: 8px;
  }
}
</style>
