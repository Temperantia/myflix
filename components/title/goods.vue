<template lang="pug">
v-container(fluid, v-if='title')
  v-row
    v-col(cols='12', md='2')
      img(src='/giftcard.png')
    v-col(cols='12', md='3')
      h2 Pay for your Netflix or give as a gift.
      p.mt-3.pl-3.red-netflix--border(style='border-left: 2px solid')
        span NO ADS
        br
        span NO COMMITMENTS
    v-col.d-flex.flex-column.justify-center(cols='12', md='3')
      v-select(
        :items='amounts',
        outlined,
        dense,
        placeholder='Choose gift card amount',
        :hide-details='true',
        v-model='amount'
      )
      a.d-flex.justify-center(
        :href='"https://click.linksynergy.com/link?id=syPXePIn/ec&offerid=686295.14468101272&type=2&murl=https%3A%2F%2Fwww.giftcards.com%2Fnetflix-gift-card%3Fexperience_type%3Dvirtual%26amount%3D" + amount'
      )
        v-btn.px-10(color='red-netflix') GET GIFTCARDS
      .mt-3
        i.white-font--text Service provided by giftcards.com
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
  amounts: any = [15, 20, 25, 50, 75, 100, 125, 150, 175, 200];
  amount: any = '';

  mounted() {
    const element: any = document.getElementById('ad');
    if (!element) {
      return;
    }
    const config = document.createElement('script');
    config.innerHTML = '';
    for (const key in this.config) {
      config.innerHTML += key + '="' + this.config[key] + '";';
    }
    config.innerHTML +=
      'amzn_assoc_default_search_phrase = "netflix ' + this.title.title + '";';

    element.appendChild(config);

    this.$loadAd('#ad');
    const checkExist = setInterval(() => {
      const element: any = document.getElementsByClassName(
        'amzn-native-content'
      )[0];
      const elements: any = document.getElementsByClassName(
        'amzn-native-product'
      );
      if (element && elements.length) {
        element.style = 'height: auto';
        for (const element of elements) {
          element.style =
            'background-color: ' +
            this.$vuetify.theme.themes.dark.blackBody +
            '; height: 250px;';
        }
        clearInterval(checkExist);
      }
    }, 100);
  }
}
</script>

