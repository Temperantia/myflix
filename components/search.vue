<template lang="pug">
v-autocomplete(
  v-if='nav',
  :items='items',
  outlined,
  dense,
  :hide-details='true',
  append-icon='mdi-magnify',
  background-color='#0f0f0f',
  placeholder='SEARCH FOR TITLES',
  width='0'
)
  template(v-slot:item='{ item }')
    nuxt-link.w-100(:to='getRoute(item)')
      v-list-item.pa-0
        .searchImage
          img(:src='getImage(item)')
        .searchText {{ item }}
v-autocomplete(
  v-else,
  :items='items',
  v-model='selected',
  :menu-props='{ closeOnContentClick: true }',
  outlined,
  dense,
  :hide-details='true',
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
    items: [],
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
