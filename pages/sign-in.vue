<template lang="pug">
v-container(fluid)
  v-row.mt-5
    v-col.text-center(cols='12', offset-lg='4', lg='4')
      h4.text-left.title-border SIGN IN
      h3.py-10 Sign In with
      socials-auth
      v-row.py-5(align='center')
        v-col.pa-0(cols='5')
          .line
        v-col.pa-0(cols='2')
          h3 OR
        v-col.pa-0(cols='5')
          .line
      v-form(ref='form', @submit.prevent='signInWithMyflix')
        v-text-field(
          color='red',
          v-model='email',
          :rules='[(v) => !!v || "Required"]',
          label='Email',
          required
        )
        v-text-field(
          color='red',
          type='password',
          v-model='password',
          :rules='[(v) => !!v || "Required"]',
          label='Password',
          required,
          autocomplete='current-password'
        )
        button.button-red.px-8.py-3.rounded-lg(
          type='submit',
          @click='signInWithMyflix'
        ) Sign In
      nuxt-link(to='/register')
        button.button-grey.px-8.py-3.mt-5.rounded-lg(type='submit') Register
</template>
<script>
export default {
  data: () => ({
    email: '',
    password: '',
  }),
  methods: {
    async signInWithMyflix() {
      if (!this.$refs.form.validate()) {
        return;
      }
      try {
        const cred = await this.$fire.auth.signInWithEmailAndPassword(
          this.email,
          this.password
        );

        this.$signIn(cred.user.uid);

        this.$router.push('/');
      } catch (error) {
        this.$toast.error('Incorrect Email or Password');
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.line {
  border-bottom: 1px solid white;
}

button {
  width: 150px;
}
</style>
