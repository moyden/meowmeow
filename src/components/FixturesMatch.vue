<template>
  <div class="fixtures-match">
    <div v-if="isScheduled" class="home-team">
      {{ homeTeam }}
    </div>
    <div v-else class="home-team">
      <a :href="`https://draft.premierleague.com/entry/${homeEntryId}/event/${gameweek + 9}`" target="_blank" rel="noreferrer">
        {{ homeTeam }}
      </a>
    </div>
    <div class="home-manager">{{ homeManager }}</div>
    <div class="home-points" :class="{ 'active': isActive, 'scheduled': isScheduled }">{{ homePoints }}</div>
    <div v-if="isScheduled" class="away-team">
      {{ awayTeam }}
    </div>
    <div v-else class="away-team">
      <a :href="`https://draft.premierleague.com/entry/${awayEntryId}/event/${gameweek + 9}`" target="_blank" rel="noreferrer">
        {{ awayTeam }}
      </a>
    </div>
    <div class="away-manager">{{ awayManager }}</div>
    <div class="away-points" :class="{ 'active': isActive, 'scheduled': isScheduled }">{{ awayPoints }}</div>
    <div class="status">{{ status === 'Complete' ? 'FT' : '' }}</div>
  </div>
</template>

<script>
export default {
  name: 'FixturesMatch',

  props: {
    gameweek: Number,
    homeEntryId: Number,
    homeTeam: String,
    homeManager: String,
    homePoints: Number,
    awayEntryId: Number,
    awayTeam: String,
    awayManager: String,
    awayPoints: Number,
    status: String
  },

  computed: {
    isActive: function () {
      return this.status === 'Active'
    },

    isScheduled: function () {
      return this.status === 'Scheduled'
    }
  }
}
</script>

<style scoped lang="scss">
  $score-box-size: 2.125em;

  a {
    color: rgb(0, 0, 0);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  .fixtures-match {
    display: grid;
    font-size: .9rem;
    grid-gap: 1px;
    grid-template-areas: "home-team    home-points away-points away-team"
                         "home-manager status      status      away-manager";
    grid-template-columns: 1fr 2.125em 2.125em 1fr;
  }

  .home-team { grid-area: home-team; }
  .home-manager { grid-area: home-manager; }
  .home-points { grid-area: home-points; }
  .away-team { grid-area: away-team; }
  .away-manager { grid-area: away-manager; }
  .away-points { grid-area: away-points; }
  .status { grid-area: status; }

  .home-team,
  .home-manager {
    text-align: right;
  }

  .home-team,
  .away-team {
    font-weight: 700;
    line-height: $score-box-size;
    padding: 0 1rem;
  }

  .home-points,
  .away-points {
    background-color: $bbc-yellow;
    font-weight: 700;
    line-height: $score-box-size;
    max-height: $score-box-size;
    text-align: center;

    &.active {
      background-color: $bbc-blue;
      color: $white;
    }

    &.scheduled {
      background-color: $border-grey;
      color: $form-grey;
    }
  }

  .home-manager,
  .away-manager {
    color: $form-grey;
    font-size: .85em;
    line-height: $score-box-size;
    padding: 0 1rem;
  }

  .status {
    color: $form-grey;
    font-size: .85em;
    line-height: $score-box-size;
    text-align: center;
  }

  @media screen and (min-width: 600px) {
    .fixtures-match {
      font-size: 1rem;
    }
  }
</style>
