import Vue from "vue"
import VueRouter, { RouteConfig } from "vue-router"
import About from "../views/About.vue"
import Call from "../views/Call.vue"
import Home from "../views/Home.vue"
import Login from "../views/Login.vue"
import NotFound from "../views/NotFound.vue"
import PostCall from "../views/PostCall.vue"
import Register from "../views/Register.vue"
import Start from "../views/Start.vue"
import VerifyAnonymous from "../views/VerifyAnonymous.vue"

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/about",
        name: "About",
        component: About,
    },
    {
        path: "/start",
        name: "Start",
        component: Start,
    },
    {
        path: "/verifyAnonymous",
        name: "Verify Anonymous",
        component: VerifyAnonymous,
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
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

export default router
