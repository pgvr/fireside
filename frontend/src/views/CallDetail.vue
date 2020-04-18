<template>
    <v-container
        ><AppBar />
        <v-layout column v-if="loading">
            Loading...
        </v-layout>
        <v-layout column v-else>
            <v-layout column v-if="allowEdit === true">
                <p class="body-1">
                    Which similarities did you discover during your fireside chat? (Hint: there are
                    {{ call.commonInterests.length }})
                </p>
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
                    <v-btn v-if="allowEdit" large color="primary" type="submit">Submit</v-btn>
                </form>
            </v-layout>
            <v-layout column v-else-if="allowEdit === false">
                <p class="body-1">
                    You discovered {{ correctGuesses.length }} out of {{ maxGuesses }} similarities.
                    <span>Good job!</span><span>You'll get 'em next time!</span>
                </p>
                <div v-if="call.firstCall">First Call: +100</div>
                <div v-else>Call Completed: +30</div>
                <div v-for="interest in correctGuesses" :key="interest">
                    <div>{{ interest }}: +50</div>
                </div>
                <div>Total: {{ call.points }}</div>
            </v-layout>
            <v-layout column>
                <p class="body-1" v-if="rating === 0">Help us improve our service by rating the call.</p>
                <p class="body-1" v-if="rating !== 0">Thank you for rating the call 😊</p>
                <v-rating
                    :readonly="rating !== 0"
                    @input="rateCall"
                    :value="rating"
                    length="5"
                    empty-icon="mdi-star-outline"
                    full-icon="mdi-star"
                ></v-rating>
                <v-layout row wrap>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <span v-on="on"
                                ><v-btn class="mt-4" text color="secondary">Set up scheduled calls</v-btn></span
                            >
                        </template>
                        <span>Coming Soon</span>
                    </v-tooltip>
                </v-layout>
            </v-layout>
        </v-layout>

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
    loading = true
    allowEdit!: boolean
    maxGuesses = 0
    call!: Call
    correctGuesses!: string[]

    async created() {
        this.loading = true
        const call = (await callState.getCall(this.$route.params.id)) as Call
        if (call) {
            this.call = call
            this.guesses = call.guessedInterests
            this.rating = call.rating
            this.allowEdit = call.guessedInterests.length === 0
            this.maxGuesses = call.commonInterests.length
            this.correctGuesses = call.commonInterests.filter(x => call.guessedInterests.includes(x))
            this.loading = false
        } else {
            console.log("something went wrong loading the call, redirecting to home")
            this.$router.push("/")
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
        }
    }

    async rateCall(event: number) {
        await callState.submitRating({ callId: this.call._id, rating: event })
        this.rating = event
        console.log("thanks")
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
