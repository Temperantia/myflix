<template lang="pug">
v-autocomplete(v-if='nav', :items='items')
  template(v-slot:item='{ item }')
    nuxt-link(style='width: 100%', :to='getRoute(item)')
      v-list-item
        v-list-item-avatar
          img(:src='getImage(item)')
        v-list-item-content
          v-list-item-title(v-text='item')
v-autocomplete(
  v-else,
  :items='items',
  v-model='selected',
  :menu-props='{ closeOnContentClick: true }'
)
  template(v-slot:item='{ item }')
    v-list-item(@click='click(item)')
      v-list-item-avatar
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
  props: ['nav', 'title'],
  methods: {
    click(value) {
      this.similar = value;
      this.selected = value;
      this.$emit('click', value, this.getImage(value), this.getRoute(value));
    },
    getRoute(title) {
      return  this.$search.find((item) => item.t === title).r;
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
