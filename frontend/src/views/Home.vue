<template>
    <v-container>
        <v-layout column>
            <v-app-bar app>
                <v-img src="../assets/fire.png" :contain="true" max-width="32" max-height="32"></v-img>
                <v-toolbar-title class="ml-2">Fireside</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon><v-icon>mdi-account</v-icon></v-btn>
            </v-app-bar>

            <v-row justify="center">
                <h1 class="display-1 pr-2">Your Sparks:</h1>
                <h1 class="display-1">530</h1>
            </v-row>
            <v-row class="mt-5">
                <h2 class="title">Past Fireside Chats</h2>
            </v-row>
            <v-simple-table :fixed-header="true">
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-left">Date</th>
                            <th class="text-left">Duration</th>
                            <th class="text-left">Guess correct?</th>
                            <th class="text-left">Sparks</th>
                            <th class="text-left">Connect</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="call in calls()" :key="call.callId">
                            <td>{{ callStart(call) }}</td>
                            <td>{{ callDuration(call) }} min</td>
                            <td>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-icon v-on="on">mdi-check</v-icon>
                                    </template>
                                    <span>Swimming, Football</span>
                                </v-tooltip>
                            </td>
                            <td>100</td>
                            <td>
                                <v-btn icon><v-icon>mdi-account-plus</v-icon></v-btn>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { getModule } from "vuex-module-decorators"
import UserModule from "@/store/modules/user.module"
import CallModule, { Call } from "@/store/modules/call.module"
import moment from "moment"

const userState = getModule(UserModule)
const callState = getModule(CallModule)

@Component
export default class Home extends Vue {
    // phone() {
    //     return userState.phone
    // }
    phone = "+4915782812186"
    calls() {
        return callState.calls
    }

    callStart(call: Call) {
        return moment(call.createdAt).format("DD.MM.YYYY HH:mm:ss")
    }
    callDuration(call: Call) {
        return Math.round(moment(call.completedAt).diff(moment(call.createdAt)) / 1000 / 60)
    }

    created() {
        this.getCalls()
    }

    async getCalls() {
        await callState.getCalls(this.phone)
    }
}
</script>
