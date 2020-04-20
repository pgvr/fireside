import Axios from "axios"
import Vue from "vue"
import App from "./App.vue"
import vuetify from "./plugins/vuetify"
import "./registerServiceWorker"
import router from "./router"
import store from "./store"

Vue.config.productionTip = false

const token = localStorage.getItem("token")
if (token) {
    console.log("found access token in local storage")
    Axios.defaults.headers.common["Authorization"] = "Bearer " + token
}

Axios.interceptors.response.use(
    response => {
        // Return a successful response back to the calling service
        return response
    },
    error => {
        if (error?.response?.status === 401) {
            store.commit("User/authExpired")
        }
        return Promise.reject(error)
    },
)

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
}).$mount("#app")
