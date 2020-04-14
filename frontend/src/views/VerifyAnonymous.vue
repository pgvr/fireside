<template>
    <v-container>
        <v-layout column>
            <form @submit.prevent="submit()">
                <VerifyPhone v-on:code="updateCode" :phone="phone()" :loading="loading" />
                <v-btn color="primary" type="submit">Submit</v-btn>
            </form>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import VerifyPhone from "../components/VerifyPhone.vue"
import { getModule } from "vuex-module-decorators"
import UserModule from "@/store/modules/user.module"

const userState = getModule(UserModule)

@Component({ components: { VerifyPhone } })
export default class VerifyAnonymous extends Vue {
    phone() {
        return userState.phone
    }
    loading = false
    code = ""
    submit() {
        console.log("submit")
        // route to loading screen and connect user
    }

    updateCode(value: string) {
        // update code
        this.code = value
    }
}
</script>
