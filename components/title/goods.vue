<template lang="pug">
v-container(fluid)
  v-row.title-border
    v-col(cols='12', lg='8')
      h3 {{ title.title.toUpperCase() + " RELATED GOODS" }}
    v-col.text-lg-right(cols='12', lg='4')
      span.white-font--text VIA AMAZON
  v-row
    v-col
      v-container(fluid)
        p.red-netflix--text This feature is currently being tested. We are trying to improve your ads experience and we will tend to give you better suggestions.
  #ad
</template>
<script lang='ts'>
import { Vue, Component, namespace } from 'nuxt-property-decorator';

const titleModule = namespace('title');

@Component
export default class Goods extends Vue {
  @titleModule.State('title') title!: any;
  config: any = {
    amzn_assoc_placement: 'adunit0',
    amzn_assoc_tracking_id: 'myflixamzaff-20',
    amzn_assoc_ad_mode: 'search',
    amzn_assoc_ad_type: 'smart',
    amzn_assoc_marketplace: 'amazon',
    amzn_assoc_region: 'US',
    amzn_assoc_default_category: 'All',
    amzn_assoc_linkid: '77ee2a4d0f2e4f62306e1dd7680fcf68',
    amzn_assoc_rows: '2',
    amzn_assoc_search_bar: 'false',
    amzn_assoc_title: 'Shop Related Products',
  };

  mounted() {
    const config = document.createElement('script');
    config.innerHTML = '';
    for (const key in this.config) {
      config.innerHTML += key + '="' + this.config[key] + '";';
    }
    config.innerHTML +=
      'amzn_assoc_default_search_phrase = "netflix ' + this.title.title + '";';

    document.getElementById('ad')?.appendChild(config);

    this.$loadAd('#ad');
    const checkExist = setInterval(() => {
      const elements: any = document.getElementsByClassName(
        'amzn-native-product'
      );
      if (elements.length) {
        for (const element of elements) {
          element.style =
            'background-color: ' +
            this.$vuetify.theme.themes.dark.blackBody +
            ';';
        }
        clearInterval(checkExist);
      }
    }, 100);
  }
}
</script>
<style lang="scss" >
::v-deep .amzn-native-product {
  background-color: $black-body;
  height: 250px;
}

.amzn-native-product {
  background-color: $black-body;
}
</style>
