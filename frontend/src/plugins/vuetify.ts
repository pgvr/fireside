// src/plugins/vuetify.js

import Vue from "vue"
import Vuetify from "vuetify"
import "vuetify/dist/vuetify.min.css"
import colors from "vuetify/lib/util/colors"

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        themes: {
            dark: {
                primary: colors.deepOrange.base,
                accent: colors.yellow.base,
            },
            light: {
                primary: colors.deepOrange.base,
            },
        },
    },
})
