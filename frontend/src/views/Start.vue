<template>
    <v-container>
        <v-row align="center">
            <v-form ref="form">
                <v-text-field v-model="name" :counter="10" label="Name" required></v-text-field>

                <v-text-field v-model="email" label="E-mail" required></v-text-field>

                <v-select
                    v-model="select"
                    :items="items"
                    :rules="[v => !!v || 'Item is required']"
                    label="Item"
                    required
                ></v-select>

                <v-checkbox
                    v-model="checkbox"
                    :rules="[v => !!v || 'You must agree to continue!']"
                    label="Do you agree?"
                    required
                ></v-checkbox>
            </v-form>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"

@Component
export default class Start extends Vue {
    valid = true
    name = ""
    email = ""
    select = null
    items = ["Item 1", "Item 2", "Item 3", "Item 4"]
    checkbox = false
    lazy = false
}
</script>
