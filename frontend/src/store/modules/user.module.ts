import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators"
import store from "@/store"

export interface User {
    phone: string
    city: string
    hobbies: string[]
    job: string
    language: string
}

@Module({ name: "User", store, namespaced: true, dynamic: true })
export default class UserModule extends VuexModule {
    phone = ""
    city = ""
    hobbies: string[] = []
    job = ""
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
    setHobbies(newHobbies: string[]) {
        this.hobbies = newHobbies
    }
    @Mutation
    setJob(newJob: string) {
        this.job = newJob
    }

    @Action
    async register({ phone, city, hobbies, job, language }: User) {
        const body = { phone, city, hobbies, job, language }
        const response = await fetch(`${process.env.VUE_APP_API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
        if (response.status === 200) {
            // update state with user details
            // route to next page
        } else {
            // register failed
        }
    }

    @Action
    async login(phone: string, password: string) {
        const body = { phone, password }
        const response = await fetch(`${process.env.VUE_APP_API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
        if (response.status === 200) {
            // update state with user details
            // route to next page
        } else {
            // register failed
        }
    }

    @Action
    async logout() {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/logout`, {
            method: "DELETE",
        })
        if (response.status === 200) {
            // update state with user details
            // route to next page
        } else {
            // register failed
        }
    }

    // // action 'incr' commits mutation 'increment' when done with return value as payload
    // @Action({ commit: "increment" })
    // incr() {
    //     return 5
    // }
    // // action 'decr' commits mutation 'decrement' when done with return value as payload
    // @Action({ commit: "decrement" })
    // decr() {
    //     return 5
    // }
}
