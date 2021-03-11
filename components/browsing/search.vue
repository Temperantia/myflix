<template lang="pug">
v-autocomplete(
  v-if='nav',
  :items='titles',
  outlined,
  dense,
  :loading='isLoading',
  :hide-details='true',
  no-filter,
  append-icon='mdi-magnify',
  :search-input.sync='value',
  background-color='#0f0f0f',
  placeholder='SEARCH FOR TITLES',
  item-text='t',
  item-value='t',
  width='0'
)
  template(v-slot:item='{ item }')
    nuxt-link.w-100(:to='item.r')
      v-list-item.pa-0
        .searchImage
          img(:src='item.b ? item.b : "/storyPlaceholder.png"', :alt='item.t')
        .searchText {{ item.t }}
v-autocomplete(
  v-else,
  :items='titles',
  :menu-props='{ closeOnContentClick: true }',
  outlined,
  :loading='isLoading',
  dense,
  no-filter,
  :hide-details='true',
  :search-input.sync='value',
  append-icon='mdi-magnify',
  background-color='#0f0f0f',
  item-text='t',
  item-value='t'
)
  template(v-slot:item='{ item }')
    v-list-item(@click='click(item)')
      v-list-item-avatar.rounded-0(width='auto', height='100')
        img(:src='item.b ? item.b : "/storyPlaceholder.png"', :alt='item.t')
      v-list-item-content
        v-list-item-title(v-text='item.t')
</template>
<script lang='ts'>
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator';

@Component
export default class Search extends Vue {
  @Prop({ type: Boolean }) nav!: boolean;

  input: string = '';
  value: string = '';
  titles: any[] = [];
  isLoading: boolean = false;

  click(title: any) {
    this.value = title.t;
    this.$emit('click', {
      id: title.id,
      Poster: title.i,
      route: title.r,
      title: title.t,
      type: title.u ? 'show' : 'movie',
    });
  }

  @Watch('value')
  async onSearchChanged(value: string) {
    if (this.isLoading) return;
    this.isLoading = true;
    this.titles = (await this.$titles.search(value)).hits;
    this.isLoading = false;
  }
}
</script>
<style lang="scss"  scoped>
::v-deep .v-input__slot {
  border: none !important;
}
::v-deep fieldset {
  border: none !important;
}
::v-deep .mdi-magnify {
  color: $red-netflix !important;
}
::v-deep input {
  text-align: center;
}
.searchImage {
  width: 80px;
  height: auto;
}
.searchText {
  display: inline-block;
  padding-left: 15px;
  font-size: 16px;
  font-weight: 500;
}
</style>
