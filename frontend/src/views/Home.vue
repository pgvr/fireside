<template>
    <v-container>
        <v-layout column>
            <h1 class="display-4">Home</h1>
            <p class="body-1">Only for authenticated users!</p>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"

@Component
export default class Home extends Vue {}
</script>
