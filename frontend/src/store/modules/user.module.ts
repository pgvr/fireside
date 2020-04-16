import router from "@/router"
import store from "@/store"
import axios from "axios"
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators"

export interface User {
    phone: string
    city: string
    interests: string[]
    job: string
    language: string
    points?: number
}

export interface Tokens {
    accessToken: string
    refreshToken: string
}

@Module({ name: "User", store, dynamic: true })
export default class UserModule extends VuexModule {
    // phone = ""
    phone = "+4915730717541"
    city = "Mannheim"
    interests: string[] = ["Hobby 1", "Hobby 2"]
    job = "Student"
    language = "English"
    loggedIn = false
    points = 0
    status: "loading" | "success" | "error" | "" = ""
    accessToken = localStorage.getItem("token") || ""
    refreshToken = ""
    user: User = {
        phone: "+4915730717541",
        city: "Mannheim",
        interests: [],
        job: "Student2",
        language: "English",
    }

    get isLoggedIn() {
        return !!this.accessToken
    }

    get authStatus() {
        return this.status
    }

    @Mutation
    setPoints(newPoints: number) {
        this.points = newPoints
    }

    @Mutation
    setPhone(newPhone: string) {
        this.phone = newPhone
    }

    @Mutation
    setCity(newCity: string) {
        this.city = newCity
    }

    @Mutation
    setInterests(newInterests: string[]) {
        this.interests = newInterests
    }

    @Mutation
    setJob(newJob: string) {
        this.job = newJob
    }

    @Mutation
    authRequest() {
        this.status = "loading"
    }

    @Mutation
    authSuccess(tokens: Tokens, user: User) {
        this.status = "success"
        this.accessToken = tokens.accessToken
        this.refreshToken = tokens.refreshToken
        this.user = user
    }

    @Mutation
    authError() {
        this.status = "error"
    }

    @Mutation
    resetAuth() {
        this.status = ""
        this.accessToken = ""
        this.refreshToken = ""
    }

    @Action
    async register(password: string) {
        try {
            const body = {
                phone: this.phone,
                city: this.city,
                interests: this.interests,
                job: this.job,
                language: this.language,
                password,
            }
            const response = await axios.post(`${process.env.VUE_APP_API_URL}/register`, body)
            const { data } = response.data
            const tokens = data.tokens
            const user = data.user
            localStorage.setItem("token", tokens.accessToken)
            axios.defaults.headers.common["Authorization"] = "Bearer " + tokens.accessToken
            this.authSuccess(tokens, user)
            router.push("/")
        } catch (error) {
            this.authError()
            localStorage.removeItem("token")
        }
    }

    @Action({ rawError: true })
    async login(auth: { phone: string; password: string }) {
        try {
            // commit('auth_request')
            const response = await axios.post(`${process.env.VUE_APP_API_URL}/login`, {
                phone: auth.phone,
                password: auth.password,
            })
            const { data } = response.data
            const tokens = data.tokens
            const user = data.user
            localStorage.setItem("token", tokens.accessToken)
            axios.defaults.headers.common["Authorization"] = "Bearer " + tokens.accessToken
            this.authSuccess(tokens, user)
            router.push("/")
        } catch (error) {
            console.log(error)
            this.authError()
            localStorage.removeItem("token")
        }
    }

    @Action
    async logout() {
        try {
            const response = await axios.delete(`${process.env.VUE_APP_API_URL}/logout`)
            const { data } = response.data
            console.log(data)
            localStorage.removeItem("token")
            this.resetAuth()
            delete axios.defaults.headers.common["Authorization"]
            router.push("/start")
        } catch (error) {
            console.log(error)
        }
    }
}
