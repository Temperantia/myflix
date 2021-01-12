<template lang="pug">
v-row(align='center')
  v-col.pr-lg-0(cols='12', lg='3')
    v-select.mr-lg-3(
      :items='days',
      outlined,
      dense,
      :hide-details='true',
      @change='update',
      v-model='day'
    )
  v-col.px-lg-0(cols='12', lg='3')
    v-select.mr-lg-3(
      :items='months',
      outlined,
      dense,
      :hide-details='true',
      @change='update',
      v-model='month'
    )
  v-col.px-lg-0(cols='12', lg='3')
    v-select.mr-lg-3(
      :items='years',
      outlined,
      dense,
      :hide-details='true',
      @change='update',
      v-model='year'
    )
  v-col.px-lg-0(cols='12', lg='3')
    .white-font--text mm/dd/yyyy
</template>
<script>
export default {
  props: ['birthdate', 'onUpdate'],
  data: () => ({
    day: null,
    month: null,
    year: null,
    daysByMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    months: Array.from({ length: 12 }, (x, i) => i + 1),
    years: Array.from(
      { length: [new Date().getFullYear() - 1900 + 13] },
      (x, i) => i + 1900
    ),
  }),
  created() {
    let birthdate = this.birthdate;
    if (!birthdate) {
      birthdate = new Date(
        new Date().setFullYear(new Date().getFullYear() - 13)
      );
    } else {
      birthdate = new Date(birthdate.seconds * 1000);
    }
    this.day = birthdate.getDate();
    this.month = birthdate.getMonth() + 1;
    this.year = birthdate.getFullYear();
  },
  computed: {
    days() {
      let days = this.daysByMonth[this.month - 1];
      if (this.month === 2 && this.year % 4 === 0) {
        days += 1;
      }
      return Array.from({ length: days }, (x, i) => i + 1);
    },
  },
  methods: {
    update() {
      this.onUpdate(new Date(this.year, this.month - 1, this.day));
    },
  },
};
</script>
