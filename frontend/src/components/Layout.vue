<template>
    <v-container v-bind:style="{ marginBottom: MarginBottom }">
        <slot></slot>
    </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import CallModule from "../store/modules/call.module"
@Component
export default class Layout extends Vue {
    get MarginBottom() {
        return this.$store.getters.callStatusFirebase === "queue" ||
            this.$store.getters.callStatusFirebase === "calling"
            ? "112px"
            : "56px"
    }
}
</script>
