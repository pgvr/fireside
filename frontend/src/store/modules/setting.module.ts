import store from "@/store"
import axios from "axios"
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators"

export interface Setting {
    _id: string
    userId: string
    days: number[]
    startTime: string
    endTime: string
    numPerDay: number
}

@Module({ name: "Setting", store, dynamic: true, namespaced: true })
export default class SettingModule extends VuexModule {
    loading = false
    setting: Setting = {
        _id: "",
        userId: "",
        days: [],
        startTime: "",
        endTime: "",
        numPerDay: 1,
    }

    @Mutation
    setUserId(userId: string) {
        this.setting.userId = userId
    }
    @Mutation
    setDays(days: number[]) {
        this.setting.days = days
    }
    @Mutation
    setStartTime(startTime: string) {
        this.setting.startTime = startTime
    }
    @Mutation
    setEndTime(endTime: string) {
        this.setting.endTime = endTime
    }
    @Mutation
    setNumPerDay(numPerDay: number) {
        this.setting.numPerDay = numPerDay
    }

    @Mutation
    setSetting(setting: Setting) {
        this.setting = setting
    }

    @Mutation
    setLoading(newLoading: boolean) {
        this.loading = newLoading
    }

    @Action
    async getSetting() {
        try {
            const response = await axios.get(`${process.env.VUE_APP_API_URL}/setting/me`)
            return response.data.data
        } catch (error) {
            console.log(error)
        }
    }

    @Action
    async updateSetting(payload: { days: number[]; startTime: string; endTime: string; numPerDay: number }) {
        try {
            console.log("Updating setting")
            const body = {
                days: payload.days,
                startTime: payload.startTime,
                endTime: payload.endTime,
                numPerDay: payload.numPerDay,
            }
            const response = await axios.post(`${process.env.VUE_APP_API_URL}/setting/update`, body)
            console.log(response)

            this.setDays(response.data.data.days)
            this.setStartTime(response.data.data.startTime)
            this.setEndTime(response.data.data.endTime)
            this.setNumPerDay(response.data.data.numPerDay)
        } catch (error) {
            console.log(error)
        }
    }

    @Action
    async deleteSetting() {
        try {
            console.log("Deleting setting")
            const response = await axios.delete(`${process.env.VUE_APP_API_URL}/setting/delete`)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }
}
