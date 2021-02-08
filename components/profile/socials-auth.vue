<template lang="pug">
client-only
  v-container(fluid)
    v-row(align='center')
      v-col(cols='6')
        .button-block.google(@click='signInWithGoogle(); clicked = true')
          button Google
          img(src='/Google.png')
      v-col(cols='6')
        .button-block.facebook(@click='signInWithFacebook(); clicked = true')
          button Facebook
          img(src='/Facebook auth.png')
      //-v-col(cols='4')
        .button-block.apple(@click='signInWithApple')
          button Apple
          img(src='/Apple.png')
    v-form(v-if='clicked', ref='form', @submit.prevent='check')
      v-text-field(
        color='red',
        v-model='username',
        :rules='[(v) => !!v || "Required", (v) => v.length >= 2 || v.length <= 16 || "(Between 2 and 16 characters)"]',
        label='Username',
        required
      )
      v-text-field(
        color='red',
        v-model='email',
        :rules='[(v) => !!v || "Required", (v) => /.+@.+\..+/.test(v) || "E-mail must be valid"]',
        label='Email',
        required
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
export default class SocialsAuth extends Vue {
  @localStorageModule.State('socialAuthUser') socialAuthUser!: any;
  @localStorageModule.Action('signInWithGoogle') signInWithGoogle!: any;
  @localStorageModule.Action('signInWithFacebook') signInWithFacebook!: any;
  @localStorageModule.Action('register') register!: any;
  clicked = false;
  username = '';
  email = '';
  agreed = false;

  check() {
    if (!(this.$refs.form as any).validate() || !this.agreed) {
      return;
    }
    this.register({
      id: this.socialAuthUser.id,
      email: this.email,
      username: this.username,
      photoURL: this.socialAuthUser.image,
      provider: this.socialAuthUser.provider,
      token: this.socialAuthUser.token,
    });
  }
}
</script>
<style lang="scss" scoped>
.google {
  background-color: white;
  color: $grey-google;
}

.facebook {
  background-color: #3c5b97;
}

.apple {
  background-color: black;
  border: 1px solid $grey-light;
}

.button-block {
  position: relative;
  width: 100%;
  height: 50px;
  display: flex;
  border-radius: 5px;
  padding-left: 30px;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  cursor: pointer;

  img {
    width: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    left: 10px;
  }

  button {
    outline: none;
  }
}
</style>
