<template lang="pug">
v-container(fluid, v-if='titles')
  v-row.subtitle-border
    v-col.pr-0(cols='12', lg='2')
      h1.pageSubHead.font-weight-black {{ show ? "TV SHOWS" : film ? "FILMS" : "SEARCH" }}
      h2.pageSubHead_1 {{ (show ? $globals.showCount : film ? $globals.filmCount : $globals.showCount + $globals.filmCount).toLocaleString("en") }} titles currently available on Netflix
    v-col.searchContainer(cols='8', offset-lg='2', lg='4')
      input#search.titlePageSearch(
        v-model='search',
        :placeholder='"SEARCH " + (show ? "TV SHOWS" : film ? "FILMS" : "TITLES")',
        @input='() => (page = 1)'
      )
    v-col#titleSettingIcons.d-flex.align-center.justify-end(cols='3', lg='4')
      img.click.icon.mr-2(
        v-if='gallery',
        @click='gallery = false',
        src='/list.png',
        alt='list icon'
      )
      img.click.icon.mr-2(
        v-else,
        @click='gallery = true',
        src='/gallery.png',
        alt='gallery icon'
      )
      img.click.icon(
        @click='settings = !settings',
        src='/gear.png',
        alt='settings icon'
      )
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
          v-if='connected'
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
    //-v-col(cols='12', lg='2') Rating
      v-select(
        :items='["All", ...Object.values(maturities)]',
        v-model='maturity',
        outlined,
        dense
      )
    //-v-col(cols='12', lg='2') Sort
      v-select(
        :items='["Most Popular", "Netflix Original", "Bingeworthy", "Release date (Newest first)", "Release date (Oldest first)", "Alphabetical (A - Z)"]',
        v-model='sort',
        outlined,
        dense
      )
  title-list(
    :titles='titles',
    :gallery='gallery',
    :page='page',
    :pages='pages',
    @update='(p) => (page = p)'
  )
</template>
<script lang='ts'>
import categories from '~/scraping/data/categories.json';
import { Vue, Component, namespace, Prop } from 'nuxt-property-decorator';
import AsyncComputed from 'vue-async-computed-decorator/dist';

const localStorageModule = namespace('localStorage');
const titleModule = namespace('title');

@Component
export default class Titles extends Vue {
  @Prop({ type: Boolean }) show!: boolean;
  @Prop({ type: Boolean }) film!: boolean;
  @titleModule.State('maturities') maturities!: any;
  @localStorageModule.State('connected') connected!: boolean;
  @localStorageModule.Getter('flixlist') flixlist!: any;
  @localStorageModule.Getter('titleStatus') titleStatus!: any;
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
  page = 1;

  mounted() {
    if (this.$route.params.category) {
      this.category = this.$route.params.category;
    }

    if (this.$route.query.search) {
      this.search = (this.$route.query.search as string) ?? '';
    }
  }

  get pages() {
    return Math.ceil(
      (this.show
        ? this.$globals.showCount
        : this.film
        ? this.$globals.filmCount
        : this.$globals.showCount + this.$globals.filmCount) / 24
    );
  }

  @AsyncComputed()
  async titles() {
    let search = this.search;
    if (this.category !== 'All') {
      search += ' ' + this.category;
    }
    let filters = [];
    if (this.show) {
      filters.push('u=1');
    } else if (this.film) {
      filters.push('u=0');
    }
    if (this.original) {
      filters.push('o=1');
    }
    const options: any = {
      offset: 24 * (this.page - 1),
      limit: 24,
    };
    if (filters.length > 0) {
      options.filters = filters.join(' AND ');
    }
    return ((await this.$titles.search(search, options)).hits as any)
      .map((hit: any) => {
        hit.i =
          hit.i === 'https://m.media-amazon.png'
            ? 'storyPlaceholder.png'
            : hit.i;
        return hit;
      })
      .filter((title: any) => {
        const status = this.titleStatus(title.id);
        if (title.y === 0 || title.a > this.now || title.y > this.nowYear) {
          return false;
        }
        return (
          ((!this.completed || status === 'Completed') &&
            (!this.watching || status === 'Watching')) ||
          (this.completed &&
            this.watching &&
            (status === 'Completed' || status === 'Watching'))
        );
      });
    /* .sort((a: any, b: any) => {
        if (this.sort === 'Most Popular') {
          return a.p - b.p;
        } else if (this.sort === 'Netflix Original') {
          return a.o ? -1 : 1;
        } else if (this.sort === 'Bingeworthy') {
          return a.h > b.h ? -1 : 1;
        } else if (this.sort === 'Release date (Newest first)') {
          return a.a && b.a ? (a.a > b.a ? -1 : 1) : a.y > b.y ? -1 : 1;
        } else if (this.sort === 'Release date (Oldest first)') {
          return a.a && b.a ? (a.a < b.a ? -1 : 1) : a.y < b.y ? -1 : 1;
        }
        return 0;
      }); */
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
