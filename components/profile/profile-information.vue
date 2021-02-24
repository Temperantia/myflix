<template lang="pug">
v-col( cols='12', lg='2')
  img(:src='image', alt='user image')
  v-row
    v-col.pt-1.pb-0
      b Gender:
    v-col.pt-1.pb-0.text-right {{ profile.gender || "-" }}
  v-row
    v-col.pt-1.pb-0
      b Birthday:
    v-col.pt-1.pb-0.text-right {{ profile.birthdate ? new Date(profile.birthdate.seconds * 1000).getFullYear() : "-" }}
  v-row
    v-col.pt-1.pb-0
      b Location:
    v-col.pt-1.pb-0.text-right {{ profile.location || "-" }}
  v-row
    v-col.pt-1.pb-0
      b Join Date:
    v-col.pt-1.pb-0.text-right {{ $moment(profile.created.seconds * 1000).format("MMM D, yyyy") }}
  v-row
    v-col.text-center
      nuxt-link(:to='"/flixlist/" + profile.username')
        button.button.flixlist FlixList
  h3.title-border INFORMATION
  v-container(fluid)
    v-row
      v-col.pt-1.pb-0
        b Reviews:
      v-col.pt-1.pb-0.text-right {{ profile.reviews.length }}
    v-row
      v-col.pt-1.pb-0
        b Suggestions:
      v-col.pt-1.pb-0.text-right {{ profile.suggestions.length }}
    v-row
      v-col.pt-1.pb-0
        b Films:
      v-col.pt-1.pb-0.text-right {{ films.length }}
    v-row
      v-col.pt-1.pb-0
        b TV Shows:
      v-col.pt-1.pb-0.text-right {{ tvShows.length }}
</template>
<script lang='ts'>
import { Vue, Component, namespace } from 'nuxt-property-decorator';

const profileModule = namespace('profile');

@Component
export default class ProfileInformation extends Vue {
  @profileModule.State('profile') profile!: any;
  @profileModule.Getter('tvShows') tvShows!: any;
  @profileModule.Getter('films') films!: any;

  get image() {
    return this.profile?.image ?? '/pfp1.png';
  }
}
</script>
