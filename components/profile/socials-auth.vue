<template lang="pug">
v-container(fluid)
  v-row(align='center')
    v-col(cols='6')
      .button-block.google(@click='signInWithGoogle')
        button Google
        img(src='/Google.png')
    v-col(cols='6')
      .button-block.facebook(@click='signInWithFacebook')
        button Facebook
        img(src='/Facebook auth.png')
    //-v-col(cols='4')
      .button-block.apple(@click='signInWithApple')
        button Apple
        img(src='/Apple.png')
  v-form(v-if='id', ref='form', @submit.prevent='register')
    v-text-field(
      color='red',
      v-model='username',
      :rules='[(v) => !!v || "Required", (v) => v.length >= 2 || v.length <= 16 || "(Between 2 and 16 characters)"]',
      label='Username',
      required
    )
    v-text-field(
      v-if='!emailFromAuth',
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
          nuxt-link(to='/terms-and-conditions')
            b.px-1 Terms and Conditions
          | and
          nuxt-link(to='/privacy-policy')
            b.px-1 Privacy Policy
    button.button-red.px-8.py-3.rounded-lg(type='submit') Create Account
</template>
<script>
export default {
  data: () => ({
    id: '',
    emailFromAuth: '',
    email: '',
    username: '',
    image: '',
    name: '',
    token: '',
    agreed: false,
  }),
  methods: {
    async signIn(provider) {
      try {
        const cred = await this.$fire.auth.signInWithPopup(provider);
        const id = cred.user.uid;
        const exists = await this.$signIn(id, this.name);
        if (exists) {
          this.$router.push('/');
        } else {
          this.id = id;
          this.emailFromAuth = cred.user.email;
          this.image = cred.user.photoURL;
          this.token = cred.credential.accessToken;
        }
      } catch (error) {
        this.$toast.error(error);
      }
    },
    async register() {
      if (!this.$refs.form.validate()) {
        return;
      }

      await this.$register(
        this.id,
        this.emailFromAuth ? this.emailFromAuth : this.email,
        this.username,
        this.image,
        this.name,
        this.token
      );
    },
    signInWithGoogle() {
      const provider = new this.$fireModule.auth.GoogleAuthProvider();
      this.name = 'google';
      this.signIn(provider);
    },
    signInWithFacebook() {
      const provider = new this.$fireModule.auth.FacebookAuthProvider();
      this.name = 'facebook';
      this.signIn(provider);
    },
    signInWithApple() {
      const provider = new this.$fireModule.auth.OAuthProvider('apple.com');
      this.name = 'apple';
      this.signIn(provider);
    },
  },
};
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
