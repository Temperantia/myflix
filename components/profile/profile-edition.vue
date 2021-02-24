<template lang="pug">
v-container(fluid)
  v-row.title-border.pa-2(align='center')
    template(v-if='$vuetify.breakpoint.mdAndUp')
      h3.click.d-inline.mr-10(
        v-for='tab in tabs',
        :key='tab.name',
        @click='currentTab = tab.name',
        :class='{ "red-netflix--text": isCurrentTab(tab.name) }'
      ) {{ tab.name }}
    v-col(v-else, cols='12', v-for='tab in tabs', :key='tab.name')
      h3.click.d-inline.mr-10(
        @click='currentTab = tab.name',
        :class='{ "red-netflix--text": isCurrentTab(tab.name) }'
      ) {{ tab.name }}
    v-col.text-md-right
      a(@click='check') SAVE CHANGES
  v-container(fluid, v-if='currentTab === "EDIT PROFILE"')
    v-row.subtitle-border
      v-col(cols='12', lg='3')
        v-container(fluid)
          .white-font--text Current Picture
      v-col(cols='12', lg='9')
        v-container(fluid)
          .white-font--text Upload a Picture
    v-row
      v-col.d-flex.justify-center(cols='12', lg='3')
        v-container(fluid)
          img(:src='copy.image ? copy.image : "/pfp1.png"', alt='user image')
      v-col(cols='12', lg='4')
        v-container(fluid)
          .mb-3 Must be jpg, gif or png format. No NSFW allowed. No copyrighted images. Maximum of 250 x 250 pixels (resized automatically).
          .mb-5
            input(type='file', @input='load')
          .mb-3.subtitle-border.white-font--text Remove Picture
          .mb-3 You can remove this picture by clicking the button below. Don't forget to upload another though, or else you will have a default image in its place.
          button.button-action(@click='copy.image = null') Remove
      v-col(cols='12', lg='5')
        v-container(fluid)
          v-row(align='center')
            v-col(cols='12', lg='3')
              h5 Time Zone
            v-col(cols='12', lg='5')
              v-select(
                :items='listTimeZones()',
                outlined,
                dense,
                :hide-details='true',
                @change='updateTimeZone',
                v-model='copy.timeZone'
              )
            v-col(cols='12', lg='3')
              .white-font--text Time: {{ time }}
          v-row(align='center')
            v-col(cols='12', lg='3')
              h5 Gender
            v-col(cols='12', lg='5')
              v-select(
                :items='["Male", "Female"]',
                v-model='copy.gender',
                outlined,
                dense,
                :hide-details='true'
              )
          v-row(align='center')
            v-col(cols='12', lg='3')
              h5 Birthday
            v-col(cols='12', xl='9')
              birthdate-picker(
                :birthdate='copy.birthdate',
                :onUpdate='updateBirthdate'
              )
          v-row(align='center')
            v-col(cols='12', lg='3')
              h5 Location
            v-col(cols='12', lg='6')
              input.location(v-model='copy.location')
            v-col(cols='12', lg='3')
              .white-font--text Ex: Anaheim, CA
  v-container(fluid, v-if='currentTab === "FAVORITES"')
    v-row
      v-col(cols='12', lg='6')
        v-container(fluid)
          h4.subtitle-border TV SHOWS
          v-row(v-for='(show, id) in copy.favorites.shows', :key='id')
            v-col(cols='12', lg='9')
              h3 {{ show.title }}
              .white-font--text {{ show.year + " " + show.maturity + " " + show.season + " Seasons" }}
              .white-font--text {{ show.genres.map((genre) => genre.name).join(", ") }}
            v-col.text-right(cols='12', lg='3')
              a.click.white-font--text(
                @click='removeFavorite(copy.favorites.shows, id)'
              ) REMOVE
      v-col(cols='12', lg='6')
        v-container(fluid)
          h4.subtitle-border FILMS
          v-row(v-for='(film, id) in copy.favorites.films', :key='id')
            v-col(cols='12', lg='9')
              h3 {{ film.title }}
              .white-font--text {{ film.year + " " + film.maturity + " " + film.duration }}
              .white-font--text {{ film.genres.map((genre) => genre.name).join(", ") }}
            v-col.text-right(cols='12', lg='3')
              a.click.white-font--text(
                @click='removeFavorite(copy.favorites.films, id)'
              ) REMOVE
  v-container(fluid, v-if='currentTab === "ACCOUNT SETTINGS"')
    v-form(ref='form')
      v-row.subtitle-border
        v-col Social Sign-in
      v-row
        v-col(cols='12', lg='2')
          v-container.d-flex.align-center(fluid)
            .button-block.google
              img(src='/Google.png', alt='google logo')
              button Google
              .disable(v-if='!copy.providers.google')
            img.pl-2.icon.click(
              src='/Layer 127.png',
              @click='signInWithGoogle',
              alt='google background image'
            )
        v-col(cols='12', lg='2')
          v-container.d-flex.align-center(fluid)
            .button-block.facebook
              img(src='/Facebook auth.png', alt='facebook logo')
              button Facebook
              .disable(v-if='!copy.providers.facebook')
            img.pl-2.icon.click(
              src='/Layer 127.png',
              @click='signInWithFacebook',
              alt='facebook background image'
            )
      v-row(:class='{ "subtitle-border": !isSocial }')
        v-col(cols='12', lg='4')
          template(v-if='!isSocial')
            .mb-5.subtitle-border Change Password
            v-text-field.my-2(
              type='password',
              color='red',
              outlined,
              v-model='passwordNew',
              label='New Password',
              :rules='[(v) => !v || v.length >= 6 || "Password should be at least 6 characters"]',
              autocomplete='new-password'
            )
            .mb-5.subtitle-border Change Email
            v-text-field(
              color='red',
              outlined,
              v-model='email',
              label='New Email',
              :rules='[(v) => !v || /.+@.+\..+/.test(v) || "E-mail must be valid"]',
              autocomplete='email'
            )
          .mb-5.subtitle-border Change Username
          v-text-field(
            color='red',
            outlined,
            v-model='username',
            :rules='[(v) => !v || v.length >= 2 || v.length <= 16 || "(Between 2 and 16 characters)"]',
            autocomplete='new-username',
            label='New Username'
          )
          div
            .white-font--text - You may only change your username once every month.
            .white-font--text - If you change your username, all links that used to go to your old username will no longer work.
        v-col(cols='12', lg='4')
          .mb-5.subtitle-border Notifications Options
          v-switch(
            label='Receive marketing emails?',
            v-model='marketing',
            dense,
            outlined,
            hide-details
          )
          .ml-10
            v-checkbox(
              :disabled='!marketing',
              label='News about MyFlix product and feature updates',
              v-model='copy.notifications.marketing.product',
              dense,
              hide-details
            )
            v-checkbox(
              :disabled='!marketing',
              label='Participation in MyFlix research surveys',
              v-model='copy.notifications.marketing.survey',
              dense,
              hide-details
            )
            v-checkbox(
              :disabled='!marketing',
              label='News about MyFlix on partner products and other third party services',
              v-model='copy.notifications.marketing.partner',
              dense,
              hide-details
            )
            v-checkbox(
              :disabled='!marketing',
              label='Things you missed since you last logged into MyFlix',
              v-model='copy.notifications.marketing.missed',
              dense,
              hide-details
            )
          v-switch(
            label='Receive marketing emails?',
            v-model='notification',
            dense,
            outlined,
            hide-details
          )
          .ml-10
            v-checkbox(
              :disabled='!notification',
              label='Direct messages',
              v-model='copy.notifications.notification.dm',
              dense,
              hide-details
            )
            v-checkbox(
              :disabled='!notification',
              label='Friend requests',
              v-model='copy.notifications.notification.friend',
              dense,
              hide-details
            )
            v-checkbox(
              :disabled='!notification',
              label='Suggestions based on your FlixList',
              v-model='copy.notifications.notification.suggestion',
              dense,
              hide-details
            )
      v-row(v-if='!isSocial')
        v-col(cols='12', lg='4')
          v-text-field.my-2(
            type='password',
            color='red',
            outlined,
            label='Confirm Password *',
            v-model='passwordCurrent',
            :hide-details='true',
            autocomplete='password'
          )
    v-form(ref='deletion')
      v-row.subtitle-border
        v-col Account Deletion
      v-row
        template(v-if='!isSocial')
          v-col(cols='12', lg='2')
            v-container(fluid)
              v-text-field.my-2(
                color='red',
                outlined,
                label='Confirm Email',
                :rules='[(v) => !!v || "Required", (v) => /.+@.+\..+/.test(v) || "E-mail must be valid"]',
                v-model='deletionEmail',
                required
              )
          v-col(cols='12', lg='2')
            v-container(fluid)
              v-text-field.my-2(
                type='password',
                color='red',
                outlined,
                label='Confirm Password',
                v-model='deletionPassword',
                :rules='[(v) => !!v || "Required"]',
                required
              )
        v-col(cols='12', lg='3')
          v-container.mt-5(fluid)
            a.px-10.py-2.red-netflix.rounded(@click='deleteUserValidate') DELETE ACCOUNT
