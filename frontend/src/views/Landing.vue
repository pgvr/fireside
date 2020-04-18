<template>
    <v-container>
        <v-layout>
            <div class="display-3">Landing Page</div>
            <div>
                <v-btn large @click="navigate('start')" color="secondary">Meet Now</v-btn>
                <v-btn large @click="navigate('login')" color="secondary">Login</v-btn>
            </div>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import router from "@/router"

@Component
export default class Landing extends Vue {
    navigate(route: string) {
        router.push(route)
    }
}
</script>
