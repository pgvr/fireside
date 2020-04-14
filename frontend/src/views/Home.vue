<template>
    <v-container>
        <v-layout column>
            <h1 class="display-4">Home</h1>
            <form @submit.prevent="submit()">
                <VerifyPhone v-on:code="updateCode" :phone="phone" :loading="loading" />
                <v-btn color="primary" type="submit">Submit</v-btn>
            </form>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import VerifyPhone from "../components/VerifyPhone.vue"

@Component({ components: { VerifyPhone } })
export default class Home extends Vue {
    code = ""
    loading = false
    phone = "+4915782812186"
    submit() {
        console.log("submit form with code " + this.code)
        this.verify()
    }
    updateCode(value: string) {
        this.code = value
    }

    async verify() {
        console.log("verify number " + this.phone + " with code " + this.code)
        this.loading = true
        const body = { phone: this.phone, code: this.code }
        const response = await fetch(process.env.VUE_APP_API_URL + "/verifyCode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
        if (response.status === 200) {
            console.log("SUCCESS")
        } else {
            console.log("Wrong code")
        }
        this.loading = false
    }
}
</script>
