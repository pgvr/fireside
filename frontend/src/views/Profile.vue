<template>
    <v-container>
        <AppBar />
        <v-layout>
            <v-card height="400" color="transparent" flat>
                <div class="display-3">User Profile</div>
            </v-card>
        </v-layout>
        <BottomNav />
    </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { getModule } from "vuex-module-decorators"
import BottomNav from "../components/BottomNav.vue"
import AppBar from "../components/AppBar.vue"
import UserModule from "@/store/modules/user.module"

const userState = getModule(UserModule)

@Component({ components: { BottomNav, AppBar } })
export default class Profile extends Vue {
    created() {
        if (!userState.user._id) {
            this.getUser()
        }
    }

    getUser() {
        userState.getUser()
    }

    userStateLoading() {
        return userState.loading
    }
}
</script>
