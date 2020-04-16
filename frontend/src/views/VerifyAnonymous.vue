<template>
    <v-container>
        <v-layout column>
            <form @submit.prevent="submit()">
                <VerifyPhone v-on:code="updateCode" />
                <v-btn color="primary" type="submit">Submit</v-btn>
            </form>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import VerifyPhone from "../components/VerifyPhone.vue"
import { getModule } from "vuex-module-decorators"
import UserModule from "@/store/modules/user.module"
import VerificationModule from "@/store/modules/verification.module"

const userState = getModule(UserModule)
const verificationState = getModule(VerificationModule)

@Component({ components: { VerifyPhone } })
export default class VerifyAnonymous extends Vue {
    code = ""

    created() {
        if (
            !userState.phone ||
            !userState.city ||
            userState.interests.length === 0 ||
            !userState.job ||
            !userState.language
        ) {
            this.$router.push("/start")
        } else if (verificationState.verified) {
            this.$router.push("/call")
        } else {
            verificationState.sendVerificationSms(userState.phone)
        }
    }

    async submit() {
        const verified = await verificationState.verifyCode({ code: this.code, phone: userState.phone })
        if (verified) {
            this.$router.push("/call")
        } else {
            console.log("code invalid")
        }
    }

    updateCode(value: string) {
        // update code
        this.code = value
    }
}
</script>
