import Axios from "axios"
import Vue from "vue"
import App from "./App.vue"
import vuetify from "./plugins/vuetify"
import "./registerServiceWorker"
import router from "./router"
import store from "./store"

const token = localStorage.getItem("token")
if (token) {
    console.log("found access token in local storage")
    Axios.defaults.headers.common["Authorization"] = "Bearer " + token
    // TODO: add 401 interceptor to get refreshed token
}

Vue.config.productionTip = false

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
}).$mount("#app")
