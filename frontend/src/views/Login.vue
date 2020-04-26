<template>
    <v-container>
        <v-layout column align-center>
            <BonfireIcon class="mt-12" :width="200" :height="200" />
            <h1 class="display-3 mt-4 mb-8">Fireside</h1>
            <v-form style="width: 100%;" @submit.prevent="login()">
                <v-card class="mx-auto" max-width="500">
                    <v-card-text>
                        <p class="title text--primary">Login</p>
                        <v-text-field
                            prepend-icon="mdi-phone"
                            v-model="phone"
                            label="Phone"
                            type="tel"
                            hint="Please prepend your country code. E.g. +49157..."
                            required
                            autofocus
                            :error-messages="phoneErrors()"
                            @input="$v.phone.$touch()"
                            @blur="$v.phone.$touch()"
                        ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <!-- <v-btn text color="deep-purple accent-4">
                        Learn More
                    </v-btn> -->
                        <v-btn large text color="secondary" to="/start">No account yet?</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn large type="submit" color="primary">Login</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { required } from "vuelidate/lib/validators"
import { validationMixin } from "vuelidate"
import userModule from "@/store/modules/user.module"
import uiModule from "@/store/modules/ui.module"
import verificationModule from "@/store/modules/verification.module"
import BonfireIcon from "../components/BonfireIcon.vue"

const validations = {
    phone: {
        required,
        phoneWithCountry(value: string) {
            if (value.match(/\+[0-9]+/)) return true
            return false
        },
    },
}

@Component({ mixins: [validationMixin], validations, components: { BonfireIcon } })
export default class Login extends Vue {
    phone = userModule.user.phone

    phoneErrors() {
        const errors: string[] = []
        if (!this.$v.phone.$dirty) return errors
        !this.$v.phone.required && errors.push("Phone is required.")
        !this.$v.phone.phoneWithCountry && errors.push("Make sure you add a '+' with your country code")
        return errors
    }

    async login() {
        this.$v.$touch()
        if (!this.$v.$invalid) {
            const userExists = await userModule.doesUserExist(this.phone)
            if (userExists) {
                userModule.setPhone(this.phone)
                verificationModule.setShouldLogin(true)
                this.$router.push("/verify")
            } else if (userExists === false) {
                uiModule.showSnackbarMessage("There is no account for this number")
            }
        }
    }
}
</script>
