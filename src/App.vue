<template>
  <div id="app">
    <AppHeader />

    <section class="league-table">
      <LeagueTable
        :initialStandings="initialStandings"
        :fixturesByGameweek="fixturesByGameweek"
        :currentGameweek="currentGameweek" />
    </section>

    <section class="fixtures-list">
      <FixturesList :matches="fixturesByGameweek" />
    </section>
  </div>
</template>

<script>
import AppHeader from './components/layout/AppHeader.vue'
import LeagueTable from './components/LeagueTable.vue'
import FixturesList from './components/FixturesList.vue'

import { json as d3json } from 'd3-fetch'

export default {
  name: 'App',

  components: {
    AppHeader,
    LeagueTable,
    FixturesList
  },

  data: function () {
    return {
      initialStandings: [],
      fixtures: [],
      scores: [],
      gameweeks: []
    }
  },

  computed: {
    fixturesByGameweek: function () {
      const standings = this.initialStandings
      const fixtures = this.fixtures
      const scores = this.scores
      const gameweeks = this.gameweeks

      const teamsById = standings.reduce((obj, team) => {
        obj[team.entryId] = team
        return obj
      }, {})

      const gameweekStatuses = gameweeks.reduce((obj, gw) => {
        obj[gw.gameweekId] = gw.gameweekStatus
        return obj
      }, {})

      const scoresByGameweek = scores.reduce((obj, score) => {
        if (!obj[score.gameweek]) obj[score.gameweek] = {}
        obj[score.gameweek][score.entryId] = score.points
        return obj
      }, {})

      fixtures.forEach(f => {
        f.status = gameweekStatuses[f.gameweek] || 'Scheduled'

        if (scoresByGameweek[f.gameweek]) {
          f.homePoints = scoresByGameweek[f.gameweek][f.homeEntryId]
          f.awayPoints = scoresByGameweek[f.gameweek][f.awayEntryId]
        } else {
          f.homePoints = 0
          f.awayPoints = 0
        }

        if (f.homePoints > f.awayPoints) {
          f.outcome = 'Home Win'
        }
        else if (f.homePoints < f.awayPoints) {
          f.outcome = 'Away Win'
        }
        else {
          f.outcome = 'Draw'
        }

        const home = teamsById[f.homeEntryId]
        const away = teamsById[f.awayEntryId]
        f.homeTeam = home.team
        f.homeManager = home.manager
        f.awayTeam = away.team
        f.awayManager = away.manager
      })

      const fixtureGameweeks = [...new Set(fixtures.map(f => f.gameweek))]
      const fixturesByGameweek = fixtureGameweeks.map(gw => {
        return {
          gameweek: gw,
          status: gameweekStatuses[gw] ? gameweekStatuses[gw] : 'Scheduled',
          fixtures: fixtures.filter(f => f.gameweek === gw)
        }
      })

      return fixturesByGameweek
    },

    currentGameweek: function () {
      if (this.gameweeks.length !== 0) {
        return this.gameweeks[this.gameweeks.length - 1].gameweekId + 9
      } else {
        return null
      }
    }
  },

  methods: {
    fetchData: async function () {
      const sheetId = '1Od21mdicDGHzXYOSNgvsoJMUjdcRviGsTqwCHa355Gw'
      const apiKey = 'AIzaSyCYIcTw_vmCmmEE7S8o6CcpcQmWFx1Gw5o'
      const ranges = [
        `'Initial Table'!A1:K`,
        `'Fixtures'!A1:D`,
        `'Scores'!A1:C`,
        `'Gameweek'!A1:B`
      ].join(`&ranges=`)
      const requestUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchGet?ranges=${ranges}&majorDimension=ROWS&key=${apiKey}`
      const dataRanges = await d3json(requestUrl)

      const parseRanges = dataRanges.valueRanges.map(range => {
        const header = range.values[0]
        const body = range.values.slice(1, range.values.length).map(row => {
          const obj = {}
          header.forEach((columnName, i) => {
            obj[columnName] = row[i]
          })
          for (let key of Object.keys(obj)) {
            if (!isNaN(+obj[key])) obj[key] = +obj[key]
          }
          return obj
        })
        return body
      })

      for (let row of parseRanges[0]) {
        row.form = row.form.split('')
      }

      this.initialStandings = parseRanges[0],
      this.fixtures = parseRanges[1],
      this.scores = parseRanges[2],
      this.gameweeks = parseRanges[3]
    }
  },

  mounted: function () {
    this.fetchData()
  }
}
</script>

<style>
* { box-sizing: border-box; }

html {
  font-size: 14px;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, Ubuntu, roboto, noto, segoe ui, arial, sans-serif;
  margin: 0 auto;
  max-width: 900px;
}

#app {

}

.league-table,
.fixtures-list {
  padding: .5em;
}
</style>
