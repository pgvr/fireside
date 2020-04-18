<template>
    <div class="NotFound">
        <v-container>
            <AppBar />
            <v-layout>
                <v-card height="400" color="transparent" flat>
                    <div class="display-3">Page not found.</div>
                </v-card>
            </v-layout>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import AppBar from "../components/AppBar.vue"

@Component({ components: { AppBar } })
export default class NotFound extends Vue {}
</script>
