<template>
    <v-container>
        <v-layout column align-center>
            <BonfireIcon class="mt-12" :width="200" :height="200" />
            <h1 class="display-3 mt-4 mb-8">Fireside</h1>
            <v-card style="width: 100%;" max-width="500">
                <v-card-text>
                    <div>About Us</div>
                    <p class="display-1 text--primary">
                        What is Fireside?
                    </p>
                    <!-- <p>adjective</p> -->
                    <p>
                        Our goal for this app is to motivate people to start using their phones for talking again.
                        Whether you want to meet new people, broaden your social horizon or have someone to talk to in
                        trying times. We will match you with a stranger based on common interests and set up a call.
                    </p>
                    <div class="body-1 text--primary">
                        😊 Have fun
                        <br />
                        ⏺ Step outside your comfort zone
                        <br />
                        👫 Make friends
                    </div>
                </v-card-text>
                <!-- <v-card-actions>
                    <v-btn text color="deep-purple accent-4">
                        Learn More
                    </v-btn>
                </v-card-actions> -->
            </v-card>
            <v-btn class="mt-4" large to="/start" color="primary">Meet Now</v-btn>
            <v-btn class="mt-4" to="/login" color="secondary">Login</v-btn>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import BonfireIcon from "../components/BonfireIcon.vue"

@Component({ components: { BonfireIcon } })
export default class Landing extends Vue {}
</script>
