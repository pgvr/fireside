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
        <BottomNav />
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { getModule } from "vuex-module-decorators"
import CallModule from "@/store/modules/call.module"
import BottomNav from "../components/BottomNav.vue"

const callState = getModule(CallModule)

@Component({ components: { BottomNav } })
export default class Call extends Vue {
    callStatus() {
        return callState.callStatus
    }
    callStateLoading() {
        return callState.loading
    }

    startCall() {
        callState.findConference()
    }

    completeCall() {
        callState.completeCall()
    }

    leaveQueue() {
        callState.leaveCallQueue()
    }

    resetCall() {
        callState.setCallStatus("idle")
    }
}
</script>
