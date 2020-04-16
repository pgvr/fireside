import UserModule from "@/store/modules/user.module"
import Vue from "vue"
import VueRouter, { RouteConfig } from "vue-router"
import { getModule } from "vuex-module-decorators"
import Call from "../views/Call.vue"
import Home from "../views/Home.vue"
import Login from "../views/Login.vue"
import NotFound from "../views/NotFound.vue"
import PostCall from "../views/PostCall.vue"
import Register from "../views/Register.vue"
import Start from "../views/Start.vue"
import VerifyAnonymous from "../views/VerifyAnonymous.vue"

const userState = getModule(UserModule)
Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: "/",
        name: "Home",
        component: Home,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: "/start",
        name: "Start",
        component: Start,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: "/verifyAnonymous",
        name: "Verify Anonymous",
        component: VerifyAnonymous,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: "/call",
        name: "Call",
        component: Call,
    },
    {
        path: "/postCall",
        name: "Post Call",
        component: PostCall,
    },
    {
        path: "*",
        name: "404",
        component: NotFound,
    },
    // {
    //     path: "/about",
    //     name: "About",
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
    // },
]

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        console.log("This route requires auth.")
        if (userState.isLoggedIn) {
            console.log("User logged in, allowing navigation.")
            next()
            return
        }
        console.log("User not logged in, redirecting to login.")
        next("/login")
    } else if (to.matched.some(record => record.meta.requiresAuth === false)) {
        console.log("This route is for logged out users.")
        if (userState.isLoggedIn) {
            console.log("User logged in, redirect to home.")
            next("/")
            return
        }
        console.log("User not logged in, allowing navigation.")
        next()
    } else {
        next()
    }
})

export default router
