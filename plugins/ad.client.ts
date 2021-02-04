import postscribe from 'postscribe';


declare module "vue/types/vue" {
  interface Vue {
    $loadAd(element: any): void;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $loadAd(element: any): void;
  }
  interface Context {
    $loadAd(element: any): void;
  }
}

declare module "vuex/types/index" {
  interface Store<S> {
    $loadAd(element: any): void;
  }
}


export default (
  _: any,
  inject: any
) => {
  inject('loadAd', (element: any) => {
    postscribe(element, `<script src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US"></script>`)
  })
}
