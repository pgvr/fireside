module.exports = {
    transpileDependencies: ["vuetify"],
    pwa: {
        workboxPluginMode: "InjectManifest",
        workboxOptions: {
            swSrc: "./src/sw.js",
            swDest: "service-worker.js",
            // ...other Workbox options...
            exclude: [/_redirects/],
        },
    },
}
