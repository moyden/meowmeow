<template>
  <div class="league-table">
    <div v-if="liveStandings" @click="toggleLive" class="as-it-stands" :class="{ 'as-it-stands--active': isLive }">
      As It Stands
    </div>

    <table class="standings">
      <thead>
        <tr class="header-row header-row--long">
          <th class="cell rank"></th>
          <th class="cell change"></th>
          <th class="cell team-name">Team</th>
          <th class="cell played">Played</th>
          <th class="cell won">Won</th>
          <th class="cell drawn">Drawn</th>
          <th class="cell lost">Lost</th>
          <th class="cell fantasy-points">+</th>
          <th class="cell points">Points</th>
          <th class="cell form">Form</th>
        </tr>
        <tr class="header-row header-row--short">
          <th class="cell rank"></th>
          <th class="cell change"></th>
          <th class="cell team-name">Team</th>
          <th class="cell played">P</th>
          <th class="cell won">W</th>
          <th class="cell drawn">D</th>
          <th class="cell lost">L</th>
          <th class="cell fantasy-points">+</th>
          <th class="cell points">Pts</th>
          <th class="cell form">Form</th>
        </tr>
      </thead>
      <tbody>
        <tr class="team-row" v-for="team in displayedStandings" v-bind:key="team.entryId">
          <td class="cell rank">{{ team.rank }}</td>
          <td class="cell change"><div class="movement" :class="[`movement--${team.movement}`]"></div></td>
          <td class="cell team-name">
            <a :href="`https://draft.premierleague.com/entry/${team.entryId}/event/${currentGameweek}`" target="_blank" rel="noreferrer">{{ team.team }}</a>
            <span class="manager">
              {{ team.manager }}
            </span>
          </td>
          <td class="cell played">{{ team.played }}</td>
          <td class="cell won">{{ team.won }}</td>
          <td class="cell drawn">{{ team.drawn }}</td>
          <td class="cell lost">{{ team.lost }}</td>
          <td class="cell fantasy-points">{{ team.fantasyPoints }}</td>
          <td class="cell points">{{ team.points }}</td>
          <td class="cell form">
            <span v-for="(result, index) in team.form" :key="index" :class="[`result`, `result--${result}`]">{{ result }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import * as cloneDeep from 'lodash/cloneDeep'
import * as d3 from 'd3-array'

export default {
  name: 'LeagueTable',

  props: {
    initialStandings: Array,
    fixturesByGameweek: Array,
    currentGameweek: Number
  },

  data: function () {
    return {
      isLive: true
    }
  },

  computed: {
    confirmedStandings: function () {
      const completeFixtures = this.fixturesByGameweek.filter(f => f.status === 'Complete')
      if (!completeFixtures) return this.initialStandings

      return this.applyFixtures(this.initialStandings, completeFixtures)
    },

    liveStandings: function () {
      const liveFixtures = this.fixturesByGameweek.filter(f => f.status === 'Active')
      if (liveFixtures.length === 0) return null

      return this.applyFixtures(this.confirmedStandings, liveFixtures)
    },

    displayedStandings: function () {
      if (this.liveStandings && this.isLive) return this.liveStandings
      else return this.confirmedStandings
    }
  },

  methods: {
    applyFixtures: function (standings_, gameweekFixtures) {
      const standings = cloneDeep(standings_)

      const entries = standings.reduce((obj, row) => {
        obj[row.entryId] = row
        return obj
      }, {})

      for (let gameweek of gameweekFixtures) {
        standings.forEach(standing => standing.oldRank = standing.rank)

        for (let fixture of gameweek.fixtures) {
          const home = entries[fixture.homeEntryId]
          const away = entries[fixture.awayEntryId]
          home.played += 1
          away.played += 1
          home.fantasyPoints += fixture.homePoints
          away.fantasyPoints += fixture.awayPoints
          if (fixture.outcome === 'Home Win') {
            home.won += 1
            away.lost += 1
            home.points += 3
            home.form = [...home.form.slice(1, home.form.length), 'W']
            away.form = [...away.form.slice(1, away.form.length), 'L']
          } else if (fixture.outcome === 'Away Win') {
            home.lost += 1
            away.won += 1
            away.points += 3
            home.form = [...home.form.slice(1, home.form.length), 'L']
            away.form = [...away.form.slice(1, away.form.length), 'W']
          } else {
            home.drawn += 1
            away.drawn += 1
            home.points += 1
            away.points += 1
            home.form = [...home.form.slice(1, home.form.length), 'D']
            away.form = [...away.form.slice(1, away.form.length), 'D']
          }
        }

        standings.sort((a, b) => d3.descending(a.points, b.points) || d3.descending(a.fantasyPoints, b.fantasyPoints))
        standings.forEach((row, i) => {
          row.rank = i + 1
          if (row.rank < row.oldRank) row.movement = 'up'
          else if (row.rank > row.oldRank) row.movement = 'down'
          else row.movement = null
        })
      }

      return standings
    },

    toggleLive: function () {
      this.isLive = !this.isLive
    }
  }
}
</script>

<style scoped lang="scss">

  a {
    color: rgb(0, 0, 0);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  .league-table {
  }

  .as-it-stands {
    background-color: $border-grey;
    color: $form-grey;
    cursor: pointer;
    display: inline-block;
    font-size: .85em;
    font-weight: 700;
    margin-bottom: 1rem;
    padding: .25em .5em;
    text-transform: uppercase;
    user-select: none;

    &--active {
      background-color: $bbc-blue;
      color: $white;
    }
  }

  .standings {
    border-collapse: collapse;
    font-size: .9em;
    width: 100%;
  }

  .header-row {
    background-color: $shade-grey;
    border-bottom: 1px solid $border-grey;
    font-weight: 700;
    text-align: right;
    padding: 1.15em .3em .3em;

    &--long {
      display: none;
    }
  }

  .cell {
    border-bottom: 1px solid $border-grey;
    line-height: 1em;
    padding: .6em .3em;
    text-align: right;
  }

  .team-row:nth-child(1) > .cell,
  .team-row:nth-child(7) > .cell {
    border-bottom: 1px dashed $black;
  }

  .rank {
    padding-left: 1em;
    text-align: left;
    width: 2em;
  }

  .change {
    display: none;
    width: 1.5em;
  }

  .played,
  .won,
  .drawn,
  .lost,
  .fantasy-points {
    width: 2.75em;
  }

  .played,
  .fantasy-points {
    display: none;
  }

  .points {
    font-weight: 700;
    padding-right: 1em;
    width: 3.75em;
  }

  .form {
    border-left: 1px solid $border-grey;
    display: none;
    padding-left: 1em;
    padding-right: .25em;
    text-align: left;
  }

  .team-name,
  .team-name {
    font-weight: 700;
    text-align: left;
    vertical-align: middle;
  }

  .movement {
    display: block;
    vertical-align: middle;
    width: 10px;
    margin: 0 auto;
    border-style: solid;
    border-color: $border-grey;
    border-width: 1px 0;

    &--up {
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-top-width: 0;
      border-bottom-color: $form-green;
    }

    &--down {
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-bottom-width: 0;
      border-top-color: $form-red;
    }
  }

  .manager {
    color: $form-grey;
    display: none;
    font-size: .75em;
    font-weight: 400;
    margin-left: .25em;
  }

  .result {
    background-color: black;
    color: white;
    display: inline-block;
    font-size: .8em;
    height: 16px;
    line-height: 16px;
    margin-right: 2px;
    text-align: center;
    vertical-align: center;
    width: 16px;

    &--W { background-color: $form-green }
    &--L { background-color: $form-red }
    &--D { background-color: $form-grey }
  }

  @media all and (min-width: 380px) {
    .standings {
      font-size: 1em;
    }

    .change {
      display: table-cell;
    }
  }

  @media all and (min-width: 480px) {
    .manager {
      display: inline;
    }
  }

  @media all and (min-width: 600px) {
    .header-row {
      &--long { display: table-row; }
      &--short { display: none; }
    }

    .standings__rank {
      width: 1.5em;
    }

    .rank {
      width: 4%;
      text-align: center;
    }

    .change {
      width: 3%;
    }

    .played,
    .won,
    .drawn,
    .lost,
    .fantasy-points,
    .points {
      width: 8.5%;
    }

    .fantasy-points,
    .played {
      display: table-cell;
    }
  }

  @media all and (min-width: 800px) {
    .form {
      display: table-cell;
    }
  }
</style>
