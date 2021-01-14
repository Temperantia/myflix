<template lang="pug">
v-container(fluid)
  v-row.mt-5
    v-col.text-center(cols='12', offset-lg='4', lg='4')
      h4.title-border.text-left REGISTER
      .mt-10
        img(src='/logo.png')
      h2.mt-10 Get started using MyFlix
      p.pa-5 Join MyFlix to catalog your favorite series, movies, and Netflix originals, compare with your friends, create your own profile, and plenty more. It's <b>Free</b>.
      h3 Sign Up with
      socials-auth
      v-row.py-5(align='center')
        v-col.pa-0(cols='5')
          .line
        v-col.pa-0(cols='2')
          h3 OR
        v-col.pa-0(cols='5')
          .line
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
    email: '',
    username: '',
    password: '',
    agreed: false,
  }),
  methods: {
    async registerWithMyflix() {
      if (!this.$refs.form.validate() || !this.agreed) {
        return;
      }
      try {
        const user = await this.$getUser(this.username);
        if (user) {
          this.$toast.error('Username is taken');
          return;
        }

        const cred = await this.$fire.auth.createUserWithEmailAndPassword(
          this.email,
          this.password
        );

        await this.$register(cred.user.uid, this.email, this.username);
        this.$router.push('/');
      } catch (error) {
        this.$toast.error(error);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.line {
  border-bottom: 1px solid white;
}

p {
  border-bottom: 1px solid white;
}
</style>
