<template>
    <v-layout column>
        <p class="title">We sent you an SMS verification code to {{ phone }}. Please insert it below.</p>
        <v-layout align-center>
            <v-text-field
                name="smsCode"
                label="Verification Code"
                id="smsCode"
                :value="code"
                @input="updateCode"
                :loading="loading"
            ></v-text-field>
            <v-btn @click="sendCode()" text color="secondary"><v-icon>mdi-refresh</v-icon>Send Again</v-btn>
        </v-layout>
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"

@Component
export default class VerifyPhone extends Vue {
    @Prop({ required: true }) readonly phone: string = ""
    @Prop({ required: true }) readonly loading: boolean = false
    code = ""

    updateCode(value: string) {
        this.code = value
        this.$emit("code", this.code)
    }

    created() {
        // send code on init
        // this.sendCode()
    }

    async sendCode() {
        const body = { phone: this.phone }
        await fetch(process.env.VUE_APP_API_URL + "/sendCode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
    }
}
</script>

<style></style>
