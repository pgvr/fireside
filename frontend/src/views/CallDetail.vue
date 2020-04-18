<template>
    <v-container
        ><AppBar />
        <v-layout column>
            <h1 class="display-2">Post Call Edit Allowed</h1>
            <p class="body-1">What do you have in common with your latest call?</p>
            <form @submit.prevent="submit">
                <v-combobox
                    v-model="guesses"
                    :disabled="!allowEdit"
                    chips
                    clearable
                    :loading="loading"
                    @blur="$v.guesses.$touch()"
                    :error-messages="guessesErrors()"
                    label="Guess Interests"
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
                    :readonly="!allowEdit"
                    v-model="rating"
                    length="5"
                    empty-icon="mdi-star-outline"
                    full-icon="mdi-star"
                ></v-rating>
                <v-tooltip bottom v-if="!allowEdit">
                    <template v-slot:activator="{ on }">
                        <span v-on="on"
                            ><v-btn :disabled="true" large color="primary" type="submit">Submit</v-btn></span
                        >
                    </template>
                    <span>You already submitted your answers for the latest call</span>
                </v-tooltip>
                <v-btn v-if="allowEdit" large color="primary" type="submit">Submit</v-btn>
            </form>
            <v-btn class="mt-4" color="secondary" to="/call">Meet Again!</v-btn>
            <v-tooltip bottom v-if="!allowEdit">
                <template v-slot:activator="{ on }">
                    <span v-on="on"><v-btn class="mt-4" small color="secondary">Set up random calls</v-btn></span>
                </template>
                <span>Coming Soon</span>
            </v-tooltip>
        </v-layout>
        <!-- <v-layout column>
            <h1>PostCall
        </v-layout> -->
        <BottomNav />
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { getModule } from "vuex-module-decorators"
import CallModule, { Call } from "@/store/modules/call.module"
import { required } from "vuelidate/lib/validators"
import { validationMixin } from "vuelidate"
import BottomNav from "../components/BottomNav.vue"
import AppBar from "../components/AppBar.vue"

const callState = getModule(CallModule)

const validations = {
    guesses: {
        required,
        maxAmount: (value: string[]) => value.length <= callState.callDetail.commonInterests?.length,
    },
}

@Component({ mixins: [validationMixin], validations, components: { BottomNav, AppBar } })
export default class CallDetail extends Vue {
    guesses: string[] = []
    rating = 0
    loading = false
    allowEdit = false
    maxGuesses = 0

    async created() {
        this.loading = true
        const call = (await callState.getCall(this.$route.params.id)) as Call
        if (call) {
            this.guesses = call.guessedInterests
            this.rating = call.rating
            this.allowEdit = call.guessedInterests.length === 0
            this.maxGuesses = call.commonInterests.length
            this.loading = false
        } else {
            this.$router.push("/home")
        }
    }

    async submit() {
        this.$v.$touch()
        if (!this.$v.$invalid) {
            const result = await callState.submitGuesses({
                callId: this.$route.params.id,
                guesses: this.guesses,
            })
            if (result) {
                this.showSubmitResult(result)
            }
            if (this.rating > 0) {
                callState.submitRating({ callId: this.$route.params.id, rating: this.rating })
            }
        }
    }

    showSubmitResult(result: { guessedCorrect: number; total: number; points: number; firstCall: boolean }) {
        this.allowEdit = false
        const { guessedCorrect, total, points, firstCall } = result
        if (firstCall) {
            // first call stuff, also points includes a + 100 for fist call
        } else {
            // normal stuff
        }
    }

    guessesErrors() {
        const errors: string[] = []
        if (!this.$v.guesses.$dirty) return errors
        !this.$v.guesses.required && errors.push("Interests are required.")
        !this.$v.guesses.maxAmount && errors.push(`You only have ${this.maxGuesses} common interests`)

        return errors
    }

    removeGuess(chip: string) {
        const index = this.guesses.indexOf(chip)
        this.guesses.splice(index, 1)
    }
}
</script>
