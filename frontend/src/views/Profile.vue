<template>
    <Layout>
        <AppBar />
        <v-layout column align-center>
            <v-form @submit.prevent="updateUser()">
                <v-card class="mx-auto" max-width="500">
                    <v-card-text>
                        <h1 class="title text--primary">Profile</h1>
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
                    </v-card-text>
                    <v-card-actions>
                        <v-btn large type="submit" color="primary">Update</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>

            <v-card class="mx-auto mt-8" max-width="500">
                <v-card-text>
                    <h1 class="title text--primary">Scheduled Call Settings</h1>
                    <template v-if="settingExists">
                        <v-row justify="center">
                            <v-btn-toggle v-model="days" dense color="success" background-color="gray" multiple>
                                <v-btn small :value="1">Mon</v-btn>
                                <v-btn small :value="2">Tue</v-btn>
                                <v-btn small :value="3">Wed</v-btn>
                                <v-btn small :value="4">Thu</v-btn>
                                <v-btn small :value="5">Fri</v-btn>
                                <v-btn small :value="6">Sat</v-btn>
                                <v-btn small :value="0">Sun</v-btn>
                            </v-btn-toggle>
                        </v-row>
                        <v-row no-gutters>
                            <v-col cols="6" class="pr-2">
                                <v-dialog
                                    ref="startDialog"
                                    v-model="settingStartModal"
                                    :return-value.sync="startTime"
                                    persistent
                                    width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="startTime"
                                            label="Start Time"
                                            prepend-icon="mdi-clock-outline"
                                            readonly
                                            :error-messages="startTimeErrors"
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-time-picker v-if="settingStartModal" v-model="startTime" format="24hr">
                                        <v-spacer></v-spacer>
                                        <v-btn text color="primary" @click="settingStartModal = false">Cancel</v-btn>
                                        <v-btn text color="primary" @click="$refs.startDialog.save(startTime)"
                                            >OK</v-btn
                                        >
                                    </v-time-picker>
                                </v-dialog>
                            </v-col>
                            <v-col cols="6" class="pl-2">
                                <v-dialog
                                    ref="endDialog"
                                    v-model="settingEndModal"
                                    :return-value.sync="endTime"
                                    persistent
                                    width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="endTime"
                                            label="End Time"
                                            prepend-icon="mdi-clock-outline"
                                            readonly
                                            :error-messages="endTimeErrors"
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-time-picker v-if="settingEndModal" v-model="endTime" format="24hr">
                                        <v-spacer></v-spacer>
                                        <v-btn text color="primary" @click="settingEndModal = false">Cancel</v-btn>
                                        <v-btn text color="primary" @click="$refs.endDialog.save(endTime)">OK</v-btn>
                                    </v-time-picker>
                                </v-dialog>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="2"></v-col>
                            <v-col cols="8">
                                <v-text-field
                                    v-model="numPerDay"
                                    label="Number of calls per day"
                                    append-outer-icon="mdi-plus"
                                    @click:append-outer="increment"
                                    prepend-icon="mdi-minus"
                                    @click:prepend="decrement"
                                >
                                </v-text-field>
                            </v-col>
                            <v-col cols="2"></v-col>
                        </v-row>
                    </template>
                </v-card-text>
                <v-card-actions v-if="!settingExists">
                    <v-col align="center">
                        <v-btn v-if="!settingExists" @click="settingExists = true" class="mt-4"
                            >Set up scheduled calls</v-btn
                        >
                        <v-btn v-if="settingExists" @click="updateScheduleSetting">Set up scheduled calls</v-btn>

                        <v-btn v-if="settingCreated" @click="updateScheduleSetting" class="mb-2"
                            >Update scheduled call settings</v-btn
                        >
                        <v-btn v-if="settingCreated" @click="deleteScheduleSetting" class="mt-2"
                            >Disable scheduled calls</v-btn
                        >
                    </v-col>
                </v-card-actions>
            </v-card>
            <v-btn style="margin-top: 800px" @click="logout">Logout<v-icon>mdi-account</v-icon></v-btn>
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
import SettingModule, { Setting } from "@/store/modules/setting.module"

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
const settingState = getModule(SettingModule)

