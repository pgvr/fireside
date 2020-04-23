<template>
    <v-container
        ><AppBar />
        <v-layout align-center column v-if="loading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-layout>
        <v-layout column v-else>
            <h1 class="display-1">Call Summary</h1>
            <v-row no-gutters align="center" class="mb-4">
                <div>{{ callCreation(call) }}</div>
                <v-divider class="mx-4"></v-divider>
                <div>{{ callDurationInMin(call) }} mins</div>
            </v-row>
            <v-layout column v-if="allowEdit === true">
                <form @submit.prevent="submit">
                    <v-card>
                        <v-card-title>
                            Which common interests did you discover during your fireside chat? (Hint: there are
                            {{ call.commonInterests.length }} 😉)
                        </v-card-title>
                        <v-card-text>
                            <v-combobox
                                v-model="guesses"
                                :disabled="!allowEdit"
                                chips
                                clearable
                                :deletable-chips="true"
                                :delimiters="[' ', ',']"
                                :loading="loading"
                                @blur="$v.guesses.$touch()"
                                :error-messages="guessesErrors()"
                                label="Guess Interests"
                                multiple
                                prepend-icon="mdi-table-tennis"
                            >
                            </v-combobox>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn :loading="stateLoading()" v-if="allowEdit" large color="primary" type="submit"
                                >Submit</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </form>
            </v-layout>
            <v-layout column v-else-if="allowEdit === false">
                <v-alert :type="correctGuesses.length > 0 ? 'success' : 'info'" border="left">
                    You discovered {{ correctGuesses.length }} out of {{ maxGuesses }} common interests.
                    <span v-if="correctGuesses.length > 0">Good job!</span><span v-else>You'll get 'em next time!</span>
                </v-alert>
                <v-row no-gutters>
                    <v-chip class="row-chip" color="success" v-if="call.firstCall"
                        >First Call:<strong>+100</strong></v-chip
                    >
                    <v-chip class="row-chip" color="success" v-else>Call Completed:<strong>+30</strong></v-chip>
                    <v-chip class="row-chip" color="secondary" v-for="interest in correctGuesses" :key="interest">
                        {{ interest }}: <strong>+50</strong>
                    </v-chip>
                    <v-chip class="row-chip" color="warning" v-for="interest in wrongGuesses" :key="interest">
                        {{ interest }}: <strong>+0</strong>
                    </v-chip>
                </v-row>
                <v-divider class="my-4"></v-divider>
                <v-row no-gutters>
                    <div class="font-weight-bold">Total: {{ call.points }}</div>
                    <v-icon color="primary">mdi-fire</v-icon>
                </v-row>
            </v-layout>
            <v-layout align-center column class="mt-12">
                <v-card>
                    <v-card-title>Feedback</v-card-title>
                    <v-card-text class="text--primary">
                        <p class="body-1" v-if="rating === 0">Help us improve our service by rating the call.</p>
                        <p class="body-1" v-if="rating !== 0">Thank you for rating the call 😊</p>
                        <v-row justify="center">
                            <v-rating
                                :readonly="rating !== 0"
                                @input="rateCall"
                                :value="rating"
                                length="5"
                                empty-icon="mdi-star-outline"
                                full-icon="mdi-star"
                            ></v-rating
                        ></v-row>
                    </v-card-text>
                </v-card>
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

<style scoped>
.row-chip {
    margin: 4px;
}
strong {
    margin-left: 4px;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { getModule } from "vuex-module-decorators"
import CallModule, { Call } from "@/store/modules/call.module"
import { required } from "vuelidate/lib/validators"
import { validationMixin } from "vuelidate"
import BottomNav from "../components/BottomNav.vue"
import AppBar from "../components/AppBar.vue"
import moment from "moment"

const callState = getModule(CallModule)

const validations = {
    guesses: {
        required,
    },
}

@Component({ mixins: [validationMixin], validations, components: { BottomNav, AppBar } })
export default class CallDetail extends Vue {
    guesses: string[] = []
    rating = 0
    stateLoading() {
        return callState.loading
    }
    callCreation(call: Call) {
        return moment(call.createdAt).format("HH:MM ⌚ D. MMMM YYYY")
    }
    callDurationInMin(call: Call) {
        const minutes = moment(call.completedAt).diff(moment(call.createdAt), "minutes")
        return minutes
    }
    loading = true
    allowEdit!: boolean
    maxGuesses = 0
    call!: Call
    correctGuesses!: string[]
    wrongGuesses!: string[]

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
            this.wrongGuesses = call.commonInterests.filter(x => !call.guessedInterests.includes(x))
        } else {
            this.$router.push("/home")
        }
        this.loading = false
    }

    async submit() {
        this.$v.$touch()
        if (!this.$v.$invalid && this.guesses.length <= this.maxGuesses) {
            const result = await callState.submitGuesses({
                callId: this.$route.params.id,
                guesses: this.guesses,
            })
            if (result) {
                this.showSubmitResult()
            }
        }
    }

    async rateCall(event: number) {
        await callState.submitRating({ callId: this.call._id, rating: event })
        this.rating = event
        console.log("thanks")
    }

    async showSubmitResult() {
        this.loading = true
        this.allowEdit = false
        const call = (await callState.getCall(this.$route.params.id)) as Call
        if (call) {
            this.call = call
            this.guesses = call.guessedInterests
            this.rating = call.rating
            this.allowEdit = call.guessedInterests.length === 0
            this.maxGuesses = call.commonInterests.length
            this.correctGuesses = call.commonInterests.filter(x => call.guessedInterests.includes(x))
            this.wrongGuesses = call.commonInterests.filter(x => !call.guessedInterests.includes(x))
        }
        this.loading = false
    }

    guessesErrors() {
        const errors: string[] = []
        if (!this.$v.guesses.$dirty) return errors
        !this.$v.guesses.required && errors.push("Interests are required.")
        if (this.guesses.length > this.maxGuesses) {
            errors.push(`You only have ${this.maxGuesses} common interests`)
        }
        // !this.$v.guesses.maxAmount && this.errorMessages.push(`You only have ${this.maxGuesses} common interests`)
        return errors
    }

    removeGuess(chip: string) {
        const index = this.guesses.indexOf(chip)
        this.guesses.splice(index, 1)
    }
}
</script>
