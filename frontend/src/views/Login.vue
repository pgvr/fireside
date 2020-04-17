<template>
    <v-container>
        <v-layout column>
            <h1 class="display-1">Login</h1>
            <v-form @submit.prevent="login()">
                <v-text-field
                    prepend-icon="mdi-phone"
                    v-model="phone"
                    label="Phone"
                    type="tel"
                    required
                    :error-messages="phoneErrors()"
                    @input="$v.phone.$touch()"
                    @blur="$v.phone.$touch()"
                ></v-text-field>
                <v-btn large type="submit" color="primary">Login</v-btn>
                <v-btn color="secondary" to="/start">No account yet?</v-btn>
            </v-form>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { required } from "vuelidate/lib/validators"
import { validationMixin } from "vuelidate"
import UserModule from "@/store/modules/user.module"
import VerificationModule from "@/store/modules/verification.module"
import { getModule } from "vuex-module-decorators"

const validations = {
    phone: { required },
}

const userState = getModule(UserModule)
const verificationState = getModule(VerificationModule)

@Component({ mixins: [validationMixin], validations })
export default class Login extends Vue {
    phone = userState.user.phone

    phoneErrors() {
        const errors: string[] = []
        if (!this.$v.phone.$dirty) return errors
        !this.$v.phone.required && errors.push("Phone is required.")
        return errors
    }

    async login() {
        this.$v.$touch()
        if (!this.$v.$invalid) {
            verificationState.setShouldLogin(true)
            this.$router.push("/verify")
        }
    }
}
</script>
