<template>
    <v-container>
        <v-layout column>
            <h1 class="display-2">Post Call</h1>
            <p class="body-1">What do you have in common with your latest call?</p>
            <form @submit.prevent="submit">
                <v-combobox
                    v-model="guesses"
                    :disabled="!allowEdit()"
                    chips
                    clearable
                    @blur="$v.guesses.$touch()"
                    :error-messages="guessesErrors()"
                    label="Common Interests"
                    multiple
                    prepend-icon="mdi-table-tennis"
                >
                    <template v-slot:selection="{ attrs, item, select, selected }">
                        <v-chip
                            v-bind="attrs"
                            :input-value="selected"
                            close
                            @click="select"
                            @click:close="removeGuess(item)"
                        >
                            <strong>{{ item }}</strong>
                        </v-chip>
                    </template>
                </v-combobox>
                <h4 class="display-1">How was your call?</h4>
                <v-rating
                    :readonly="!allowEdit()"
                    v-model="rating"
                    length="5"
                    empty-icon="mdi-star-outline"
                    full-icon="mdi-star"
                ></v-rating>
                <v-tooltip bottom v-if="!allowEdit()">
                    <template v-slot:activator="{ on }">
                        <span v-on="on"
                            ><v-btn :disabled="true" large color="primary" type="submit">Submit</v-btn></span
                        >
                    </template>
                    <span>You already submitted your answers for the latest call</span>
                </v-tooltip>
                <v-btn v-if="allowEdit()" large color="primary" type="submit">Submit</v-btn>
            </form>
            <v-btn class="mt-4" v-if="anonymousAccount()" large color="success" to="/register">Create Account</v-btn>
            <v-btn class="mt-4" color="secondary" to="/call">Meet Again!</v-btn>
            <v-tooltip bottom v-if="!allowEdit()">
                <template v-slot:activator="{ on }">
                    <span v-on="on"><v-btn class="mt-4" small color="secondary">Set up random calls</v-btn></span>
                </template>
                <span>Coming Soon</span>
            </v-tooltip>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { getModule } from "vuex-module-decorators"
import UserModule, { User } from "@/store/modules/user.module"
import CallModule from "@/store/modules/call.module"
import VerificationModule from "@/store/modules/verification.module"
import { required } from "vuelidate/lib/validators"
import { validationMixin } from "vuelidate"
const validations = {
    guesses: {
        required,
    },
}

const userState = getModule(UserModule)
const callState = getModule(CallModule)
const verificationState = getModule(VerificationModule)

@Component({ mixins: [validationMixin], validations })
export default class PostCall extends Vue {
    guesses: string[] = []
    rating = 0
    allowEdit() {
        return callState.postCallEditEnabled
    }
    anonymousAccount() {
        return !userState.loggedIn
    }

    created() {
        if (!verificationState.verified) {
            this.$router.push("/start")
        } else {
            callState.fetchEditStatus(userState.phone)
        }
    }

    async submit() {
        console.log("submit")
        const result = await callState.submitGuesses({ phone: userState.phone, guesses: this.guesses })
        console.log(result)
        if (this.rating > 0) {
            await callState.submitRating({ phone: userState.phone, rating: this.rating })
        }
        await callState.fetchEditStatus(userState.phone)
    }

    async rate() {
        return true
    }

    guessesErrors() {
        const errors: string[] = []
        if (!this.$v.guesses.$dirty) return errors
        !this.$v.guesses.required && errors.push("Interests are required.")
        return errors
    }

    removeGuess(chip: string) {
        const index = this.guesses.indexOf(chip)
        this.guesses.splice(index, 1)
    }
}
</script>
