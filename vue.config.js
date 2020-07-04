module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/variables.scss";`
      }
    }
  },
  pwa: {
    name: 'Meow Meow',
    themeColor: 'rgb(255, 210, 48)',
    msTileColor: 'rgb(255, 210, 48)',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'default'
  }
}
