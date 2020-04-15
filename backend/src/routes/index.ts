import express from "express"
import login from "./access/login.route"
import logout from "./access/logout.route"
import register from "./access/register.route"
import token from "./access/token.route"
import conference from "./conference/conference.route"
import webhook from "./conference/webhook.route"
import sendCode from "./verification/sendCode.route"
import verifyCode from "./verification/verifyCode.route"

const router = express.Router()

router.use("/conference", conference)
router.use("/login", login)
router.use("/register", register)
router.use("/logout", logout)
router.use("/token", token)
router.use("/sendCode", sendCode)
router.use("/verifyCode", verifyCode)
router.use("/webhook", webhook)

export default router
