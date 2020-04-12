<template>
    <v-app>
        <v-content>
            <router-view />
        </v-content>
    </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"

@Component
export default class App extends Vue {}
</script>
