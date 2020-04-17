<template>
    <v-container>
        <v-layout column>
            <form @submit.prevent="submit()">
                <p class="title">We sent you an SMS verification code to {{ phone() }}. Please insert it below.</p>
                <v-layout align-center>
                    <v-text-field
                        name="smsCode"
                        label="Verification Code"
                        id="smsCode"
                        v-model="code"
                        :loading="loading()"
                    ></v-text-field>
                    <v-btn @click="sendCode()" text color="secondary"><v-icon>mdi-refresh</v-icon>Send Again</v-btn>
                </v-layout>
                <v-btn color="primary" type="submit">Submit</v-btn>
            </form>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
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
        return userState.user.phone
    }

    created() {
        if (verificationState.shouldLogin && !userState.user.phone) {
            // login requires phone, disallow
            this.$router.push("/login")
        } else if (
            !verificationState.shouldLogin &&
            (!userState.user.phone ||
                !userState.user.city ||
                userState.user.interests.length === 0 ||
                !userState.user.job ||
                !userState.user.language)
        ) {
            this.$router.push("/start")
        } else {
            verificationState.sendVerificationSms(userState.user.phone)
        }
    }

    submit() {
        verificationState.verifyCode(this.code)
    }

    sendCode() {
        verificationState.sendVerificationSms(userState.user.phone)
    }
}
</script>