@Component({ mixins: [validationMixin], validations, components: { BottomNav, AppBar, Layout } })
export default class Profile extends Vue {
    // User
    phone = userState.user.phone
    city = userState.user.city
    interests = userState.user.interests
    job = userState.user.job
    language = userState.user.language
    languages = ["English"]

    // Settings
    settingStartModal = false
    settingEndModal = false
    settingExists = false
    settingCreated = false

    get getSettingExists() {
        return this.settingExists
    }

    userId = ""
    days: number[] = []
    startTime = ""
    endTime = ""
    numPerDay = 1

    // Setting validation
    startTimeErrors: string[] = []
    endTimeErrors: string[] = []
    daysErrors: string[] = []

    async created() {
        if (!userState.user._id) {
            await userState.getUser()
            this.phone = userState.user.phone
            this.city = userState.user.city
            this.interests = userState.user.interests
            this.job = userState.user.job
            this.language = userState.user.language
        }
        if (!settingState.setting._id) {
            const set = await settingState.getSetting()
            if (set) {
                this.updateLocalSetting(set)
                this.settingExists = true
                this.settingCreated = true
            }
        } else {
            this.updateLocalSetting(settingState.setting)
            this.settingExists = true
            this.settingCreated = true
        }
    }

    increment() {
        this.numPerDay += 1
    }
    decrement() {
        if (this.numPerDay > 1) this.numPerDay -= 1
    }

    updateLocalSetting(setting: Setting) {
        this.userId = setting.userId
        this.days = setting.days

        // Convert UTC time from DB back to local time
        const localOffsetHours = new Date().getTimezoneOffset() / 60
        const startTimesUTC = setting.startTime.split(":")
        const endTimesUTC = setting.endTime.split(":")
        const startTimeLocal = `${parseInt(startTimesUTC[0]) - localOffsetHours}:${startTimesUTC[1]}`
        const endTimeLocal = `${parseInt(endTimesUTC[0]) - localOffsetHours}:${endTimesUTC[1]}`
        this.startTime = startTimeLocal

        this.endTime = endTimeLocal
        this.numPerDay = setting.numPerDay
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

    async updateUser() {
        console.log("update user info")

        this.$v.$touch()
        if (!this.$v.$invalid) {
            await userState.updateUser({ city: this.city, interests: this.interests, job: this.job })
        }
    }

    checkSettings() {
        this.startTimeErrors = []
        this.endTimeErrors = []

        if (this.days.length) this.daysErrors.push("Please select at least one day")
        if (this.startTime === "") this.startTimeErrors.push("Start time is required")
        if (this.endTime === "") this.endTimeErrors.push("End time is required")

        const startTimes = this.startTime.split(":")
        const endTimes = this.endTime.split(":")

        const sT = new Date()
        const eT = new Date()
        sT.setHours(parseInt(startTimes[0]), parseInt(startTimes[1]))
        eT.setHours(parseInt(endTimes[0]), parseInt(endTimes[1]))

        if (sT > eT) this.endTimeErrors.push("End time must be after start time")

        if (this.startTimeErrors[0] || this.endTimeErrors[0]) return false
        return true
    }

    async updateScheduleSetting() {
        if (!this.checkSettings()) return

        console.log("update scheduled call info")
        // Convert local time from browser to UTC time for DB
        const localOffsetHours = new Date().getTimezoneOffset() / 60
        const startTimes = this.startTime.split(":")
        const endTimes = this.endTime.split(":")

        const startTimeUTC = `${parseInt(startTimes[0]) + localOffsetHours}:${startTimes[1]}`
        const endTimeUTC = `${parseInt(endTimes[0]) + localOffsetHours}:${endTimes[1]}`

        await settingState.updateSetting({
            days: this.days,
            startTime: startTimeUTC,
            endTime: endTimeUTC,
            numPerDay: this.numPerDay,
        })
        this.settingCreated = true
    }

    async deleteScheduleSetting() {
        console.log("delete scheduled call setting")
        await settingState.deleteSetting()
        this.settingExists = false
        this.settingCreated = false

        this.userId = ""
        this.days = []
        this.startTime = ""
        this.endTime = ""
        this.numPerDay = 1
    }

    logout() {
        userState.logout()
    }
}
</script>
