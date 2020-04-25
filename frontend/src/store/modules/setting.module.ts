import store from "@/store"
import axios from "axios"
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators"
import UiModule from "./ui.module"

const uiState = getModule(UiModule)

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
    setId(_id: string) {
        this.setting._id = _id
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
            this.setLoading(true)
            const response = await axios.get(`${process.env.VUE_APP_API_URL}/setting/me`)
            const { data } = response.data
            this.setSetting({ ...data })
            this.setLoading(false)
            return response.data.data
        } catch (error) {
            console.log(error)
            this.setLoading(false)
            return null
        }
    }

    @Action
    async updateSetting(payload: { days: number[]; startTime: string; endTime: string; numPerDay: number }) {
        try {
            this.setLoading(true)
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

            uiState.showSnackbarMessage("Schedule Updated")
        } catch (error) {
            console.log(error)
        }
        this.setLoading(false)
    }

    @Action
    async deleteSetting() {
        try {
            this.setLoading(true)
            await axios.delete(`${process.env.VUE_APP_API_URL}/setting/delete`)
            this.setId("")
            this.setDays([])
            this.setStartTime("")
            this.setEndTime("")
            this.setNumPerDay(1)
            uiState.showSnackbarMessage("Schedule Deleted")
        } catch (error) {
            console.log(error)
        }
        this.setLoading(false)
    }
}
