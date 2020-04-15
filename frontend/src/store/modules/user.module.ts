import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators"
import store from "@/store"
import router from "@/router"
import axios from "axios"

export interface User {
    phone: string
    city: string
    interests: string[]
    job: string
    language: string
}

@Module({ name: "User", store, dynamic: true })
export default class UserModule extends VuexModule {
    phone = "+4915730717541"
    city = "Mannheim"
    interests: string[] = []
    job = "Student"
    language = "English"

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

    @Action
    async register(password: string) {
        const body = {
            phone: this.phone,
            city: this.city,
            interests: this.interests,
            job: this.job,
            language: this.language,
            password,
        }
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/register`, body)

        if (response.status === 200) {
            // update state with user details
            // route to next page
            const data = await response.data
            console.log(data)
            router.push("/")
        } else {
            // register failed
        }
    }

    @Action({ rawError: true })
    async login(auth: { phone: string; password: string }) {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/login`, {
            phone: auth.phone,
            password: auth.password,
        })
        if (response.status === 200) {
            // update state with user details
            // route to next page
            const data = await response.data
            console.log(data)
            router.push("/")
        } else {
            // register failed
        }
    }

    @Action
    async logout() {
        const response = await axios.delete(`${process.env.VUE_APP_API_URL}/logout`)
        if (response.status === 200) {
            // update state with user details
            // route to next page
            const data = await response.data
            console.log(data)
            router.push("start")
        } else {
            // register failed
        }
    }
}
