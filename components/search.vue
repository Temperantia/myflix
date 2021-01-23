<template lang="pug">
v-autocomplete(
  v-if='nav',
  :items='items',
  outlined,
  dense,
  :hide-details='true',
  append-icon='mdi-magnify',
  :search-input='input',
  :filter='search',
  background-color='#0f0f0f',
  placeholder='SEARCH FOR TITLES',
  cache-items,
  width='0'
)
  template(v-slot:item='{ item }')
    nuxt-link.w-100(:to='getRoute(item)')
      v-list-item
        v-row
          v-col(cols='5')
            img(:src='getImage(item)')
          v-col(cols='7') {{ item }}
v-autocomplete(
  v-else,
  :items='items',
  v-model='selected',
  :menu-props='{ closeOnContentClick: true }',
  outlined,
  dense,
  :hide-details='true',
  cache-items,
  :search-input='input',
  :filter='search',
  append-icon='mdi-magnify',
  background-color='#0f0f0f'
)
  template(v-slot:item='{ item }')
    v-list-item(@click='click(item)')
      v-list-item-avatar.rounded-0(width='auto', height='100')
        img(:src='getImage(item)')
      v-list-item-content
        v-list-item-title(v-text='item')
</template>
<script>
export default {
  data: () => ({
    similar: '',
    selected: '',
    input: '',
    items: [],
    map: {
      a: 'á|à|ã|â|À|Á|Ã|Â',
      e: 'é|è|ê|É|È|Ê',
      i: 'í|ì|î|Í|Ì|Î',
      o: 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
      u: 'ú|ù|û|ü|Ú|Ù|Û|Ü',
      c: 'ç|Ç',
      n: 'ñ|Ñ',
    },
  }),
  props: { nav: Boolean, title: Object },
  methods: {
    click(value) {
      this.similar = value;
      this.selected = value;
      this.$emit(
        'click',
        this.getId(value),
        value,
        this.getImage(value),
        this.getRoute(value)
      );
    },
    getRoute(title) {
      return this.$search.find((item) => item.t === title).r;
    },
    getImage(title) {
      return this.$search.find((item) => item.t === title).i;
    },
    getId(title) {
      return this.$search.find((item) => item.t === title).id;
    },
    search(item, queryText, itemText) {
      return (
        this.slugify(itemText)
          .toLocaleLowerCase()
          .indexOf(this.slugify(queryText).toLocaleLowerCase()) > -1
      );
    },
    slugify(str) {
      for (const pattern in this.map) {
        str = str.replace(new RegExp(this.map[pattern], 'g'), pattern);
      }
      return str;
    },
  },
  created() {
    this.items = this.$search.map((item) => item.t);
  },
};
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
</style>
