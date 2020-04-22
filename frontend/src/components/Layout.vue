<template>
    <v-container v-bind:style="{ marginBottom: MarginBottom }">
        <slot></slot>
    </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { getModule } from "vuex-module-decorators"
import CallModule from "../store/modules/call.module"
const callState = getModule(CallModule)
@Component
export default class Layout extends Vue {
    get MarginBottom() {
        return callState.callStatus === "queue" || callState.callStatus === "calling" ? "112px" : "56px"
    }
}
</script>
