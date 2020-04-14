<template>
    <v-container>
        <v-layout column>
            <h1 class="display-1">Register</h1>
            <v-form @submit.prevent="register()">
                <v-text-field
                    prepend-icon="mdi-phone"
                    :value="phone"
                    readonly=""
                    label="Phone"
                    type="tel"
                    required
                ></v-text-field>

                <v-text-field
                    prepend-icon="mdi-lock"
                    v-model="password"
                    @input="$v.password.$touch()"
                    @blur="$v.password.$touch()"
                    :error-messages="passwordErrors()"
                    label="Password"
                    type="password"
                    required
                ></v-text-field>

                <v-text-field
                    prepend-icon="mdi-lock-reset"
                    v-model="repeatPassword"
                    @blur="$v.repeatPassword.$touch()"
                    :error-messages="repeatPasswordErrors()"
                    label="Repeat Password"
                    type="password"
                    required
                ></v-text-field>

                <v-btn large type="submit" color="primary">Register</v-btn>
            </v-form>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { required, sameAs } from "vuelidate/lib/validators"
import { validationMixin } from "vuelidate"
import { getModule } from "vuex-module-decorators"
import UserModule from "@/store/modules/user.module"
const validations = {
    password: { required },
    repeatPassword: {
        required,
        matchesPassword: sameAs("password"),
    },
}

const userState = getModule(UserModule)

@Component({ mixins: [validationMixin], validations })
export default class Register extends Vue {
    phone = userState.phone
    password = ""
    repeatPassword = ""

    passwordErrors() {
        const errors: string[] = []
        if (!this.$v.password.$dirty) return errors
        !this.$v.password.required && errors.push("Password is required.")
        return errors
    }

    repeatPasswordErrors() {
        const errors: string[] = []
        if (!this.$v.repeatPassword.$dirty) return errors
        !this.$v.repeatPassword.required && errors.push("Repeat Password is required.")
        !this.$v.repeatPassword.matchesPassword && errors.push("Passwords must match.")
        return errors
    }

    async register() {
        console.log("submit!")
        this.$v.$touch()
        if (this.$v.$invalid) {
            console.log("invalid submission")
        } else {
            // do your submit logic here
            console.log("form is valid")
            userState.register(this.password)
        }
    }
}
</script>
