import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators"
import store from "@/store"
import axios from "axios"

export interface Call {
    callId: string
    conferenceId: string
    phone: string
    createdAt: Date
    completedAt: Date
    commonInterests: string[]
}

@Module({ name: "Call", store, dynamic: true })
export default class CallModule extends VuexModule {
    inQueue = false
    calls: Call[] = []

    @Mutation
    setInQueue(newValue: boolean) {
        this.inQueue = newValue
    }
    @Mutation
    setCalls(newCalls: Call[]) {
        this.calls = newCalls
    }

    @Action
    async getCalls(phone: string) {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/calls/${phone}`)
        if (response.status === 200) {
            // update state with user details
            // route to next page
            const { data } = response.data
            this.setCalls(data)
        } else {
            // register failed
        }
    }
}
