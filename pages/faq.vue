<template lang="pug">
v-container(fluid)
  v-row
    v-col
      h2 FAQ
  v-row
    v-col(cols='12', lg='6')
      .title-border.mb-5 CONTENT REQUEST
      p We currently have a wide range of shows and movies but we plan to add more content depending on our user requests.
      client-only
        template(v-if='submitted || $globals.contentRequests.includes(id)')
          p
            i.grey--text Thank you for requesting us to add your country. We will do our best to access your demand shortly.
        template(v-else)
          p You can request us to add content from your country:
          v-select(
            :items='countries',
            v-model='country',
            outlined,
            dense,
            label='Request Form'
          )
          button.button.button-red(
            @click='$requestContent(country); submitted = true'
          ) SUBMIT
    v-col(cols='12', lg='6')
      .title-border.mb-5 SUGGESTIONS, NEW FEATURES, OR OTHER INQUIRIES
      p MYFLIX team welcomes constructive ideas or improvements.
       p
        a(
          href='https://pmfsurvey.com/g/3215', 
          target="_blank"
        )
          span.red-netflix--text.text-decoration-underline {{ "MAKE A FEEDBACK ON MYFLIX HERE" }}
  
      p
        span {{ "You can also contact us with the following email for other inquiries or business related matters." }}
      p
        a(mailto='support@my-flix.net')
          span.red-netflix--text.text-decoration-underline {{ "support@my-flix.net" }}
    v-row
    v-col(cols='12', lg='6')
      .title-border.mb-5 REPORT A BUG
      p
        span {{ "Report a bug through " }}
        a(
          href='https://airtable.com/embed/shrPDSbVeF4A9bUOK?backgroundColor=pink',
          target="_blank"
        )
          span.red-netflix--text.text-decoration-underline {{ "this link" }}
</template>
<script lang='ts'>
import countries from 'i18n-iso-countries';
import locale from 'i18n-iso-countries/langs/en.json';
import { Vue, Component, namespace } from 'nuxt-property-decorator';

countries.registerLocale(locale);
const localStorageModule = namespace('localStorage');

@Component
export default class Faq extends Vue {
  submitted = false;
  country = 'UNITED STATES OF AMERICA';
  countries = Object.values(
    countries.getNames('en', { select: 'official' })
  ).map((country) => country.toUpperCase());
  @localStorageModule.Getter('id') id!: any;
}
</script>
