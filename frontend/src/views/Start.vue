<template>
    <v-container>
        <v-layout column>
            <h1 class="display-1">Start</h1>
            <v-form @submit.prevent="meet()">
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
                    v-model="hobbies"
                    :items="hobbySuggestions"
                    chips
                    clearable
                    @blur="$v.hobbies.$touch()"
                    :error-messages="hobbyErrors()"
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
                            @click:close="removeHobby(item)"
                        >
                            <strong>{{ item }}</strong>
                        </v-chip>
                    </template>
                </v-combobox>
                <v-text-field
                    prepend-icon="mdi-briefcase"
                    v-model="occupation"
                    label="Occupation"
                    @input="$v.occupation.$touch()"
                    @blur="$v.occupation.$touch()"
                    :error-messages="occupationErrors()"
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

                <v-btn large type="submit" color="primary">Meet Now</v-btn>
            </v-form>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { required } from "vuelidate/lib/validators"
import { validationMixin } from "vuelidate"
const validations = {
    phone: { required },
    city: { required },
    hobbies: {
        required,
        minTwo: (value: string[]) => value.length > 1,
    },
    occupation: { required },
}

@Component({ mixins: [validationMixin], validations })
export default class Start extends Vue {
    phone = ""
    city = ""
    hobbies: string[] = []
    hobbySuggestions = ["Football", "Food"]
    occupation = ""
    language = "English"
    languages = ["English"]

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

    hobbyErrors() {
        const errors: string[] = []
        if (!this.$v.hobbies.$dirty) return errors
        !this.$v.hobbies.required && errors.push("Hobbies are required.")
        !this.$v.hobbies.minTwo && errors.push("You need at least two.")
        return errors
    }

    occupationErrors() {
        const errors: string[] = []
        if (!this.$v.occupation.$dirty) return errors
        !this.$v.occupation.required && errors.push("Occupation is required.")
        return errors
    }

    async meet() {
        console.log("submit!")
        this.$v.$touch()
        if (this.$v.$invalid) {
            console.log("invalid submission")
        } else {
            // do your submit logic here
            console.log("form is valid")
            // route to phone verification
        }
    }

    removeHobby(chip: string) {
        const index = this.hobbies.indexOf(chip)
        this.hobbies.splice(index, 1)
    }
}
</script>
