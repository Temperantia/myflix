<template lang="pug">
v-container(fluid)
  v-row
    v-col.text-center(cols='12', offset-lg='3', lg='6', offset-xl='4', xl='4')
      h4.title-border.text-left REGISTER
      .mt-10
        img(src='/myflix-logo.png', style='width: 60%', alt='myflix logo')
      h2.mt-10 Get started using MyFlix
      p.pa-5 Join MyFlix to catalog your favorite series, movies, and Netflix originals, compare with your friends, create your own profile, and plenty more. It's <b>Free</b>.
      h3 Sign Up with
      socials-auth
      v-row.py-5(align='center')
        v-col.pa-0(offset='5', cols='2')
          h3(v-if='!socialAuthUser') OR

      v-form(ref='form', @submit.prevent='registerWithMyflix')
        v-text-field(
          color='red',
          v-model='email',
          label='Email',
          :rules='[(v) => !!v || "Required", (v) => /.+@.+\..+/.test(v) || "E-mail must be valid"]',
          required
        )
        v-text-field(
          color='red',
          v-model='username',
          :rules='[(v) => !!v || "Required", (v) => v.length >= 2 || v.length <= 16 || "(Between 2 and 16 characters)"]',
          label='Username',
          required,
          autocomplete='username'
        )
        v-text-field(
          v-if='!socialAuthUser',
          color='red',
          type='password',
          v-model='password',
          :rules='[(v) => !!v || "Required", (v) => v.length >= 6 || "Password should be at least 6 characters"]',
          label='Password',
          required,
          autocomplete='current-password'
        )
        .pt-5.pb-10.d-flex.justify-center
          v-checkbox(color='red', v-model='agreed')
            template(v-slot:label)
              | I have read and agree to the
              nuxt-link(to='/terms-of-service')
                b.px-1 Terms of Service
              | and
              nuxt-link(to='/privacy-policy')
                b.px-1 Privacy Policy
        button.button-red.px-8.py-3.rounded-lg(type='submit') Create Account
</template>
<script lang='ts'>
import { Vue, Component, namespace } from 'nuxt-property-decorator';

const localStorageModule = namespace('localStorage');

@Component
export default class Register extends Vue {
  email = '';
  username = '';
  password = '';
  agreed = false;
  @localStorageModule.State('socialAuthUser') socialAuthUser!: any;
  @localStorageModule.Mutation('setSocialAuthUser') setSocialAuthUser!: any;
  @localStorageModule.Action('register') register!: any;

  created() {
    this.setSocialAuthUser(null);
  }

  registerWithMyflix() {
    if (!(this.$refs.form as any).validate() || !this.agreed) {
      return;
    }
    if (this.socialAuthUser) {
      this.register({
        id: this.socialAuthUser.id,
        email: this.email,
        username: this.username,
        photoURL: this.socialAuthUser.image,
        provider: this.socialAuthUser.provider,
        token: this.socialAuthUser.token,
      });
    } else {
      this.register({
        email: this.email,
        username: this.username,
        password: this.password,
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.line {
  border-bottom: 1px solid white;
}

p {
  border-bottom: 1px solid white;
}
</style>
