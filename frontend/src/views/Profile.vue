<template>
    <Layout>
        <AppBar />
        <v-layout column>
            <h1 class="display-1">Your Profile</h1>
            <v-form @submit.prevent="update()">
                <v-text-field
                    prepend-icon="mdi-phone"
                    v-model="phone"
                    label="Phone"
                    type="tel"
                    readonly
                    required
                    :error-messages="phoneErrors()"
                    :loading="userStateLoading()"
                    @input="$v.phone.$touch()"
                    @blur="$v.phone.$touch()"
                ></v-text-field>
                <v-text-field
                    prepend-icon="mdi-city"
                    v-model="city"
                    @input="$v.city.$touch()"
                    @blur="$v.city.$touch()"
                    :error-messages="cityErrors()"
                    :loading="userStateLoading()"
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
                    :loading="userStateLoading()"
                    label="Your favorite hobbies"
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
                    :loading="userStateLoading()"
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

                <v-btn large type="submit" color="primary">Update</v-btn>
            </v-form>
            <v-btn @click="logout">Logout<v-icon>mdi-account</v-icon></v-btn>
        </v-layout>
        <BottomNav />
    </Layout>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { required } from "vuelidate/lib/validators"
import { validationMixin } from "vuelidate"
import { getModule } from "vuex-module-decorators"
import BottomNav from "../components/BottomNav.vue"
import Layout from "../components/Layout.vue"
import AppBar from "../components/AppBar.vue"
import UserModule from "@/store/modules/user.module"

const validations = {
    phone: { required },
    city: { required },
    interests: {
        required,
        minTwo: (value: string[]) => value.length > 1,
    },
    job: { required },
}

const userState = getModule(UserModule)

@Component({ mixins: [validationMixin], validations, components: { BottomNav, AppBar, Layout } })
export default class Profile extends Vue {
    phone = userState.user.phone
    city = userState.user.city
    interests = userState.user.interests
    job = userState.user.job
    language = userState.user.language
    languages = ["English"]

    async created() {
        if (!userState.user._id) {
            await userState.getUser()
            this.phone = userState.user.phone
            this.city = userState.user.city
            this.interests = userState.user.interests
            this.job = userState.user.job
            this.language = userState.user.language
        }
    }

    userStateLoading() {
        return userState.loading
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

    removeInterest(chip: string) {
        const index = this.interests.indexOf(chip)
        this.interests.splice(index, 1)
    }

    async update() {
        console.log("update user info")

        this.$v.$touch()
        if (!this.$v.$invalid) {
            await userState.updateUser({ city: this.city, interests: this.interests, job: this.job })
        }
    }

    logout() {
        userState.logout()
    }
}
</script>
