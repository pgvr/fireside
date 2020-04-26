<template>
    <v-container v-bind:style="{ marginBottom: MarginBottom }">
        <slot></slot>
    </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import callModule from "../store/modules/call.module"
@Component
export default class Layout extends Vue {
    get MarginBottom() {
        return callModule.callStatus === "queue" || callModule.callStatus === "calling" ? "112px" : "56px"
    }
}
</script>
