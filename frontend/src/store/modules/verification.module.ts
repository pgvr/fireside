import router from "@/router"
import store from "@/store"
import Axios from "axios"
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators"
import uiModule from "./ui.module"
import userModule from "./user.module"

@Module({ name: "Verification", store, dynamic: true, namespaced: true })
class VerificationModule extends VuexModule {
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
                const body = { phone: userModule.user.phone, code }
                response = await Axios.post(`${process.env.VUE_APP_API_URL}/code/login`, body)
            } else {
                // register
                console.log(userModule.user)
                const body = {
                    ...userModule.user,
                    code,
                }
                delete body._id
                response = await Axios.post(`${process.env.VUE_APP_API_URL}/code/register`, body)
            }
            const { data } = response.data
            const tokens = data.tokens
            const user = data.user
            localStorage.setItem("token", tokens.accessToken)
            localStorage.setItem("refreshToken", tokens.refreshToken)
            Axios.defaults.headers.common["Authorization"] = "Bearer " + tokens.accessToken
            userModule.authSuccess({ tokens, user })
            router.push("/home")

            // if not 200 it will go into catch
            this.setLoading(false)
        } catch (error) {
            console.log(error)
            this.setLoading(false)
            userModule.authError()
            localStorage.removeItem("token")
            localStorage.removeItem("refreshToken")
            uiModule.showSnackbarMessage("Something went wrong. Please check the token and try again.")
        }
    }
}

export default getModule(VerificationModule)
