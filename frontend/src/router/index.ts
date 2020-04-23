import UserModule from "@/store/modules/user.module"
import Vue from "vue"
import VueRouter, { RouteConfig } from "vue-router"
import { getModule } from "vuex-module-decorators"
import Landing from "../views/Landing.vue"

const userState = getModule(UserModule)
Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: "/",
        name: "Landing",
        component: Landing,
        meta: {
            requiresAuth: false,
            title: "Fireside | Welcome to Fireside",
        },
    },
    {
        path: "/home",
        name: "Home",
        component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
        meta: {
            requiresAuth: true,
            title: "Fireside | Home",
        },
    },
    {
        path: "/start",
        name: "Start",
        component: () => import(/* webpackChunkName: "start" */ "../views/Start.vue"),
        meta: {
            requiresAuth: false,
            title: "Fireside | Get Started",
        },
    },
    {
        path: "/verify",
        name: "Verify Phone",
        component: () => import(/* webpackChunkName: "verify-phone" */ "../views/VerifyPhone.vue"),
        meta: {
            requiresAuth: false,
            title: "Fireside | Verify Your Phone",
        },
    },
    {
        path: "/login",
        name: "Login",
        component: () => import(/* webpackChunkName: "login" */ "../views/Login.vue"),
        meta: {
            requiresAuth: false,
            title: "Fireside | Login",
        },
    },
    {
        path: "/profile",
        name: "Profile",
        component: () => import(/* webpackChunkName: "profile" */ "../views/Profile.vue"),
        meta: {
            requiresAuth: true,
            title: "Fireside | Profile",
        },
    },
    {
        path: "/call",
        name: "Call",
        component: () => import(/* webpackChunkName: "call" */ "../views/Call.vue"),
        meta: {
            requiresAuth: true,
            title: "Fireside | Chat",
        },
    },
    {
        path: "/detail/:id",
        name: "Call Detail",
        component: () => import(/* webpackChunkName: "call-detail" */ "../views/CallDetail.vue"),
        meta: {
            requiresAuth: true,
            title: "Fireside | Chat Detail",
        },
    },
    {
        path: "*",
        name: "404",
        component: () => import(/* webpackChunkName: "not-found" */ "../views/NotFound.vue"),
        meta: {
            title: "Fireside | Not Found",
        },
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
    scrollBehavior() {
        return { x: 0, y: 0 }
    },
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title || "Fireside"
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
            next("/home")
            return
        }
        console.log("User not logged in, allowing navigation.")
        next()
    } else {
        next()
    }
})

export default router