</template>
<script lang='ts'>
import { listTimeZones } from 'timezone-support';
import { formatToTimeZone } from 'date-fns-timezone';
import { Vue, Component, namespace } from 'nuxt-property-decorator';

const profileModule = namespace('profile');
const localStorageModule = namespace('localStorage');

@Component
export default class ProfileEdition extends Vue {
  @profileModule.State('profile') profile!: any;
  @localStorageModule.Action('delete') deleteUser!: any;
  @localStorageModule.Action('update') update!: any;

  listTimeZones = listTimeZones;
  formatToTimeZone = formatToTimeZone;
  currentTab = 'EDIT PROFILE';
  copy: any = {};
  passwordNew = '';
  passwordCurrent = '';
  email = '';
  username = '';
  deletionEmail = '';
  deletionPassword = '';
  marketing: boolean = true;
  notification: boolean = true;

  created() {
    this.copy = JSON.parse(JSON.stringify(this.profile));
    if (!this.copy.timeZone) {
      this.$set(
        this.copy,
        'timeZone',
        Intl.DateTimeFormat().resolvedOptions().timeZone
      );
    }
    if (!this.copy.notifications) {
      this.copy.notifications = {
        marketing: {
          product: true,
          survey: true,
          partner: true,
          missed: true,
        },
        notification: {
          dm: true,
          friend: true,
          suggestion: true,
        },
      };
    }
  }

