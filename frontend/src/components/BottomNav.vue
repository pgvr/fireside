<template>
    <v-container>
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

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"

@Component
export default class BottomNav extends Vue {}
</script>
