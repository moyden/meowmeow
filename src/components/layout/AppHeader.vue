<template>
  <div class="app-header">
    <header class="page-header">
      <h1 class="page-title">SPORT</h1>
    </header>
    <nav class="navigation">
      Football
      <svg class="chevron" width="31.9" height="32" viewBox="0 0 31.9 32"><path d="M29 16L3 0v7.2L17.6 16 3 24.8V32z"></path></svg>
      Meow Meow League
    </nav>
  </div>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style scoped lang="scss">
  .app-header {}

  .page-header {
    background-color: $bbc-yellow;
    padding: .85em 1.15em;
    position: relative;

    &:before, &:after {
      background-color: $bbc-yellow;
      content: '';
      display: block;
      height: 100%;
      position: absolute;
      top: 0;
      width: calc(50vw - 50%);
    }

    &:before { left: calc(-50vw + 50%); }
    &:after { right: calc(-50vw + 50%); }
  }

  .page-title {
    font-size: 32px;
    font-weight: 700;
    margin: auto;
    padding: 0;
    width: 100%;
  }

  .navigation {
    background-color: $black;
    color: $white;
    padding: 6px 16px;
    position: relative;
    width: 100%;

    &:before, &:after {
      background-color: $black;
      content: '';
      display: block;
      height: 100%;
      position: absolute;
      top: 0;
      width: calc(50vw - 50%);
    }

    &:before { left: calc(-50vw + 50%); }
    &:after { right: calc(-50vw + 50%); }
  }

  .chevron {
    fill: white;
    height: .85em;
    width: .85em;
  }
</style>
