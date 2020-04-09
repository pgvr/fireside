import express from "express"
import twilio from "twilio"
import { SuccessResponse } from "../../core/ApiResponse"
import asyncHandler from "../../helpers/asyncHandler"
import { buildConference } from "../../helpers/conference.helper"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

const router = express.Router()

router.post(
    "/",
    asyncHandler(async (req, res) => {
        const { user } = req.body // as User

        const match = { number: "+123456" } // findMatch()

        const conferenceXml = buildConference("Welcome", "New Conference Name")

        const numbers = [user.number, match.number]

        await Promise.all(
            numbers.map((number) => {
                return client.calls.create({
                    twiml: conferenceXml.toString(),
                    to: number,
                    from: process.env.TWILIO_NUMBER,
                    // Callbacks to update status
                    // statusCallback: "https://www.myapp.com/events",
                    // statusCallbackEvent: ["initiated", "answered"],
                    // statusCallbackMethod: "POST",
                })
            }),
        )

        return new SuccessResponse("Successful", null).send(res)
    }),
)

export default router
