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
    Axios.interceptors.response.use(
        response => {
            return response
        },
        error => {
            // This function is part of a promise chain.
            // It needs to return a value or another promise so the caller knows when it
            // has completed.

            // Pass all non 401s back to the caller.
            if (error.response.status !== 401) {
                return Promise.reject(error)
            }

            const body = {
                refreshToken: localStorage.getItem("refreshToken"),
            }

            // eject removes a previously added interceptor with an id.
            // I don't think you want this, it isn't doing anything.
            // axios.interceptors.response.eject(/* id */);

            // As the refresh request was not being returned, it wasn't part of the
            // promise chain. The callers .then / .catch would be called before the
            // token refresh had completed and you would still have the old token in
            // localStorage.
            return Axios.post(`${process.env.VUE_APP_API_URL}/token/refresh`, body)
                .then(response => {
                    localStorage.setItem("token", response.data.accessToken)
                    localStorage.setItem("refreshToken", response.data.refreshToken)

                    // This is updating the header of the config that's just failed.
                    // It will not update the header of future requests.
                    // error.response.config.headers["Authorization"] = `Bearer ${
                    //   response.data.token
                    // }`;

                    // This will update future request headers
                    Axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.accessToken}`

                    // Still need to return the an error because the original request failed
                    // but added a property to show it can be tried again.
                    error.hasRefreshedToken = true
                    return Promise.reject(error)
                })
                .catch(() => {
                    const tokenError = new Error("Cannot refresh token")
                    // tokenError.originalError = error
                    return Promise.reject(tokenError)
                })
        },
    )
}
Vue.config.productionTip = false

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
}).$mount("#app")
