<template>
    <v-container>
        <transition name="slide">
            <v-bottom-navigation
                background-color="primary"
                style="bottom: 56px;align-items:center;"
                fixed
                v-if="callStatus() === 'queue' || callStatus() === 'calling'"
            >
                <v-btn max-width="100%" width="100%" style="font-size: initial;" text to="/call">
                    <span v-if="callStatus() === 'queue'">You are currently in queue</span>
                    <span v-if="callStatus() === 'calling'">You are currently in a call</span>
                </v-btn>
            </v-bottom-navigation>
        </transition>
        <v-bottom-navigation fixed grow color="orange">
            <v-btn to="/profile">
                <span>Profile</span>
                <v-icon>mdi-account</v-icon>
            </v-btn>

            <v-btn to="/home">
                <span>Home</span>
                <v-icon>mdi-home</v-icon>
            </v-btn>

            <v-btn to="/call">
                <span>Meet Now</span>
                <v-icon>mdi-phone-plus</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </v-container>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: margin-bottom 0.8s ease-out;
}

.slide-enter,
.slide-leave-to {
    margin-bottom: -200px;
}

.slide-enter-to,
.slide-leave {
    margin-bottom: 0px;
}
</style>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import CallModule from "@/store/modules/call.module"
import { getModule } from "vuex-module-decorators"
const callState = getModule(CallModule)

@Component
export default class BottomNav extends Vue {
    callStatus() {
        return callState.callStatus
    }
    goToCall() {
        this.$router.push("/call")
    }
}
</script>
