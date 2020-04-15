<template>
    <v-container>
        <v-layout column>
            <h1 class="display-1">Call Screen</h1>
            <v-layout v-if="callStatus() === 'idle'" column>
                <p class="body-1">Click the button to find a stranger</p>
                <v-btn :loading="callStateLoading()" color="primary" class="mt-4" @click="startCall()"
                    >Start Call</v-btn
                >
            </v-layout>
            <v-layout v-else-if="callStatus() === 'queue'" column>
                <v-btn :loading="callStateLoading()" color="error" class="mt-4" @click="leaveQueue()"
                    >Leave Queue</v-btn
                >
            </v-layout>
            <v-layout v-else-if="callStatus() === 'calling'" column>
                <v-btn :loading="callStateLoading()" color="success" class="mt-4" @click="completeCall()"
                    >Complete Call</v-btn
                >
                <v-btn :loading="callStateLoading()" color="info" class="mt-4" @click="resetCall()"
                    >Something is wrong</v-btn
                >
            </v-layout>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { getModule } from "vuex-module-decorators"
import UserModule, { User } from "@/store/modules/user.module"
import CallModule from "@/store/modules/call.module"

const userState = getModule(UserModule)
const callState = getModule(CallModule)

@Component
export default class Call extends Vue {
    callStatus() {
        return callState.callStatus
    }
    callStateLoading() {
        return callState.loading
    }

    startCall() {
        const user: User = {
            phone: userState.phone,
            city: userState.city,
            interests: userState.interests,
            job: userState.job,
            language: userState.language,
        }
        callState.findConference(user)
    }

    completeCall() {
        callState.completeCall(userState.phone)
    }

    leaveQueue() {
        const user: User = {
            phone: userState.phone,
            city: userState.city,
            interests: userState.interests,
            job: userState.job,
            language: userState.language,
        }
        callState.leaveCallQueue(user)
    }

    resetCall() {
        callState.setCallStatus("idle")
    }
}
</script>