  mounted() {
    if (this.$route.params.tab) {
      this.currentTab = this.$route.params.tab;
    }
  }

  check() {
    if (this.$refs.form && !(this.$refs.form as any).validate()) {
      return;
    }
    this.update(
      this.copy,
      this.passwordNew,
      this.passwordCurrent,
      this.email,
      this.username
    );
  }

  removeFavorite(titles: any, id: string) {
    this.$delete(titles, id);
  }

  isCurrentTab(tab: string) {
    return tab === this.currentTab;
  }

  load(event: any) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    if (
      file.type !== 'image/jpeg' &&
      file.type !== 'image/png' &&
      file.type !== 'image/gif'
    ) {
      this.$toast.error('Must be jpg, gif or png format.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const img: HTMLImageElement = document.createElement('img');
      img.src = e.target?.result as string;

      await new Promise((r) => setTimeout(r, 2000));

      const canvas = document.createElement('canvas');
      let ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);

      const MAX_WIDTH = 250;
      const MAX_HEIGHT = 250;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      const dataurl = canvas.toDataURL(file.type);
      this.copy.image = dataurl;
    };
    reader.readAsDataURL(file);
  }

  updateTimeZone(value: string) {
    this.copy.timeZone = value;
  }

  updateBirthdate(value: string) {
    this.copy.birthdate = value;
  }

  async deleteUserValidate() {
    if (!(this.$refs.deletion as any).validate()) {
      return;
    }
    await this.deleteUser(this.deletionEmail, this.deletionPassword);
  }

  async link(provider: any, name: string) {
    try {
      const cred: any = await this.$fire.auth.signInWithPopup(provider);
      this.$set(this.copy.providers, name, {
        id: cred.user.uid,
        token: cred.credential.accessToken,
      });
    } catch (error) {
      this.$toast.error(error);
    }
  }

  signInWithGoogle() {
    const provider = new this.$fireModule.auth.GoogleAuthProvider();
    this.link(provider, 'google');
  }

  signInWithFacebook() {
    const provider = new this.$fireModule.auth.FacebookAuthProvider();
    this.link(provider, 'facebook');
  }

  get isSocial() {
    return Object.values(this.copy.providers).find(
      (provider: any) => provider.id === this.copy.id
    );
  }

  get tabs() {
    return [
      {
        name: 'EDIT PROFILE',
      },
      {
        name: 'FAVORITES',
      },
      {
        name: 'ACCOUNT SETTINGS',
      },
    ];
  }

  get time() {
    return formatToTimeZone(new Date(), 'h:mm A', {
      timeZone: this.copy.timeZone,
    });
  }
}
</script>
<style lang="scss" scoped>
img {
  max-width: 250px;
  max-height: 250px;
}
.button-action {
  padding: 5px 30px;
  border-radius: 5px;
  color: $white-font;
  border: 1px solid $white-font;
}
.location {
  width: 100%;
  padding-left: 5px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 5px;
}
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
  height: 50px;
  width: 100%;
  display: flex;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  font-size: 20px;

  .disable {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
  }

  img {
    width: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    left: 10px;
  }

  button {
    padding-left: 30px;
    outline: none;
    cursor: default;
  }
}
.icon {
  height: 30px;
}
</style>
