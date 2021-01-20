import postscribe from 'postscribe';

export default (
  _,
  inject
) => {
  inject('loadAd', (element) => {
    postscribe(element, `<script src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US"></script>`)
  })
}
