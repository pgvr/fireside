<template>
    <v-container>
        <v-app-bar app>
            <BonfireIcon width="32" height="32" />
            <!-- <v-img src="../assets/fire.png" :contain="true" max-width="32" max-height="32"></v-img> -->
            <v-toolbar-title class="ml-4">Fireside</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-switch
                v-model="$vuetify.theme.dark"
                inset
                @change="themeChange"
                prepend-icon="mdi-theme-light-dark"
                hide-details="true"
            ></v-switch>
        </v-app-bar>
    </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import BonfireIcon from "./BonfireIcon.vue"

@Component({ components: { BonfireIcon } })
export default class AppBar extends Vue {
    themeChange(dark: boolean) {
        console.log("theme changed, dark: " + dark)
        localStorage.setItem("vuetifyTheme", dark ? "dark" : "light")
    }
}
</script>
