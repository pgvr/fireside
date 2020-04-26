<template>
    <Layout>
        <AppBar />
        <v-layout column>
            <v-row no-gutters justify="center" class="mb-4">
                <h1 class="display-1">Welcome to Fireside</h1>
            </v-row>
            <v-row no-gutters justify="center" class="mb-4">
                <h1 class="display-1">Queue: {{ $store.state.queue }}</h1>
            </v-row>
            <v-row no-gutters justify="center" class="mb-4">
                <h1 class="display-1">Conference: {{ $store.state.conference }}</h1>
            </v-row>
            <v-row no-gutters class="mb-8">
                <v-col cols="12" sm="6" class="mt-4 pr-sm-2">
                    <v-card class="grow mx-auto" max-width="500" color="primary">
                        <v-card-title>Ready to have a chat?</v-card-title>
                        <v-card-text>
                            Pass the time by talking to someone you have never talked to before. Be kind, be curious and
                            make the best out of the current situation. 😊
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text outlined to="/call">Find Call</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="6" class="mt-4 pl-sm-2">
                    <v-card class="grow mx-auto" max-width="500" color="secondary">
                        <v-card-title
                            ><span class="mr-2">Current Sparks:</span>
                            <v-progress-circular v-if="userLoading()" indeterminate></v-progress-circular>
                            <span v-else>
                                {{ userSparks() }}
                                <v-icon style="margin-bottom: 6px" color="secondary">mdi-fire</v-icon>
                            </span>
                        </v-card-title>
                        <v-card-text>
                            Gather sparks by finding out what you have in common with your call. This can guide your
                            conversation if you don't know what you can talk about or when it feels awkward (and it
                            probably will).
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn text outlined v-on="on">Show off your sparks</v-btn>
                                </template>
                                <span>You didn't guess any common interests</span>
                            </v-tooltip>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
            <v-row no-gutters class="mb-2">
                <h2 class="title">Past Fireside Chats</h2>
            </v-row>
            <v-row justify="center" v-if="callsLoading()">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-row>
            <v-simple-table :fixed-header="true" v-else>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-left">Date</th>
                            <th class="text-left">Duration</th>
                            <th class="text-left">Guess Submitted</th>
                            <th class="text-left">Sparks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="cursor: pointer" v-for="call in calls()" :key="call._id" @click="goToDetail(call)">
                            <td>{{ callStart(call) }}</td>
                            <td>{{ callDuration(call) }} min</td>
                            <td>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-icon v-on="on" v-if="guesses(call) && guesses(call).length > 0"
                                            >mdi-check</v-icon
                                        >
                                        <v-icon v-on="on" v-else>mdi-close</v-icon>
                                    </template>
                                    <span v-if="guesses(call) && guesses(call).length > 0">
                                        <span v-if="correctInterests(call)">{{ correctInterests(call) }}</span>
                                        <span v-else>Unfortunately you did not guess correctly</span>
                                    </span>
                                    <span v-else>No submitted guesses yet</span>
                                </v-tooltip>
                            </td>
                            <td>{{ call.points }}</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-layout>
        <BottomNav />
    </Layout>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import userModule from "@/store/modules/user.module"
import callModule, { Call } from "@/store/modules/call.module"
import moment from "moment"
import BottomNav from "../components/BottomNav.vue"
import AppBar from "../components/AppBar.vue"
import BonfireIcon from "../components/BonfireIcon.vue"
import Layout from "../components/Layout.vue"

@Component({ components: { BottomNav, AppBar, BonfireIcon, Layout } })
export default class Home extends Vue {
    phone() {
        return userModule.user?.phone
    }
    calls() {
        return callModule.calls
    }
    userSparks() {
        return userModule.user?.points
    }
    userLoading() {
        return userModule.loading
    }
    callsLoading() {
        return callModule.loading
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
    correctInterests(call: Call) {
        const correctGuesses = call.commonInterests.filter(x => call.guessedInterests.includes(x))
        return correctGuesses.join(", ")
    }
    guesses(call: Call) {
        return call.guessedInterests
    }

    created() {
        if (callModule.calls.length === 0) {
            callModule.getCalls()
        }
    }

    logout() {
        userModule.logout()
    }
}
</script>
