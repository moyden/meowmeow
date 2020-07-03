<template>
  <div class="fixtures-list">
    <div class="view-switch">
      <div @click="switchView('scores')" class="switch-button" :class="{ 'active': showScores }">
        Scores & Results
      </div>
      <div @click="switchView('fixtures')" class="switch-button" :class="{ 'active': !showScores }">
        Fixtures
      </div>
    </div>
    <ol class="gameweeks">
      <li v-for="gameweek in displayed" v-bind:key="gameweek.gameweek">
        <FixturesGameweek
          :gameweek="gameweek.gameweek"
          :matches="gameweek.fixtures" />
      </li>
    </ol>
  </div>
</template>

<script>
import FixturesGameweek from './FixturesGameweek.vue'

import * as d3 from 'd3-array'
import * as cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'FixturesList',

  props: {
    matches: Array
  },

  components: {
    FixturesGameweek
  },

  data: function () {
    return {
      showScores: true
    }
  },

  computed: {
    scores: function () {
      const matches = cloneDeep(this.matches)
      const matchesNewToOld = matches.sort((a, b) => {
        return d3.descending(a.gameweek, b.gameweek)
      })
      return matchesNewToOld.filter(m => {
        return m.status === 'Active' || m.status === 'Complete'
      })
    },

    fixtures: function () {
      const matches = cloneDeep(this.matches)
      const matchesOldToNew = matches.sort((a, b) => {
        return d3.ascending(a.gameweek, b.gameweek)
      })
      return matchesOldToNew.filter(m => {
        return m.status === 'Scheduled'
      })
    },

    displayed: function () {
      if (this.showScores) return this.scores
      else return this.fixtures
    }
  },

  methods: {
    switchView: function (view) {
      if (view === 'scores') this.showScores = true
      else if (view === 'fixtures') this.showScores = false
    }
  }
}
</script>

<style scoped lang="scss">
  .gameweeks {
    list-style: none;
    padding: 0;
  }

  .view-switch {
    border: 1px solid $border-grey;
    display: grid;
    grid-template-columns: 1fr 1fr;
    // margin: 2rem 0 1rem;
  }

  .switch-button {
    cursor: pointer;
    padding: 1em;
    text-align: center;
    text-transform: uppercase;
    user-select: none;

    &.active {
      background-color: rgb(64, 64, 64);
      color: $white;
    }
  }
</style>
