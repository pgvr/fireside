import { Module, VuexModule, Mutation } from "vuex-module-decorators"
import store from "@/store"

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
