import store from "@/store"
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators"

@Module({ name: "Ui", store, dynamic: true, namespaced: true })
class UiModule extends VuexModule {
    showSnackbar = false
    snackbarMessage = ""

    @Mutation
    setShowSnackbar(newValue: boolean) {
        this.showSnackbar = newValue
    }
    @Mutation
    setSnackbarMessage(newValue: string) {
        this.snackbarMessage = newValue
    }

    @Action
    showSnackbarMessage(message: string) {
        this.setSnackbarMessage(message)
        this.setShowSnackbar(true)
    }
}

export default getModule(UiModule)
