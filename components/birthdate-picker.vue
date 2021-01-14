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
<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator';
import firebase from 'firebase';

@Component
export default class BirthdatePicker extends Vue {
  @Prop() readonly birthdate!: firebase.firestore.Timestamp;
  @Prop() readonly onUpdate!: Function;

  day: number = 0;
  month: number = 0;
  year: number = 0;
  daysByMonth: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  months: number[] = Array.from({ length: 12 }, (x, i) => i + 1);
  years: number[] = Array.from(
    { length: new Date().getFullYear() - 1900 + 13 },
    (x, i) => i + 1900
  );

  created() {
    let birthdate: Date;
    if (!this.birthdate) {
      birthdate = new Date(
        new Date().setFullYear(new Date().getFullYear() - 13)
      );
    } else {
      birthdate = new Date(this.birthdate.seconds * 1000);
    }
    this.day = birthdate.getDate();
    this.month = birthdate.getMonth() + 1;
    this.year = birthdate.getFullYear();
  }
  get days() {
    let days: number = this.daysByMonth[this.month - 1];
    if (this.month === 2 && this.year % 4 === 0) {
      days += 1;
    }
    return Array.from({ length: days }, (x, i) => i + 1);
  }
  update() {
    this.onUpdate(new Date(this.year, this.month - 1, this.day));
  }
}
</script>
