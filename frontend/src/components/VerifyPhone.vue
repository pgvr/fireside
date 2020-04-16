<template>
    <v-layout column>
        <p class="title">We sent you an SMS verification code to {{ phone() }}. Please insert it below.</p>
        <v-layout align-center>
            <v-text-field
                name="smsCode"
                label="Verification Code"
                id="smsCode"
                :value="code"
                @input="updateCode"
                :loading="loading()"
            ></v-text-field>
            <v-btn @click="sendCode()" text color="secondary"><v-icon>mdi-refresh</v-icon>Send Again</v-btn>
        </v-layout>
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { getModule } from "vuex-module-decorators"
import UserModule from "@/store/modules/user.module"
import VerificationModule from "@/store/modules/verification.module"

const userState = getModule(UserModule)
const verificationState = getModule(VerificationModule)

@Component
export default class VerifyPhone extends Vue {
    code = ""
    loading() {
        return verificationState.loading
    }
    phone() {
        return userState.phone
    }

    updateCode(value: string) {
        this.code = value
        this.$emit("code", this.code)
    }

    async sendCode() {
        await verificationState.sendVerificationSms(userState.phone)
    }
}
</script>

<style></style>
