module.exports = {
    transpileDependencies: ["vuetify"],
    pwa: {
        workboxOptions: {
            // ...other Workbox options...
            exclude: [/_redirects/],
        },
    },
}
