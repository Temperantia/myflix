<template lang="pug">
v-container(fluid)
  v-row
    v-col(cols='12', lg='1')
    v-col(cols='12', lg='10')
      v-container(fluid)
        v-row.title-border
          v-col Cannot find it on Netflix? Access everything through our VPN offers to change your location.
          v-col.text-right(@click='$router.pop()') BACK TO OVERVIEW
        v-row
          v-col
            v-container(fluid)
              div Please choose from a list of our affiliates below for your VPN service Access
              v-row
                v-col(cols='12', md='4', v-for='vpn of vpns', :key='vpn.name')
                  v-container(fluid)
                    v-row
                      v-col(cols='3')
                        img(:src='vpn.logo', :alt='vpn.name')
                      v-col(cols='9')
                        h2
                          b {{ vpn.name }}
                        i.white-font--text {{ vpn.tagline }}
                        .my-3.d-flex.align-center
                          img.icon(src='Layer 46.png', style='height: fit-content')
                          .mt-1.d-flex.align-center
                            span.ml-1 {{ " - Rated" }}
                            img.mx-1(src='Layer 47.png' style='width: 20px; height: 20px;')
                            b {{ vpn.score }} / 5
                        v-btn.black-body--bg.px-10.blue-completed--border.border
                          .blue-completed--text.font-weight-bold
                            a(:href='$config.enableAffiliates && vpn.link' target="_blank") Get {{ vpn.name }}
</template>
<script lang='ts'>
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class Vpn extends Vue {
  vpns = [
    {
      logo: 'Layer 48.png',
      name: 'HMA VPN',
      tagline: 'Get more from your internet with HMA VPN',
      score: '4.2',
      link: 'https://click.hmavpn.com/aff_c?offer_id=1&aff_id=1926&file_id=511',
    },
    {
      logo: 'Layer 49.png',
      name: 'PUREVPN',
      tagline: 'Now work, binge & stay secure online with PureVPN',
      score: '4.7',
      link:
        'https://www.purevpn.com/streaming-special.php?aff=45815&amp,a_bid=bd4c8e59',
    },
    {
      logo: 'Layer 50.png',
      name: 'NordVPN',
      tagline: 'Because your online security comes first',
      score: '4.4',
      link: 'https://go.nordvpn.net/aff_c?offer_id=15&aff_id=50394&url_id=902',
    },
    {
      logo: 'Layer 45.png',
      name: 'Surefshark',
      tagline: 'Secure your digital life',
      score: '4.3',
      link: 'https://get.surfshark.net/aff_c?offer_id=6&aff_id=6612',
    },
  ];
}
</script>
<style lang="scss" scoped>
.black-body--bg {
  background-color: $black-body !important;
}
</style>
