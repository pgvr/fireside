<template>
    <v-container>
        <v-layout column align-center>
            <BonfireIcon class="mt-12" :width="200" :height="200" />
            <h1 class="display-3 mt-4 mb-8">Fireside</h1>
            <v-form style="width: 100%;" @submit.prevent="meet()">
                <v-card class="mx-auto" max-width="500">
                    <v-card-text>
                        <p class="title text--primary">
                            We need some info to set up your account
                        </p>
                        <v-text-field
                            prepend-icon="mdi-phone"
                            v-model="phone"
                            label="Phone"
                            type="tel"
                            hint="Please prepend your country code. E.g. +49157..."
                            required
                            :error-messages="phoneErrors()"
                            @input="$v.phone.$touch()"
                            @blur="$v.phone.$touch()"
                        ></v-text-field>
                        <v-text-field
                            prepend-icon="mdi-city"
                            v-model="city"
                            @input="$v.city.$touch()"
                            @blur="$v.city.$touch()"
                            :error-messages="cityErrors()"
                            label="City"
                            type="text"
                            required
                        ></v-text-field>
                        <v-combobox
                            v-model="interests"
                            chips
                            :deletable-chips="true"
                            :delimiters="[' ', ',']"
                            clearable
                            @blur="$v.interests.$touch()"
                            :error-messages="interestErrors()"
                            label="Your favorite hobbies or interests"
                            multiple
                            prepend-icon="mdi-table-tennis"
                        >
                        </v-combobox>
                        <v-text-field
                            prepend-icon="mdi-briefcase"
                            v-model="job"
                            label="Occupation"
                            @input="$v.job.$touch()"
                            @blur="$v.job.$touch()"
                            :error-messages="jobErrors()"
                            type="text"
                            required
                        ></v-text-field>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-select
                                    :items="languages"
                                    v-model="language"
                                    prepend-icon="mdi-translate"
                                    label="Language"
                                    readonly
                                    required
                                    v-on="on"
                                ></v-select>
                            </template>
                            <span>We only support English for now</span>
                        </v-tooltip>
                    </v-card-text>
                    <v-card-actions>
                        <!-- <v-btn text color="deep-purple accent-4">
                        Learn More
                    </v-btn> -->
                        <v-btn large @click="navigate('login')" text color="secondary">Login</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn large type="submit" color="primary">Meet Now</v-btn>
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
import { getModule } from "vuex-module-decorators"
import UserModule from "@/store/modules/user.module"
import UiModule from "@/store/modules/ui.module"
import VerificationModule from "@/store/modules/verification.module"
import router from "@/router"
import AppBar from "../components/AppBar.vue"
import BonfireIcon from "../components/BonfireIcon.vue"

const validations = {
    phone: {
        required,
        phoneWithCountry(value: string) {
            if (value.match(/\+[0-9]+/)) return true
            return false
        },
    },
    city: { required },
    interests: {
        required,
        minTwo: (value: string[]) => value.length > 1,
    },
    job: { required },
}

const userState = getModule(UserModule)
const verificationState = getModule(VerificationModule)
const uiState = getModule(UiModule)

@Component({ mixins: [validationMixin], validations, components: { AppBar, BonfireIcon } })
export default class Start extends Vue {
    phone = ""
    city = ""
    interests: string[] = []
    job = ""
    language = "English"
    languages = ["English"]

    navigate(route: string) {
        userState.setPhone(this.phone)
        userState.setCity(this.city)
        userState.setInterests(this.interests)
        userState.setJob(this.job)
        router.push(route)
    }

    phoneErrors() {
        const errors: string[] = []
        if (!this.$v.phone.$dirty) return errors
        !this.$v.phone.required && errors.push("Phone is required.")
        !this.$v.phone.phoneWithCountry && errors.push("Make sure you add a '+' with your country code")
        return errors
    }

    cityErrors() {
        const errors: string[] = []
        if (!this.$v.city.$dirty) return errors
        !this.$v.city.required && errors.push("City is required.")
        return errors
    }

    interestErrors() {
        const errors: string[] = []
        if (!this.$v.interests.$dirty) return errors
        !this.$v.interests.required && errors.push("Interests are required.")
        !this.$v.interests.minTwo && errors.push("You need at least two.")
        return errors
    }

    jobErrors() {
        const errors: string[] = []
        if (!this.$v.job.$dirty) return errors
        !this.$v.job.required && errors.push("Occupation is required.")
        return errors
    }

    async meet() {
        this.$v.$touch()
        if (!this.$v.$invalid) {
            const userExists = await userState.doesUserExist(this.phone)
            if (!userExists) {
                userState.setPhone(this.phone)
                userState.setCity(this.city)
                userState.setInterests(this.interests)
                userState.setJob(this.job)
                verificationState.setShouldLogin(false)
                this.$router.push("/verify")
            } else {
                uiState.showSnackbarMessage("This number is already registered")
            }
        }
    }

    removeInterest(chip: string) {
        const index = this.interests.indexOf(chip)
        this.interests.splice(index, 1)
    }
}
</script>
