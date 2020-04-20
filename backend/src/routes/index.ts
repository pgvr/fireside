import express from "express"
import logout from "./access/logout.route"
import token from "./access/token.route"
import call from "./calls/call.route"
import conference from "./conference/conference.route"
import schedule from "./conference/schedule.route"
import webhook from "./conference/webhook.route"
import user from "./user/user.route"
import code from "./verification/code.route"

const router = express.Router()

router.use("/conference", conference)
router.use("/logout", logout)
router.use("/token", token)
router.use("/code", code)
router.use("/webhook", webhook)
router.use("/calls", call)
router.use("/user", user)
router.use("/schedule", schedule)

export default router
