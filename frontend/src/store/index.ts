import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        phone: "",
        city: "",
        hobbies: [],
        job: "",
        language: "English",
    },
    mutations: {
        setPhone(state, payload) {
            state.phone = payload.phone
        },
        setCity(state, payload) {
            state.city = payload.city
        },
        setHobbies(state, payload) {
            state.hobbies = payload.hobbies
        },
        setJob(state, payload) {
            state.job = payload.job
        },
    },
    actions: {},
    modules: {},
})
