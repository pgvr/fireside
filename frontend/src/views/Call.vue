<template>
    <v-container>
        <AppBar />
        <v-layout column align-center>
            <div class="display-1 mb-8" style="text-align:center;">Ready to have a Chat?</div>
            <BonfireIcon
                :loading="callStatus() === 'queue'"
                class="mb-8"
                width="150"
                height="150"
                :gray="callStatus() === 'idle'"
            />

            <v-layout column>
                <p
                    v-if="(callStatus() === 'idle') | (callStatus() === 'queue')"
                    class="body-1"
                    style="text-align:center"
                >
                    Your phone will ring as soon as we find a likeminded person.
                </p>
                <p v-if="callStatus() === 'calling'" class="body-1" style="text-align:center">
                    Once your call is done, navigate to the call summary.
                </p>
                <v-btn
                    v-if="callStatus() === 'idle'"
                    :loading="callStateLoading()"
                    color="primary"
                    class="mt-4"
                    @click="startCall()"
                    >Start Call</v-btn
                >
                <v-btn
                    v-if="callStatus() === 'queue'"
                    :loading="callStateLoading()"
                    color="error"
                    class="mt-4"
                    @click="leaveQueue()"
                    >Leave Queue</v-btn
                >
                <v-btn
                    v-if="callStatus() === 'calling'"
                    :loading="callStateLoading()"
                    color="success"
                    class="mt-4"
                    @click="completeCall()"
                    >Complete Call</v-btn
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
import AppBar from "../components/AppBar.vue"
import BonfireIcon from "../components/BonfireIcon.vue"

const callState = getModule(CallModule)

@Component({ components: { BottomNav, AppBar, BonfireIcon } })
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
}
</script>
