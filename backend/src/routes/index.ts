import express from "express"
import conference from "./conference/conference.route"

const router = express.Router()

router.use("/conference", conference)

export default router
