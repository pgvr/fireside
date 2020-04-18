<template>
    <v-container>
        <AppBar />
        <v-layout column>
            <v-layout justify="center">
                <h1 class="display-1 pr-2">Your Sparks:</h1>
                <v-progress-circular v-if="userLoading()" indeterminate color="primary"></v-progress-circular>
                <h1 class="display-1" v-else>{{ userSparks() }}</h1>
            </v-layout>
            <v-layout class="mt-5">
                <h2 class="title">Past Fireside Chats</h2>
            </v-layout>
            <v-layout justify="center" class="py-4" v-if="callsLoading()">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-layout>
            <v-simple-table :fixed-header="true" v-else>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-left">Date</th>
                            <th class="text-left">Duration</th>
                            <th class="text-left">Guess correct?</th>
                            <th class="text-left">Sparks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="call in calls()" :key="call._id" @click="goToDetail(call)">
                            <td>{{ callStart(call) }}</td>
                            <td>{{ callDuration(call) }} min</td>
                            <td>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-icon
                                            v-on="on"
                                            v-if="call.guessedInterests && call.guessedInterests.length > 0"
                                            >mdi-check</v-icon
                                        >
                                        <v-icon v-on="on" v-else>mdi-close</v-icon>
                                    </template>
                                    <span v-if="call.guessedInterests && call.guessedInterests.length > 0">{{
                                        guessedInterests(call)
                                    }}</span>
                                    <span v-else>You didn't guess any common interests</span>
                                </v-tooltip>
                            </td>
                            <td>{{ call.points }}</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-layout>
        <BottomNav />
    </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { getModule } from "vuex-module-decorators"
import UserModule from "@/store/modules/user.module"
import CallModule, { Call } from "@/store/modules/call.module"
import moment from "moment"
import BottomNav from "../components/BottomNav.vue"
import AppBar from "../components/AppBar.vue"
import BonfireIcon from "../components/BonfireIcon.vue"

const userState = getModule(UserModule)
const callState = getModule(CallModule)

@Component({ components: { BottomNav, AppBar, BonfireIcon } })
export default class Home extends Vue {
    phone() {
        return userState.user?.phone
    }
    calls() {
        return callState.calls
    }
    userSparks() {
        return userState.user?.points
    }
    userLoading() {
        return userState.loading
    }
    callsLoading() {
        return callState.loading
    }

    goToDetail(call: Call) {
        this.$router.push(`/detail/${call._id}`)
    }

    callStart(call: Call) {
        return moment(call.createdAt).format("DD.MM.YY HH:mm")
    }
    callDuration(call: Call) {
        return Math.round(moment(call.completedAt).diff(moment(call.createdAt)) / 1000 / 60)
    }
    callSparks(call: Call) {
        return call.points
    }
    guessedInterests(call: Call) {
        return call.guessedInterests?.join(", ")
    }

    created() {
        if (!userState.user._id) {
            userState.getUser()
            callState.getCalls()
        }
    }

    logout() {
        userState.logout()
    }
}
</script>
