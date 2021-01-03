<template lang="pug">
v-container(fluid)
  v-row.title-border.pa-2
    v-col
      a(v-for='tab in tabs', :key='tab.name', @click='currentTab = tab.name')
        h3.d-inline.mr-10(
          :class='{ "red-netflix--text": isCurrentTab(tab.name) }'
        ) {{ tab.name }}
    v-col.text-right
      a(@click='save(copy)') SAVE CHANGES
  v-container(fluid, v-if='currentTab === "EDIT PROFILE"')
    v-row.subtitle-border
      v-col(cols='3')
        .white-font--text Current Picture
      v-col(cols='9')
        .white-font--text Upload a Picture
    v-row
      v-col.d-flex.justify-center(cols='3')
        img(:src='copy.image ? copy.image : "/defaultUser.png"')
      v-col(cols='4')
        .mb-3 Must be jpg, gif or png format. No NSFW allowed. No copyrighted images. Maximum of 250 x 250 pixels (resized automatically).
        .mb-5
          input(type='file', @input='load')
        .mb-3.subtitle-border.white-font--text Remove Picture
        .mb-3 You can remove this picture by clicking the button below. Don't forget to upload another though, or else you will have a default image in its place.
        button.button-action(@click='copy.image = null') Remove
      v-col(cols='5')
        v-row(align='center')
          v-col.py-1(cols='3')
            h5 Time Zone
          v-col.py-1(cols='5')
            v-select(
              :items='listTimeZones()',
              outlined,
              dense,
              :hide-details='true',
              @change='updateTimeZone',
              v-model='copy.timeZone'
            )
          v-col.py-1(cols='3')
            .white-font--text Time: {{ time }}
        v-row(align='center')
          v-col.py-1(cols='3')
            h5 Gender
          v-col.py-1(cols='5')
            v-select(
              :items='["Male", "Female"]',
              v-model='copy.gender',
              outlined,
              dense,
              :hide-details='true'
            )
        v-row(align='center')
          v-col.py-1(cols='3')
            h5 Birthday
          v-col.py-1(cols='9')
            birthdate-picker(
              :birthdate='copy.birthdate',
              :onUpdate='updateBirthdate'
            )
        v-row(align='center')
          v-col.py-1(cols='3')
            h5 Location
          v-col.py-1(cols='6')
            input.location(v-model='copy.location')
          v-col.py-1(cols='3')
            .white-font--text Ex: Anaheim, CA
</template>
<script>
import { listTimeZones } from 'timezone-support';
import { formatToTimeZone } from 'date-fns-timezone';
export default {
  methods: {
    isCurrentTab(tab) {
      return tab === this.currentTab;
    },
    load(event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      if (
        file.type !== 'image/jpeg' &&
        file.type !== 'image/png' &&
        file.type !== 'image/gif'
      ) {
        this.$toasted.error('Must be jpg, gif or png format.');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        await new Promise((r) => setTimeout(r, 2000));

        const canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

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
        ctx.drawImage(img, 0, 0, width, height);

        const dataurl = canvas.toDataURL(file.type);
        this.copy.image = dataurl;
      };
      reader.readAsDataURL(file);
    },
    updateTimeZone(value) {
      this.copy = Object.assign({}, this.copy, { timeZone: value });
    },
    updateBirthdate(value) {
      this.copy.birthdate = value;
    },

  },
  props: ['user', 'save'],
  data: () => ({
    listTimeZones,
    formatToTimeZone,
    currentTab: 'EDIT PROFILE',
    copy: null,
  }),
  created() {
    this.copy = Object.assign({}, this.user);
    if (!this.copy.timeZone) {
      this.copy = Object.assign({}, this.copy, {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }
  },
  computed: {
    tabs() {
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
    },
    time() {
      return formatToTimeZone(new Date(), 'h:mm A', {
        timeZone: this.copy.timeZone,
      });
    },
  },
};
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
</style>
