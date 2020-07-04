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
    themeColor: '#ffd230',
    msTileColor: '#ffd230',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'default'
  }
}
