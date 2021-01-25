<template lang="pug">
client-only
  v-container(fluid)
    v-row
      v-col(cols='3')
        client-only
          scrollactive.my-nav(
            scrollContainerSelector='#content',
            :offset='130'
          )
            a.scrollactive-item(
              v-for='item in items',
              :key='item.title',
              :href='"#" + slugify(item.title)'
            )
              h5.py-2.white-font--text {{ item.title.toUpperCase() }}
      v-col#content(cols='9', style='overflow-y: scroll; height: 70vh')
        p This Privacy Policy governs the manner in which INC DIGITAL collects, uses, maintains and discloses information collected from users (each, a "User") of the my-flix.net website ("Site"). This privacy policy applies to the Site and all products and services offered by INC DIGITAL.
        div(
          v-for='item in items',
          :key='item.title',
          :id='slugify(item.title)'
        )
          h4.pb-2.red-netflix--text {{ item.title.toUpperCase() }}
          p(v-html='item.content')
</template>
<script>
import slugify from 'slugify';
export default {
  data: () => ({
    items: [
      {
        title: 'personal identification information',
        content:
          'We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the siteplace an orderfill out a formrespond to a surveysubscribe to the newsletter and in connection with other activities, services, features or resources we make available on our Site. Users may be asked for, as appropriate, name, email address, phone number,<br>Users may, however, visit our Site anonymously.<br>We will collect personal identification information from Users only if they voluntarily submit such information to us. Users can always refuse to supply personally identification information, except that it may prevent them from engaging in certain Site related activities.',
      },
      {
        title: 'non-personal identification information',
        content:
          'We may collect non-personal identification information about Users whenever they interact with our Site. Non-personal identification information may include the browser name, the type of computer and technical information about Users means of connection to our Site, such as the operating system and the Internet service providers utilized and other similar information.',
      },
      {
        title: 'web browser cookies',
        content:
          'Our Site may use "cookies" to enhance User experience. User\'s web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. User may choose to set their web browser to refuse cookies, or to alert you when cookies are being sent. If they do so, note that some parts of the Site may not function properly.',
      },
      {
        title: 'how we use collected information',
        content:
          'INC DIGITAL collects and uses Users personal information for the following purposes:<ul><li>To improve customer service</li><li>Your information helps us to more effectively respond to your customer service requests and support needs.</li><li>To personalize user experience</li><li>We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site.</li><li>To improve our Site</li><li>We continually strive to improve our website offerings based on the information and feedback we receive from you.</li><li>To process transactions</li><li>We may use the information Users provide about themselves when placing an order only to provide service to that order. We do not share this information with outside parties except to the extent necessary to provide the service.</li><li>To administer a content, promotion, survey or other Site feature</li><li>To send Users information they agreed to receive about topics we think will be of interest to them.</li><li>To share your information with third parties</li><li>We may share or sell information with third parties for marketing or other purposes.</li><li>To send periodic emails</li><li>The email address Users provide for order processing, will only be used to send them information and updates pertaining to their order. It may also be used to respond to their inquiries, and/or other requests or questions. If User decides to opt-in to our mailing list, they will receive emails that may include company news, updates, related product or service information, etc. If at any time the User would like to unsubscribe from receiving future emails, we include detailed unsubscribe instructions at the bottom of each email or User may contact us via our Site.</li></ul>',
      },
      {
        title: 'how we protect your information',
        content:
          'We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site.<br>Sensitive and private data exchange between the Site and its Users happens over a SSL secured communication channel and is encrypted and protected with digital signatures. ',
      },
      {
        title: 'sharing your personal information',
        content:
          'We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above.We may use third party service providers to help us operate our business and the Site or administer activities on our behalf, such as sending out newsletters or surveys. We may share your information with these third parties for those limited purposes provided that you have given us your permission.',
      },
      {
        title: 'third party websites',
        content:
          "Users may find advertising or other content on our Site that link to the sites and services of our partners, suppliers, advertisers, sponsors, licensors and other third parties. We do not control the content or links that appear on these sites and are not responsible for the practices employed by websites linked to or from our Site. In addition, these sites or services, including their content and links, may be constantly changing. These sites and services may have their own privacy policies and customer service policies. Browsing and interaction on any other website, including websites which have a link to our Site, is subject to that website's own terms and policies.",
      },
      {
        title: 'advertising',
        content:
          'Ads appearing on our site may be delivered to Users by advertising partners, who may set cookies. These cookies allow the ad server to recognize your computer each time they send you an online advertisement to compile non personal identification information about you or others who use your computer. This information allows ad networks to, among other things, deliver targeted advertisements that they believe will be of most interest to you. This privacy policy does not cover the use of cookies by any advertisers.',
      },
      {
        title: 'google adsense',
        content:
          'Some of the ads may be served by Google. Google\'s use of the DART cookie enables it to serve ads to Users based on their visit to our Site and other sites on the Internet. DART uses "non personally identifiable information" and does NOT track personal information about you, such as your name, email address, physical address, etc. You may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy at <a href="http://www.google.com/privacy_ads.html">http://www.google.com/privacy_ads.html</a>',
      },
      {
        title: "compliance with children's online privacy protection act",
        content:
          'Protecting the privacy of the very young is especially important. For that reason, we never collect or maintain information at our Site from those we actually know are under 13, and no part of our website is structured to attract anyone under 13.',
      },
      {
        title: 'changes to this privacy policy',
        content:
          'INC DIGITAL has the discretion to update this privacy policy at any time. When we do, revise the updated date at the bottom of this page,. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.',
      },
      {
        title: 'your acceptance of these terms',
        content:
          'By using this Site, you signify your acceptance of this policy and terms of service. If you do not agree to this policy, please do not use our Site. Your continued use of the Site following the posting of changes to this policy will be deemed your acceptance of those changes.',
      },
      {
        title: 'contacting us',
        content:
          'If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at:<br>INC DIGITAL<br><a href="https://my-flix.net">my-flix.net</a><br>57 rue du dessous des berges, 75013 Paris, France<br><a href="mailto:contact@my-flix.net">contact@my-flix.net</a>',
      },
    ],
  }),
  methods: {
    slugify,
  },
};
</script>
<style lang="scss" scoped>
.is-active > h5 {
  color: white;
}
</style>
