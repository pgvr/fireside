import router from "@/router"
import store from "@/store"
import Axios from "axios"
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators"
import UserModule from "./user.module"

const userState = getModule(UserModule)

@Module({ name: "Verification", store, dynamic: true, namespaced: true })
export default class VerificationModule extends VuexModule {
    loading = false
    shouldLogin = false

    @Mutation
    setLoading(value: boolean) {
        this.loading = value
    }
    @Mutation
    setShouldLogin(value: boolean) {
        this.shouldLogin = value
    }

    @Action
    async sendVerificationSms(phone: string) {
        this.setLoading(true)
        const body = { phone }
        await Axios.post(`${process.env.VUE_APP_API_URL}/code/send`, body)
        this.setLoading(false)
    }

    @Action
    async verifyCode(code: string) {
        this.setLoading(true)
        try {
            let response
            if (this.shouldLogin) {
                // login
                const body = { phone: userState.user.phone, code }
                response = await Axios.post(`${process.env.VUE_APP_API_URL}/code/login`, body)
            } else {
                // register
                const body = {
                    ...userState.user,
                    code,
                }
                response = await Axios.post(`${process.env.VUE_APP_API_URL}/code/register`, body)
            }
            const { data } = response.data
            const tokens = data.tokens
            const user = data.user
            localStorage.setItem("token", tokens.accessToken)
            localStorage.setItem("refreshToken", tokens.refreshToken)
            Axios.defaults.headers.common["Authorization"] = "Bearer " + tokens.accessToken
            userState.authSuccess({ tokens, user })
            if (this.shouldLogin) {
                router.push("/home")
            } else {
                // for first time users bring them to the call directly
                router.push("/call")
            }
            // if not 200 it will go into catch
            this.setLoading(false)
        } catch (error) {
            console.log(error)
            this.setLoading(false)
            userState.authError()
            localStorage.removeItem("token")
            localStorage.removeItem("refreshToken")
        }
    }
}
