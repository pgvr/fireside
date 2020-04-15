import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators"
import store from "@/store"
import router from "@/router"
import axios from "axios"

@Module({ name: "Call", store, dynamic: true })
export default class CallModule extends VuexModule {
    inQueue = false

    @Mutation
    setInQueue(newValue: boolean) {
        this.inQueue = newValue
    }
}
