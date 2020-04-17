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
    points: number
}

export interface Tokens {
    accessToken: string
    refreshToken: string
}

@Module({ name: "User", store, dynamic: true })
export default class UserModule extends VuexModule {
    status: "loading" | "success" | "error" | "" = ""
    accessToken = localStorage.getItem("token") || ""
    refreshToken = ""
    user: User = {
        phone: "",
        city: "",
        interests: [],
        job: "",
        language: "English",
        points: 0,
    }

    get isLoggedIn() {
        return !!this.accessToken
    }

    get authStatus() {
        return this.status
    }

    @Mutation
    setPoints(newPoints: number) {
        this.user.points = newPoints
    }

    @Mutation
    setPhone(newPhone: string) {
        this.user.phone = newPhone
    }

    @Mutation
    setCity(newCity: string) {
        this.user.city = newCity
    }

    @Mutation
    setInterests(newInterests: string[]) {
        this.user.interests = newInterests
    }

    @Mutation
    setJob(newJob: string) {
        this.user.job = newJob
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

    @Mutation
    setUser(user: User) {
        this.user = user
    }

    @Action
    async getUser() {
        try {
            const response = await axios.get(`${process.env.VUE_APP_API_URL}/user/me`)
            const { data } = response.data
            this.setUser(data.user)
        } catch (error) {
            console.log(error)
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
