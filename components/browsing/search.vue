<template lang="pug">
v-autocomplete(
  v-if='nav',
  :items='titles',
  outlined,
  dense,
  :hide-details='true',
  append-icon='mdi-magnify',
  :search-input='input',
  :filter='search',
  background-color='#0f0f0f',
  placeholder='SEARCH FOR TITLES',
  cache-items,
  item-text='t',
  item-value='t',
  :value='value',
  width='0'
)
  template(v-slot:item='{ item }')
    nuxt-link.w-100(:to='item.r')
      v-list-item.pa-0
        .searchImage
          img(:src='item.b')
        .searchText {{ item.t }}
v-autocomplete(
  v-else,
  :items='titles',
  :menu-props='{ closeOnContentClick: true }',
  outlined,
  dense,
  :hide-details='true',
  cache-items,
  :search-input='input',
  :filter='search',
  :value='value',
  append-icon='mdi-magnify',
  background-color='#0f0f0f'
)
  template(v-slot:item='{ item }')
    v-list-item(@click='click(item)')
      v-list-item-avatar.rounded-0(width='auto', height='100')
        img(:src='item.b')
      v-list-item-content
        v-list-item-title(v-text='item.t')
</template>
<script lang='ts'>
import { Vue, Component, namespace, Prop } from 'nuxt-property-decorator';

const browseModule = namespace('browse');

@Component
export default class Search extends Vue {
  @Prop({ type: Boolean }) nav!: boolean;
  @browseModule.State('titles') titles!: Function;
  input: string = '';
  value: string = '';
  items: any[] = [];
  map: any = {
    a: 'á|à|ã|â|À|Á|Ã|Â',
    e: 'é|è|ê|É|È|Ê',
    i: 'í|ì|î|Í|Ì|Î',
    o: 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
    u: 'ú|ù|û|ü|Ú|Ù|Û|Ü',
    c: 'ç|Ç',
    n: 'ñ|Ñ',
  };

  click(item: any) {
    this.value = item.t;
    this.$emit('click', item);
  }

  search(item: any, queryText: string, itemText: any) {
    return (
      this.slugify(item.t)
        .toLocaleLowerCase()
        .indexOf(this.slugify(queryText).toLocaleLowerCase()) > -1
    );
  }

  slugify(str: string) {
    for (const pattern in this.map) {
      str = str.replace(new RegExp(this.map[pattern], 'g'), pattern);
    }
    return str;
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
