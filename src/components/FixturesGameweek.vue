<template>
  <div class="fixtures-gameweek">
    <div class="header">
      Gameweek {{ gameweek }}
    </div>
    <ul class="matches">
      <li class="match" v-for="match in matches" v-bind:key="match.fixtureId">
        <FixturesMatch v-bind="match" />
      </li>
    </ul>
  </div>
</template>

<script>
import FixturesMatch from './FixturesMatch.vue'

export default {
  name: 'FixturesGameweek',

  props: {
    gameweek: Number,
    matches: Array
  },

  components: {
    FixturesMatch
  }
}
</script>

<style scoped lang="scss">
  .header {
    background-color: $shade-grey;
    font-size: .85em;
    padding: .6em;
    text-transform: uppercase;
  }

  .matches {
    list-style: none;
    padding: 0;
  }

  .match {
    border-bottom: 1px solid $border-grey;
    margin: 1em 0;
    padding-bottom: .5em;

    &:last-child {
      border-bottom: none;
    }
  }
</style>
