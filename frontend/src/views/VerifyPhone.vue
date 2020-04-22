<template>
    <v-container>
        <v-layout column align-center>
            <BonfireIcon class="mt-12" :width="200" :height="200" />
            <h1 class="display-3 mt-4 mb-8">Fireside</h1>
            <v-form style="width: 100%;" @submit.prevent="submit()">
                <v-card class="mx-auto" max-width="500">
                    <v-card-text>
                        <p class="title text--primary">
                            We sent a verification code to {{ phone() }}. Please insert it below.
                        </p>
                        <v-text-field
                            name="smsCode"
                            label="Verification Code"
                            id="smsCode"
                            autofocus
                            type="tel"
                            required
                            @input="$v.code.$touch()"
                            @blur="$v.code.$touch()"
                            :error-messages="codeErrors()"
                            v-model="code"
                            :loading="loading()"
                        ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="sendCode()" large text color="secondary"
                            ><v-icon>mdi-refresh</v-icon>Send Again</v-btn
                        >
                        <v-spacer></v-spacer>
                        <v-btn color="primary" large type="submit">Submit</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { getModule } from "vuex-module-decorators"
import UserModule from "@/store/modules/user.module"
import VerificationModule from "@/store/modules/verification.module"
import BonfireIcon from "../components/BonfireIcon.vue"
import { required } from "vuelidate/lib/validators"
import { validationMixin } from "vuelidate"

const userState = getModule(UserModule)
const verificationState = getModule(VerificationModule)

const validations = {
    code: { required },
}

@Component({ mixins: [validationMixin], validations, components: { BonfireIcon } })
export default class VerifyPhone extends Vue {
    code = ""
    loading() {
        return verificationState.loading
    }
    phone() {
        return userState.user.phone
    }
    codeErrors() {
        const errors: string[] = []
        if (!this.$v.code.$dirty) return errors
        !this.$v.code.required && errors.push("Code is required.")
        return errors
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
        this.$v.$touch()
        if (!this.$v.$invalid) {
            verificationState.verifyCode(this.code)
        }
    }

    sendCode() {
        verificationState.sendVerificationSms(userState.user.phone)
    }
}
</script>
