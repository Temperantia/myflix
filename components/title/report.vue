<template lang="pug">
v-overlay(:value='display', opacity='0.7', dark)
  v-container.px-10.py-5.report(fluid)
    v-row
      v-col.title-border REPORT ABUSE
    v-row
      v-col
        p Please use this report feature to notify an administrator or moderator of any nudity, excessive profanity or anything you feel that exceeds a PG-13 rating. A moderator will review it and take action as necessary.
        p
          b Do not use this feature to report grievances, a disagreement is not a valid reason.
          br
          b Do not use this feature to report bugs/errors. {{ " " }}
          span Please send us an email at {{ " " }}
          a.red-netflix--text(href='mailto:support@my-flix.net') support@my-flix.net {{ " " }}
          span if you would like to report mistakes or errors concerning the website or its content.
        p Report Summary:
        p
          span You are reporting {{ " " }}
          nuxt-link(:to='"/profile/" + username')
            b.red-netflix--text {{ username }}
          span 's {{ type }} of {{ title }}
    v-row
      v-col(cols='12', lg='3')
        button.w-100.px-5.py-2.border(@click='confirm') SUBMIT REPORT
      v-col(cols='12', lg='3')
        button.w-100.px-5.py-2.border.white-font--border.white-font--text(
          @click='cancel'
        ) CANCEL
</template>
<script>
export default {
  props: ['username', 'display', 'type', 'title', 'confirm', 'cancel'],
};
</script>
<style lang="scss" scoped>
.report {
  background-color: $black-body;
}
</style>
