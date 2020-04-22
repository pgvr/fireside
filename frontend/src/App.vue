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
        </v-content>
    </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { getModule } from "vuex-module-decorators"
import UiModule from "@/store/modules/ui.module"
import store from "./store"

const uiState = getModule(UiModule)

@Component
export default class App extends Vue {
    showSnackbar() {
        return uiState.showSnackbar
    }
    snackbarMessage() {
        return uiState.snackbarMessage
    }
    updateSnackbar(value: boolean) {
        uiState.setShowSnackbar(value)
    }

    created() {
        // fetch initial data
        // module import doesnt work for some reason
        if (store.getters["User/isLoggedIn"]) {
            store.dispatch("Call/checkQueueStatus")
        }
    }
}
</script>
