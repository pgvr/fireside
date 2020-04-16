import store from "@/store"
import Axios from "axios"
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators"

@Module({ name: "Verification", store, dynamic: true })
export default class VerificationModule extends VuexModule {
    verified = false
    loading = false

    @Mutation
    setVerified(value: boolean) {
        this.verified = value
    }
    @Mutation
    setLoading(value: boolean) {
        this.loading = value
    }

    @Action
    async sendVerificationSms(phone: string) {
        this.setLoading(true)
        const body = { phone }
        await Axios.post(`${process.env.VUE_APP_API_URL}/sendCode`, body)
        this.setLoading(false)
    }

    @Action
    async verifyCode(payload: { code: string; phone: string }) {
        this.setLoading(true)
        try {
            const body = { phone: payload.phone, code: payload.code }
            await Axios.post(`${process.env.VUE_APP_API_URL}/verifyCode`, body)
            // if not 200 it will go into catch
            this.setLoading(false)
            this.setVerified(true)
            return true
        } catch (error) {
            console.log(error)
            this.setLoading(false)
            this.setVerified(false)
            return false
        }
    }
}
