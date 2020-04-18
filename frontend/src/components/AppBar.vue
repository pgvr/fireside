<template>
    <v-container>
        <v-app-bar app>
            <BonfireIcon width="32" height="32" />
            <!-- <v-img src="../assets/fire.png" :contain="true" max-width="32" max-height="32"></v-img> -->
            <v-toolbar-title class="ml-4">Fireside</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="logout"><v-icon>mdi-account</v-icon></v-btn>
        </v-app-bar>
    </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { getModule } from "vuex-module-decorators"
import UserModule from "@/store/modules/user.module"
import BonfireIcon from "./BonfireIcon.vue"

const userState = getModule(UserModule)

@Component({ components: { BonfireIcon } })
export default class AppBar extends Vue {
    logout() {
        userState.logout()
    }
}
</script>
