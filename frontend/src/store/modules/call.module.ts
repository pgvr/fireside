import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators"
import store from "@/store"
import axios from "axios"
import { User } from "./user.module"

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
    callInProgress = false
    calls: Call[] = []
    updateQueueInterval = -1
    refreshQueueCounter = 0

    @Mutation
    setInQueue(newValue: boolean) {
        this.inQueue = newValue
    }
    @Mutation
    setCallInProgress(newValue: boolean) {
        this.callInProgress = newValue
    }
    @Mutation
    setCalls(newCalls: Call[]) {
        this.calls = newCalls
    }
    @Mutation
    setUpdateQueueInterval(newInterval: number) {
        this.updateQueueInterval = newInterval
    }
    @Mutation
    resetInterval() {
        clearInterval(this.updateQueueInterval)
        this.updateQueueInterval = -1
    }
    @Mutation
    increaseQueueCounter() {
        this.refreshQueueCounter = this.refreshQueueCounter + 1
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

    @Action
    async findConference(user: User) {
        try {
            this.setCallInProgress(true)
            const response = await axios.post(`${process.env.VUE_APP_API_URL}/conference`, { ...user })
            const { data } = response.data
            if (data.queue) {
                // put user in queue
                this.setInQueue(true)
                const interval = setInterval(async () => {
                    console.log("checking if still in queue")
                    if (this.refreshQueueCounter === 5) {
                        console.log("Queue timeout, removing user from queue")
                        this.leaveCallQueue(user)
                    } else {
                        this.increaseQueueCounter()
                        const response = await axios.get(
                            `${process.env.VUE_APP_API_URL}/calls/stillInQueue/${user.phone}`,
                        )
                        const { data } = response.data
                        if (!data.queue) {
                            // not in queue anymore, call started
                            console.log("not in queue anymore, call must have started")
                            this.setInQueue(false)
                            this.resetInterval()
                        }
                    }
                }, 5000)
                this.setUpdateQueueInterval(interval)
            } else if (data.queue === false) {
                // call is being initiated
                this.setInQueue(false)
            }
        } catch (error) {
            this.setInQueue(false)
            this.setCallInProgress(false)
        }
    }

    @Action
    async resetCall() {
        // bring to initial call screen because someone declined or something else went wrong
        this.setInQueue(false)
        this.setCallInProgress(false)
    }

    @Action
    async leaveCallQueue(user: User) {
        this.resetInterval()
        this.setInQueue(false)
        this.setCallInProgress(false)
        await axios.post(`${process.env.VUE_APP_API_URL}/conference/leaveQueue`, { ...user })
        // bring back to initial call screen
    }

    @Action
    async completeCall(phone: string) {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/calls/isCallActive/${phone}`)
        const { data } = response.data
        if (data.callActive) {
            // dont allow to complete because call is still active
            console.log("call still active")
        } else {
            // bring user to post call screen
            console.log("call finished, navigate to post call")
        }
    }
}
