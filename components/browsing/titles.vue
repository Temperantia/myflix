<template lang="pug">
v-container(fluid)
  v-row.subtitle-border
    v-col.pr-0(cols='12', lg='2')
      h1.pageSubHead.font-weight-black {{ show ? "TV SHOWS" : film ? "FILMS" : "TITLES" }}
      h2.pageSubHead_1 {{ parseFloat(source.length).toLocaleString("en") }} titles currently available on Netflix
    v-col.searchContainer(cols='8', offset-lg='2', lg='4')
      input#search.titlePageSearch(
        v-model='search',
        :placeholder='"SEARCH " + (show ? "TV SHOWS" : film ? "FILMS" : "TITLES")'
      )
    v-col#titleSettingIcons.d-flex.align-center.justify-end(cols='3', lg='4')
      img.click.icon.mr-2(
        v-if='gallery',
        @click='gallery = false',
        src='/list.png'
      )
      img.click.icon.mr-2(v-else, @click='gallery = true', src='/gallery.png')
      img.click.icon(@click='settings = !settings', src='/gear.png')
      .window.pa-2.border.white-font--border(v-if='settings')
        v-checkbox.my-1(
          label='Show completed',
          v-model='completed',
          dense,
          hide-details,
          v-if='connected'
        )
        v-checkbox.my-1(
          label='Show currently watching',
          v-model='watching',
          dense,
          hide-details,
          v-if='(show || !film) && connected'
        )
        v-checkbox.my-1(
          label='Netflix Original only',
          v-model='original',
          dense,
          hide-details
        )
  v-row.ma-0
    v-col(cols='12', lg='2') Genre
      v-select(
        :items='["All", ...categories]',
        v-model='category',
        outlined,
        dense
      )
    v-col(cols='12', lg='2') Rating
      v-select(
        :items='["All", ...Object.values(maturities)]',
        v-model='maturity',
        outlined,
        dense
      )
    v-col(cols='12', lg='2') Sort
      v-select(
        :items='["Most Popular", "Netflix Original", "Release date (Newest first)", "Release date (Oldest first)", "Alphabetical (A - Z)"]',
        v-model='sort',
        outlined,
        dense
      )
  title-list(:source='source', :gallery='gallery')
</template>
<script lang='ts'>
import categories from '~/netflix/data/categories.json';
import { Vue, Component, namespace, Prop } from 'nuxt-property-decorator';

const localStorageModule = namespace('localStorage');
const browseModule = namespace('browse');
const titleModule = namespace('title');

@Component
export default class Titles extends Vue {
  @Prop({ type: Boolean }) show!: boolean;
  @Prop({ type: Boolean }) film!: boolean;
  @browseModule.State('titles') titles!: any;
  @titleModule.State('maturities') maturities!: any;
  @localStorageModule.Getter('flixlist') flixlist!: any;
  gallery = false;
  settings = false;
  category = 'All';
  maturity = 'All';
  sort = 'Alphabetical (A - Z)';
  completed = false;
  watching = false;
  original = false;
  search = '';
  categories = categories;
  now = Date.now();
  nowYear = new Date().getFullYear();
  map: any = {
    a: 'á|à|ã|â|À|Á|Ã|Â',
    e: 'é|è|ê|É|È|Ê',
    i: 'í|ì|î|Í|Ì|Î',
    o: 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
    u: 'ú|ù|û|ü|Ú|Ù|Û|Ü',
    c: 'ç|Ç',
    n: 'ñ|Ñ',
  };

  mounted() {
    if (this.$route.params.category) {
      this.category = this.$route.params.category;
    }
  }

  slugify(str: string): string {
    for (const pattern in this.map) {
      str = str.replace(new RegExp(this.map[pattern], 'g'), pattern);
    }
    return str;
  }

  get source() {
    const search = this.slugify(this.search).toLocaleLowerCase();
    return this.titles
      .filter((title: any) => {
        if (title.y === 0 || title.a > this.now || title.y > this.nowYear) {
          return false;
        }
        return (
          ((!this.show && !this.film) || this.show ? title.u : !title.u) &&
          (this.category === 'All' || title.c.includes(this.category)) &&
          (this.maturity === 'All' || title.v === this.maturity) &&
          (this.search === '' ||
            this.slugify(title.t).toLocaleLowerCase().indexOf(search) > -1) &&
          (!this.original || title.o) &&
          (((!this.completed || title.status === 'Completed') &&
            (!this.watching || title.status === 'Watching')) ||
            (this.completed &&
              this.watching &&
              (title.status === 'Completed' || title.status === 'Watching')))
        );
      })
      .map((title: any) => {
        if (this.flixlist?.[title.id]) {
          title.status = this.flixlist[title.id].status;
          if (title.s) {
            title.episodes = this.flixlist[title.id].episodes;
          }
        }
        return title;
      })
      .sort((a: any, b: any) => {
        if (this.sort === 'Most Popular') {
          return a.p - b.p;
        } else if (this.sort === 'Netflix Original') {
          return a.o ? -1 : 1;
        } else if (this.sort === 'Release date (Newest first)') {
          return a.a && b.a ? (a.a > b.a ? -1 : 1) : a.y > b.y ? -1 : 1;
        } else if (this.sort === 'Release date (Oldest first)') {
          return a.a && b.a ? (a.a < b.a ? -1 : 1) : a.y < b.y ? -1 : 1;
        }
      });
  }
}
</script>
<style lang="scss" scoped>
.window {
  position: absolute;
  top: 0;
  right: 50px;
  background-color: $black-body;
}
.titlePageSearch {
  width: 100%;
  background-color: #0f0f0f;
  color: $grey-light;
  border: none;
  padding: 0px 12px;
  height: 40px;
  line-height: 40px;
  border-radius: 3px;
  text-align: center;
}
.pageSubHead {
  font-size: 55px;
  line-height: 55px;
}
.pageSubHead_1 {
  font-size: 16px;
  font-style: italic;
  font-weight: 300;
  line-height: 16px;
  color: #555555;
}
.searchContainer {
  vertical-align: text-bottom;
}
.subtitle-border {
  padding-bottom: 12px;
}
#titleSettingIcons {
  padding-top: 18px;
}
</style>
