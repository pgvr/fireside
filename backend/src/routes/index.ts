import express from "express"
import conference from "./conference/conference"

const router = express.Router()

router.use("/conference", conference)

export default router
