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
      required,
      autocomplete='username'
    )
    button.button-red.px-8.py-3.rounded-lg(type='submit') Create Account
</template>
<script>
export default {
  data: () => ({
    id: null,
    username: '',
    image: null,
  }),
  methods: {
    async signIn(provider) {
      try {
        const cred = await this.$fire.auth.signInWithPopup(provider);
        const id = cred.user.uid;
        const exists = await this.$signIn(id);
        if (exists) {
          this.$router.push('/');
        } else {
          this.id = id;
          this.image = cred.user.photoURL;
        }
      } catch (error) {
        this.$toasted.error(error);
      }
    },
    async register() {
      if (!this.$refs.form.validate()) {
        return;
      }

      await this.$register(this.id, this.username, this.image);

      this.$router.push('/');
    },
    signInWithGoogle() {
      const provider = new this.$fireModule.auth.GoogleAuthProvider();
      this.signIn(provider);
    },
    signInWithFacebook() {
      const provider = new this.$fireModule.auth.FacebookAuthProvider();
      this.signIn(provider);
    },
    signInWithApple() {
      const provider = new this.$fireModule.auth.OAuthProvider('apple.com');
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
