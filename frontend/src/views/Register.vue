<template>
    <v-container>
        <v-layout column>
            <h1 class="display-1">Register</h1>
            <v-form @submit.prevent="register()">
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
                    :items="interestSuggestions"
                    chips
                    clearable
                    @blur="$v.interests.$touch()"
                    :error-messages="interestErrors()"
                    label="Your favorite hobbies"
                    multiple
                    prepend-icon="mdi-table-tennis"
                >
                    <template v-slot:selection="{ attrs, item, select, selected }">
                        <v-chip
                            v-bind="attrs"
                            :input-value="selected"
                            close
                            @click="select"
                            @click:close="removeInterest(item)"
                        >
                            <strong>{{ item }}</strong>
                        </v-chip>
                    </template>
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

                <v-btn large type="submit" color="primary">Meet Now</v-btn>
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
    phone: { required },
    city: { required },
    interests: {
        required,
        minTwo: (value: string[]) => value.length > 1,
    },
    job: { required },
}

const userState = getModule(UserModule)

@Component({ mixins: [validationMixin], validations })
export default class Register extends Vue {
    phone = userState.phone
    city = userState.city
    interests: string[] = userState.interests
    interestSuggestions = ["Football", "Food"]
    job = userState.job
    language = userState.language
    languages = ["English"]
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

    phoneErrors() {
        const errors: string[] = []
        if (!this.$v.phone.$dirty) return errors
        !this.$v.phone.required && errors.push("Phone is required.")
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
