import fbDb from "@/utils/firebase"
import Vue from "vue"
import Vuex from "vuex"
import { firestoreAction, vuexfireMutations } from "vuexfire"
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        queue: null,
        conference: null,
    },
    getters: {
        callStatusFirebase: state => {
            if (state.queue) {
                return "queue"
            } else if (state.conference) {
                return "calling"
            } else {
                return "idle"
            }
        },
    },
    mutations: vuexfireMutations,
    actions: {
        bindRef: firestoreAction(function(context, payload) {
            context.bindFirestoreRef(payload.name, payload.ref, payload.options)
        }),

        init: firestoreAction(function(context, payload) {
            context.bindFirestoreRef("queue", fbDb.collection("queues").doc(payload.userId))
            context.bindFirestoreRef("conference", fbDb.collection("conferences").doc(payload.userId))
        }),
    },
})
