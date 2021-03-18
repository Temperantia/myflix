<template lang="pug">
client-only
  v-container(fluid)
    v-row(align='center')
      v-col.d-flex.flex-column.align-center(cols='12')
        button.button-block.google.mb-5(@click='registerWithGoogle()')
          h4 Google
          img(src='/Google.png', alt='google logo')

          .overlay(v-if='clickedFacebook')
        button.button-block.facebook(@click='registerWithFacebook()')
          h4 Facebook
          img(src='/Facebook auth.png', alt='facebook logo')
          .overlay(v-if='clickedGoogle')
      //-v-col(cols='4')
        .button-block.apple(@click='signInWithApple')
          button Apple
          img(src='/Apple.png', alt='apple logo')
    //-v-form(v-if='clicked', ref='form', @submit.prevent='check')
      //-v-text-field(
        color='red',
        v-model='username',
        :rules='[(v) => !!v || "Required", (v) => v.length >= 2 || v.length <= 16 || "(Between 2 and 16 characters)"]',
        label='Username',
        required
       )
      //-v-text-field(
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
  clickedGoogle = false;
  clickedFacebook = false;
  username = '';

  async registerWithGoogle() {
    if (this.clickedGoogle || this.clickedFacebook) {
      return;
    }
    await this.signInWithGoogle();
    this.clickedGoogle = true;
  }

  async registerWithFacebook() {
    if (this.clickedGoogle || this.clickedFacebook) {
      return;
    }
    await this.signInWithGoogle();
    this.clickedFacebook = true;
  }
}
</script>
<style lang="scss" scoped>
.google {
  background-color: white;

  h4 {
    color: $grey-google;
  }
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
  width: 300px;
  height: 50px;
  display: flex;
  border-radius: 5px;
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

  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0.8;
  }
}
</style>
