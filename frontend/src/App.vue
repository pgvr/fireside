<template>
    <v-app>
        <v-content>
            <router-view />
            <!-- Global Snackbar managed via ui state -->
            <v-snackbar class="mb-8" @input="updateSnackbar" :value="showSnackbar()">
                {{ snackbarMessage() }}
                <v-btn color="pink" text @click="updateSnackbar(false)">
                    Close
                </v-btn>
            </v-snackbar>
            <!-- sw update snackbar -->
            <v-snackbar v-model="snackWithButtons" :timeout="30000">
                An Update Is Available
                <v-spacer />
                <v-btn text color="primary" @click.stop="refreshApp">
                    Refresh
                </v-btn>
                <v-btn icon @click="snackWithButtons = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-snackbar>
        </v-content>
    </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import store from "./store"
import { getModule } from "vuex-module-decorators"
import UiModule from "./store/modules/ui.module"
import CallModule from "./store/modules/call.module"
import UserModule from "./store/modules/user.module"
import VerificationModule from "./store/modules/verification.module"
import SettingModule from "./store/modules/setting.module"
// Register all state modules
const uiState = getModule(UiModule)
getModule(CallModule)
getModule(UserModule)
getModule(VerificationModule)
getModule(SettingModule)

@Component
export default class App extends Vue {
    refreshing = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registration: any
    snackWithButtons = false

    created() {
        // fetch initial data
        // module import doesnt work for some reason
        if (store.getters["User/isLoggedIn"]) {
            store.dispatch("Call/checkQueueStatus")
        }

        // Listen for swUpdated event and display refresh snackbar as required.
        document.addEventListener("swUpdated", this.showRefreshUI, { once: true })
        // Refresh all open app tabs when a new service worker is installed.
        navigator.serviceWorker.addEventListener("controllerchange", () => {
            if (this.refreshing) return
            this.refreshing = true
            window.location.reload()
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    showRefreshUI(e: any) {
        // Display a snackbar inviting the user to refresh/reload the app due
        // to an app update being available.
        // The new service worker is installed, but not yet active.
        // Store the ServiceWorkerRegistration instance for later use.
        this.registration = e.detail
        this.snackWithButtons = true
    }

    refreshApp() {
        this.snackWithButtons = false
        // Protect against missing registration.waiting.
        if (!this.registration || !this.registration.waiting) {
            return
        }
        this.registration.waiting.postMessage("skipWaiting")
    }

    showSnackbar() {
        return uiState.showSnackbar
    }
    snackbarMessage() {
        return uiState.snackbarMessage
    }
    updateSnackbar(value: boolean) {
        uiState.setShowSnackbar(value)
    }
}
</script>
